"use server";

import { sendContactEmail, type ContactFormData, type EmailResult } from "../services/email";

/**
 * Server Action for contact form submission
 * This runs on the server and handles email sending
 */
export async function submitContactForm(formData: FormData): Promise<EmailResult> {
  const data: ContactFormData = {
    email: formData.get("email") as string,
    message: formData.get("message") as string,
    name: (formData.get("name") as string) || undefined,
  };

  return sendContactEmail(data);
}
