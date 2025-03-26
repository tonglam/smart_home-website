import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

interface FeedHeaderProps {
  onToggleExpand: () => void;
  isExpanded: boolean;
  className?: string;
}

export function FeedHeader({
  onToggleExpand,
  isExpanded,
  className,
}: FeedHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 border-b",
        className
      )}
    >
      <h3 className="font-medium">Recent Device Activities</h3>
      <Button variant="ghost" size="sm" onClick={onToggleExpand}>
        {isExpanded ? (
          <HiChevronUp className="h-4 w-4" />
        ) : (
          <HiChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
