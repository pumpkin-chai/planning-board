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

  const handleAttending = () => {
    if (event.isAttending) {
      startTransition(async () => {
        const { data, error } = await supabase
          .from("attendees")
          .delete()
          .eq("event_id", event.id)
          .select()
          .single();

        if (!data || error) {
          toast.error("Failed to retract RSVP", {
            description: `Failed to mark event "${event.title}" as not attending. Please try again later.`,
          });
        } else {
          toast.success("No longer attending", {
            description: `Successfully marked "${event.title}" as not attending.`,
          });
          router.refresh();
        }
      });
    } else {
      startTransition(async () => {
        const { data, error } = await supabase
          .from("attendees")
          .insert({
            event_id: event.id,
          })
          .select()
          .single();

        if (!data || error) {
          toast.error("RSVP failed", {
            description: `Failed to mark event "${event.title}" as attending. Please try again later.`,
          });
        } else {
          toast.success("You are attending!", {
            description: `Successfully marked "${event.title}" as attending.`,
          });
          router.refresh();
        }
      });
    }
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
            <Button disabled={isPending} onClick={handleAttending}>
              Mark as {event.isAttending ? "not attending" : "attending"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
