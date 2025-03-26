"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaGithub } from "react-icons/fa";

export function GitHubRepositoryLink() {
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
          aria-label="View source code on GitHub"
        >
          <FaGithub className="h-5 w-5" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>View Source Code</p>
      </TooltipContent>
    </Tooltip>
  );
}
