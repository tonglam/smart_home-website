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

  useEffect(() => {
    if (isVisible) {
      setRendered(true);
    }

    if (!isVisible) {
      const timer = setTimeout(() => {
        setRendered(false);
      }, 300);

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
