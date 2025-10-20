"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { EventProposal, EventProposalDialog } from "./event-proposal-dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Event = { id: number; name: string; datetime: Date };

export function EventCalendar({
  groupId,
  events,
}: {
  groupId: number;
  events: Event[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const selectedEvents = events.filter(
    (event) => event.datetime.toDateString() === date?.toDateString(),
  );

  const handlePropose = (proposal: EventProposal) => {
    console.log("Proposed Event:", proposal);

    const propose = async () => {
      const { data } = await supabase
        .from("Events")
        .insert({
          group_id: groupId,
          name: proposal.name,
          datetime: proposal.date.toISOString(),
        })
        .select()
        .single();
      if (data) {
        router.refresh();
      }
    };

    propose();
  };

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
        <EventProposalDialog proposeAction={handlePropose} />
      </div>
    </div>
  );
}
