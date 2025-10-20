import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GroupManager } from "./group-manager";

export default async function People() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">People</h1>
      <section>
        <h2 className="text-2xl mb-4">Your Groups</h2>
        <GroupManager />
      </section>
    </div>
  );
}
