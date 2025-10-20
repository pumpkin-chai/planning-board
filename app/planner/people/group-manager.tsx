"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NewGroupDialog } from "./new-group-dialog";
import { JoinGroupDialog } from "./join-group-dialog";
import { createClient } from "@/lib/supabase/client";

type Group = { id: number; name: string };

export function GroupManager() {
  const [loading, setLoading] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    setLoading(true);

    const fetchGroups = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("Memberships")
          .select("Groups:group_id ( id, name )")
          .overrideTypes<{ Groups: Group }[]>();
        if (data === null) {
          setGroups([]);
          return;
        }
        setGroups(data.map((item) => item.Groups));
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleNewGroup = async (name: string) => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("Groups")
        .insert({ name })
        .select()
        .single();
      if (data) {
        setGroups((prevGroups) => [...prevGroups, data]);
        const { data: membershipAddData } = await supabase
          .from("Memberships")
          .insert({ group_id: data.id });
        console.log("Membership insert data:", membershipAddData);
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleJoinGroup = async (id: number) => {
    console.log("Joining group with ID:", id);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("Memberships")
        .insert({ group_id: id });
      console.log("Membership insert data:", data);
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleLeaveGroup = (id: number) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  return (
    <div>
      <div className="mb-6 flex items-stretch gap-4">
        <NewGroupDialog newGroupAction={handleNewGroup} />
        <JoinGroupDialog joinGroupAction={handleJoinGroup} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <GroupList groups={groups} onLeaveGroup={handleLeaveGroup} />
      )}
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
