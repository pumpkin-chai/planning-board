import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditProfileDialogue } from "./edit-profile-dialog";

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profileInfo } = await supabase
    .from("profiles")
    .select("id, username, first_name, last_name")
    .eq("id", user.id)
    .single()
    .overrideTypes<{ name: string; memberCount: number }>();

  return (
    <div className="px-8 py-3 w-full">
      <h1 className="self-start text-5xl font-bold mb-8">My Profile</h1>
      
      
      <section>
        <h1>
          <EditProfileDialogue uid={user.id} user_name={profileInfo?.username} firstname={profileInfo?.first_name} lastname={profileInfo?.last_name}/>
        </h1>
      </section>
    </div>
  );
}