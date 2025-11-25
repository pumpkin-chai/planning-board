"use client";

import { createClient } from "@/lib/supabase/client";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Group } from "@/lib/types";
import { useRouter } from "next/navigation";

export function LeaveGroupButton({
  group,
  refresh,
}: {
  group: Group;
  refresh?: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [pending, startTransition] = useTransition();

  const leaveGroup = () => {
    startTransition(async () => {
      const { error } = await supabase
        .from("Memberships")
        .delete()
        .eq("group_id", group.id);

      if (error) {
        toast.error("Error leaving group", {
          description: `Failed to leave group "${group.name}"`,
        });
      } else {
        toast.success("Left group", {
          description: `Successfully left group "${group.name}"`,
        });
        if (refresh) router.refresh();
      }
    });
  };

  return (
    <Button disabled={pending} onClick={leaveGroup}>
      Leave Group
    </Button>
  );
}
