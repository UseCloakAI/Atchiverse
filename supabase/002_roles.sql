-- Roles: student (lessons), parent (dashboard), debug (own sandbox profile + dashboard).
alter table public.students add column role text not null default 'student'
  check (role in ('student', 'parent', 'debug'));

create or replace function public.pin_login(p_pin text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare s public.students; t uuid;
begin
  select * into s from public.students where pin_hash = crypt(p_pin, pin_hash) limit 1;
  if s.id is null then perform pg_sleep(1); return null; end if;
  delete from public.sessions where expires_at < now();
  insert into public.sessions(student_id) values (s.id) returning token into t;
  return json_build_object('token', t, 'name', s.name, 'role', s.role, 'progress', s.progress);
end $$;

create or replace function public.load_progress(p_token uuid)
returns json language plpgsql security definer set search_path = public as $$
declare sid uuid := public._student_for(p_token);
begin
  if sid is null then raise exception 'invalid session' using errcode = '28000'; end if;
  return (select json_build_object('name', name, 'role', role, 'progress', progress) from public.students where id = sid);
end $$;

-- Parent + debug accounts can read every student's progress and recent answers.
create or replace function public.parent_overview(p_token uuid)
returns json language plpgsql security definer set search_path = public as $$
declare sid uuid := public._student_for(p_token); r text;
begin
  if sid is null then raise exception 'invalid session' using errcode = '28000'; end if;
  select role into r from public.students where id = sid;
  if r not in ('parent', 'debug') then raise exception 'not allowed' using errcode = '42501'; end if;
  return coalesce((select json_agg(x order by x.name) from (
    select st.name, st.progress, st.updated_at,
      (select count(*) from public.answers a where a.student_id = st.id) as total,
      (select count(*) from public.answers a where a.student_id = st.id and a.correct) as right,
      (select max(created_at) from public.answers a where a.student_id = st.id) as last_active,
      (select coalesce(json_agg(k order by k.misses desc, k.skill), '[]') from (
        select a.skill, a.subject, min(a.grade) as grade, count(*) as attempts,
               count(*) filter (where a.correct) as right, count(*) filter (where not a.correct) as misses
        from public.answers a where a.student_id = st.id group by a.skill, a.subject) k) as skills,
      (select coalesce(json_agg(a2 order by a2.created_at desc), '[]') from (
        select kind, subject, skill, grade, question, answer, correct, created_at
        from public.answers a where a.student_id = st.id order by created_at desc limit 40) a2) as recent
    from public.students st where st.role = 'student') x), '[]'::json);
end $$;

revoke all on function public.parent_overview(uuid) from public;
grant execute on function public.parent_overview(uuid) to anon, authenticated;

-- Seed accounts separately (never commit PINs):
-- insert into public.students(name, role, pin_hash) values
--   ('Parent', 'parent', extensions.crypt('<PARENT PIN>', extensions.gen_salt('bf'))),
--   ('Debug',  'debug',  extensions.crypt('<DEBUG PIN>',  extensions.gen_salt('bf')));
