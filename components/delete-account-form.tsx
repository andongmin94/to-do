"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DeleteAccountFormProps = {
  enabled: boolean;
  deleteAccountAction: () => Promise<void>;
};

export function DeleteAccountForm({
  enabled,
  deleteAccountAction,
}: DeleteAccountFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">회원탈퇴</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p className="text-muted-foreground">
          계정을 삭제하면 내 숙제/완료 기록이 함께 삭제됩니다. 이 작업은 되돌릴
          수 없습니다.
        </p>

        <form
          action={deleteAccountAction}
          className="mt-6"
          onSubmit={(e) => {
            if (!enabled) {
              e.preventDefault();
              alert(
                "서버 설정이 필요합니다. (SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았어요.)"
              );
              return;
            }

            if (!confirm("정말 회원탈퇴할까요? 되돌릴 수 없습니다.")) {
              e.preventDefault();
            }
          }}
        >
          <Button type="submit" variant="destructive" disabled={!enabled}>
            회원탈퇴
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
