"use client";

import { Button } from "@/components/ui/button";
import { HiXCircle } from "react-icons/hi";

interface RemoveActivityButtonProps {
  onRemove: () => void;
}

export function RemoveActivityButton({ onRemove }: RemoveActivityButtonProps) {
  return (
    <Button variant="ghost" size="sm" className="-mr-2" onClick={onRemove}>
      <HiXCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      <span className="sr-only">Remove activity</span>
    </Button>
  );
}
