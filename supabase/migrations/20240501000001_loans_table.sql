-- Create loans table for tracking circulation
create table public.loans (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references public.reports(id) on delete cascade not null,
  borrower_id uuid references public.profiles(id) not null,
  loan_date timestamptz default now() not null,
  due_date timestamptz not null,
  return_date timestamptz,
  status text default 'ONGOING' not null, -- ONGOING, RETURNED, OVERDUE
  notes text,
  created_at timestamptz default now() not null
);

alter table public.loans enable row level security;

-- RLS Policies for Loans
create policy "Loans are viewable by everyone." on public.loans for select using (true);
create policy "Admins can manage all loans." on public.loans for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "Staff can view their own loans." on public.loans for select using (
  borrower_id = auth.uid()
);

-- Index for performance
create index idx_loans_report_id on public.loans(report_id);
create index idx_loans_status on public.loans(status);
