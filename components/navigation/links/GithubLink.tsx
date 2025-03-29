import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

export function GithubLink() {
  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="h-10 w-10 rounded-full transition-colors hover:bg-muted"
      aria-label="View GitHub repository"
    >
      <a
        href="https://github.com/tonglam/smart_home-website"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub className="h-5 w-5" aria-hidden="true" />
      </a>
    </Button>
  );
}
