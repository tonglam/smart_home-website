"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = "onboarding@resend.dev"; // Resend's test email
const TEST_EMAIL = "qitonglan@gmail.com"; // Your verified email for testing

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validate the input data
    const validatedData = contactFormSchema.parse(formData);

    // Create confirmation email content
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

    // In test mode, we can only send to the verified email
    const isTestMode = FROM_EMAIL.includes("resend.dev");
    const emailRecipient = isTestMode ? TEST_EMAIL : validatedData.email;

    // Send confirmation email to customer
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: [emailRecipient],
      subject: `[Confirmation] We received your message - ${validatedData.subject}`,
      text: emailContent,
      replyTo: FROM_EMAIL,
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
