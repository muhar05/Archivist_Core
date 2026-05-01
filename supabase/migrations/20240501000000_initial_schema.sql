-- Enable pgvector extension
create extension if not exists vector;

-- Create custom types/enums
create type user_role as enum ('admin', 'staff');
create type unit_status as enum ('available', 'low_space', 'full');
create type report_status as enum ('pending', 'archived', 'loaned');

-- 1. Profiles Table (Linked to Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role user_role default 'staff' not null,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

-- 2. Rooms Table
create table public.rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  floor_number integer default 1 not null,
  description text,
  is_maintenance boolean default false not null, -- Maintenance Mode (Poin 9)
  created_at timestamptz default now() not null
);

alter table public.rooms enable row level security;

-- 3. Storage Units Table (Recursive Structure)
create table public.storage_units (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.rooms(id) on delete restrict not null, -- Restricted Deletion (Poin 9)
  parent_id uuid references public.storage_units(id) on delete restrict, -- Restricted Deletion (Poin 9)
  name text not null,
  x integer default 0 not null,
  y integer default 0 not null,
  z integer default 0 not null,
  is_assignable boolean default false not null,
  status unit_status default 'available' not null,
  created_at timestamptz default now() not null,
  
  constraint no_self_reference check (id <> parent_id) -- Circular Reference Prevention (Poin 9)
);

alter table public.storage_units enable row level security;

-- 4. Reports Table
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  unit_id uuid references public.storage_units(id) on delete restrict not null,
  title text not null,
  client text,
  metadata jsonb default '{}'::jsonb not null,
  embedding vector(1536), -- Semantic Search (Poin 6)
  status report_status default 'pending' not null,
  created_by uuid references public.profiles(id) not null,
  current_holder_id uuid references public.profiles(id), -- Handover Tracking (Poin 9)
  created_at timestamptz default now() not null
);

alter table public.reports enable row level security;

-- 5. Report Audit Logs (Handover Logic - Poin 9)
create table public.report_logs (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references public.reports(id) on delete cascade not null,
  action text not null, -- 'DEPOSIT', 'LOAN', 'HANDOVER', 'VERIFICATION'
  from_user_id uuid references public.profiles(id),
  to_user_id uuid references public.profiles(id),
  notes text,
  created_at timestamptz default now() not null
);

alter table public.report_logs enable row level security;

-- RLS POLICIES

-- Helper Function to check if a room is in maintenance
create or replace function public.is_room_in_maintenance(p_room_id uuid)
returns boolean as $$
begin
  return exists (select 1 from public.rooms where id = p_room_id and is_maintenance = true);
end;
$$ language plpgsql security definer;

-- Profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Rooms
create policy "Rooms are viewable by everyone." on public.rooms for select using (true);
create policy "Admins can manage rooms." on public.rooms for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Storage Units
create policy "Storage units are viewable by everyone." on public.storage_units for select using (true);
create policy "Admins can manage storage units." on public.storage_units for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Staff can only update status if not in maintenance." on public.storage_units
  for update using (
    not public.is_room_in_maintenance(room_id)
    and exists (select 1 from public.profiles where id = auth.uid())
  );

-- Reports
create policy "Reports are viewable by everyone." on public.reports for select using (true);
create policy "Admins have full control over reports." on public.reports for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Staff can create reports if not in maintenance." on public.reports
  for insert with check (
    not exists (
      select 1 from public.storage_units su 
      join public.rooms r on su.room_id = r.id 
      where su.id = unit_id and r.is_maintenance = true
    )
  );
create policy "Staff can update own pending reports if not in maintenance." on public.reports
  for update using (
    created_by = auth.uid() 
    and status = 'pending'
    and not exists (
      select 1 from public.storage_units su 
      join public.rooms r on su.room_id = r.id 
      where su.id = unit_id and r.is_maintenance = true
    )
  );

-- Report Logs
create policy "Logs are viewable by everyone." on public.report_logs for select using (true);
create policy "System/Users can insert logs." on public.report_logs for insert with check (auth.uid() is not null);

-- TRIGGER FOR NEW USER PROFILE
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New Staff'), 'staff');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

