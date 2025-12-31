import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function LoginCheck() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // 소프트 딜리트(탈퇴)된 계정이면 앱 이용 차단
  const userId = data.claims.sub;
  if (userId) {
    const { data: profile, error: profileError } = await supabase
      .from("user_profile")
      .select("deleted_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profileError && profile?.deleted_at) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
      redirect("/auth/login?reason=deleted");
    }
  }

  return null;
}
