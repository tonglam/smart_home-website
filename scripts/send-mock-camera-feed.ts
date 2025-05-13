import { config } from "dotenv";
import path from "path";
import { CAMERA_TOPIC } from "../lib/utils/defaults.util";
import { publishMessage } from "../lib/utils/mqtt.util";

// Load environment variables from .env file at the project root
config({ path: path.resolve(__dirname, "../../.env") });

const MOCK_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; // 1x1 transparent PNG

interface MockCameraMessage {
  timestamp: string;
  home_id: string;
  device_id: string;
  image_b64: string;
  format: string;
  resolution: string;
}

async function sendMockFeedMessage() {
  const message: MockCameraMessage = {
    timestamp: new Date().toISOString(),
    home_id: "mock-home-123",
    device_id: "mock-camera-789",
    image_b64: MOCK_IMAGE_BASE64,
    format: "image/png",
    resolution: "640x480",
  };

  console.log(
    `[MockFeed] Publishing to topic "${CAMERA_TOPIC}":`,
    JSON.stringify(message, null, 2)
  );

  const success = await publishMessage(CAMERA_TOPIC, message);

  if (success) {
    console.log("[MockFeed] Message published successfully.");
  } else {
    console.error("[MockFeed] Failed to publish message.");
  }
}

async function startMockFeed() {
  console.log(
    "[MockFeed] Starting to send mock camera feed messages every 5 seconds."
  );
  console.log(
    `[MockFeed] Ensure your MQTT_BROKER_URL, MQTT_USERNAME, and MQTT_PASSWORD environment variables are correctly set in your .env file for mqtt.util.ts to connect.`
  );
  console.log("[MockFeed] Press Ctrl+C to stop.");

  // Send one immediately
  await sendMockFeedMessage();

  // Then send every 5 seconds
  const intervalId = setInterval(sendMockFeedMessage, 5000);

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n[MockFeed] Stopping mock feed...");
    clearInterval(intervalId);
    // Allow some time for the last console logs if needed, then exit
    setTimeout(() => process.exit(0), 500);
  });

  process.on("SIGTERM", () => {
    console.log("\n[MockFeed] Stopping mock feed (SIGTERM)...");
    clearInterval(intervalId);
    setTimeout(() => process.exit(0), 500);
  });
}

startMockFeed().catch((error) => {
  console.error("[MockFeed] Error starting mock feed:", error);
  process.exit(1);
});
