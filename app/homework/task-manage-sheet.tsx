"use client";

import * as React from "react";
import { PanelLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type TaskStatusRow = {
  id: string;
  title: string;
  cadence: "daily" | "weekly";
  reset_time: string;
  reset_weekday: number | null;
  timezone: string;
  archived: boolean;
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

type TaskManageSheetProps = {
  rows: TaskStatusRow[];
  createTaskAction: (formData: FormData) => Promise<void>;
  deleteTaskAction: (formData: FormData) => Promise<void>;
};

export default function TaskManageSheet({
  rows,
  createTaskAction,
  deleteTaskAction,
}: TaskManageSheetProps) {
  const tasks = rows.filter((r) => !r.archived);
  const [cadence, setCadence] = React.useState<"daily" | "weekly">("daily");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="fixed left-0 top-1/2 z-40 h-44 w-14 -translate-y-1/2 rounded-l-none rounded-r-lg border-l-0 bg-background/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col items-center justify-center gap-2 cursor-pointer"
          aria-label="숙제 관리 열기"
        >
          <PanelLeftIcon className="size-5" />
          <span className="text-xs font-medium leading-tight text-muted-foreground text-center">
            숙제
            <br />
            관리
          </span>
          <span className="sr-only">숙제 관리 열기</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="gap-0 p-0">
        <SheetHeader className="border-b">
          <SheetTitle>숙제 관리</SheetTitle>
          <SheetDescription>여기서 숙제 생성/삭제를 합니다.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-5 p-4 overflow-auto">
          <form action={createTaskAction} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input name="title" placeholder="예) 영어단어 30개" required />
              <Button type="submit" className="cursor-pointer">
                추가
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">주기</label>
                <select
                  name="cadence"
                  defaultValue="daily"
                  className="h-9 rounded-md border bg-transparent px-3 text-sm cursor-pointer"
                  onChange={(e) => {
                    const next =
                      e.target.value === "weekly" ? "weekly" : "daily";
                    setCadence(next);
                  }}
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                </select>
              </div>

              {cadence === "weekly" ? (
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">요일</label>
                  <select
                    name="reset_weekday"
                    defaultValue=""
                    required
                    className="h-9 rounded-md border bg-transparent px-3 text-sm cursor-pointer"
                  >
                    <option value="">선택</option>
                    <option value="0">일</option>
                    <option value="1">월</option>
                    <option value="2">화</option>
                    <option value="3">수</option>
                    <option value="4">목</option>
                    <option value="5">금</option>
                    <option value="6">토</option>
                  </select>
                </div>
              ) : null}
              
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">리셋</label>
                <Input
                  name="reset_time"
                  type="time"
                  defaultValue="00:00"
                  step={60}
                  required
                  className="w-32 cursor-pointer"
                />
              </div>

              <input type="hidden" name="timezone" value="Asia/Seoul" />
            </div>
          </form>

          <div className="flex flex-col gap-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                등록된 숙제가 없어요.
              </p>
            ) : (
              tasks.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-3 rounded-md border p-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{row.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCadence(row)}
                      {row.is_done ? " · 완료됨" : ""}
                    </div>
                  </div>

                  <form
                    action={deleteTaskAction}
                    onSubmit={(e) => {
                      if (!confirm("정말 삭제할까요?")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="task_id" value={row.id} />
                    <Button
                      type="submit"
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                    >
                      삭제
                    </Button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
