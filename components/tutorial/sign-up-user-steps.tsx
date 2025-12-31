import Link from "next/link";
import { TutorialStep } from "./tutorial-step";
import { ArrowUpRight } from "lucide-react";

export function SignUpUserSteps() {
  return (
    <ol className="flex flex-col gap-6">
      {process.env.VERCEL_ENV === "preview" ||
      process.env.VERCEL_ENV === "production" ? (
        <TutorialStep title="리다이렉트 URL 설정">
          <p>이 앱은 Vercel에 배포된 것으로 보입니다.</p>
          <p className="mt-4">
            현재 배포 환경은
            <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
              &quot;{process.env.VERCEL_ENV}&quot;
            </span>{" "}
            이고, 배포 URL은
            <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
              https://to-do.andongmin.com
            </span>
            .
          </p>
          <p className="mt-4">
            Vercel 배포 URL을 기준으로 리다이렉트 URL을 등록하기 위해{" "}
            <Link
              className="text-primary hover:text-foreground"
              href={
                "https://supabase.com/dashboard/project/_/auth/url-configuration"
              }
            >
              Supabase 프로젝트 설정을 업데이트
            </Link>{" "}
            해야 합니다.
          </p>
          <ul className="mt-4">
            <li>
              -{" "}
              <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
                http://localhost:3000/**
              </span>
            </li>
            <li>
              -{" "}
              <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/**`}
              </span>
            </li>
            <li>
              -{" "}
              <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
                {`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
                  ".vercel.app",
                  ""
                )}-*-[vercel-team-url].vercel.app/**`}
              </span>{" "}
              (Vercel Team URL은{" "}
              <Link
                className="text-primary hover:text-foreground"
                href="https://vercel.com/docs/accounts/create-a-team#find-your-team-id"
                target="_blank"
              >
                Vercel Team 설정
              </Link>
              )
            </li>
          </ul>
          <Link
            href="https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls"
            target="_blank"
            className="text-primary/50 hover:text-primary mt-4 flex items-center gap-1 text-sm"
          >
            리다이렉트 URL 문서 <ArrowUpRight size={14} />
          </Link>
        </TutorialStep>
      ) : null}
      <TutorialStep title="첫 사용자 회원가입">
        <p>
          이제{" "}
          <Link
            href="auth/sign-up"
            className="text-foreground/80 font-bold hover:underline"
          >
            회원가입
          </Link>{" "}
          페이지로 이동해 첫 사용자를 만들어 보세요. 일단은 본인 계정 하나만
          만들어도 괜찮아요. 나중에 사용자들은 얼마든지 늘릴 수 있습니다.
        </p>
      </TutorialStep>
    </ol>
  );
}
