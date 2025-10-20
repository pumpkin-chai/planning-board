"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { EventProposalDialog } from "./event-proposal-dialog";

type Event = { id: number; name: string; datetime: Date };

export function EventCalendar({ events }: { events: Event[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const selectedEvents = events.filter(
    (event) => event.datetime.toDateString() === date?.toDateString(),
  );

  return (
    <div className="flex flex-wrap gap-6">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm flex-1 min-w-[300px]"
        captionLayout="dropdown"
      />
      <div className="flex-1 flex flex-col min-w-[300px] gap-4">
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {selectedEvents.map((event) => (
            <li key={event.id} className="p-4 border rounded-md">
              <h3 className="font-semibold">{event.name}</h3>
              <p className="text-sm text-muted-foreground">
                {event.datetime.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
        <EventProposalDialog />
      </div>
    </div>
  );
}
