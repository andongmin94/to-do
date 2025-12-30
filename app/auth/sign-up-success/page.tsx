import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="mt-20 flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">회원가입이 완료됐어요!</CardTitle>
              <CardDescription>이메일 인증을 완료해 주세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                회원가입이 성공적으로 처리되었습니다. 로그인하기 전에 이메일에서
                계정 인증을 완료해 주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
