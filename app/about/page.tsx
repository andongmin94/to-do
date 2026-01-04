import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "사용법",
};

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">TO DO</h1>
        <p className="text-muted-foreground text-sm">
          반복되는 숙제(할 일)를 등록해두고, 완료 버튼으로 체크하는 개인용 관리
          앱입니다. 매일/매주 같은 주기로 자동 초기화돼서 “다시 해야 할 것”이
          자연스럽게 돌아옵니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>처음 사용하기</CardTitle>
          <CardDescription>
            로그인한 계정 기준으로 숙제가 저장됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <ol className="text-muted-foreground list-decimal space-y-2 pl-5">
            <li>회원가입/로그인 후 홈으로 이동합니다.</li>
            <li>
              왼쪽의 <span className="text-foreground">숙제 관리</span>를 열어
              숙제를 추가합니다.
            </li>
            <li>
              홈에서 숙제 옆의 <span className="text-foreground">완료</span>
              버튼으로 체크합니다.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>숙제 추가/설정</CardTitle>
          <CardDescription>
            주기와 초기화 시간을 설정할 수 있어요.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="text-muted-foreground list-disc space-y-2 pl-5">
            <li>
              <span className="text-foreground">주기</span>
              <div className="mt-1">매일 / 매주 중 하나를 선택합니다.</div>
            </li>
            <li>
              <span className="text-foreground">초기화</span>
              <div className="mt-1">
                선택한 시각을 기준으로 “오늘/이번 주에 해야 할 숙제”가 다시
                나타납니다.
              </div>
            </li>
            <li>
              <span className="text-foreground">요일(매주 선택 시)</span>
              <div className="mt-1">매주 어떤 요일에 초기화할지 고릅니다.</div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>완료/초기화 규칙</CardTitle>
          <CardDescription>헷갈리기 쉬운 부분만 짚어둘게요.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="text-muted-foreground list-disc space-y-2 pl-5">
            <li>
              숙제를 <span className="text-foreground">완료</span>하면 목록에서
              사라집니다.
            </li>
            <li>
              다음 초기화 시각이 지나면, 다시 해야 할 숙제로 목록에 나타납니다.
            </li>
            <li>
              같은 숙제를 같은 회차에서 다시 누르면(토글) 완료가 취소됩니다.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>삭제/데이터</CardTitle>
          <CardDescription>
            내 숙제는 내 계정에만 저장되고, 다른 사람은 볼 수 없습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="text-muted-foreground list-disc space-y-2 pl-5">
            <li>
              숙제 관리는 <span className="text-foreground">숙제 관리</span>에서
              삭제할 수 있어요.
            </li>
            <li>
              로그인한 사용자 기준으로만 조회/수정되도록 보호되어 있습니다.
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button asChild variant="outline">
          <Link href="/">홈으로</Link>
        </Button>
        <Button asChild>
          <a
            href="https://github.com/andongmin94/to-do"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
