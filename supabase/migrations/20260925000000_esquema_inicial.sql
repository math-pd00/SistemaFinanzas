create type public.tipo_cuenta as enum ('tarjeta_credito', 'prestamo', 'cuenta_bancaria', 'efectivo');
create type public.tipo_movimiento as enum ('ingreso', 'gasto', 'pago', 'transferencia', 'interes', 'comision', 'ajuste');
create type public.tipo_categoria as enum ('gasto', 'ingreso');
create type public.rol_hogar as enum ('propietario', 'miembro');

create table public.hogares (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 80),
  creado_por uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.miembros_hogar (
  hogar_id uuid not null references public.hogares (id) on delete cascade,
  usuario_id uuid not null references auth.users (id) on delete cascade,
  rol public.rol_hogar not null default 'miembro',
  created_at timestamptz not null default now(),
  primary key (hogar_id, usuario_id)
);

create table public.cuentas (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid not null references public.hogares (id) on delete cascade,
  tipo public.tipo_cuenta not null,
  nombre text not null check (char_length(nombre) between 1 and 80),
  entidad text check (char_length(entidad) <= 80),
  titular text check (char_length(titular) <= 80),
  moneda char(3) not null default 'USD',
  cupo_centavos bigint check (cupo_centavos >= 0),
  sobrecupo_centavos bigint not null default 0 check (sobrecupo_centavos >= 0),
  dia_corte smallint check (dia_corte between 1 and 31),
  dia_pago smallint check (dia_pago between 1 and 31),
  tasa_anual numeric(7, 4) not null default 0 check (tasa_anual >= 0),
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, hogar_id)
);

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid not null references public.hogares (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 50),
  tipo public.tipo_categoria not null,
  icono text,
  color text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, hogar_id),
  unique (hogar_id, tipo, nombre)
);

create table public.diferidos (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid not null references public.hogares (id) on delete cascade,
  cuenta_id uuid not null,
  descripcion text not null check (char_length(descripcion) between 1 and 120),
  monto_centavos bigint not null check (monto_centavos > 0),
  numero_cuotas smallint not null check (numero_cuotas between 1 and 120),
  tasa_anual numeric(7, 4) not null default 0 check (tasa_anual >= 0),
  fecha_inicio date not null,
  created_at timestamptz not null default now(),
  unique (id, hogar_id),
  foreign key (cuenta_id, hogar_id) references public.cuentas (id, hogar_id)
);

create table public.movimientos (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid not null references public.hogares (id) on delete cascade,
  tipo public.tipo_movimiento not null,
  cuenta_id uuid not null,
  cuenta_destino_id uuid,
  categoria_id uuid,
  diferido_id uuid,
  monto_centavos bigint not null,
  fecha date not null default current_date,
  descripcion text check (char_length(descripcion) <= 200),
  creado_por uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (cuenta_id, hogar_id) references public.cuentas (id, hogar_id),
  foreign key (cuenta_destino_id, hogar_id) references public.cuentas (id, hogar_id),
  foreign key (categoria_id, hogar_id) references public.categorias (id, hogar_id),
  foreign key (diferido_id, hogar_id) references public.diferidos (id, hogar_id) on delete cascade,
  check ((tipo = 'ajuste' and monto_centavos <> 0) or (tipo <> 'ajuste' and monto_centavos > 0)),
  check ((tipo in ('pago', 'transferencia')) = (cuenta_destino_id is not null)),
  check (cuenta_destino_id is distinct from cuenta_id),
  check (diferido_id is null or tipo = 'gasto')
);

create table public.presupuestos (
  id uuid primary key default gen_random_uuid(),
  hogar_id uuid not null references public.hogares (id) on delete cascade,
  categoria_id uuid not null,
  mes date not null check (extract(day from mes) = 1),
  monto_centavos bigint not null check (monto_centavos > 0),
  created_at timestamptz not null default now(),
  unique (hogar_id, categoria_id, mes),
  foreign key (categoria_id, hogar_id) references public.categorias (id, hogar_id) on delete cascade
);

create index on public.miembros_hogar (usuario_id);
create index on public.cuentas (hogar_id);
create index on public.diferidos (hogar_id);
create index on public.diferidos (cuenta_id);
create index on public.movimientos (hogar_id, fecha desc);
create index on public.movimientos (cuenta_id);
create index on public.movimientos (cuenta_destino_id);
create index on public.movimientos (categoria_id);
create index on public.movimientos (diferido_id);

create function public.es_miembro(p_hogar_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.miembros_hogar
    where hogar_id = p_hogar_id
      and usuario_id = (select auth.uid())
  );
$$;

revoke execute on function public.es_miembro(uuid) from public, anon;
grant execute on function public.es_miembro(uuid) to authenticated;

alter table public.hogares enable row level security;
alter table public.miembros_hogar enable row level security;
alter table public.cuentas enable row level security;
alter table public.categorias enable row level security;
alter table public.diferidos enable row level security;
alter table public.movimientos enable row level security;
alter table public.presupuestos enable row level security;

create policy "miembros ven su hogar" on public.hogares
  for select to authenticated
  using (public.es_miembro(id));

create policy "propietario edita su hogar" on public.hogares
  for update to authenticated
  using (creado_por = (select auth.uid()))
  with check (creado_por = (select auth.uid()));

create policy "miembros ven miembros" on public.miembros_hogar
  for select to authenticated
  using (public.es_miembro(hogar_id));

create policy "acceso por hogar" on public.cuentas
  for all to authenticated
  using (public.es_miembro(hogar_id))
  with check (public.es_miembro(hogar_id));

create policy "acceso por hogar" on public.categorias
  for all to authenticated
  using (public.es_miembro(hogar_id))
  with check (public.es_miembro(hogar_id));

