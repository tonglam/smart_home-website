"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import * as React from "react";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date) => void;
  className?: string;
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  // Get hours and minutes from the date
  const hours = date ? date.getHours().toString().padStart(2, "0") : "00";
  const minutes = date ? date.getMinutes().toString().padStart(2, "0") : "00";

  const [hour, setHour] = React.useState(hours);
  const [minute, setMinute] = React.useState(minutes);

  // Update the component state when the date prop changes
  React.useEffect(() => {
    if (date) {
      setHour(date.getHours().toString().padStart(2, "0"));
      setMinute(date.getMinutes().toString().padStart(2, "0"));
    }
  }, [date]);

  // Handle hour input
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, "");

    // Ensure the value is between 0 and 23
    let numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue > 23) numValue = 23;
      if (numValue < 0) numValue = 0;
      value = numValue.toString().padStart(2, "0");
    }

    setHour(value);

    if (date && value.length === 2) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(value));
      setDate(newDate);
    }
  };

  // Handle minute input
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove non-numeric characters
    value = value.replace(/\D/g, "");

    // Ensure the value is between 0 and 59
    let numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (numValue > 59) numValue = 59;
      if (numValue < 0) numValue = 0;
      value = numValue.toString().padStart(2, "0");
    }

    setMinute(value);

    if (date && value.length === 2) {
      const newDate = new Date(date);
      newDate.setMinutes(parseInt(value));
      setDate(newDate);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Input
        type="text"
        value={hour}
        onChange={handleHourChange}
        className="w-[3rem] text-center p-1 h-8"
        placeholder="00"
        maxLength={2}
      />
      <span className="text-base">:</span>
      <Input
        type="text"
        value={minute}
        onChange={handleMinuteChange}
        className="w-[3rem] text-center p-1 h-8"
        placeholder="00"
        maxLength={2}
      />
    </div>
  );
}
