import { TutorialStep } from "./tutorial-step";
import { CodeBlock } from "./code-block";

const create = `create table notes (
  id bigserial primary key,
  title text
);

insert into notes(title)
values
  ('오늘 Supabase 프로젝트를 만들었다.'),
  ('데이터를 추가하고 Next.js에서 조회해 봤다.'),
  ('아주 좋았다!');
`.trim();

const rls = `alter table notes enable row level security;
create policy "Allow public read access" on notes
for select
using (true);`.trim();

const server = `import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select()

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

const client = `'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('notes').select()
      setNotes(data)
    }
    getData()
  }, [])

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
`.trim();

export function FetchDataSteps() {
  return (
    <ol className="flex flex-col gap-6">
      <TutorialStep title="테이블 생성 및 예시 데이터 추가">
        <p>
          Supabase 프로젝트의{" "}
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            테이블 에디터
          </a>{" "}
          로 이동해서 테이블을 만들고 예시 데이터를 넣어보세요. 예시가
          필요하다면 아래 내용을{" "}
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            SQL 에디터
          </a>{" "}
          에 붙여넣고 RUN을 눌러 실행하면 됩니다.
        </p>
        <CodeBlock code={create} />
      </TutorialStep>

      <TutorialStep title="Row Level Security(RLS) 설정">
        <p>
          Supabase는 기본적으로 Row Level Security(RLS)가 활성화되어 있습니다.
          <code>notes</code> 테이블에서 데이터를 조회하려면 정책(policy)을
          추가해야 합니다. 이는{" "}
          <a
            href="https://supabase.com/dashboard/project/_/editor"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            테이블 에디터
          </a>{" "}
          또는{" "}
          <a
            href="https://supabase.com/dashboard/project/_/sql/new"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            SQL 에디터
          </a>
          에서 설정할 수 있습니다.
        </p>
        <p>
          예를 들어, 아래 SQL을 실행하면 누구나 읽을 수 있도록 설정할 수
          있습니다.
        </p>
        <CodeBlock code={rls} />
        <p>
          RLS에 대한 자세한 내용은{" "}
          <a
            href="https://supabase.com/docs/guides/auth/row-level-security"
            className="text-foreground/80 font-bold hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Supabase 문서
          </a>
          에서 확인할 수 있습니다.
        </p>
      </TutorialStep>

      <TutorialStep title="Next.js에서 Supabase 데이터 조회">
        <p>
          Supabase 클라이언트를 만들고 Async Server Component에서 데이터를
          조회하려면 아래 경로에 page.tsx 파일을 새로 만들고{" "}
          <span className="bg-muted text-secondary-foreground relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium">
            /app/notes/page.tsx
          </span>{" "}
          다음 코드를 추가하세요.
        </p>
        <CodeBlock code={server} />
        <p>또는 Client Component를 사용해도 됩니다.</p>
        <CodeBlock code={client} />
      </TutorialStep>

      <TutorialStep title="Supabase UI 라이브러리 둘러보기">
        <p>
          아래의{" "}
          <a
            href="https://supabase.com/ui"
            className="text-foreground/80 font-bold hover:underline"
          >
            Supabase UI 라이브러리
          </a>{" "}
          에서 블록을 설치해 보세요. 예를 들어, 아래 명령으로 Realtime Chat
          블록을 설치할 수 있습니다.
        </p>
        <CodeBlock
          code={
            "npx shadcn@latest add https://supabase.com/ui/r/realtime-chat-nextjs.json"
          }
        />
      </TutorialStep>

      <TutorialStep title="주말에 만들고, 크게 성장시키기!">
        <p>이제 세상에 제품을 공개할 준비가 됐어요!</p>
      </TutorialStep>
    </ol>
  );
}
