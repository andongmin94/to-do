import { LoginForm } from "@/components/login-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

function decodeQueryValue(value: string) {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{
    reason?: string;
    error?: string;
    error_code?: string;
    error_description?: string;
  }>;
}) {
  const params = await searchParams;
  const reason = typeof params?.reason === "string" ? params.reason : undefined;

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

  return (
    <div className="mt-20 flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {showAuthError ? (
          <div className="mb-4">
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
          </div>
        ) : null}
        <LoginForm initialReason={reason} />
      </div>
    </div>
  );
}
