"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type Member = {
  user: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
  role: string;
};

export function MembersDialog({
  label,
  className,
  groupId,
}: {
  label: string;
  className?: string;
  groupId: number;
}) {
  const supabase = createClient();

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("Memberships")
        .select(
          "user:profiles(username, firstName:first_name, lastName:last_name), role",
        )
        .eq("group_id", groupId)
        .overrideTypes<Member[]>();

      if (error) {
        console.error(error.message);
      } else {
        setMembers(data);
      }
    };

    fetchData();
  }, [supabase]);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button className={className}>{label}</button>
        </DialogTrigger>
        <DialogContent className="w-full sm:w-3/4 md:w-2/3 h-1/2">
          <DialogHeader className="sr-only">
            <DialogTitle>Members</DialogTitle>
            <DialogDescription>Members of this group.</DialogDescription>
          </DialogHeader>
          <ScrollArea className="w-full mt-4">
            <ul>
              {members.map((member) => {
                let name = "";
                if (member.user.firstName) {
                  name += member.user.firstName;
                }
                if (member.user.lastName) {
                  name += ` ${member.user.lastName}`;
                }

                return (
                  <li key={member.user.username}>
                    <div className="flex justify-between items-center">
                      <div>
                        {name && (
                          <span className="text-sm font-bold">{name} </span>
                        )}
                        <span className="text-sm italic">
                          {member.user.username}
                        </span>
                      </div>
                      <span className="text-sm">{member.role}</span>
                    </div>
                    <Separator className="my-2" />
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </DialogContent>
      </form>
    </Dialog>
  );
}
