"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { NewGroupDialog } from "@/components/new-group-dialog";
import { JoinGroupDialog } from "@/components/join-group-dialog";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Group } from "@/lib/types";

type Role = "admin" | "member";

type GroupResult = {
  id: number;
  name: string;
  memberCount: number;
  role: Role;
};

export function GroupManager() {
  const [loading, setLoading] = useState<boolean>(false);
  const [groups, setGroups] = useState<GroupResult[]>([]);

  useEffect(() => {
    setLoading(true);

    const fetchGroups = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("user_groups")
          .select(
            "id:group_id, name:group_name, memberCount:member_count, role",
          )
          .order("role")
          .overrideTypes<GroupResult[]>();
        if (data === null) {
          setGroups([]);
          return;
        }
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleJoinGroup = async (id: number) => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("Memberships")
        .insert({ group_id: id })
        .select("Groups:group_id ( id, name )")
        .single()
        .overrideTypes<{ Groups: GroupResult }>();
      if (data?.Groups) {
        setGroups((prevGroups) => [...prevGroups, data.Groups]);
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleLeaveGroup = async (id: number) => {
    try {
      const supabase = createClient();
      await supabase.from("Memberships").delete().eq("group_id", id);
      setGroups(groups.filter((group) => group.id !== id));
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleNewGroup = (group: Group) => {
    setGroups((prevGroups) => [
      ...prevGroups,
      { ...group, memberCount: 1, role: "admin" },
    ]);
  };

  return (
    <div>
      <div className="mb-6 flex items-stretch gap-4">
        <NewGroupDialog onCreate={handleNewGroup} />
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
  groups: GroupResult[];
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
  group: GroupResult;
  onLeaveGroup: (id: number) => void;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/planner/calendar/${group.id}`)}
      className="border border-border p-6 rounded-lg cursor-pointer flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div>
        <h3 className="text-xl font-semibold">{group.name}</h3>
        <span className="text-sm text-muted-foreground">
          {group.memberCount} {group.memberCount === 1 ? "Member" : "Members"}
        </span>
      </div>
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          {group.role === "member" && (
            <Button
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onLeaveGroup(group.id);
              }}
            >
              Leave Group
            </Button>
          )}
        </div>
        <ChevronRight className="ml-4" />
      </div>
    </div>
  );
}
