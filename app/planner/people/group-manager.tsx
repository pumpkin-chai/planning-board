"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, UserRoundSearch } from "lucide-react";
import { useState } from "react";
import { NewGroupDialog } from "./new-group-dialog";

type Group = { id: number; name: string };

export function GroupManager() {
  const [groups, setGroups] = useState<Group[]>([
    { id: 1, name: "Family" },
    { id: 2, name: "Friends" },
    { id: 3, name: "Work" },
    { id: 4, name: "Gym Buddies" },
    { id: 5, name: "Book Club" },
  ]);

  const handleNewGroup = (name: string) => {
    console.log(`New Group ${name}`);
  };

  const handleLeaveGroup = (id: number) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-stretch gap-4">
        <NewGroupDialog newGroupAction={handleNewGroup} />
        <Button variant="outline">
          <UserRoundSearch />
          Join Group
        </Button>
      </div>
      <GroupList groups={groups} onLeaveGroup={handleLeaveGroup} />
    </div>
  );
}

function GroupList({
  groups,
  onLeaveGroup,
}: {
  groups: Group[];
  onLeaveGroup: (id: number) => void;
}) {
  return (
    <ul>
      {groups.map((group) => (
        <li key={group.id} className="mb-4 last:mb-0">
          <GroupCard group={group} onLeaveGroup={onLeaveGroup} />
        </li>
      ))}
    </ul>
  );
}

function GroupCard({
  group,
  onLeaveGroup,
}: {
  group: Group;
  onLeaveGroup: (id: number) => void;
}) {
  return (
    <div className="border border-border p-6 rounded-lg cursor-pointer flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-xl font-semibold">{group.name}</h3>
        <span className="text-sm text-muted-foreground">5 members</span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline">Invite Members</Button>
          <Button variant="default" onClick={() => onLeaveGroup(group.id)}>
            Leave
          </Button>
        </div>
        <ChevronRight className="ml-4" />
      </div>
    </div>
  );
}

