"use client";

import { JoinGroupDialog } from "@/components/join-group-dialog";
import { NewGroupDialog } from "@/components/new-group-dialog";
import { useRouter } from "next/navigation";

export function GroupManagementButtons({ className }: { className?: string }) {
  const router = useRouter();

  const refetch = () => router.refresh();

  return (
    <div className={`flex gap-2 ${className ?? ""}`}>
      <NewGroupDialog onCreate={refetch} />
      <JoinGroupDialog onJoinGroup={refetch} />
    </div>
  );
}