create policy "acceso por hogar" on public.diferidos
  for all to authenticated
  using (public.es_miembro(hogar_id))
  with check (public.es_miembro(hogar_id));

create policy "acceso por hogar" on public.movimientos
  for all to authenticated
  using (public.es_miembro(hogar_id))
  with check (public.es_miembro(hogar_id));

create policy "acceso por hogar" on public.presupuestos
  for all to authenticated
  using (public.es_miembro(hogar_id))
  with check (public.es_miembro(hogar_id));

create function public.crear_hogar_inicial()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_hogar_id uuid;
begin
  insert into public.hogares (nombre, creado_por)
  values ('Mi hogar', new.id)
  returning id into v_hogar_id;

  insert into public.miembros_hogar (hogar_id, usuario_id, rol)
  values (v_hogar_id, new.id, 'propietario');

  insert into public.cuentas (hogar_id, tipo, nombre)
  values (v_hogar_id, 'efectivo', 'Efectivo');

  insert into public.categorias (hogar_id, nombre, tipo)
  select v_hogar_id, c.nombre, c.tipo::public.tipo_categoria
  from (
    values
      ('Alimentación', 'gasto'),
      ('Transporte', 'gasto'),
      ('Servicios', 'gasto'),
      ('Vivienda', 'gasto'),
      ('Salud', 'gasto'),
      ('Entretenimiento', 'gasto'),
      ('Compras', 'gasto'),
      ('Educación', 'gasto'),
      ('Otros', 'gasto'),
      ('Sueldo', 'ingreso'),
      ('Ingresos extra', 'ingreso')
  ) as c (nombre, tipo);

  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_hogar_inicial();

create view public.v_saldos_cuentas
with (security_invoker = true)
as
with efectos as (
  select
    m.cuenta_id,
    case m.tipo
      when 'ingreso' then m.monto_centavos
      when 'ajuste' then 0
      else -m.monto_centavos
    end as flujo_centavos,
    case when m.tipo = 'ajuste' then m.monto_centavos else 0 end as ajuste_centavos
  from public.movimientos m
  union all
  select m.cuenta_destino_id, m.monto_centavos, 0
  from public.movimientos m
  where m.cuenta_destino_id is not null
),
saldos as (
  select
    c.id as cuenta_id,
    c.hogar_id,
    c.nombre,
    c.tipo,
    c.entidad,
    c.titular,
    c.cupo_centavos,
    c.sobrecupo_centavos,
    c.dia_corte,
    c.dia_pago,
    coalesce(sum(
      case
        when c.tipo in ('tarjeta_credito', 'prestamo') then -e.flujo_centavos
        else e.flujo_centavos
      end
      + e.ajuste_centavos
    ), 0)::bigint as saldo_centavos
  from public.cuentas c
  left join efectos e on e.cuenta_id = c.id
  group by c.id
)
select
  s.*,
  case
    when s.cupo_centavos is null then null
    else s.cupo_centavos + s.sobrecupo_centavos - s.saldo_centavos
  end as cupo_disponible_centavos
from saldos s;

create view public.v_diferidos_estado
with (security_invoker = true)
as
with base as (
  select
    d.id,
    d.hogar_id,
    d.cuenta_id,
    d.descripcion,
    d.monto_centavos,
    d.numero_cuotas,
    d.tasa_anual,
    d.fecha_inicio,
    d.tasa_anual / 1200 as tasa_mensual,
    least(
      d.numero_cuotas,
      greatest(
        0,
        (extract(year from age(current_date, d.fecha_inicio)) * 12
          + extract(month from age(current_date, d.fecha_inicio)))::int
      )
    ) as cuotas_transcurridas
  from public.diferidos d
),
con_cuota as (
  select
    b.*,
    case
      when b.tasa_mensual = 0 then b.monto_centavos::numeric / b.numero_cuotas
      else b.monto_centavos * b.tasa_mensual / (1 - power(1 + b.tasa_mensual, -b.numero_cuotas))
    end as cuota_exacta
  from base b
)
select
  c.id as diferido_id,
  c.hogar_id,
  c.cuenta_id,
  c.descripcion,
  c.monto_centavos,
  c.numero_cuotas,
  c.tasa_anual,
  c.fecha_inicio,
  (c.fecha_inicio + make_interval(months => c.numero_cuotas))::date as fecha_fin_estimada,
  round(c.cuota_exacta)::bigint as cuota_estimada_centavos,
  c.cuotas_transcurridas,
  c.numero_cuotas - c.cuotas_transcurridas as cuotas_restantes,
  greatest(
    0,
    round(
      case
        when c.tasa_mensual = 0 then c.monto_centavos - c.cuota_exacta * c.cuotas_transcurridas
        else c.monto_centavos * power(1 + c.tasa_mensual, c.cuotas_transcurridas)
          - c.cuota_exacta * (power(1 + c.tasa_mensual, c.cuotas_transcurridas) - 1) / c.tasa_mensual
      end
    )
  )::bigint as saldo_capital_estimado_centavos,
  round(c.cuota_exacta * c.numero_cuotas - c.monto_centavos)::bigint as interes_total_estimado_centavos
from con_cuota c;

create view public.v_gastos_mensuales
with (security_invoker = true)
as
select
  m.hogar_id,
  date_trunc('month', m.fecha)::date as mes,
  m.categoria_id,
  m.tipo,
  sum(m.monto_centavos)::bigint as total_centavos
from public.movimientos m
where m.tipo in ('gasto', 'interes', 'comision')
group by m.hogar_id, date_trunc('month', m.fecha), m.categoria_id, m.tipo;
