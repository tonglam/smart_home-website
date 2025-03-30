"use client";

import { populateMockData, type PopulateResult } from "@/app/actions/mock/mock"; // Ensure this path is correct
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Info, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { useState, useTransition } from "react";

export function PopulateForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<PopulateResult | null>(null);
  const router = useRouter(); // Initialize router

  const handleSubmit = () => {
    setResult(null); // Reset previous result

    startTransition(async () => {
      const actionResult = await populateMockData();
      setResult(actionResult);

      // Redirect to dashboard on success after a short delay
      if (actionResult.success) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000); // 2-second delay
      }
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      {" "}
      {/* Added margin-top */}
      <CardHeader>
        <CardTitle>Populate Mock Data</CardTitle>
        <CardDescription>
          Click the button below to populate your account with sample smart home
          data for demonstration purposes. This action can only be performed
          once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleSubmit}
          disabled={isPending || (result?.success ?? false)} // Disable if pending or successful
          className="w-full"
          aria-live="polite" // Announce changes for screen readers
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Populating...
            </>
          ) : result?.success ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Data Populated
            </>
          ) : (
            "Populate Mock Data"
          )}
        </Button>
      </CardContent>
      {/* Show footer only when there is a result */}
      {result && (
        <CardFooter className="flex flex-col items-start space-y-2 border-t pt-4">
          <div
            className={`flex items-center text-sm font-medium ${result.success ? "text-green-600" : "text-red-600"}`}
          >
            {result.success ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Status: {result.success ? "Success" : "Error"}
          </div>
          <p className="text-sm text-muted-foreground">{result.message}</p>
          {result.success && (
            <div className="flex items-center text-sm text-blue-600 mt-2">
              <Info className="mr-2 h-4 w-4" />
              Redirecting to dashboard...
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
