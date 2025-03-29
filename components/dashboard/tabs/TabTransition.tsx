"use client";

import { cn } from "@/lib/utils/utils";
import React, { useEffect, useState } from "react";

interface TabTransitionProps {
  children: React.ReactNode;
  className?: string;
  isVisible: boolean;
}

export function TabTransition({
  children,
  className,
  isVisible,
}: TabTransitionProps) {
  const [rendered, setRendered] = useState(isVisible);

  // Handle the visibility change
  useEffect(() => {
    if (isVisible) {
      setRendered(true);
    }

    // If hiding, we'll let the animation play before removing from DOM
    if (!isVisible) {
      const timer = setTimeout(() => {
        setRendered(false);
      }, 300); // Match the duration of the animation

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!rendered) {
    return null;
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none absolute",
        className
      )}
    >
      {children}
    </div>
  );
}
