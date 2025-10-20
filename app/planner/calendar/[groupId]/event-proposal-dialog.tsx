"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export type EventProposal = { title: string; startsAt: Date };

export function EventProposalDialog({
  proposeAction,
}: {
  proposeAction: (date: EventProposal) => void;
}) {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleEventNameChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleEventDateChange = (event: any) => {
    setDate(event.target.value);
  };

  const handleSubmit = () => {
    proposeAction({ title: title, startsAt: new Date(date) });
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">Propose Event</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Propose Event</DialogTitle>
            <DialogDescription>
              Propose a new event to the group.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Event Name"
                value={title}
                onChange={handleEventNameChange}
                required
              />
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="datetime-local"
                name="date"
                value={date}
                onChange={handleEventDateChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Create Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
