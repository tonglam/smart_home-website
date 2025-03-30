"use client";

import { useClerk } from "@clerk/nextjs";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AuthErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    // Only set hasError to true for authentication-related errors
    const isAuthError =
      error.message?.toLowerCase().includes("auth") ||
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("unauthenticated") ||
      error.message?.toLowerCase().includes("session") ||
      error.name === "ClerkError";

    return { hasError: isAuthError };
  }

  componentDidCatch(error: Error) {
    // If it's not an auth error, rethrow it to be caught by the global error handler
    const isAuthError =
      error.message?.toLowerCase().includes("auth") ||
      error.message?.toLowerCase().includes("unauthorized") ||
      error.message?.toLowerCase().includes("unauthenticated") ||
      error.message?.toLowerCase().includes("session") ||
      error.name === "ClerkError";

    if (!isAuthError) {
      throw error;
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

function ErrorFallback() {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      // Using 'as Route' assertion to satisfy Typed Routes
      router.push("/signin" as Route);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Error</h2>
      <p className="text-gray-600 mb-8">Please sign in again to continue.</p>
      <button
        onClick={handleSignOut}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Sign In
      </button>
    </div>
  );
}
