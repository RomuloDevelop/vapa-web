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
    .header { background: #0A1628; color: #D4A853; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #666; }
    .value { margin-top: 5px; }
    .message { background: white; padding: 15px; border-left: 3px solid #D4A853; }
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
