import Link from "next/link";

import { DeleteAccountForm } from "@/components/delete-account-form";
import { Button } from "@/components/ui/button";

import { deleteAccount } from "./actions";

export const metadata = {
  title: "회원탈퇴",
};

export default function Page() {
  return (
    <div className="mt-20 flex w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <DeleteAccountForm
          enabled={true}
          deleteAccountAction={deleteAccount}
        />
        <Button asChild variant="outline">
          <Link href="/">홈으로</Link>
        </Button>
      </div>
    </div>
  );
}
