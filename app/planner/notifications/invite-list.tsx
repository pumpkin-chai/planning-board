"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Check, X } from "lucide-react";
import { InviteStatus } from "./actions";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Invite = {
  inviter: string;
  group: string;
  status: InviteStatus;
  groupId: number;
};

export function InviteList() {
  const supabase = createClient();

  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from("user_invitations")
        .select("inviter, group:group_name, status, groupId:group_id");

      if (data) {
        setInvites(data);
      }
    };

    getData();
  }, []);

  const setStatus = async (
    inviter: string,
    groupId: number,
    status: InviteStatus,
  ) => {
    const { data, error } = await supabase
      .from("user_invitations")
      .update({ status: status })
      .eq("inviter", inviter)
      .eq("group_id", groupId)
      .select("inviter, group:group_name, status, groupId:group_id")
      .single();

    if (data) {
      setInvites(
        invites.map((invite) =>
          invite.inviter === data.inviter && invite.group === data.group
            ? { ...invite, status: data.status }
            : invite,
        ),
      );
    }

    if (error) {
      // TODO: Add error message
      console.error(error);
    }
  };

  return (
    <ul>
      {invites.map((invite) => (
        <li
          key={`${invite.group}-${invite.inviter}`}
          className="mb-4 last:mb-0"
        >
          <Invite
            inviter={invite.inviter}
            group={invite.group}
            status={invite.status}
            acceptAction={() =>
              setStatus(invite.inviter, invite.groupId, "accepted")
            }
            declineAction={() =>
              setStatus(invite.inviter, invite.groupId, "declined")
            }
          />
        </li>
      ))}
    </ul>
  );
}

export function Invite({
  inviter,
  group,
  status,
  acceptAction,
  declineAction,
}: {
  inviter: string;
  group: string;
  status: InviteStatus;
  acceptAction: () => void;
  declineAction: () => void;
}) {
  return (
    <div
      className={`p-6 ${status === "pending" ? "bg-card" : "bg-muted border border-border"} rounded-lg flex justify-between items-center`}
    >
      <div
        className={
          status === "pending" ? "text-foreground" : "text-muted-foreground"
        }
      >
        <span className="font-bold">{inviter}</span> invited you to{" "}
        <span className="underline">{group}</span>
      </div>
      {status === "pending" ? (
        <ButtonGroup>
          <Button variant="ghost" onClick={acceptAction}>
            <Check />
          </Button>
          <Button variant="ghost" onClick={declineAction}>
            <X />
          </Button>
        </ButtonGroup>
      ) : (
        <span className="text-muted-foreground text-sm">
          {status.toUpperCase()}
        </span>
      )}
    </div>
  );
}
