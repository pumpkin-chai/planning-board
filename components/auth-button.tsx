import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { redirect } from "next/navigation";

export async function AuthButton() {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.getClaims();
  if (error || !authData?.claims) {
    redirect("/auth/login");
  }
  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", authData.claims.sub)
    .single();

  return data ? (
    <div className="flex items-center gap-4 text-sm">
      {data.username}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
