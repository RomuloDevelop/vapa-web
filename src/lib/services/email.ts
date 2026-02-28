import nodemailer from "nodemailer";

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== "false"; // Default to true (SSL)
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL; // Where to receive contact form emails

// Timeout for SMTP operations (8 seconds to stay under Vercel's 10s limit)
const SMTP_TIMEOUT = 8000;

export interface DonationReceiptData {
  donorName: string;
  donorEmail: string;
  amountCents: number;
  currency: string;
  donationDate: string;
  billingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
}

export interface ContactFormData {
  email: string;
  message: string;
  name?: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
  errorCode?: "TIMEOUT" | "CONFIG" | "SMTP" | "VALIDATION" | "UNKNOWN";
}

/**
 * Validate email configuration
 */
function validateConfig(): EmailResult | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL) {
    return {
      success: false,
      error: "Email service is not configured. Please contact the administrator.",
      errorCode: "CONFIG",
    };
  }
  return null;
}

/**
 * Validate form data
 */
function validateFormData(data: ContactFormData): EmailResult | null {
  if (!data.email || !data.email.includes("@")) {
    return {
      success: false,
      error: "Please provide a valid email address.",
      errorCode: "VALIDATION",
    };
  }
  if (!data.message || data.message.trim().length < 10) {
    return {
      success: false,
      error: "Please provide a message (at least 10 characters).",
      errorCode: "VALIDATION",
    };
  }
  return null;
}

/**
 * Create transporter with timeout settings
 *
 * Common configurations:
 * - Port 465: SSL/TLS (secure: true)
 * - Port 587: STARTTLS (secure: false) - most common for cPanel
 * - Port 25: Plain (no encryption)
 */
function createTransporter() {
  // For port 587, we need STARTTLS (secure: false initially, then upgrade)
  // For port 465, we use implicit SSL (secure: true)
  const useSecure = SMTP_PORT === 465 ? true : SMTP_SECURE;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: useSecure,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: SMTP_TIMEOUT,
    greetingTimeout: SMTP_TIMEOUT,
    socketTimeout: SMTP_TIMEOUT,
    // For STARTTLS on port 587
    ...(SMTP_PORT === 587 && {
      requireTLS: true,
    }),
    // Allow self-signed certificates (common on shared hosting)
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Send invitation email with link to set password
 */
export async function sendInvitationEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  const configError = validateConfig();
  if (configError) return configError;

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const setPasswordUrl = `${baseUrl}/auth/set-password?token=${token}`;

  const transporter = createTransporter();

  const mailOptions = {
    from: `"VAPA" <${SMTP_USER}>`,
    to: email,
    subject: "You're invited to VAPA — Set your password",
    text: `
Hi ${name},

You've been invited to join the VAPA members area.

Please click the link below to set your password and activate your account:

${setPasswordUrl}

This link will expire in 48 hours.

If you did not expect this invitation, you can safely ignore this email.

— VAPA Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #142840; color: #DCBA60; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .btn { display: inline-block; padding: 14px 28px; background: #DCBA60; color: #142840; text-decoration: none; font-weight: bold; border-radius: 6px; }
    .footer { padding: 15px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to VAPA</h2>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>You've been invited to join the VAPA members area. Click the button below to set your password and activate your account:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${setPasswordUrl}" class="btn">Set Your Password</a>
      </p>
      <p style="font-size: 13px; color: #666;">This link will expire in 48 hours. If the button doesn't work, copy and paste this URL into your browser:</p>
      <p style="font-size: 12px; word-break: break-all; color: #888;">${setPasswordUrl}</p>
    </div>
    <div class="footer">
      If you did not expect this invitation, you can safely ignore this email.
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("TIMEOUT")), SMTP_TIMEOUT);
    });

    await Promise.race([sendPromise, timeoutPromise]);
    return { success: true };
  } catch (error) {
    console.error("Error sending invitation email:", error);
    if (error instanceof Error && error.message === "TIMEOUT") {
      return { success: false, error: "Email server timeout.", errorCode: "TIMEOUT" };
    }
    return { success: false, error: "Failed to send invitation email.", errorCode: "SMTP" };
  } finally {
    transporter.close();
  }
}

/**
 * Send password reset email with link to reset password
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<EmailResult> {
  const configError = validateConfig();
  if (configError) return configError;

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

  const transporter = createTransporter();

  const mailOptions = {
    from: `"VAPA" <${SMTP_USER}>`,
    to: email,
    subject: "Reset your VAPA password",
    text: `
Hi ${name},

We received a request to reset your password for your VAPA account.

Please click the link below to set a new password:

${resetUrl}

This link will expire in 1 hour.

If you did not request a password reset, you can safely ignore this email.

— VAPA Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #142840; color: #DCBA60; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .btn { display: inline-block; padding: 14px 28px; background: #DCBA60; color: #142840; text-decoration: none; font-weight: bold; border-radius: 6px; }
    .footer { padding: 15px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Reset Your Password</h2>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>We received a request to reset your password for your VAPA account. Click the button below to set a new password:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="btn">Reset Password</a>
      </p>
      <p style="font-size: 13px; color: #666;">This link will expire in 1 hour. If the button doesn't work, copy and paste this URL into your browser:</p>
      <p style="font-size: 12px; word-break: break-all; color: #888;">${resetUrl}</p>
    </div>
    <div class="footer">
      If you did not request a password reset, you can safely ignore this email.
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("TIMEOUT")), SMTP_TIMEOUT);
    });

    await Promise.race([sendPromise, timeoutPromise]);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    if (error instanceof Error && error.message === "TIMEOUT") {
      return { success: false, error: "Email server timeout.", errorCode: "TIMEOUT" };
    }
    return { success: false, error: "Failed to send password reset email.", errorCode: "SMTP" };
  } finally {
    transporter.close();
  }
}

