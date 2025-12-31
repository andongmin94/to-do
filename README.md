# 숙제 캘린더 (to-do)

매일/매주 반복되는 "숙제"를 등록해두고, 완료 버튼으로 체크하면 그 회차(period)에서는 목록에서 사라지는 간단한 개인용 숙제 관리 앱입니다.
초기화 시간이 지나면(예: 매일 오전 6시) 다시 해야 할 숙제로 돌아옵니다.

- Next.js(App Router) + Server Actions
- Supabase(Auth + Postgres + RLS)

## 주요 기능

- 숙제 등록/삭제
  - 주기: `매일(daily)` / `매주(weekly)`
  - 초기화 기준 시간: `reset_time` (예: 06:00)
  - (weekly) 초기화 요일: `reset_weekday` (0=일 ~ 6=토)
- 숙제 완료 토글
  - 완료하면 해당 회차(period_start)에는 목록에서 숨김
  - 다시 누르면 해당 회차 완료 기록 삭제(= 미완료로 되돌림)
- 자동 초기화 로직
  - DB 함수로 "현재 회차(period_start)"를 계산해서, 회차가 바뀌면 자연스럽게 다시 해야 할 숙제로 표시
- 사용자별 데이터 분리
  - Supabase RLS 정책으로 `auth.uid()` 기반 소유자만 접근 가능

## 빠른 시작

### 1) 설치

```bash
npm install
```

### 2) Supabase 준비

1. Supabase 프로젝트 생성
2. Supabase SQL Editor에서 [supabase/ddl.sql](supabase/ddl.sql) 실행

### 3) 환경변수 설정

**프로젝트 루트에 `.env.local` 생성**

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

- Supabase 대시보드에서 Project URL / API Keys(Publishable key)를 넣으면 됩니다.
- 키 이름이 `ANON_KEY`가 아니라 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 쓰고 있으니 그대로 맞춰주세요.

### 4) 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 스크립트

- `npm run dev`: 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버
- `npm run lint`: ESLint
- `npm run prettier`: Prettier 포맷

## Prettier에서 제외(무시) 설정은 어디서?

Prettier가 포맷 대상에서 제외할 경로는 보통 루트의 `.prettierignore`에서 관리합니다.
(작성 방식은 `.gitignore`랑 거의 동일합니다.)

**예시**

```gitignore
# dependencies / build
node_modules/
.next/
out/

# generated
supabase/.temp/

# lockfiles(원하면)
package-lock.json
```

**추가로, 스크립트에서 무시 파일을 강제 지정하고 싶으면**

```json
"prettier": "prettier --write . --ignore-path .prettierignore"
```

## 폴더 구조(요약)

- [app](app): 화면/서버 액션
  - [app/page.tsx](app/page.tsx): 숙제 목록/완료 처리 UI
  - [app/actions.ts](app/actions.ts): create/delete/toggle Server Actions
  - [app/task-manage-sheet.tsx](app/task-manage-sheet.tsx): 숙제 생성/삭제 시트 UI
- [lib/supabase](lib/supabase): Supabase 클라이언트
- [supabase/ddl.sql](supabase/ddl.sql): 테이블/RLS/함수 스키마

## 라이선스

MIT License.
