import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";

import { createTask, deleteTask, toggleTask } from "./actions";
import TaskManageSheet from "./task-manage-sheet";

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
  const activeRows = rows.filter((row) => !row.archived && !row.is_done);

  return (
    <>
      <LoginCheck />
      <div className="flex-1 w-full flex flex-col gap-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">숙제</h1>
            <p className="text-sm text-muted-foreground">
              완료를 누르면 목록에서 사라지고, 리셋되면 다시 나타납니다.
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
            <p className="text-sm text-muted-foreground">
              지금 해야 할 숙제가 없어요.
            </p>
          ) : (
            activeRows.map((row) => (
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
                  <Button type="submit">완료</Button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
