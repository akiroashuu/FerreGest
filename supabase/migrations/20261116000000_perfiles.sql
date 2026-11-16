-- FerreGest · Fase 0 · Perfiles de usuario y roles
--
-- Cada cuenta de Supabase Auth (auth.users) tiene exactamente un perfil con
-- su nombre y su rol. Las cuentas las crea un administrador; el registro
-- público debe estar desactivado en el proyecto de Supabase.

create type public.rol_usuario as enum ('administrador', 'bodeguero', 'vendedor');

create table public.perfiles (
  -- RESTRICT: no se puede borrar un usuario que tenga historial. Se desactiva.
  id         uuid primary key references auth.users (id) on delete restrict,
  nombre     text not null check (char_length(btrim(nombre)) > 0),
  rol        public.rol_usuario not null default 'vendedor',
  activo     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.perfiles is
  'Nombre, rol y estado de cada usuario del sistema. Relación 1:1 con auth.users.';

-- ---------------------------------------------------------------------------
-- updated_at automático (se reutilizará en las demás tablas)
-- ---------------------------------------------------------------------------
create function public.tocar_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger perfiles_tocar_updated_at
  before update on public.perfiles
  for each row execute function public.tocar_updated_at();

-- ---------------------------------------------------------------------------
-- Crear el perfil cuando se crea la cuenta
-- ---------------------------------------------------------------------------
-- El rol NO se lee de los metadatos del usuario: toda cuenta nueva nace como
-- vendedor y un administrador le asigna después el rol que corresponda.
create function public.crear_perfil_de_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'nombre'), ''),
      split_part(new.email, '@', 1),
      'Usuario'
    )
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_de_usuario();

-- ---------------------------------------------------------------------------
-- Función de apoyo para las políticas de acceso
-- ---------------------------------------------------------------------------
-- SECURITY DEFINER para poder consultar perfiles desde una política de la
-- propia tabla sin provocar recursión de RLS.
create function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.perfiles
    where id = (select auth.uid())
      and rol = 'administrador'
      and activo
  );
$$;

-- ---------------------------------------------------------------------------
-- Permisos y Row Level Security
-- ---------------------------------------------------------------------------
alter table public.perfiles enable row level security;

revoke all on public.perfiles from anon, authenticated;
grant select, update on public.perfiles to authenticated;

revoke execute on function public.es_administrador() from public, anon;
grant execute on function public.es_administrador() to authenticated;
revoke execute on function public.crear_perfil_de_usuario() from public, anon, authenticated;
revoke execute on function public.tocar_updated_at() from public, anon, authenticated;

-- Cualquier usuario con sesión ve los perfiles (hace falta para mostrar quién
-- registró una venta o un movimiento).
create policy perfiles_lectura
  on public.perfiles
  for select
  to authenticated
  using (true);

-- Solo un administrador activo cambia nombre, rol o estado.
-- No hay políticas de INSERT ni DELETE: los perfiles los crea el trigger y
-- nunca se eliminan.
create policy perfiles_edicion_admin
  on public.perfiles
  for update
  to authenticated
  using (public.es_administrador())
  with check (public.es_administrador());
