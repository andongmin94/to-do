import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createTask, toggleTask } from "./actions";

import LoginCheck from "@/components/login-check";
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

function formatCadence(row: TaskStatusRow) {
  const timeLabel = row.reset_time.slice(0, 5);

  if (row.cadence === "daily") {
    return `매일 ${timeLabel} 리셋`;
  }

  const weekdayMap = ["일", "월", "화", "수", "목", "금", "토"];
  const weekdayLabel =
    row.reset_weekday === null ? "?" : weekdayMap[row.reset_weekday] ?? "?";

  return `매주 ${weekdayLabel} ${timeLabel} 리셋`;
}

export default async function TasksPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_task_current_status");

  if (error) {
    return (
      <div className="flex-1 w-full">
        <h1 className="text-2xl font-bold mb-2">숙제 관리</h1>
        <p className="text-sm text-destructive">{error.message}</p>
      </div>
    );
  }

  const rows = (data ?? []) as TaskStatusRow[];

  return (
    <>
      <LoginCheck />
      <div className="flex-1 w-full flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">숙제 관리</h1>
          <p className="text-sm text-muted-foreground">
            안함 → 딸각 → 함. 리셋 시간 지나면 자동으로 안함으로 보입니다.
          </p>
        </div>

        <form action={createTask} className="flex flex-col gap-3 max-w-xl">
          <div className="flex gap-2">
            <Input name="title" placeholder="예) 영어단어 30개" required />
            <Button type="submit">추가</Button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-sm text-muted-foreground">주기</label>
            <select
              name="cadence"
              defaultValue="daily"
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            >
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
            </select>

            <label className="text-sm text-muted-foreground">리셋</label>
            <Input
              name="reset_time"
              type="time"
              defaultValue="00:00"
              step={60}
              required
              className="w-32"
            />

            <label className="text-sm text-muted-foreground">요일(매주)</label>
            <select
              name="reset_weekday"
              defaultValue=""
              className="h-9 rounded-md border bg-transparent px-3 text-sm"
            >
              <option value="">-</option>
              <option value="0">일</option>
              <option value="1">월</option>
              <option value="2">화</option>
              <option value="3">수</option>
              <option value="4">목</option>
              <option value="5">금</option>
              <option value="6">토</option>
            </select>

            <input type="hidden" name="timezone" value="Asia/Seoul" />
          </div>
        </form>

        <div className="flex flex-col gap-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 숙제가 없어요. 위에서 하나 추가해보세요.
            </p>
          ) : (
            rows.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <div className="font-medium truncate">{row.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatCadence(row)} {/* · TZ: {row.timezone} */}
                  </div>
                </div>

                <form action={toggleTask}>
                  <input type="hidden" name="task_id" value={row.id} />
                  <Button
                    type="submit"
                    variant={row.is_done ? "secondary" : "default"}
                  >
                    {row.is_done ? "완료" : "미완료"}
                  </Button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
