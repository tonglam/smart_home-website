"use server";

import { publishMessage } from "@/lib/utils/mqtt.util";
import { currentUser } from "@clerk/nextjs/server";

interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Server Action to securely publish an MQTT message.
 * Ensures the user is authenticated before publishing.
 *
 * @param topic The MQTT topic to publish to.
 * @param message The message payload (string or object).
 * @returns ActionResult indicating success or failure.
 */
export async function publishMqttMessageAction(
  topic: string,
  message: string | object
): Promise<ActionResult> {
  const user = await currentUser();

  if (!user) {
    console.error(
      "[Action Error] publishMqttMessageAction: Unauthenticated user."
    );
    return {
      success: false,
      error: "Authentication required. Please sign in.",
    };
  }

  console.log(
    `[Action] User ${user.id} attempting to publish to topic: ${topic}`
  );

  try {
    const published = await publishMessage(topic, message);

    if (published) {
      return { success: true, message: "Message published successfully." };
    } else {
      return {
        success: false,
        error: "Failed to publish message via MQTT.",
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[Action Error] publishMqttMessageAction failed for topic ${topic}: ${errorMessage}`
    );
    return {
      success: false,
      error: `An unexpected error occurred: ${errorMessage}`,
    };
  }
}
