import { TutorialStep } from "./tutorial-step";

export function ConnectSupabaseSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="Supabase 프로젝트 만들기">
        <p>
          아래 링크로 이동해서{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="text-foreground/80 font-bold hover:underline"
            rel="noreferrer"
          >
            database.new
          </a>{" "}
          에서 새 Supabase 프로젝트를 만드세요.
        </p>
      </TutorialStep>

      <TutorialStep title="환경 변수 설정">
        <p>
          Next.js 앱에서{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            .env.example
          </span>{" "}
          파일 이름을{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            .env.local
          </span>{" "}
          로 바꾸고, 아래 링크의{" "}
          <a
            href="https://app.supabase.com/project/_/settings/api"
            target="_blank"
            className="text-foreground/80 font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase 프로젝트 API 설정
          </a>
          값을 채워 넣으세요.
        </p>
      </TutorialStep>

      <TutorialStep title="Next.js 개발 서버 재시작">
        <p>
          환경 변수를 다시 읽히려면 개발 서버를 종료하고{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            npm run dev
          </span>{" "}
          를 다시 실행해야 할 수 있습니다.
        </p>
      </TutorialStep>

      <TutorialStep title="페이지 새로고침">
        <p>
          Next.js가 새 환경 변수를 반영하도록 페이지를 새로고침해야 할 수
          있습니다.
        </p>
      </TutorialStep>
    </ol>
  );
}
