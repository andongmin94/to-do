"use client";

import * as React from "react";
import { PanelLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex-1 min-h-0 overflow-auto p-4">
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

          <div className="sticky bottom-0 border-t bg-background p-4">
            <form
              action={createTaskAction}
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                if (cadence === "weekly" && resetWeekday === "") {
                  e.preventDefault();
                  alert("매주를 선택한 경우 요일 선택이 필요합니다.");
                }
              }}
            >
              <div className="flex gap-2">
                <Input name="title" placeholder="예) 영어단어 30개" required />
                <Button type="submit" className="cursor-pointer">
                  추가
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">주기</label>
                  <input type="hidden" name="cadence" value={cadence} />
                  <Select
                    value={cadence}
                    onValueChange={(v) => {
                      const next = v === "weekly" ? "weekly" : "daily";
                      setCadence(next);
                      if (next === "daily") {
                        setResetWeekday("");
                      }
                    }}
                  >
                    <SelectTrigger className="w-full cursor-pointer">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectItem value="daily">매일</SelectItem>
                      <SelectItem value="weekly">매주</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {cadence === "weekly" ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground">요일</label>
                    <input
                      type="hidden"
                      name="reset_weekday"
                      value={resetWeekday}
                    />
                    <Select value={resetWeekday} onValueChange={setResetWeekday}>
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        <SelectItem value="0">일</SelectItem>
                        <SelectItem value="1">월</SelectItem>
                        <SelectItem value="2">화</SelectItem>
                        <SelectItem value="3">수</SelectItem>
                        <SelectItem value="4">목</SelectItem>
                        <SelectItem value="5">금</SelectItem>
                        <SelectItem value="6">토</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">초기화</label>
                  <input type="hidden" name="reset_time" value={resetTime} />
                  <div className="flex items-center gap-2">
                    <Select
                      value={meridiem}
                      onValueChange={(v) => setMeridiem(v === "pm" ? "pm" : "am")}
                    >
                      <SelectTrigger
                        className="w-24 cursor-pointer"
                        aria-label="오전/오후"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        <SelectItem value="am">오전</SelectItem>
                        <SelectItem value="pm">오후</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(hour12)}
                      onValueChange={(v) => {
                        const parsed = Number(v);
                        setHour12(Number.isNaN(parsed) ? 12 : parsed);
                      }}
                    >
                      <SelectTrigger
                        className="w-24 cursor-pointer"
                        aria-label="시"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                          <SelectItem key={h} value={String(h)}>
                            {h}시
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(minute)}
                      onValueChange={(v) => {
                        const parsed = Number(v);
                        setMinute(
                          Number.isNaN(parsed)
                            ? 0
                            : Math.max(0, Math.min(59, parsed))
                        );
                      }}
                    >
                      <SelectTrigger
                        className="w-28 cursor-pointer"
                        aria-label="분"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {pad2(m)}분
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <input type="hidden" name="timezone" value="Asia/Seoul" />
              </div>
            </form>
          </div>
        </div>
                      onValueChange={setResetWeekday}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="선택" />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        <SelectItem value="0">일</SelectItem>
                        <SelectItem value="1">월</SelectItem>
                        <SelectItem value="2">화</SelectItem>
                        <SelectItem value="3">수</SelectItem>
                        <SelectItem value="4">목</SelectItem>
                        <SelectItem value="5">금</SelectItem>
                        <SelectItem value="6">토</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted-foreground">초기화</label>
                  <input type="hidden" name="reset_time" value={resetTime} />
                  <div className="flex items-center gap-2">
                    <Select
                      value={meridiem}
                      onValueChange={(v) =>
                        setMeridiem(v === "pm" ? "pm" : "am")
                      }
                    >
                      <SelectTrigger
                        className="w-24 cursor-pointer"
                        aria-label="오전/오후"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        <SelectItem value="am">오전</SelectItem>
                        <SelectItem value="pm">오후</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(hour12)}
                      onValueChange={(v) => {
                        const parsed = Number(v);
                        setHour12(Number.isNaN(parsed) ? 12 : parsed);
                      }}
                    >
                      <SelectTrigger
                        className="w-24 cursor-pointer"
                        aria-label="시"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (h) => (
                            <SelectItem key={h} value={String(h)}>
                              {h}시
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    <Select
                      value={String(minute)}
                      onValueChange={(v) => {
                        const parsed = Number(v);
                        setMinute(
                          Number.isNaN(parsed)
                            ? 0
                            : Math.max(0, Math.min(59, parsed))
                        );
                      }}
                    >
                      <SelectTrigger
                        className="w-28 cursor-pointer"
                        aria-label="분"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" align="start">
                        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {pad2(m)}분
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <input type="hidden" name="timezone" value="Asia/Seoul" />
              </div>
            </form>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4 pt-0">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
