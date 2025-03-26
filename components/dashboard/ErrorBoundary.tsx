"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { HiExclamationCircle } from "react-icons/hi";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className={cn("p-8", this.props.className)}>
          <div className="flex flex-col items-center text-center">
            <HiExclamationCircle className="h-8 w-8 text-destructive mb-2" />
            <h3 className="font-medium mb-1">Something Went Wrong</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button variant="outline" size="sm" onClick={this.handleReset}>
              Try Again
            </Button>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
