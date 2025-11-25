"use client";

import { CalendarIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NewGroupDialog } from "@/components/new-group-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NoCalendarsPrompt() {
  const router = useRouter();

  return (
    <Empty className="size-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarIcon />
        </EmptyMedia>
        <EmptyTitle>No calendars yet!</EmptyTitle>
        <EmptyDescription>
          You currently have no calendars. Get started by creating one below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <NewGroupDialog onCreateAction={() => router.refresh()} />
          <Button variant="outline">Join group calendar</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
