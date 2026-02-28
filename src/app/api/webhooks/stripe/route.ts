import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  insertDonation,
  getDonationBySessionId,
  markReceiptSent,
} from "@/lib/services/donations";
import { sendDonationReceiptEmail } from "@/lib/services/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // Verify webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutCompleted(session);
    } catch (error) {
      console.error(
        "[Stripe Webhook] Error processing checkout.session.completed:",
        error
      );
      // Return 500 so Stripe retries
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const sessionId = session.id;

  // Idempotency: skip if already processed
  const existing = await getDonationBySessionId(sessionId);
  if (existing) {
    console.log(
      `[Stripe Webhook] Session ${sessionId} already processed, skipping.`
    );
    return;
  }

  const customerDetails = session.customer_details;
  const donorName = customerDetails?.name || "Valued Donor";
  const donorEmail = customerDetails?.email;

  if (!donorEmail) {
    console.error(
      `[Stripe Webhook] No email found for session ${sessionId}`
    );
    throw new Error("No donor email in checkout session");
  }

  const amountTotal = session.amount_total;
  if (!amountTotal || amountTotal <= 0) {
    console.error(
      `[Stripe Webhook] Invalid amount for session ${sessionId}`
    );
    throw new Error("Invalid donation amount");
  }

  const currency = session.currency || "usd";
  const billingAddress = customerDetails?.address;
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;

  // Store donation in Supabase
  const { id: donationId } = await insertDonation({
    stripe_session_id: sessionId,
    stripe_payment_intent: paymentIntent,
    donor_name: donorName,
    donor_email: donorEmail,
    amount_cents: amountTotal,
    currency,
    billing_address_line1: billingAddress?.line1 || null,
    billing_address_line2: billingAddress?.line2 || null,
    billing_city: billingAddress?.city || null,
    billing_state: billingAddress?.state || null,
    billing_postal_code: billingAddress?.postal_code || null,
    billing_country: billingAddress?.country || null,
  });

  // Send receipt email (best-effort — don't fail the webhook if email fails)
  const emailResult = await sendDonationReceiptEmail({
    donorName,
    donorEmail,
    amountCents: amountTotal,
    currency,
    donationDate: new Date().toISOString(),
    billingAddress: billingAddress
      ? {
          line1: billingAddress.line1,
          line2: billingAddress.line2,
          city: billingAddress.city,
          state: billingAddress.state,
          postalCode: billingAddress.postal_code,
          country: billingAddress.country,
        }
      : undefined,
  });

  if (emailResult.success) {
    await markReceiptSent(donationId);
    console.log(
      `[Stripe Webhook] Receipt email sent for session ${sessionId}`
    );
  } else {
    console.error(
      `[Stripe Webhook] Failed to send receipt for session ${sessionId}:`,
      emailResult.error
    );
  }
}
