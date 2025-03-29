"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-2xl w-full">
        <div className="flex flex-col items-center text-center">
          <HiOutlineExclamationCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
