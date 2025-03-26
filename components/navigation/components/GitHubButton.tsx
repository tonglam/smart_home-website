"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaGithub } from "react-icons/fa";

export function GitHubButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full transition-colors hover:bg-muted"
          onClick={() =>
            window.open(
              "https://github.com/tonglam/smart_home-website",
              "_blank"
            )
          }
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>View Source Code</p>
      </TooltipContent>
    </Tooltip>
  );
}
