"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

function requiredString(value: FormDataEntryValue | null, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

function normalizeResetTime(value: string) {
  // HTML time input이 "06:00:00"처럼 올 수도 있어서 HH:MM로 정규화
  const trimmed = value.trim();
  const match = /^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d(?:\.\d+)?)?$/.exec(
    trimmed
  );
  if (!match) {
    return trimmed;
  }
  return `${match[1]}:${match[2]}`;
}

export async function createTask(formData: FormData) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    throw new Error("Not authenticated");
  }

  const title = requiredString(formData.get("title"), "title");

  const cadenceRaw = requiredString(formData.get("cadence"), "cadence");
  const cadence =
    cadenceRaw === "daily" || cadenceRaw === "weekly" ? cadenceRaw : null;
  if (!cadence) {
    throw new Error("주기(cadence)가 올바르지 않습니다.");
  }

  const resetTimeRaw = requiredString(formData.get("reset_time"), "reset_time");
  const resetTime = normalizeResetTime(resetTimeRaw);
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(resetTime)) {
    throw new Error("초기화 시간 형식이 올바르지 않습니다. (예: 06:00)");
  }

  const timezoneValue = formData.get("timezone");
  const timezone =
    typeof timezoneValue === "string" && timezoneValue.trim().length > 0
      ? timezoneValue.trim()
      : "Asia/Seoul";

  const resetWeekdayValue = formData.get("reset_weekday");
  const parsedWeekday =
    typeof resetWeekdayValue === "string" && resetWeekdayValue !== ""
      ? Number(resetWeekdayValue)
      : null;

  const resetWeekday = cadence === "weekly" ? parsedWeekday : null;
  if (cadence === "weekly") {
    if (resetWeekday === null || Number.isNaN(resetWeekday)) {
      throw new Error("매주(weekly)는 요일 선택이 필요합니다.");
    }
    if (resetWeekday < 0 || resetWeekday > 6) {
      throw new Error("요일은 0(일)~6(토) 범위여야 합니다.");
    }
  }

  const { error } = await supabase.from("task").insert({
    user_id: claimsData.claims.sub,
    title,
    cadence,
    reset_time: resetTime,
    reset_weekday: resetWeekday,
    timezone,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteTask(formData: FormData) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    throw new Error("Not authenticated");
  }

  const taskId = requiredString(formData.get("task_id"), "task_id");

  const { error } = await supabase
    .from("task")
    .delete()
    .eq("id", taskId)
    .eq("user_id", claimsData.claims.sub);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function toggleTask(formData: FormData) {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    throw new Error("Not authenticated");
  }

  const taskId = requiredString(formData.get("task_id"), "task_id");

  const { data: periodStart, error: periodError } = await supabase.rpc(
    "task_current_period_start",
    { p_task_id: taskId }
  );
  if (periodError || !periodStart) {
    throw new Error(periodError?.message ?? "Failed to compute period_start");
  }

  const { data: existing, error: existingError } = await supabase
    .from("task_log")
    .select("task_id")
    .eq("task_id", taskId)
    .eq("period_start", periodStart)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    const { error: deleteError } = await supabase
      .from("task_log")
      .delete()
      .eq("task_id", taskId)
      .eq("period_start", periodStart);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  } else {
    const { error: insertError } = await supabase.from("task_log").insert({
      task_id: taskId,
      user_id: claimsData.claims.sub,
      period_start: periodStart,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  revalidatePath("/");
}
