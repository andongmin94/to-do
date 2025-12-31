"use client";

import * as React from "react";

import type { DeleteAccountActionState } from "@/app/auth/delete-account/actions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DeleteAccountFormProps = {
  enabled: boolean;
  deleteAccountAction: (
    prevState: DeleteAccountActionState,
    formData: FormData
  ) => Promise<DeleteAccountActionState>;
};

export function DeleteAccountForm({
  enabled,
  deleteAccountAction,
}: DeleteAccountFormProps) {
  const [state, formAction] = React.useActionState<
    DeleteAccountActionState,
    FormData
  >(deleteAccountAction, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">회원탈퇴</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {state?.error ? (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>회원탈퇴 실패</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}

        <p className="text-muted-foreground">
          계정을 삭제하면 내 숙제/완료 기록이 함께 삭제됩니다. 이 작업은 되돌릴
          수 없습니다.
        </p>

        <form
          action={formAction}
          className="mt-6"
          onSubmit={(e) => {
            if (!enabled) {
              e.preventDefault();
              alert("현재 회원탈퇴를 진행할 수 없습니다.");
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
