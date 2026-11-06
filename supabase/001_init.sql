-- Atchiverse schema: PIN login, cloud progress, answer log.
-- Run in Supabase → SQL Editor (project: Atchiverse / flsjetuwysxzrlscigww).
create extension if not exists pgcrypto with schema extensions;

create table public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pin_hash text not null,
  progress jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.sessions (
  token uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '90 days'
);
create table public.answers (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.students(id) on delete cascade,
  kind text not null, subject text, skill text, grade int,
  question text, answer text, correct boolean not null,
  created_at timestamptz not null default now()
);
create index on public.answers (student_id, created_at desc);
create index on public.sessions (student_id);

alter table public.students enable row level security;
alter table public.sessions enable row level security;
alter table public.answers enable row level security;
-- No policies: the browser only reaches data through the RPCs below.

create or replace function public.pin_login(p_pin text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare s public.students; t uuid;
begin
  select * into s from public.students where pin_hash = crypt(p_pin, pin_hash) limit 1;
  if s.id is null then perform pg_sleep(1); return null; end if;
  delete from public.sessions where expires_at < now();
  insert into public.sessions(student_id) values (s.id) returning token into t;
  return json_build_object('token', t, 'name', s.name, 'progress', s.progress);
end $$;

create or replace function public._student_for(p_token uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select student_id from public.sessions where token = p_token and expires_at > now()
$$;

create or replace function public.load_progress(p_token uuid)
returns json language plpgsql security definer set search_path = public as $$
declare sid uuid := public._student_for(p_token);
begin
  if sid is null then raise exception 'invalid session' using errcode = '28000'; end if;
  return (select json_build_object('name', name, 'progress', progress) from public.students where id = sid);
end $$;

create or replace function public.save_progress(p_token uuid, p_progress jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare sid uuid := public._student_for(p_token);
begin
  if sid is null then raise exception 'invalid session' using errcode = '28000'; end if;
  update public.students set progress = p_progress, updated_at = now() where id = sid;
end $$;

create or replace function public.log_answer(p_token uuid, p_kind text, p_subject text, p_skill text, p_grade int, p_question text, p_answer text, p_correct boolean)
returns void language plpgsql security definer set search_path = public as $$
declare sid uuid := public._student_for(p_token);
begin
  if sid is null then raise exception 'invalid session' using errcode = '28000'; end if;
  insert into public.answers(student_id, kind, subject, skill, grade, question, answer, correct)
  values (sid, left(p_kind,20), left(p_subject,20), left(p_skill,40), p_grade, left(p_question,300), left(p_answer,200), p_correct);
end $$;

revoke all on function public._student_for(uuid) from public, anon, authenticated;
revoke all on function public.pin_login(text), public.load_progress(uuid), public.save_progress(uuid, jsonb),
  public.log_answer(uuid, text, text, text, int, text, text, boolean) from public;
grant execute on function public.pin_login(text), public.load_progress(uuid), public.save_progress(uuid, jsonb),
  public.log_answer(uuid, text, text, text, int, text, text, boolean) to anon, authenticated;

-- Seed the student separately (never commit a PIN — this repo is public):
-- insert into public.students(name, pin_hash) values ('Atchi', extensions.crypt('<PIN>', extensions.gen_salt('bf')));
