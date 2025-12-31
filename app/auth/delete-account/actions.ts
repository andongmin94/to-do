"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function deleteAccount() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (error || !user?.sub) {
    redirect("/auth/login");
  }

  const userId = user.sub;

  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  const admin = createAdminClient();
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  redirect("/auth/login");
}
