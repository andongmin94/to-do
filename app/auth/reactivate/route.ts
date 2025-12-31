import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (error || !user?.sub) {
    return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
  }

  const { error: upsertError } = await supabase.from("user_profile").upsert(
    {
      user_id: user.sub,
      deleted_at: null,
    },
    {
      onConflict: "user_id",
    }
  );

  if (upsertError) {
    return NextResponse.json({ ok: false, error: upsertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
