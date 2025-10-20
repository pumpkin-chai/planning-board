import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ groupId: string[] }>;
}) {
  const { groupId } = await params;

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
      <h1 className="self-start text-5xl font-bold mb-8">Calendar Page for Group ID: {groupId}</h1>
    </div>
  );
}
