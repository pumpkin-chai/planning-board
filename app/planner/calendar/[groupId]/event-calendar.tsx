"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { EventProposal, EventProposalDialog } from "./event-proposal-dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { EventCard } from "./event-card";

export type Event = {
  id: number;
  title: string;
  startsAt: Date;
  status: string;
  createdBy: string;
};

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
    (event) => event.startsAt.toDateString() === date?.toDateString(),
  );

  const handlePropose = (proposal: EventProposal) => {
    console.log("Proposed Event:", proposal);

    const propose = async () => {
      const { data } = await supabase
        .from("Events")
        .insert({
          group_id: groupId,
          title: proposal.title,
          starts_at: proposal.startsAt.toISOString(),
          status: "proposed",
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
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))
          ) : (
            <li>No events for this date.</li>
          )}
        </ul>
        <EventProposalDialog proposeAction={handlePropose} />
      </div>
    </div>
  );
}
