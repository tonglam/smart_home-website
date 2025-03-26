"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { IoMdHelpCircleOutline } from "react-icons/io";

export function SupportButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href="/support">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full transition-colors hover:bg-muted"
          >
            <IoMdHelpCircleOutline className="h-5 w-5" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Get Help & Support</p>
      </TooltipContent>
    </Tooltip>
  );
}