/**
 * Send donation acknowledgment and receipt email
 */
export async function sendDonationReceiptEmail(
  data: DonationReceiptData
): Promise<EmailResult> {
  const configError = validateConfig();
  if (configError) return configError;

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: data.currency.toUpperCase(),
  }).format(data.amountCents / 100);

  const formattedDate = new Date(data.donationDate).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const addressParts = [
    data.billingAddress?.line1,
    data.billingAddress?.line2,
    [
      data.billingAddress?.city,
      data.billingAddress?.state,
      data.billingAddress?.postalCode,
    ]
      .filter(Boolean)
      .join(", "),
    data.billingAddress?.country,
  ].filter(Boolean);
  const billingAddressText =
    addressParts.length > 0 ? addressParts.join(", ") : "Not provided";
  const billingAddressHtml =
    addressParts.length > 0 ? addressParts.join("<br>") : "Not provided";

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const logoUrl = `${baseUrl}/vapa-email.png`;

  const transporter = createTransporter();

  const mailOptions = {
    from: `"VAPA" <${SMTP_USER}>`,
    to: data.donorEmail,
    subject: "Donation Acknowledgment and Receipt — VAPA",
    text: `
Donation Acknowledgment and Receipt

Dear ${data.donorName},

We greatly appreciate your generous donation of ${formattedAmount}, made to the Venezuelan American Petroleum Association (VAPA).

Below are the details of your contribution:

  - Donation Amount: ${formattedAmount}
  - Date of Contribution: ${formattedDate}
  - Donor Name: ${data.donorName}
  - Billing Address: ${billingAddressText}

Your support plays an important role in advancing VAPA's educational and charitable initiatives for tomorrow's energy landscape.

The Venezuelan American Petroleum Association is a nonprofit organization recognized as tax-exempt under Section 501(c)(3) of the Internal Revenue Code. Our Federal Tax Identification Number (EIN) is 84-2435501.

No goods or services were provided in exchange for this contribution. Therefore, your donation is tax-deductible to the extent permitted by law. Please retain this letter for your records.

If you have any questions, please contact us at oman.oquendo@vapa-us.org.

To learn more about VAPA and our mission, please visit: http://vapa-us.org

With gratitude,
Venezuelan American Petroleum Association (VAPA)
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .logo-bar { padding: 20px; background: #fff; }
    .logo-bar table { width: 100%; }
    .logo-bar img { height: 60px; width: auto; }
    .logo-bar .date { text-align: right; font-size: 13px; color: #666; vertical-align: bottom; }
    .content { padding: 30px 20px; background: #f9f9f9; }
    .greeting { font-size: 16px; margin-bottom: 15px; }
    .details { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .details td { padding: 10px 12px; border-bottom: 1px solid #e0e0e0; vertical-align: top; }
    .details .label { font-weight: bold; color: #666; width: 40%; }
    .details .value { color: #333; }
    .amount { font-size: 18px; font-weight: bold; color: #142840; }
    .tax-info { background: #fff; border-left: 3px solid #DCBA60; padding: 15px; margin: 20px 0; font-size: 14px; }
    .tax-info strong { color: #142840; }
    .legal { font-size: 13px; color: #666; margin: 20px 0; font-style: italic; }
    .contact { font-size: 13px; color: #666; margin-top: 20px; }
    .contact a { color: #DCBA60; text-decoration: none; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #C2CEDB; background: #142840; }
    .footer a { color: #DCBA60; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-bar">
      <table><tr>
        <td><img src="${logoUrl}" alt="VAPA - Venezuelan American Petroleum Association" /></td>
        <td class="date">${formattedDate}</td>
      </tr></table>
    </div>
    <div class="content">
      <h2 style="text-align: center; font-size: 18px; color: #333; margin: 0 0 20px 0;">Donation Acknowledgment and Receipt</h2>
      <p class="greeting">Dear <strong>${data.donorName}</strong>,</p>
      <p>We greatly appreciate your generous donation of <strong>${formattedAmount}</strong>, made to the Venezuelan American Petroleum Association (VAPA).</p>

      <table class="details">
        <tr>
          <td class="label">Donation Amount</td>
          <td class="value amount">${formattedAmount}</td>
        </tr>
        <tr>
          <td class="label">Date of Contribution</td>
          <td class="value">${formattedDate}</td>
        </tr>
        <tr>
          <td class="label">Donor Name</td>
          <td class="value">${data.donorName}</td>
        </tr>
        <tr>
          <td class="label">Billing Address</td>
          <td class="value">${billingAddressHtml}</td>
        </tr>
      </table>

      <p>Your support plays an important role in advancing VAPA's educational and charitable initiatives for tomorrow's energy landscape.</p>

      <div class="tax-info">
        <strong>Tax Deduction Information</strong><br>
        The Venezuelan American Petroleum Association is a nonprofit organization recognized as tax-exempt under <strong>Section 501(c)(3)</strong> of the Internal Revenue Code. Our Federal Tax Identification Number (EIN) is <strong>84-2435501</strong>.
      </div>

      <p class="legal"><strong>No goods or services were provided in exchange for this contribution.</strong> Therefore, your donation is tax-deductible to the extent permitted by law. Please retain this letter for your records.</p>

      <p class="contact">If you have any questions, please contact us at <a href="mailto:oman.oquendo@vapa-us.org">oman.oquendo@vapa-us.org</a>.</p>
      <p class="contact">To learn more about VAPA and our mission, please visit: <a href="http://vapa-us.org">vapa-us.org</a></p>
    </div>
    <div class="footer">
      <p>With gratitude,<br><strong>Venezuelan American Petroleum Association (VAPA)</strong></p>
      <p><a href="http://vapa-us.org">vapa-us.org</a></p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("TIMEOUT")), SMTP_TIMEOUT);
    });

    await Promise.race([sendPromise, timeoutPromise]);
    return { success: true };
  } catch (error) {
    console.error("Error sending donation receipt email:", error);
    if (error instanceof Error && error.message === "TIMEOUT") {
      return {
        success: false,
        error: "Email server timeout.",
        errorCode: "TIMEOUT",
      };
    }
    return {
      success: false,
      error: "Failed to send donation receipt email.",
      errorCode: "SMTP",
    };
  } finally {
    transporter.close();
  }
}

/**
 * Send contact form email with timeout handling
 */
export async function sendContactEmail(data: ContactFormData): Promise<EmailResult> {
  // Validate configuration
  const configError = validateConfig();
  if (configError) return configError;

  // Validate form data
  const validationError = validateFormData(data);
  if (validationError) return validationError;

  const transporter = createTransporter();

  // Create email content
  const mailOptions = {
    from: `"VAPA Contact Form" <${SMTP_USER}>`,
    to: CONTACT_EMAIL,
    replyTo: data.email,
    subject: `Contact Iquery: ${data.name || data.email}`,
    text: `
New message from VAPA website contact form:

From: ${data.name || data.email}
Email: ${data.email}

Message:
${data.message}

---
This email was sent from the VAPA website contact form.
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #142840; color: #DCBA60; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .value { margin-top: 5px; }
    .message { background: white; padding: 15px; border-left: 3px solid #DCBA60; }
    .footer { padding: 15px; text-align: center; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From:</div>
        <div class="value">${data.name || data.email}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message">${data.message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
    <div class="footer">
      This email was sent from the VAPA website contact form.
    </div>
  </div>
</body>
</html>
    `.trim(),
  };

  // Send with timeout wrapper
  try {
    const sendPromise = transporter.sendMail(mailOptions);

    // Race between send and timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("TIMEOUT"));
      }, SMTP_TIMEOUT);
    });

    await Promise.race([sendPromise, timeoutPromise]);

    return { success: true };
  } catch (error) {
    // Detailed error logging for debugging
    console.error("=== Email Send Error ===");
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    if (error instanceof Error && "code" in error) {
      console.error("Error code:", (error as NodeJS.ErrnoException).code);
    }
    console.error("Full error:", error);
    console.error("========================");

    // Handle specific error types
    if (error instanceof Error) {
      const errMsg = error.message.toLowerCase();
      const errCode = "code" in error ? (error as NodeJS.ErrnoException).code : "";

      if (error.message === "TIMEOUT") {
        return {
          success: false,
          error: "The email server is taking too long to respond. Please try again later.",
          errorCode: "TIMEOUT",
        };
      }

      // SMTP authentication errors
      if (errMsg.includes("auth") || errMsg.includes("535") || errMsg.includes("invalid login")) {
        return {
          success: false,
          error: "Email authentication failed. Please contact the administrator.",
          errorCode: "SMTP",
        };
      }

      // Connection errors
      if (
        errMsg.includes("econnrefused") ||
        errMsg.includes("enotfound") ||
        errMsg.includes("connect") ||
        errMsg.includes("etimedout") ||
        errCode === "ECONNREFUSED" ||
        errCode === "ENOTFOUND" ||
        errCode === "ETIMEDOUT"
      ) {
        return {
          success: false,
          error: "Could not connect to the email server. Please try again later.",
          errorCode: "SMTP",
        };
      }

      // SSL/TLS errors
      if (
        errMsg.includes("ssl") ||
        errMsg.includes("tls") ||
        errMsg.includes("certificate") ||
        errMsg.includes("wrong version") ||
        errCode === "ESOCKET"
      ) {
        return {
          success: false,
          error: "Email server security error. Try changing SMTP_PORT to 587 and SMTP_SECURE to false.",
          errorCode: "SMTP",
        };
      }
    }

    return {
      success: false,
      error: "Failed to send your message. Please try again or contact us directly.",
      errorCode: "UNKNOWN",
    };
  } finally {
    // Close the transporter
    transporter.close();
  }
}
