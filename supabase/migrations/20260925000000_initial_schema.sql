create type public.account_type as enum ('credit_card', 'loan', 'bank_account', 'cash');
create type public.transaction_type as enum ('income', 'expense', 'payment', 'transfer', 'interest', 'fee', 'adjustment');
create type public.category_type as enum ('expense', 'income');
create type public.household_role as enum ('owner', 'member');

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.household_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  type public.account_type not null,
  name text not null check (char_length(name) between 1 and 80),
  institution text check (char_length(institution) <= 80),
  holder text check (char_length(holder) <= 80),
  currency char(3) not null default 'USD',
  credit_limit_cents bigint check (credit_limit_cents >= 0),
  overlimit_cents bigint not null default 0 check (overlimit_cents >= 0),
  statement_day smallint check (statement_day between 1 and 31),
  payment_due_day smallint check (payment_due_day between 1 and 31),
  annual_rate numeric(7, 4) not null default 0 check (annual_rate >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, household_id)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 50),
  type public.category_type not null,
  icon text,
  color text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, household_id),
  unique (household_id, type, name)
);

create table public.installment_plans (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  account_id uuid not null,
  description text not null check (char_length(description) between 1 and 120),
  amount_cents bigint not null check (amount_cents > 0),
  installment_count smallint not null check (installment_count between 1 and 120),
  annual_rate numeric(7, 4) not null default 0 check (annual_rate >= 0),
  start_date date not null,
  created_at timestamptz not null default now(),
  unique (id, household_id),
  foreign key (account_id, household_id) references public.accounts (id, household_id)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  type public.transaction_type not null,
  account_id uuid not null,
  destination_account_id uuid,
  category_id uuid,
  installment_plan_id uuid,
  amount_cents bigint not null,
  transaction_date date not null default current_date,
  description text check (char_length(description) <= 200),
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (account_id, household_id) references public.accounts (id, household_id),
  foreign key (destination_account_id, household_id) references public.accounts (id, household_id),
  foreign key (category_id, household_id) references public.categories (id, household_id),
  foreign key (installment_plan_id, household_id) references public.installment_plans (id, household_id) on delete cascade,
  check ((type = 'adjustment' and amount_cents <> 0) or (type <> 'adjustment' and amount_cents > 0)),
  check ((type in ('payment', 'transfer')) = (destination_account_id is not null)),
  check (destination_account_id is distinct from account_id),
  check (installment_plan_id is null or type = 'expense')
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  category_id uuid not null,
  month date not null check (extract(day from month) = 1),
  amount_cents bigint not null check (amount_cents > 0),
  created_at timestamptz not null default now(),
  unique (household_id, category_id, month),
  foreign key (category_id, household_id) references public.categories (id, household_id) on delete cascade
);

create index on public.household_members (user_id);
create index on public.accounts (household_id);
create index on public.installment_plans (household_id);
create index on public.installment_plans (account_id);
create index on public.transactions (household_id, transaction_date desc);
create index on public.transactions (account_id);
create index on public.transactions (destination_account_id);
create index on public.transactions (category_id);
create index on public.transactions (installment_plan_id);

