"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Check, X } from "lucide-react";
import { InviteStatus, updateInviteStatus } from "./actions";
import { useState } from "react";

export function Invite({
  inviter,
  group,
  status,
  groupId,
}: {
  inviter: string;
  group: string;
  status: InviteStatus;
  groupId: number;
}) {
  const [currentStatus, setCurrentStatus] = useState<InviteStatus>(status);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAccept = async () => {
    setLoading(true);
    const { data } = await updateInviteStatus(inviter, groupId, "accepted");
    if (data) {
      setCurrentStatus(data.status);
    }
    setLoading(false);
  };

  const handleDecline = async () => {
    setLoading(true);
    const { data } = await updateInviteStatus(inviter, groupId, "declined");
    if (data) {
      setCurrentStatus(data.status);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-between bg-background p-4 rounded-lg">
      <div>
        <span className="font-bold">{inviter}</span> invited you to{" "}
        <span className="underline">{group}</span>
      </div>
      {loading ? (
        <span>Loading</span>
      ) : currentStatus === "pending" ? (
        <ButtonGroup>
          <Button variant="ghost" onClick={handleAccept}>
            <Check />
          </Button>
          <Button variant="ghost" onClick={handleDecline}>
            <X />
          </Button>
        </ButtonGroup>
      ) : (
        <span className="text-muted-foreground text-sm">
          {currentStatus.toUpperCase()}
        </span>
      )}
    </div>
  );
}
