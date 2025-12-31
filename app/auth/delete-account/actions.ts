"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type DeleteAccountActionState = {
  error?: string;
};

export async function deleteAccount(
  _prevState: DeleteAccountActionState,
  _formData: FormData
): Promise<DeleteAccountActionState> {
  void _prevState;
  void _formData;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (error || !user?.sub) {
    redirect("/auth/login");
  }

  const userId = user.sub;

  // 탈퇴 시 사용자 데이터 삭제(숙제/완료 기록)
  // task_log는 task on delete cascade 이므로 task만 지워도 함께 삭제됩니다.
  const { error: deleteTasksError } = await supabase
    .from("task")
    .delete()
    .eq("user_id", userId);
  if (deleteTasksError) {
    return { error: deleteTasksError.message };
  }

  const { error: softDeleteError } = await supabase.from("user_profile").upsert(
    {
      user_id: userId,
      deleted_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id",
    }
  );

  if (softDeleteError) {
    return { error: softDeleteError.message };
  }

  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }

  redirect("/auth/login?reason=deleted");
}
