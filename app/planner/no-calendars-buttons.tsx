"use client";

import { NewGroupDialog } from "@/components/new-group-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function NoCalendarsButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <NewGroupDialog onCreate={() => router.refresh()} />
      <Button variant="outline">Join group calendar</Button>
    </div>
  );
}