create function public.is_household_member(p_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.household_members
    where household_id = p_household_id
      and user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_household_member(uuid) from public, anon;
grant execute on function public.is_household_member(uuid) to authenticated;

alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.installment_plans enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;

create policy "members can view their household" on public.households
  for select to authenticated
  using (public.is_household_member(id));

create policy "owner can update their household" on public.households
  for update to authenticated
  using (created_by = (select auth.uid()))
  with check (created_by = (select auth.uid()));

create policy "members can view household members" on public.household_members
  for select to authenticated
  using (public.is_household_member(household_id));

create policy "household access" on public.accounts
  for all to authenticated
  using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

create policy "household access" on public.categories
  for all to authenticated
  using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

create policy "household access" on public.installment_plans
  for all to authenticated
  using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

create policy "household access" on public.transactions
  for all to authenticated
  using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

create policy "household access" on public.budgets
  for all to authenticated
  using (public.is_household_member(household_id))
  with check (public.is_household_member(household_id));

create function public.create_initial_household()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_household_id uuid;
begin
  insert into public.households (name, created_by)
  values ('Mi hogar', new.id)
  returning id into v_household_id;

  insert into public.household_members (household_id, user_id, role)
  values (v_household_id, new.id, 'owner');

  insert into public.accounts (household_id, type, name)
  values (v_household_id, 'cash', 'Efectivo');

  insert into public.categories (household_id, name, type)
  select v_household_id, c.name, c.type::public.category_type
  from (
    values
      ('Alimentación', 'expense'),
      ('Transporte', 'expense'),
      ('Servicios', 'expense'),
      ('Vivienda', 'expense'),
      ('Salud', 'expense'),
      ('Entretenimiento', 'expense'),
      ('Compras', 'expense'),
      ('Educación', 'expense'),
      ('Otros', 'expense'),
      ('Sueldo', 'income'),
      ('Ingresos extra', 'income')
  ) as c (name, type);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_initial_household();

create view public.v_account_balances
with (security_invoker = true)
as
with effects as (
  select
    t.account_id,
    case t.type
      when 'income' then t.amount_cents
      when 'adjustment' then 0
      else -t.amount_cents
    end as flow_cents,
    case when t.type = 'adjustment' then t.amount_cents else 0 end as adjustment_cents
  from public.transactions t
  union all
  select t.destination_account_id, t.amount_cents, 0
  from public.transactions t
  where t.destination_account_id is not null
),
balances as (
  select
    a.id as account_id,
    a.household_id,
    a.name,
    a.type,
    a.institution,
    a.holder,
    a.credit_limit_cents,
    a.overlimit_cents,
    a.statement_day,
    a.payment_due_day,
    coalesce(sum(
      case
        when a.type in ('credit_card', 'loan') then -e.flow_cents
        else e.flow_cents
      end
      + e.adjustment_cents
    ), 0)::bigint as balance_cents
  from public.accounts a
  left join effects e on e.account_id = a.id
  group by a.id
)
select
  b.*,
  case
    when b.credit_limit_cents is null then null
    else b.credit_limit_cents + b.overlimit_cents - b.balance_cents
  end as available_credit_cents
from balances b;

create view public.v_installment_plan_status
with (security_invoker = true)
as
with base as (
  select
    p.id,
    p.household_id,
    p.account_id,
    p.description,
    p.amount_cents,
    p.installment_count,
    p.annual_rate,
    p.start_date,
    p.annual_rate / 1200 as monthly_rate,
    least(
      p.installment_count,
      greatest(
        0,
        (extract(year from age(current_date, p.start_date)) * 12
          + extract(month from age(current_date, p.start_date)))::int
      )
    ) as elapsed_installments
  from public.installment_plans p
),
with_installment as (
  select
    b.*,
    case
      when b.monthly_rate = 0 then b.amount_cents::numeric / b.installment_count
      else b.amount_cents * b.monthly_rate / (1 - power(1 + b.monthly_rate, -b.installment_count))
    end as exact_installment
  from base b
)
select
  w.id as installment_plan_id,
  w.household_id,
  w.account_id,
  w.description,
  w.amount_cents,
  w.installment_count,
  w.annual_rate,
  w.start_date,
  (w.start_date + make_interval(months => w.installment_count))::date as estimated_end_date,
  round(w.exact_installment)::bigint as estimated_installment_cents,
  w.elapsed_installments,
  w.installment_count - w.elapsed_installments as remaining_installments,
  greatest(
    0,
    round(
      case
        when w.monthly_rate = 0 then w.amount_cents - w.exact_installment * w.elapsed_installments
        else w.amount_cents * power(1 + w.monthly_rate, w.elapsed_installments)
          - w.exact_installment * (power(1 + w.monthly_rate, w.elapsed_installments) - 1) / w.monthly_rate
      end
    )
  )::bigint as estimated_principal_balance_cents,
  round(w.exact_installment * w.installment_count - w.amount_cents)::bigint as estimated_total_interest_cents
from with_installment w;

create view public.v_monthly_expenses
with (security_invoker = true)
as
select
  t.household_id,
  date_trunc('month', t.transaction_date)::date as month,
  t.category_id,
  t.type,
  sum(t.amount_cents)::bigint as total_cents
from public.transactions t
where t.type in ('expense', 'interest', 'fee')
group by t.household_id, date_trunc('month', t.transaction_date), t.category_id, t.type;
