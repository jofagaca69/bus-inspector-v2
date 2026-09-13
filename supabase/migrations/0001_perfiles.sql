-- Cootranszipa Bus Inspector — Perfiles y control de acceso
--
-- Cómo aplicar esta migración:
--   1. Abre el dashboard de tu proyecto en supabase.com
--   2. Ve a "SQL Editor" -> "New query"
--   3. Pega TODO este archivo y ejecútalo (Run)
--
-- Este script es idempotente donde es razonable (usa "if not exists" /
-- "or replace"), pero está pensado para correrse una sola vez sobre un
-- proyecto nuevo.

-- ============================================================================
-- 1. Rol de usuario
-- ============================================================================
-- Se deja como enum para que Postgres valide el valor a nivel de columna.
-- Agregar un rol nuevo en el futuro (ej. 'supervisor') no requiere migrar
-- datos existentes:
--   alter type public.user_role add value 'supervisor';
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('conductor', 'admin');
  end if;
end $$;

-- ============================================================================
-- 2. Tabla de perfiles
-- ============================================================================
-- Extiende auth.users (tabla gestionada por Supabase, no se debe alterar).
-- La cédula es el identificador de negocio; el email real usado en
-- auth.users es sintético (cedula@<dominio>), nunca se muestra al usuario.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  cedula text not null unique,
  nombre_completo text not null,
  telefono text,
  rol public.user_role not null default 'conductor',
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cedula_solo_digitos check (cedula ~ '^[0-9]{6,12}$')
);

comment on table public.profiles is
  'Datos de negocio de cada usuario (conductor o admin). Uno a uno con auth.users.';
comment on column public.profiles.cedula is
  'Número de cédula del conductor, solo dígitos. Identificador de negocio usado para iniciar sesión.';

create index if not exists profiles_rol_idx on public.profiles (rol);

-- ============================================================================
-- 3. updated_at automático
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- ============================================================================
-- 4. Crear el perfil automáticamente cuando nace un usuario de Auth
-- ============================================================================
-- Se ejecuta en la misma transacción que el insert en auth.users: si algo
-- falla aquí, la creación del usuario también se revierte, evitando el
-- estado roto de "usuario de Auth sin perfil".
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, cedula, nombre_completo, rol)
  values (
    new.id,
    new.raw_user_meta_data ->> 'cedula',
    coalesce(new.raw_user_meta_data ->> 'nombre_completo', ''),
    coalesce((new.raw_user_meta_data ->> 'rol')::public.user_role, 'conductor')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================================================
-- 5. Función auxiliar: rol del usuario autenticado actual
-- ============================================================================
-- security definer + search_path vacío: se ejecuta saltando RLS. Es
-- deliberado y necesario: si la policy de "admin ve todo" tuviera que
-- consultar la propia tabla profiles para saber si eres admin, y esa
-- consulta a su vez disparara la misma policy, Postgres entraría en
-- recursión infinita. Esta función corta el ciclo.
create or replace function public.rol_actual()
returns public.user_role
language sql
security definer
stable
set search_path = ''
as $$
  select rol from public.profiles where id = auth.uid();
$$;

-- ============================================================================
-- 6. Impedir que un usuario se autoasigne rol o se reactive/desactive
-- ============================================================================
-- Las policies de RLS de Postgres no filtran de forma fiable columna por
-- columna en un mismo UPDATE, así que la protección se hace con un
-- trigger: si quien edita no es admin, se ignoran los cambios a "rol" y
-- "activo" y se conserva el valor anterior.
create or replace function public.proteger_columnas_privilegiadas()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.rol_actual() is distinct from 'admin' then
    new.rol := old.rol;
    new.activo := old.activo;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_proteger_columnas on public.profiles;
create trigger profiles_proteger_columnas
  before update on public.profiles
  for each row
  execute function public.proteger_columnas_privilegiadas();

-- ============================================================================
-- 7. Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
  on public.profiles
  for select
  to authenticated
  using (
    id = auth.uid()
    or public.rol_actual() = 'admin'
  );

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update"
  on public.profiles
  for update
  to authenticated
  using (
    id = auth.uid()
    or public.rol_actual() = 'admin'
  )
  with check (
    id = auth.uid()
    or public.rol_actual() = 'admin'
  );

-- No se define policy de INSERT ni DELETE para ningún rol: los perfiles
-- solo nacen a través del trigger handle_new_user (que corre como
-- security definer y por lo tanto no necesita policy) y nunca se borran
-- físicamente (las bajas son profiles.activo = false). Sin policy, RLS
-- deniega el acceso por defecto.
