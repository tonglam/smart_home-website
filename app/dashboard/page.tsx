"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {user?.firstName || "User"}!
          </h2>
          <p className="text-muted-foreground mb-6">
            This is a protected page. Only authenticated users can access it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
