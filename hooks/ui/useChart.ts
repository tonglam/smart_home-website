"use client";

import * as React from "react";

export interface ChartContextProps {
  data: number[];
  labels: string[];
  title: string;
  description?: string;
  onDataPointClick?: (index: number) => void;
}

/**
 * Hook for accessing chart context within Chart components
 */
export function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <Chart />");
  }

  return context;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

export { ChartContext };
