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
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function EventItem({ event }: { event: Event }) {
  const supabase = createClient();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState<boolean>(false);

  const handleDelete = () => {
    startTransition(async () => {
      const { error } = await supabase
        .from("Events")
        .delete()
        .eq("id", event.id);

      if (error) {
        toast.error("Event deletion failed", {
          description: `Failed to delete event "${event.title}." Please try again later.`,
        });
      } else {
        toast.success("Event successfully deleted", {
          description: `Successfully deleted event "${event.title}."`,
        });
        setOpen(false);
        router.refresh();
      }
    });
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
              disabled={isPending}
            >
              Delete Event
            </Button>
          ) : (
            <Button disabled={isPending}>Mark as going</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
