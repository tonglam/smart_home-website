"use client";

import type { ChartContextProps } from "@/types/ui";
import * as React from "react";

/**
 * Hook for accessing chart context within Chart components
 */
export function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

export { ChartContext };
