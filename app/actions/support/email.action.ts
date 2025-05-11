"use server";

import { EMAIL_DEFAULTS } from "@/lib/utils/defaults.util";
import {
  contactFormSchema,
  type ContactFormData,
} from "@/schemas/contact.schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: ContactFormData) {
  try {
    const validatedData = contactFormSchema.parse(formData);

    const emailContent = `
      Dear ${validatedData.fullName},

      Thank you for contacting Smart Home Support. We have received your message and will get back to you within 24-48 hours.

      Here's a copy of your submission:

      Subject: ${validatedData.subject}
      Priority: ${validatedData.priority}
      
      Your Message:
      ${validatedData.description}

      If you need immediate assistance or have any additional information to provide, please reply to this email.

      Best regards,
      Smart Home Support Team
    `;

    const isTestMode = EMAIL_DEFAULTS.FROM_EMAIL.includes("resend.dev");
    const emailRecipient = isTestMode
      ? EMAIL_DEFAULTS.TEST_EMAIL
      : validatedData.email;

    const result = await resend.emails.send({
      from: EMAIL_DEFAULTS.FROM_EMAIL,
      to: [emailRecipient],
      subject: `[Confirmation] We received your message - ${validatedData.subject}`,
      text: emailContent,
      replyTo: EMAIL_DEFAULTS.REPLY_TO,
    });

    if (result.error) {
      console.error("Error sending email:", result.error);
      throw new Error("Failed to send confirmation email");
    }

    return {
      success: true,
      messageId: result.data?.id,
      testMode: isTestMode,
    };
  } catch (error) {
    console.error("Error in sendContactEmail:", error);
    throw error;
  }
}
