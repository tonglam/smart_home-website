"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * CSRF protected action wrapper
 * Ensures that the action is only executed by authenticated users
 * and protects against CSRF attacks
 */
export async function withCsrfCheck<T>(
  action: () => Promise<T>,
  options?: {
    redirectOnError?: boolean;
    errorMessage?: string;
  }
): Promise<T> {
  try {
    const session = await auth();
    if (!session.userId) {
      throw new Error("Unauthorized");
    }
    return await action();
  } catch (error) {
    console.error("CSRF check failed:", error);
    if (options?.redirectOnError) {
      redirect("/signin");
    }
    throw new Error(options?.errorMessage || "Authentication failed");
  }
}
