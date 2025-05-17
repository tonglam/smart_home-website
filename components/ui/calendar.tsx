"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-3",
        caption: "relative flex justify-center items-center h-8",
        caption_label: "text-base font-medium",
        nav: "absolute flex items-center right-1 space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 text-muted-foreground hover:text-foreground"
        ),
        table: "w-full border-collapse",
        head_row: "grid grid-cols-[1fr_6fr]",
        head_cell: cn(
          "text-muted-foreground font-normal text-[0.8rem]",
          "[&:nth-child(1)]:text-center",
          "[&:nth-child(2)]:grid [&:nth-child(2)]:grid-cols-6 [&:nth-child(2)]:gap-0"
        ),
        row: "flex w-full mt-1",
        cell: "h-8 w-8 text-center text-sm relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 p-0 font-normal aria-selected:opacity-100 hover:bg-muted"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      formatters={{
        formatCaption: (date: Date) => {
          return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
        },
        formatWeekdayName: (date: Date) => {
          const weekday = date.toLocaleDateString("en-US", {
            weekday: "short",
          });
          return weekday.slice(0, 2);
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
