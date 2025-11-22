"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { EventProposal, EventProposalDialog } from "./event-proposal-dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { EventCard } from "./event-card";
import { Button } from "@/components/ui/button";

export type Event = {
  id: number;
  title: string;
  desc: string;
  startsAt: Date;
  endsAt?: Date;
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

  const [statusFilters, setStatusFilters] = useState<
    { id: number; name: string; checked: boolean }[]
  >([
    { id: 1, name: "proposed", checked: true },
    { id: 2, name: "planned", checked: true },
    { id: 3, name: "canceled", checked: true },
  ]);
  const enabledFilters = new Set(
    statusFilters
      .filter((filter) => filter.checked)
      .map((filter) => filter.name),
  );

  const handlePropose = (proposal: EventProposal) => {
    console.log("Proposed Event:", proposal);

    const propose = async () => {
      const { data } = await supabase
        .from("Events")
        .insert({
          group_id: groupId,
          title: proposal.title,
          description: proposal.description,
          starts_at: proposal.startsAt.toISOString(),
          ends_at: proposal.endsAt,
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
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm w-full max-w-[600px] m-auto"
        captionLayout="dropdown"
      />
      <div className="flex-1 flex flex-col min-w-[300px] gap-4 mt-8">
        <h3 className="mb-2 text-lg font-semibold">Events</h3>
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {selectedEvents.length > 0 ? (
            selectedEvents
              .filter((event) => enabledFilters.has(event.status))
              .map((event) => (
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
      <div>
        <h3 className="mt-8 mb-2 text-lg font-semibold">Filters</h3>
        <div className="sm:flex gap-4 items-center">
          <div className="flex gap-4 mb-4 sm:mb-0">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setStatusFilters((prevFilters) =>
                  prevFilters.map((f) => ({ ...f, checked: true })),
                );
              }}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilters((prevFilters) =>
                  prevFilters.map((f) => ({ ...f, checked: false })),
                );
              }}
            >
              Clear
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {statusFilters.map((filter) => (
              <li key={filter.id}>
                <input
                  type="checkbox"
                  id={`filter-${filter.id}`}
                  checked={filter.checked}
                  onChange={() => {
                    setStatusFilters((prevFilters) =>
                      prevFilters.map((f) =>
                        f.id === filter.id ? { ...f, checked: !f.checked } : f,
                      ),
                    );
                  }}
                />
                <label htmlFor={`filter-${filter.id}`} className="ml-2">
                  {filter.name[0].toUpperCase() + filter.name.slice(1)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
