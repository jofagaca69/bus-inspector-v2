-- Cootranszipa Bus Inspector — Ficha del conductor
--
-- Cómo aplicar esta migración (igual que las anteriores):
--   1. Abre el dashboard de tu proyecto en supabase.com
--   2. Ve a "SQL Editor" -> "New query"
--   3. Pega TODO este archivo y ejecútalo (Run)
--
-- Agrega a public.profiles los datos que hacen útil una "ficha" del
-- conductor: licencia y su vencimiento, tipo de sangre, EPS, contacto de
-- emergencia y fecha de ingreso. Es idempotente ("if not exists" / se
-- recrean los CHECK) y no toca datos existentes: todas las columnas nuevas
-- son opcionales, así que los perfiles actuales siguen siendo válidos.
--
-- DATOS PERSONALES: el tipo de sangre, la EPS y el contacto de emergencia
-- son datos personales (Ley 1581 de 2012, protección de datos). No se
-- cambia ninguna policy de RLS: las de 0001_perfiles.sql ya limitan la
-- lectura al propio usuario o a un admin (profiles_select) y la edición
-- también (profiles_update). Un conductor NUNCA ve la ficha de otro.
--
-- Aún no se guarda foto del conductor: exigiría un bucket de Storage con
-- sus propias policies (ver la sección 16 de 0003_inspecciones.sql).

-- ============================================================================
-- 1. Columnas
-- ============================================================================
alter table public.profiles
  add column if not exists licencia_numero text,
  add column if not exists licencia_categoria text,
  add column if not exists licencia_vence date,
  add column if not exists rh text,
  add column if not exists eps text,
  add column if not exists contacto_emergencia_nombre text,
  add column if not exists contacto_emergencia_telefono text,
  add column if not exists fecha_ingreso date;

-- ============================================================================
-- 2. Validaciones
-- ============================================================================
-- Postgres no soporta "add constraint if not exists": se eliminan y se
-- recrean para que la migración pueda correrse más de una vez.
alter table public.profiles
  drop constraint if exists licencia_categoria_valida,
  drop constraint if exists licencia_numero_longitud,
  drop constraint if exists rh_valido,
  drop constraint if exists eps_longitud,
  drop constraint if exists contacto_nombre_longitud,
  drop constraint if exists contacto_telefono_valido;

alter table public.profiles
  add constraint licencia_categoria_valida
    check (licencia_categoria is null
           or licencia_categoria in ('A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3')),
  add constraint licencia_numero_longitud
    check (licencia_numero is null or char_length(licencia_numero) between 4 and 20),
  add constraint rh_valido
    check (rh is null or rh in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  add constraint eps_longitud
    check (eps is null or char_length(eps) between 2 and 80),
  add constraint contacto_nombre_longitud
    check (contacto_emergencia_nombre is null
           or char_length(contacto_emergencia_nombre) between 3 and 100),
  add constraint contacto_telefono_valido
    check (contacto_emergencia_telefono is null
           or contacto_emergencia_telefono ~ '^[0-9]{7,12}$');

-- ============================================================================
-- 3. Documentación
-- ============================================================================
comment on column public.profiles.licencia_numero is
  'Número de la licencia de conducción.';
comment on column public.profiles.licencia_categoria is
  'Categoría de la licencia (A1, A2, B1, B2, B3, C1, C2, C3). Un bus de servicio público requiere C2 o C3.';
comment on column public.profiles.licencia_vence is
  'Fecha de vencimiento de la licencia. Alimenta el aviso de "por vencer" del centro de alertas.';
comment on column public.profiles.rh is
  'Tipo de sangre y factor RH (dato sensible; solo lo ven el propio conductor y los admin).';
comment on column public.profiles.eps is
  'EPS a la que está afiliado el conductor.';
comment on column public.profiles.contacto_emergencia_nombre is
  'A quién avisar en una emergencia (dato personal de un tercero).';
comment on column public.profiles.contacto_emergencia_telefono is
  'Teléfono del contacto de emergencia, solo dígitos (7 a 12).';
comment on column public.profiles.fecha_ingreso is
  'Fecha en que el conductor ingresó a la empresa.';

-- ============================================================================
-- 4. Índice para el aviso de licencias por vencer
-- ============================================================================
-- El centro de alertas del admin busca conductores activos con la licencia
-- próxima a vencer; el índice parcial evita recorrer perfiles sin fecha.
create index if not exists profiles_licencia_vence_idx
  on public.profiles (licencia_vence)
  where licencia_vence is not null;
