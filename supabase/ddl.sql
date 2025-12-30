-- Supabase SQL Editor에서 그대로 실행하세요.

-- 0) UUID 생성 함수용 확장
create extension if not exists pgcrypto;

-- 1) Tables: task (할 일 규칙)
create table if not exists public.task (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  cadence text not null check (cadence in ('daily', 'weekly')),
  reset_time time not null default '00:00',
  reset_weekday smallint null check (reset_weekday between 0 and 6),
  timezone text not null default 'Asia/Seoul',
  archived boolean not null default false,
  created_at timestamptz not null default now(),

  constraint task_cadence_weekday_chk check (
    (cadence = 'daily' and reset_weekday is null)
    or
    (cadence = 'weekly' and reset_weekday is not null)
  )
);

create index if not exists task_user_id_idx on public.task (user_id);

-- 이미 존재하는 DB에 예전 체크 제약(task_reset_time_chk)이 남아있을 수 있어 제거합니다.
do $$
begin
  if to_regclass('public.task') is not null then
    alter table public.task drop constraint if exists task_reset_time_chk;
  end if;
end $$;

-- 2) Tables: task_log (완료 기록/도장판)
create table if not exists public.task_log (
  task_id uuid not null references public.task (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  period_start timestamptz not null,
  completed_at timestamptz not null default now(),
  primary key (task_id, period_start)
);

create index if not exists task_log_user_id_idx on public.task_log (user_id);

-- 3) RLS 설정
alter table public.task enable row level security;
alter table public.task_log enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='task' and policyname='task is owned by user'
  ) then
    create policy "task is owned by user"
      on public.task
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='task_log' and policyname='log is owned by user'
  ) then
    create policy "log is owned by user"
      on public.task_log
      for all
      using (
        auth.uid() = user_id
        and exists (
          select 1
          from public.task t
          where t.id = task_log.task_id
            and t.user_id = auth.uid()
        )
      )
      with check (
        auth.uid() = user_id
        and exists (
          select 1
          from public.task t
          where t.id = task_log.task_id
            and t.user_id = auth.uid()
        )
      );
  end if;
end $$;

-- 4) 함수: 구간 계산
create or replace function public.compute_period_start(
  p_cadence text,
  p_reset_time time,
  p_reset_weekday smallint,
  p_timezone text,
  p_ref timestamptz
) returns timestamptz
language plpgsql
stable
as $$
declare
  local_now timestamp;
  candidate timestamp;
  dow int;
  days_since int;
begin
  local_now := p_ref at time zone p_timezone;

  if p_cadence = 'daily' then
    candidate := date_trunc('day', local_now) + p_reset_time;
    if local_now < candidate then
      candidate := candidate - interval '1 day';
    end if;

  elsif p_cadence = 'weekly' then
    if p_reset_weekday is null then
      raise exception 'reset_weekday is required for weekly cadence';
    end if;

    dow := extract(dow from local_now);
    days_since := (dow - p_reset_weekday + 7) % 7;

    candidate := (date_trunc('day', local_now) - make_interval(days => days_since)) + p_reset_time;
    if local_now < candidate then
      candidate := candidate - interval '7 days';
    end if;

  else
    raise exception 'Unsupported cadence: %', p_cadence;
  end if;

  return candidate at time zone p_timezone;
end;
$$;

-- 5) 함수: 특정 Task의 현재 구간
create or replace function public.task_current_period_start(
  p_task_id uuid,
  p_ref timestamptz default now()
) returns timestamptz
language plpgsql
stable
security invoker
as $$
declare
  t record;
begin
  select *
    into t
  from public.task
  where id = p_task_id
    and user_id = auth.uid();

  if not found then
    raise exception 'Task not found or not allowed';
  end if;

  return public.compute_period_start(t.cadence, t.reset_time, t.reset_weekday, t.timezone, p_ref);
end;
$$;

-- 6) 함수: UI 조회용
create or replace function public.get_task_current_status(
  p_ref timestamptz default now()
)
returns table (
  id uuid,
  title text,
  cadence text,
  reset_time time,
  reset_weekday smallint,
  timezone text,
  created_at timestamptz,
  archived boolean,
  period_start timestamptz,
  is_done boolean
)
language sql
stable
security invoker
as $$
  select
    t.id,
    t.title,
    t.cadence,
    t.reset_time,
    t.reset_weekday,
    t.timezone,
    t.created_at,
    t.archived,
    p.period_start,
    (c.task_id is not null) as is_done
  from public.task t
  cross join lateral (
    select public.compute_period_start(t.cadence, t.reset_time, t.reset_weekday, t.timezone, p_ref) as period_start
  ) p
  left join public.task_log c
    on c.task_id = t.id
   and c.period_start = p.period_start
  where t.user_id = auth.uid()
    and t.archived = false
  order by t.created_at asc;
$$;

-- ============================================================
-- 7) 문서화 (DDL Comments)
--    이 주석들은 Supabase Table Editor나 ERD 툴에서 툴팁으로 보입니다.
-- ============================================================

comment on table public.task is '사용자가 등록한 할 일(숙제)의 규칙 정의 테이블';
comment on column public.task.title is '할 일 제목';
comment on column public.task.cadence is '반복 주기 (daily: 매일, weekly: 매주)';
comment on column public.task.reset_time is '초기화 기준 시간 (예: 06:00이면 아침 6시에 체크박스 풀림)';
comment on column public.task.reset_weekday is 'weekly일 경우 초기화 요일 (0:일요일 ~ 6:토요일)';
comment on column public.task.timezone is '사용자의 현지 시간대 (기본: Asia/Seoul)';

comment on table public.task_log is '할 일 수행 기록 (도장판). 특정 구간(period_start)에 완료했는지 여부를 저장';
comment on column public.task_log.task_id is '수행한 할 일의 ID';
comment on column public.task_log.period_start is '해당 기록이 유효한 구간의 시작 시각 (이 시각이 다르면 다른 도장칸으로 취급)';
comment on column public.task_log.completed_at is '실제로 버튼을 누른 시각';