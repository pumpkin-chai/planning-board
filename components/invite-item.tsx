"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Invite, InviteStatus } from "@/lib/types";
import { useRouter } from "next/navigation";

export function InviteItem({ invite }: { invite: Invite }) {
  const supabase = createClient();
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  const setStatus = (newStatus: InviteStatus) => {
    startTransition(async () => {
      const { error } = await supabase
        .from("user_invitations")
        .update({ status: newStatus })
        .eq("inviter", invite.inviter)
        .eq("group_id", invite.groupId);

      const presentTense = newStatus === "accepted" ? "accept" : "decline";
      if (error) {
        toast.error(`Failed to ${presentTense}`, {
          description: `Failed to ${presentTense} invitation. Please try again later.`,
        });
      } else {
        toast.success(`Invite ${newStatus}`, {
          description: `Successfully ${newStatus} invitation to group "${invite.group}."`,
        });
        router.refresh();
      }
    });
  };

  return (
    <div
      className={`p-6 ${invite.status === "pending" ? "bg-card" : "bg-transparent border"} rounded flex justify-between items-center shadow-sm`}
    >
      <div
        className={
          invite.status === "pending"
            ? "text-foreground"
            : "text-muted-foreground"
        }
      >
        <span className="font-bold">{invite.inviter}</span> invited you to{" "}
        <span className="underline">{invite.group}</span>
      </div>
      {invite.status === "pending" ? (
        <ButtonGroup>
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => setStatus("accepted")}
          >
            <Check />
          </Button>
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => setStatus("declined")}
          >
            <X />
          </Button>
        </ButtonGroup>
      ) : (
        <span className="text-muted-foreground text-sm">
          {invite.status.toUpperCase()}
        </span>
      )}
    </div>
  );
}
