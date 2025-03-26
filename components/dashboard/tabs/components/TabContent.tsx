"use client";

import { TabsContent } from "@/components/ui/tabs";
import { memo } from "react";
import type { TabValue } from "../../types";

interface TabContentProps {
  value: TabValue;
  Component: React.FC;
}

export const TabContent = memo(({ value, Component }: TabContentProps) => {
  return (
    <TabsContent
      value={value}
      role="tabpanel"
      aria-labelledby={`${value}-tab`}
      tabIndex={0}
      className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <Component />
    </TabsContent>
  );
});

TabContent.displayName = "TabContent";
