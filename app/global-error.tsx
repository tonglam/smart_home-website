"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HiExclamationCircle } from "react-icons/hi";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="p-8 max-w-2xl w-full">
            <div className="flex flex-col items-center text-center">
              <HiExclamationCircle className="h-8 w-8 text-destructive mb-2" />
              <h3 className="text-lg font-medium mb-2">
                Something went wrong! Try again or reload the page.
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error.message || "An unexpected error occurred"}
                {error.digest && (
                  <span className="block text-xs mt-1">
                    Error ID: {error.digest}
                  </span>
                )}
              </p>
              <div className="flex gap-4">
                <Button variant="default" onClick={reset}>
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </body>
    </html>
  );
}
