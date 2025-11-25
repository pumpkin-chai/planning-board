"use client";

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { EventProposalDialog } from "./event-proposal-dialog";
import { Button } from "@/components/ui/button";
import { EventList } from "./event-list";
import { Event } from "@/lib/types";

export type EventResult = {
  id: number;
  title: string;
  desc: string;
  startsAt: string;
  endsAt?: string | null;
  status: string;
  creator: { username: string };
  isAttending: boolean;
  attendeeCount: number;
};

export function EventCalendar({
  groupId,
  events,
}: {
  groupId: number;
  events: Event[];
}) {
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

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-lg w-full max-w-[600px] m-auto"
        captionLayout="dropdown"
      />
      <div className="flex-1 flex flex-col min-w-[300px] gap-4 mt-8">
        <h3 className="mb-2 text-lg font-semibold">Events</h3>
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {selectedEvents.length > 0 ? (
            <EventList
              events={selectedEvents.filter((event) =>
                enabledFilters.has(event.status),
              )}
            />
          ) : (
            <li>No events for this date.</li>
          )}
        </ul>
        <EventProposalDialog group={groupId} />
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
