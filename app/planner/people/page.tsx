import { GroupManagementButtons } from "@/components/group-management-buttons";
import { Suspense } from "react";
import { GroupList } from "@/components/group-list";

export default function People() {
  return (
    <div className="px-4 sm:px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">People</h1>
      <section>
        <h2 className="text-2xl mb-4">Your Groups</h2>
        <GroupManagementButtons className="mb-8" />
        <div className="bg-muted p-3 sm:p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <GroupList />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
