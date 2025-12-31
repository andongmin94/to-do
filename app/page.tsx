import { createClient } from "@/lib/supabase/server";

import LoginCheck from "@/components/login-check";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

import TaskManageSheet from "./task-manage-sheet";
import { createTask, deleteTask, toggleTask } from "./actions";

type TaskStatusRow = {
  id: string;
  title: string;
  cadence: "daily" | "weekly";
  reset_time: string; // Postgres time
  reset_weekday: number | null;
  timezone: string;
  created_at: string;
  archived: boolean;
  period_start: string;
  is_done: boolean;
};

function decodeQueryValue(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function formatKoreanTime(timeValue: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)/.exec(timeValue);
  if (!match) {
    return timeValue;
  }

  const hour24 = Number(match[1]);
  const minute = match[2];
  const meridiem = hour24 < 12 ? "오전" : "오후";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return minute === "00"
    ? `${meridiem} ${hour12}시`
    : `${meridiem} ${hour12}시 ${minute}분`;
}

function formatCadence(row: TaskStatusRow) {
  const timeLabel = formatKoreanTime(row.reset_time);

  if (row.cadence === "daily") {
    return `매일 ${timeLabel} 초기화`;
  }

  const weekdayMap = ["일", "월", "화", "수", "목", "금", "토"];
  const weekdayLabel =
    row.reset_weekday === null ? "?" : (weekdayMap[row.reset_weekday] ?? "?");

  return `매주 ${weekdayLabel} ${timeLabel} 초기화`;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    error_code?: string;
    error_description?: string;
  }>;
}) {
  const params = await searchParams;
  const errorCode =
    typeof params?.error_code === "string" ? params.error_code : undefined;
  const errorDescription =
    typeof params?.error_description === "string"
      ? decodeQueryValue(params.error_description)
      : undefined;
  const errorType = typeof params?.error === "string" ? params.error : undefined;

  const showAuthError = Boolean(errorCode || errorType);
  const title =
    errorCode === "otp_expired"
      ? "링크가 만료되었습니다"
      : "인증에 실패했습니다";
  const description =
    errorCode === "otp_expired"
      ? "이메일 링크가 만료되었거나 이미 사용되었습니다. 비밀번호 재설정을 다시 요청해 주세요."
      : errorDescription || "요청을 처리할 수 없습니다. 다시 시도해 주세요.";

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_task_current_status");

  if (error) {
    return (
      <div className="w-full flex-1">
        <h1 className="mb-2 text-2xl font-bold">숙제 관리</h1>
        <p className="text-destructive text-sm">{error.message}</p>
      </div>
    );
  }

  const rows = (data ?? []) as TaskStatusRow[];
  const activeRows = rows.filter((row) => !row.archived && !row.is_done);
  const dailyRows = activeRows.filter((row) => row.cadence === "daily");
  const nonDailyRows = activeRows.filter((row) => row.cadence !== "daily");

  return (
    <>
      <LoginCheck />
      <div className="flex w-full flex-1 flex-col gap-6">
        {showAuthError ? (
          <Alert variant="destructive">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
              <p>{description}</p>
              <p>
                <Link
                  href="/auth/forgot-password"
                  className="underline underline-offset-4"
                >
                  비밀번호 재설정 다시 요청
                </Link>
              </p>
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">숙제</h1>
            <p className="text-muted-foreground text-sm">
              완료를 누르면 목록에서 사라지고, 초기화되면 다시 나타납니다.
            </p>
          </div>
          <TaskManageSheet
            rows={rows}
            createTaskAction={createTask}
            deleteTaskAction={deleteTask}
          />
        </div>

        <div className="flex flex-col gap-2">
          {activeRows.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              지금 해야 할 숙제가 없어요.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <section className="flex flex-col gap-2">
                <div className="text-muted-foreground text-sm font-semibold">
                  매일
                </div>
                {dailyRows.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    매일 숙제가 없어요.
                  </p>
                ) : (
                  dailyRows.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{row.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {formatCadence(row)}
                        </div>
                      </div>

                      <form action={toggleTask}>
                        <input type="hidden" name="task_id" value={row.id} />
                        <Button type="submit" className="cursor-pointer">
                          완료
                        </Button>
                      </form>
                    </div>
                  ))
                )}
              </section>

              <section className="flex flex-col gap-2">
                <div className="text-muted-foreground text-sm font-semibold">
                  매주
                </div>
                {nonDailyRows.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    매주 숙제가 없어요.
                  </p>
                ) : (
                  nonDailyRows.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between gap-3 rounded-md border p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{row.title}</div>
                        <div className="text-muted-foreground text-xs">
                          {formatCadence(row)}
                        </div>
                      </div>

                      <form action={toggleTask}>
                        <input type="hidden" name="task_id" value={row.id} />
                        <Button type="submit" className="cursor-pointer">
                          완료
                        </Button>
                      </form>
                    </div>
                  ))
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
