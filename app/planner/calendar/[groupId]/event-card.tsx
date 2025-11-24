"use client";

import { Event } from "./event-calendar";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function EventCard({ event }: { event: Event }) {
  let statusStyle: string = "";
  if (event.status === "proposed") {
    statusStyle = "text-muted-foreground";
  } else if (event.status === "canceled") {
    statusStyle = "text-red-600";
  }

  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setLoading(true);

    const deleteEvent = async () => {
      const { error } = await supabase
        .from("Events")
        .delete()
        .eq("id", event.id);

      if (error) {
        console.error(`Error deleting event ${event.title}`);
      } else {
        console.log(`Successfully deleted ${event.title}`);
        setOpen(false);
      }

      setLoading(false);
    };

    deleteEvent();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Item className="bg-card hover:bg-accent">
          <ItemContent>
            <ItemTitle>{event.title}</ItemTitle>
            <ItemDescription>
              {event.startsAt.toLocaleString()}
              {event.endsAt &&
                " to " +
                  (event.endsAt > event.startsAt
                    ? event.endsAt.toLocaleTimeString()
                    : event.endsAt.toLocaleString())}{" "}
            </ItemDescription>
            <ItemFooter>
              <p>
                by {event.creator.currentUser ? "you" : event.creator.username}
              </p>
            </ItemFooter>
          </ItemContent>
        </Item>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">{event.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Event information
          </DialogDescription>
        </DialogHeader>

        <div>
          <p>Created by {event.creator.username}</p>
          <p>Status: {event.status[0].toUpperCase() + event.status.slice(1)}</p>
          <p>Starts: {event.startsAt.toLocaleString()}</p>
          {event.endsAt && <p>Ends: {event.endsAt.toLocaleString()}</p>}
        </div>

        <DialogFooter>
          {event.creator.currentUser ? (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Event
            </Button>
          ) : (
            <Button>Mark as going</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
