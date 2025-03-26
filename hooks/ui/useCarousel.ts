"use client";

import type { CarouselContextProps } from "@/types/ui";
import * as React from "react";

/**
 * Hook for accessing carousel context within Carousel components
 */
export function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export { CarouselContext };
