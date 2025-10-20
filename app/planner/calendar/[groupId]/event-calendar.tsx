"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function EventCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm w-full md:w-3/5 lg:w-1/2"
      captionLayout="dropdown"
    />
  );
}
