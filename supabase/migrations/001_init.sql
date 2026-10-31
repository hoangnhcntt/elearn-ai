-- ELearn AI database schema
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('teacher', 'student')),
  level text,
  language text not null default 'vi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level text not null,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  level text not null,
  due_at timestamptz,
  ai_generated boolean not null default false,
  assignment_type text not null default 'quiz' check (assignment_type in ('quiz', 'writing', 'practice')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  question_type text not null check (question_type in ('multiple-choice', 'fill-in-the-blanks', 'true-false', 'matching', 'writing')),
  prompt text not null,
  correct_answer text,
  explanation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  score numeric(5,2) not null default 0,
  status text not null check (status in ('in_progress', 'submitted', 'graded', 'overdue')),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  chosen_answer text,
  is_correct boolean,
  created_at timestamptz not null default now()
);

create table if not exists public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  task_title text not null,
  task_type text not null check (task_type in ('daily', 'weekly', 'revision', 'assessment')),
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'assigned', 'complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  level text not null,
  topic text not null,
  prompt jsonb not null,
  response jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  skill text not null,
  mastery numeric(5,2) not null default 0,
  updated_at timestamptz not null default now(),
  unique (student_id, skill)
);

create table if not exists public.teacher_settings (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  auto_assign_daily boolean not null default true,
  language text not null default 'vi',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (teacher_id)
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_classes_teacher_id on public.classes(teacher_id);
create index if not exists idx_class_members_student_id on public.class_members(student_id);
create index if not exists idx_assignments_teacher_id on public.assignments(teacher_id);
create index if not exists idx_assignments_class_id on public.assignments(class_id);
create index if not exists idx_questions_assignment_id on public.questions(assignment_id);
create index if not exists idx_attempts_student_id on public.attempts(student_id);
create index if not exists idx_attempts_assignment_id on public.attempts(assignment_id);
create index if not exists idx_daily_tasks_student_id on public.daily_tasks(student_id);
create index if not exists idx_learning_progress_student_id on public.learning_progress(student_id);

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.assignments enable row level security;
alter table public.questions enable row level security;
alter table public.choices enable row level security;
alter table public.attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.daily_tasks enable row level security;
alter table public.ai_generations enable row level security;
alter table public.learning_progress enable row level security;
alter table public.teacher_settings enable row level security;

create policy "profiles_visible_to_own_user" on public.profiles
for select using (auth.uid() = id);

create policy "teachers_manage_own_classes" on public.classes
for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

create policy "students_view_class_membership" on public.class_members
for select using (auth.uid() = student_id or exists (
  select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()
));

create policy "teacher_manage_assignments" on public.assignments
for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

create policy "students_view_assigned_questions" on public.questions
for select using (exists (
  select 1 from public.assignments a
  where a.id = assignment_id and (
    a.teacher_id = auth.uid() or exists (
      select 1 from public.class_members cm
      join public.classes cl on cl.id = cm.class_id
      where cm.student_id = auth.uid() and cl.id = a.class_id
    )
  )
));

create policy "students_view_own_attempts" on public.attempts
for select using (auth.uid() = student_id or exists (
  select 1 from public.assignments a where a.id = assignment_id and a.teacher_id = auth.uid()
));

create policy "teachers_manage_ai_generations" on public.ai_generations
for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

create policy "students_update_own_progress" on public.learning_progress
for all using (auth.uid() = student_id) with check (auth.uid() = student_id);

create policy "teachers_manage_settings" on public.teacher_settings
for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.update_updated_at();

create trigger set_classes_updated_at before update on public.classes
for each row execute function public.update_updated_at();

create trigger set_assignments_updated_at before update on public.assignments
for each row execute function public.update_updated_at();

create trigger set_questions_updated_at before update on public.questions
for each row execute function public.update_updated_at();

create trigger set_daily_tasks_updated_at before update on public.daily_tasks
for each row execute function public.update_updated_at();

create trigger set_learning_progress_updated_at before update on public.learning_progress
for each row execute function public.update_updated_at();

create trigger set_teacher_settings_updated_at before update on public.teacher_settings
for each row execute function public.update_updated_at();
