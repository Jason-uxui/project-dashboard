-- Project Manager Dashboard: projects + tasks CRUD foundation
-- Run this in your Supabase SQL editor for project rucrraniltkhbevprvvl

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'planned'
    check (status in ('backlog', 'planned', 'active', 'cancelled', 'completed')),
  priority text not null default 'medium'
    check (priority in ('urgent', 'high', 'medium', 'low')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  start_date date not null default current_date,
  end_date date not null default (current_date + interval '14 days')::date,
  client text,
  type_label text,
  duration_label text,
  tags text[] not null default '{}',
  members text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null default 'task'
    check (type in ('bug', 'improvement', 'task')),
  assignee text not null default 'Unassigned',
  status text not null default 'todo'
    check (status in ('todo', 'in-progress', 'done')),
  start_date date not null default current_date,
  end_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_projects_status on public.projects(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "projects_select_all" on public.projects;
drop policy if exists "projects_insert_all" on public.projects;
drop policy if exists "projects_update_all" on public.projects;
drop policy if exists "projects_delete_all" on public.projects;
drop policy if exists "tasks_select_all" on public.tasks;
drop policy if exists "tasks_insert_all" on public.tasks;
drop policy if exists "tasks_update_all" on public.tasks;
drop policy if exists "tasks_delete_all" on public.tasks;

create policy "projects_select_all"
on public.projects for select
to anon, authenticated
using (true);

create policy "projects_insert_all"
on public.projects for insert
to anon, authenticated
with check (true);

create policy "projects_update_all"
on public.projects for update
to anon, authenticated
using (true)
with check (true);

create policy "projects_delete_all"
on public.projects for delete
to anon, authenticated
using (true);

create policy "tasks_select_all"
on public.tasks for select
to anon, authenticated
using (true);

create policy "tasks_insert_all"
on public.tasks for insert
to anon, authenticated
with check (true);

create policy "tasks_update_all"
on public.tasks for update
to anon, authenticated
using (true)
with check (true);

create policy "tasks_delete_all"
on public.tasks for delete
to anon, authenticated
using (true);
