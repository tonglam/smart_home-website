"use client";

import { publishMqttMessageAction } from "@/app/actions/mqtt/publish.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for potentially longer messages
import { useAuth } from "@clerk/nextjs"; // To check auth status
import { useState } from "react";

interface ResultState {
  type: "success" | "error";
  message: string;
}

export default function MqttTestPage() {
  const { isSignedIn } = useAuth();
  const [topic, setTopic] = useState<string>("test/topic");
  const [message, setMessage] = useState<string>('{"hello": "world"}');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ResultState | null>(null);

  const handlePublish = async () => {
    if (!isSignedIn) {
      setResult({
        type: "error",
        message: "Please sign in to publish messages.",
      });
      return;
    }
    if (!topic || !message) {
      setResult({
        type: "error",
        message: "Topic and message cannot be empty.",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Attempt to parse JSON, fallback to string if invalid
      let messagePayload: string | object;
      try {
        messagePayload = JSON.parse(message);
      } catch (e) {
        messagePayload = message; // Send as plain string if not valid JSON
        console.error("Invalid JSON:", e);
      }

      const actionResult = await publishMqttMessageAction(
        topic,
        messagePayload
      );

      if (actionResult.success) {
        setResult({
          type: "success",
          message: actionResult.message || "Message published successfully!",
        });
      } else {
        setResult({
          type: "error",
          message: actionResult.error || "Failed to publish.",
        });
      }
    } catch (error) {
      console.error("Error calling publish action:", error);
      setResult({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected client-side error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">MQTT Publish Test</h1>
      {!isSignedIn && (
        <p className="text-red-600 mb-4">
          You must be signed in to use this test page.
        </p>
      )}
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., device/light-1/control"
            disabled={isLoading || !isSignedIn}
          />
        </div>
        <div>
          <Label htmlFor="message">Message (JSON or Plain Text)</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='e.g., { "state": "on", "brightness": 80 }'
            rows={4}
            disabled={isLoading || !isSignedIn}
          />
        </div>
        <Button onClick={handlePublish} disabled={isLoading || !isSignedIn}>
          {isLoading ? "Publishing..." : "Publish Message"}
        </Button>

        {result && (
          <div
            className={`mt-4 p-3 rounded ${result.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <p>
              <span className="font-semibold">
                {result.type === "success" ? "Success:" : "Error:"}
              </span>{" "}
              {result.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
