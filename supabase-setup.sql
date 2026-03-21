-- ============================================================
-- ARCUS CLUB — Setup do Banco de Dados (Supabase)
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- ─── Tabela de perfis (vinculada ao sistema de auth) ────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('admin', 'mentee')),
  mentee_id text  -- preenchido apenas para usuários com role = 'mentee'
);

alter table public.profiles enable row level security;

create policy "Usuário lê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin lê todos os perfis"
  on public.profiles for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Admin gerencia todos os perfis"
  on public.profiles for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');


-- ─── Tabela de mentorados ────────────────────────────────────
create table public.mentees (
  id text primary key,
  name text,
  email text,
  phone text,
  stage text default 'Ativo',
  goal text,
  join_date text,
  avatar text,
  color text,
  tags text[] default '{}',
  milestones boolean[] default '{false,false,false,false,false,false}',
  notes text,
  custom_plan text,
  photo_url text,
  last_contact text,
  created_at timestamptz default now()
);

alter table public.mentees enable row level security;

create policy "Admin gerencia mentorados"
  on public.mentees for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Mentorado lê os próprios dados"
  on public.mentees for select
  using ((select mentee_id from public.profiles where id = auth.uid()) = id);


-- ─── Tabela de leads (prospecção) ────────────────────────────
create table public.leads (
  id text primary key,
  name text,
  email text,
  phone text,
  source text,
  interest text,
  stage text default 'Novo Lead',
  avatar text,
  color text,
  tags text[] default '{}',
  last_contact text,
  notes text,
  interactions jsonb default '[]',
  next_steps jsonb default '[]',
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

create policy "Admin gerencia leads"
  on public.leads for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');


-- ─── Tabela de eventos / calendário ──────────────────────────
create table public.events (
  id text primary key,
  title text,
  date text,
  time text,
  type text,
  description text,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Admin gerencia eventos"
  on public.events for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');


-- ─── Tabela de metas ─────────────────────────────────────────
create table public.goals (
  id text primary key,
  period integer,  -- 30, 60, 90 ou 150 dias
  text text,
  done boolean default false,
  created_at timestamptz default now()
);

alter table public.goals enable row level security;

create policy "Admin gerencia metas"
  on public.goals for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');


-- ─── Tabela de arquivos dos mentorados ───────────────────────
create table public.files (
  id uuid default gen_random_uuid() primary key,
  mentee_id text references public.mentees(id) on delete cascade,
  name text not null,
  storage_path text not null,
  file_type text,
  size bigint,
  uploaded_by uuid references auth.users,
  created_at timestamptz default now()
);

alter table public.files enable row level security;

create policy "Admin gerencia arquivos"
  on public.files for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Mentorado lê os próprios arquivos"
  on public.files for select
  using ((select mentee_id from public.profiles where id = auth.uid()) = mentee_id);


-- ─── Storage: bucket de arquivos dos mentorados ──────────────
-- PASSO 1: Criar o bucket pela interface do Supabase:
--   Dashboard → Storage → New bucket
--   Nome: mentee-files  |  Public bucket: NÃO
--
-- PASSO 2: Depois de criar o bucket, rode as policies abaixo:

create policy "Admin faz upload de arquivos"
  on storage.objects for all
  using (
    bucket_id = 'mentee-files'
    and (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Mentorado baixa os próprios arquivos"
  on storage.objects for select
  using (
    bucket_id = 'mentee-files'
    and (select mentee_id from public.profiles where id = auth.uid()) = split_part(name, '/', 1)
  );


-- Run this if base_plan column doesn't exist yet:
alter table public.mentees add column if not exists base_plan jsonb;

-- Run this to add financial payments history per mentee:
alter table public.mentees add column if not exists payments jsonb default '[]'::jsonb;


-- ============================================================
-- COMO CRIAR USUÁRIOS
-- ============================================================
-- 1. No Supabase Dashboard → Authentication → Users → Add User
--    Crie o e-mail e senha do usuário
--
-- 2. Após criar, copie o UUID do usuário e rode no SQL Editor:
--
-- Para um ADMIN (você e seu sócio):
--   insert into public.profiles (id, role)
--   values ('UUID_DO_USUARIO', 'admin');
--
-- Para um MENTORADO (substitua pelo ID real do mentorado na tabela mentees):
--   insert into public.profiles (id, role, mentee_id)
--   values ('UUID_DO_USUARIO', 'mentee', 'ID_DO_MENTORADO');
-- ============================================================
