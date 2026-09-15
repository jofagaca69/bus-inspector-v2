-- Cootranszipa Bus Inspector — Inspección diaria, flota y novedades
--
-- Cómo aplicar esta migración:
--   1. Abre el dashboard de tu proyecto en supabase.com
--   2. Ve a "SQL Editor" -> "New query"
--   3. Pega TODO este archivo y ejecútalo (Run)
--   4. La sección 16 (Storage) puede requerir ejecutarse desde
--      Storage -> Policies si el SQL Editor se queja de permisos.
--      Ver la nota al inicio de esa sección.
--
-- Igual que 0001, es idempotente donde es razonable ("if not exists" /
-- "or replace") pero está pensado para correrse una sola vez, después de
-- 0001_perfiles.sql y 0002_corregir_cedula_por_defecto.sql.
--
-- NOTA DE ALCANCE: el catálogo de los 23 componentes del bus (ficha
-- técnica, criticidad, sustento legal, pasos de inspección) NO vive en
-- esta base de datos. Es contenido estático en lib/datos/componentes.ts.
-- Aquí solo se guarda el RESULTADO de haber inspeccionado cada uno. Por
-- eso inspeccion_items.codigo_componente es text libre (validado contra
-- el catálogo en la Server Action con zod) y no una FK: la alternativa
-- obligaría a una migración SQL cada vez que se edita un texto del
-- catálogo, y crearía dos fuentes de verdad que se desincronizan en
-- silencio.


-- ============================================================================
-- 1. Enums del dominio de inspección
-- ============================================================================
-- Todos son dominios cerrados definidos por el negocio, igual que
-- user_role en 0001. El enum además ORDENA por orden de declaración, así
-- que "order by estado" ya sale de mejor a peor sin ningún case.
--
-- Si en el futuro hay que agregar un valor:
--   alter type public.tipo_novedad add value 'neumatica';
-- (en Postgres 12+ eso corre dentro de transacción, siempre que el valor
-- nuevo no se USE en la misma transacción.)

do $$
begin
  if not exists (select 1 from pg_type where typname = 'estado_item') then
    -- 'sin_revisar' es el estado inicial de todo ítem al abrir la
    -- inspección. Es un estado real y no un NULL para que la pregunta
    -- "¿cuántos me faltan?" sea un count con filtro y no un count de
    -- nulos, y para que la columna pueda ser NOT NULL.
    create type public.estado_item as enum (
      'sin_revisar',
      'correcto',
      'requiere_revision',
      'fuera_de_servicio'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'tipo_inspeccion') then
    create type public.tipo_inspeccion as enum ('completa', 'rapida');
  end if;

  if not exists (select 1 from pg_type where typname = 'estado_general') then
    -- Semáforo del vehículo. Los nombres son los colores y no
    -- 'apto'/'no_apto' porque la UI, los tokens de color de
    -- app/globals.css y el lenguaje que usan los conductores en el patio
    -- ya hablan de verde/amarillo/rojo.
    create type public.estado_general as enum ('verde', 'amarillo', 'rojo');
  end if;

  if not exists (select 1 from pg_type where typname = 'tipo_novedad') then
    create type public.tipo_novedad as enum (
      'mecanica',
      'electrica',
      'carroceria',
      'seguridad',
      'documentacion',
      'limpieza',
      'otra'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'severidad_novedad') then
    create type public.severidad_novedad as enum ('baja', 'media', 'alta', 'critica');
  end if;

  if not exists (select 1 from pg_type where typname = 'estado_novedad') then
    create type public.estado_novedad as enum (
      'abierta',
      'en_proceso',
      'resuelta',
      'descartada'
    );
  end if;
end $$;


-- ============================================================================
-- 2. Flota
-- ============================================================================
-- Tabla propia y no un simple texto "placa" en cada inspección: la placa
-- se escribe mal a mano en un celular dentro de un bus, y un historial
-- por vehículo con placas tipeadas ("SVK123", "svk 123", "SVK-123") es
-- inservible. Con una tabla, el conductor elige de una lista.
create table if not exists public.buses (
  id uuid primary key default gen_random_uuid(),
  placa text not null unique,
  numero_interno text not null unique,
  modelo text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Placa colombiana de servicio público: 3 letras + 3 dígitos. Se exige
  -- mayúscula en la propia restricción para que el UNIQUE sea fiable:
  -- sin esto 'SVK123' y 'svk123' serían dos buses distintos. La
  -- normalización a mayúscula la hace el .transform() de zod en la
  -- Server Action; esta restricción es la red de seguridad.
  constraint placa_formato check (placa = upper(placa) and placa ~ '^[A-Z]{3}[0-9]{3}$'),
  constraint numero_interno_no_vacio check (char_length(trim(numero_interno)) between 1 and 10)
);

comment on table public.buses is
  'Flota de la empresa. Los buses no se borran nunca: se desactivan (activo = false) porque las inspecciones históricas los referencian.';
comment on column public.buses.numero_interno is
  'Número pintado en la carrocería. Es como los conductores identifican el bus en el patio; la placa casi nunca se usa en conversación.';
comment on column public.buses.activo is
  'false = fuera de la flota. No aparece en el selector del conductor pero sigue visible para el admin y en el historial.';

create index if not exists buses_activo_idx on public.buses (activo) where activo;

drop trigger if exists buses_set_updated_at on public.buses;
create trigger buses_set_updated_at
  before update on public.buses
  for each row
  execute function public.set_updated_at();  -- definida en 0001


-- ============================================================================
-- 3. Bus asignado al conductor
-- ============================================================================
-- El admin asigna un bus por defecto a cada conductor, pero el conductor
-- puede cambiarlo si ese día le toca otro. Es solo un DEFAULT para
-- precargar el formulario: la verdad de "qué bus se inspeccionó" vive en
-- inspecciones.bus_id, que se copia en el momento de abrir la inspección
-- y ya no cambia si mañana se reasigna el perfil.
--
-- IMPORTANTE: bus_id se deja DELIBERADAMENTE fuera del trigger
-- proteger_columnas_privilegiadas de 0001 (que congela "rol" y "activo"
-- para no-admins). A diferencia de esos, el conductor SÍ debe poder
-- cambiar su propio bus_id sin pedirle permiso a nadie.
alter table public.profiles
  add column if not exists bus_id uuid references public.buses (id) on delete set null;

comment on column public.profiles.bus_id is
  'Bus asignado por defecto. Solo precarga el formulario de inspección; el conductor puede cambiarlo. "on delete set null" para que borrar un bus jamás tumbe un perfil.';

create index if not exists profiles_bus_id_idx on public.profiles (bus_id);


-- ============================================================================
-- 4. Inspecciones (cabecera / acta)
-- ============================================================================
create table if not exists public.inspecciones (
  id uuid primary key default gen_random_uuid(),

  -- "on delete restrict" y no "cascade": un acta de inspección es un
  -- documento con valor probatorio. Borrar un conductor no puede borrar
  -- su historial. Las bajas de conductores son profiles.activo = false
  -- (ver 0001), así que este restrict nunca debería dispararse.
  conductor_id uuid not null references public.profiles (id) on delete restrict,
  bus_id uuid not null references public.buses (id) on delete restrict,

  tipo public.tipo_inspeccion not null default 'completa',

  -- Opcional: no todos los buses tienen el odómetro funcionando, y
  -- obligarlo llevaría a que el conductor invente un número.
  kilometraje integer,
  observaciones text,

  -- Resultados congelados al cerrar (ver sección 12 y la justificación
  -- de por qué se almacenan en vez de calcularse al leer).
  total_items smallint,
  items_correctos smallint,
  items_requieren_revision smallint,
  items_fuera_de_servicio smallint,
  porcentaje_cumplimiento numeric(5, 2),
  estado_general public.estado_general,

  iniciada_en timestamptz not null default now(),

  -- El ciclo de vida se modela con UNA columna nullable y no con un enum
  -- de estado. Ver comentario extenso en la sección 10.
  finalizada_en timestamptz,

  -- Fecha calendario LOCAL de la inspección. Generada y almacenada para
  -- poder agrupar e indexar el historial "por día".
  --
  -- El 'America/Bogota' es obligatorio, no cosmético: una inspección a
  -- las 7:00 p.m. de Bogotá ya es el DÍA SIGUIENTE en UTC. Agrupar el
  -- historial por (iniciada_en)::date en UTC partiría en dos los turnos
  -- de la tarde y haría que "la inspección de hoy" desaparezca de la
  -- pantalla del conductor a las 7 p.m. Colombia no tiene horario de
  -- verano, así que el offset es fijo -05 y la expresión es IMMUTABLE
  -- (requisito de las columnas generadas).
  fecha date not null generated always as
    ((iniciada_en at time zone 'America/Bogota')::date) stored,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint kilometraje_razonable
    check (kilometraje is null or kilometraje between 0 and 3000000),
  -- Coherencia temporal: no se puede cerrar antes de abrir.
  constraint cierre_posterior_a_inicio
    check (finalizada_en is null or finalizada_en >= iniciada_en),
  -- Una inspección finalizada SIEMPRE tiene resultados. Esto impide que
  -- un UPDATE manual la marque cerrada sin pasar por cerrar_inspeccion().
  constraint finalizada_tiene_resultados
    check (
      finalizada_en is null
      or (estado_general is not null
          and porcentaje_cumplimiento is not null
          and total_items is not null)
    )
);

comment on table public.inspecciones is
  'Cabecera del acta de inspección diaria. Una fila por inspección; el detalle de cada componente está en inspeccion_items. Una vez finalizada_en deja de ser NULL, la fila es inmutable (trigger bloquear_inspeccion_finalizada).';
comment on column public.inspecciones.bus_id is
  'Bus realmente inspeccionado. Se copia de profiles.bus_id al abrir, pero es independiente: reasignar el bus del conductor mañana no reescribe el historial.';
comment on column public.inspecciones.fecha is
  'Fecha calendario en hora de Colombia (America/Bogota). Generada porque agrupar por UTC partiría los turnos de la tarde en dos días.';
comment on column public.inspecciones.finalizada_en is
  'NULL = inspección en curso (borrador editable y descartable). NOT NULL = acta cerrada e inmutable.';
comment on column public.inspecciones.porcentaje_cumplimiento is
  'Congelado al cerrar. No se recalcula al leer: si el catálogo cambia, el porcentaje histórico no puede moverse.';


-- ============================================================================
-- 5. Ítems de la inspección (detalle)
-- ============================================================================
create table if not exists public.inspeccion_items (
  id uuid primary key default gen_random_uuid(),
  inspeccion_id uuid not null references public.inspecciones (id) on delete cascade,

  -- Slug del catálogo estático (lib/datos/componentes.ts, campo `id` de
  -- cada ComponenteBus). Sin FK a ninguna tabla: ver la nota de alcance
  -- al inicio del archivo.
  codigo_componente text not null,

  -- Snapshot del nombre en el momento de la inspección. Denormalizado a
  -- propósito: si dentro de dos años el catálogo renombra o elimina un
  -- componente, el acta antigua debe seguir siendo legible sin
  -- arqueología en el historial de git.
  nombre_componente text not null,

  orden smallint not null default 0,
  estado public.estado_item not null default 'sin_revisar',
  nota text,
  revisado_en timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint codigo_componente_slug
    check (codigo_componente ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(codigo_componente) <= 60),
  constraint nota_longitud check (nota is null or char_length(nota) <= 1000),
  -- Clave natural del ítem. Hace que "marcar el componente X de esta
  -- inspección" sea un upsert idempotente (onConflict), lo que importa
  -- mucho en un celular con señal intermitente donde el mismo tap se
  -- reenvía dos veces.
  constraint inspeccion_items_unicos unique (inspeccion_id, codigo_componente)
);

comment on table public.inspeccion_items is
  'Un renglón por componente inspeccionado. Se crean los N renglones de golpe al abrir la inspección (23 si es completa) para que "12 de 23" sea un count y no una resta contra un catálogo que vive en el código.';
comment on column public.inspeccion_items.nombre_componente is
  'Copia del nombre del catálogo al momento de inspeccionar. Garantiza que el acta siga siendo legible aunque el catálogo cambie.';

-- NO se crea índice sobre (inspeccion_id) a secas: la restricción UNIQUE
-- (inspeccion_id, codigo_componente) ya crea un índice cuya PRIMERA
-- columna es inspeccion_id, y Postgres lo usa igual para
-- "where inspeccion_id = $1". Un índice extra sería peso muerto en cada
-- insert.
create index if not exists inspeccion_items_fallas_idx
  on public.inspeccion_items (codigo_componente, estado)
  where estado in ('requiere_revision', 'fuera_de_servicio');
comment on index public.inspeccion_items_fallas_idx is
  'Índice parcial para el reporte del admin "qué componente falla más en la flota". Solo indexa las filas problemáticas, que son la minoría, así que ocupa una fracción de un índice completo.';


-- ============================================================================
-- 6. Novedades — tabla APARTE, no columnas del ítem
-- ============================================================================
-- Se evaluaron las dos opciones. Gana tabla aparte por tres razones, en
-- orden de peso:
--
--   1. CICLO DE VIDA OPUESTO. El ítem se CONGELA al finalizar la
--      inspección (es un acta). La novedad, en cambio, tiene que seguir
--      viva DESPUÉS de cerrar: el admin o el mecánico la pasan a
--      'en_proceso' y luego a 'resuelta' días más tarde. Si la novedad
--      fuera una columna del ítem, el mismo trigger que protege la
--      inmutabilidad del acta congelaría también el flujo de
--      resolución. Sería imposible tener las dos cosas.
--
--   2. UNA NOVEDAD PUEDE NO TENER ÍTEM. "Se pinchó una llanta en ruta",
--      "un pasajero rompió una ventana": el conductor reporta sin haber
--      abierto ninguna inspección. Como columnas del ítem eso sería
--      imposible de representar.
--
--   3. LA CONSULTA CLAVE DEL ADMIN es "todas las novedades abiertas de
--      la flota, las críticas primero". Con tabla propia es un index
--      scan sobre un índice parcial de unas decenas de filas; como
--      columnas del ítem sería un seq scan sobre cientos de miles de
--      renglones de checklist, el 97% de ellos 'correcto' y sin novedad.
create table if not exists public.novedades (
  id uuid primary key default gen_random_uuid(),

  -- Ambos nullables: una novedad puede nacer suelta, fuera de una
  -- inspección. "on delete set null" y no cascade: si se descarta una
  -- inspección en curso, la novedad reportada durante ella sobrevive
  -- huérfana pero válida (el bus sigue teniendo el problema).
  inspeccion_id uuid references public.inspecciones (id) on delete set null,
  inspeccion_item_id uuid references public.inspeccion_items (id) on delete set null,

  -- bus_id y reportada_por SÍ son obligatorios: sin ellos la novedad no
  -- es accionable.
  bus_id uuid not null references public.buses (id) on delete restrict,
  reportada_por uuid not null references public.profiles (id) on delete restrict,

  tipo public.tipo_novedad not null,
  severidad public.severidad_novedad not null default 'media',
  descripcion text not null,

  estado public.estado_novedad not null default 'abierta',
  resuelta_por uuid references public.profiles (id) on delete set null,
  resuelta_en timestamptz,
  nota_resolucion text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- 10 caracteres mínimo: "malo" no es un reporte accionable para el
  -- taller. El mensaje de error al usuario lo da zod antes de llegar
  -- aquí; esto es la red de seguridad.
  constraint descripcion_util check (char_length(trim(descripcion)) between 10 and 2000),
  -- Si tiene ítem, tiene inspección. Al revés no (novedad suelta dentro
  -- de una inspección, o novedad totalmente suelta).
  constraint item_implica_inspeccion
    check (inspeccion_item_id is null or inspeccion_id is not null),
  -- Coherencia del cierre: resuelta <=> hay quién y cuándo.
  constraint cierre_coherente check (
    (estado in ('resuelta', 'descartada')) = (resuelta_en is not null)
  )
);

comment on table public.novedades is
  'Reportes de problemas. Tabla aparte del ítem porque sobreviven al cierre del acta: el acta se congela, la novedad sigue su flujo abierta -> en_proceso -> resuelta.';

create index if not exists novedades_pendientes_idx
  on public.novedades (severidad desc, created_at desc)
  where estado in ('abierta', 'en_proceso');
comment on index public.novedades_pendientes_idx is
  'Índice parcial: la bandeja del admin solo mira lo no resuelto. Las novedades cerradas, que con el tiempo serán el 95%, ni siquiera entran al índice.';

create index if not exists novedades_bus_idx on public.novedades (bus_id, created_at desc);
create index if not exists novedades_reportada_por_idx on public.novedades (reportada_por, created_at desc);
create index if not exists novedades_inspeccion_idx on public.novedades (inspeccion_id);
create index if not exists novedades_item_idx on public.novedades (inspeccion_item_id);


-- ============================================================================
-- 7. Evidencias — tabla, NO un array de rutas
-- ============================================================================
-- Se descartó "inspeccion_items.fotos text[]" por cuatro motivos:
--
--   1. Una foto tiene metadatos que el array no puede llevar: quién la
--      subió, cuándo, mime, tamaño. En un documento con valor probatorio
--      eso importa tanto como la imagen.
--   2. Borrar una foto de un text[] es un UPDATE sobre la fila del ítem,
--      que el trigger de inmutabilidad bloquea. Con tabla propia la foto
--      tiene su propia policy y su propio ciclo de vida.
--   3. Un array no puede tener FK ni servir "todas las fotos del bus X
--      del último mes" sin desarmarlo con unnest.
--   4. La misma foto puede pertenecer a un ítem O a una novedad suelta.
--      Un array en inspeccion_items solo cubre el primer caso.
--
-- La imagen en sí NO se guarda aquí: vive en Supabase Storage (bucket
-- privado 'evidencias'). Esta tabla guarda la RUTA. Ver sección 16.
create table if not exists public.evidencias (
  id uuid primary key default gen_random_uuid(),

  inspeccion_id uuid references public.inspecciones (id) on delete cascade,
  inspeccion_item_id uuid references public.inspeccion_items (id) on delete cascade,
  novedad_id uuid references public.novedades (id) on delete cascade,

  -- Ruta dentro del bucket 'evidencias'. UNIQUE para que el mismo objeto
  -- de Storage no pueda quedar registrado dos veces si la Server Action
  -- se reintenta.
  ruta text not null unique,

  mime text not null default 'image/webp',
  bytes integer,
  subida_por uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),

  -- Exactamente un dueño: o cuelga de un ítem, o de una novedad.
  constraint evidencia_un_solo_dueno
    check (num_nonnulls(inspeccion_item_id, novedad_id) = 1),
  constraint evidencia_item_implica_inspeccion
    check (inspeccion_item_id is null or inspeccion_id is not null),
  constraint mime_permitido
    check (mime in ('image/jpeg', 'image/png', 'image/webp')),
  constraint tamano_razonable
    check (bytes is null or bytes between 1 and 5242880),

  -- CLAVE: la primera carpeta de la ruta DEBE ser el uuid de quien sube.
  -- Esta restricción es la que mantiene sincronizadas esta tabla y las
  -- policies de storage.objects (sección 16), que solo saben leer
  -- (storage.foldername(name))[1]. Sin esto, un cliente podría registrar
  -- en public.evidencias la ruta de la foto de OTRO conductor y verla
  -- firmada desde el detalle de su propia inspección.
  constraint ruta_pertenece_a_quien_sube
    check (split_part(ruta, '/', 1) = subida_por::text)
);

comment on table public.evidencias is
  'Metadatos de las fotos. El binario vive en el bucket privado "evidencias" de Supabase Storage; aquí solo la ruta. Tabla y no array de texto porque la foto tiene ciclo de vida, metadatos y dueño propio.';
comment on column public.evidencias.ruta is
  'Ruta en el bucket: {conductor_id}/{inspeccion_id}/{codigo_componente}/{uuid}.webp o {conductor_id}/novedades/{novedad_id}/{uuid}.webp. El primer segmento debe ser subida_por (ver restricción ruta_pertenece_a_quien_sube).';

create index if not exists evidencias_item_idx on public.evidencias (inspeccion_item_id);
create index if not exists evidencias_novedad_idx on public.evidencias (novedad_id);
create index if not exists evidencias_inspeccion_idx on public.evidencias (inspeccion_id);


-- ============================================================================
-- 8. Índices del historial
-- ============================================================================
-- Consulta del conductor: sus inspecciones, más reciente primero.
--   where conductor_id = $1 order by iniciada_en desc limit 20
create index if not exists inspecciones_conductor_fecha_idx
  on public.inspecciones (conductor_id, iniciada_en desc);

-- Consulta del admin: toda la flota, más reciente primero.
create index if not exists inspecciones_fecha_idx
  on public.inspecciones (iniciada_en desc);

-- Consulta del admin filtrando por vehículo: "historial del bus 042".
create index if not exists inspecciones_bus_fecha_idx
  on public.inspecciones (bus_id, fecha desc);

-- Tablero del admin: solo lo que no está en verde. Índice parcial: la
-- mayoría de inspecciones deberían salir verdes, así que este índice se
-- mantiene diminuto.
create index if not exists inspecciones_alertas_idx
  on public.inspecciones (estado_general, iniciada_en desc)
  where estado_general in ('amarillo', 'rojo');


-- ============================================================================
-- 9. Una sola inspección abierta a la vez (race condition)
-- ============================================================================
-- Sin esto, el doble tap sobre "Iniciar inspección" con red lenta crea
-- DOS borradores y el conductor llena uno mientras el otro queda huérfano
-- para siempre. Un "select ... if not exists then insert" en la Server
-- Action NO lo resuelve: dos peticiones concurrentes pasan las dos por el
-- select antes de que cualquiera inserte. La única solución correcta es
-- que la BD rechace la segunda con un índice único parcial.
--
-- Se restringe por CONDUCTOR y no por bus: un conductor no puede tener
-- dos checklists a medias, punto. Restringirlo por BUS sería tentador
-- ("nadie más inspecciona este bus mientras yo lo hago") pero crea un
-- bloqueo operativo real: si el conductor del turno anterior dejó un
-- borrador abierto y se fue a su casa, el siguiente NO PUEDE trabajar.
-- El caso "dos conductores inspeccionando el mismo bus a la vez" es raro
-- y se resuelve mostrando un aviso no bloqueante en la UI.
create unique index if not exists inspecciones_una_abierta_por_conductor_idx
  on public.inspecciones (conductor_id)
  where finalizada_en is null;

comment on index public.inspecciones_una_abierta_por_conductor_idx is
  'Garantía atómica de "una inspección en curso por conductor". La Server Action captura el error 23505 y redirige al borrador existente en vez de mostrar un error.';


-- ============================================================================
-- 10. Ciclo de vida: por qué finalizada_en nullable y no un enum de estado
-- ============================================================================
-- Se descartó "estado public.estado_inspeccion not null" porque:
--
--   a) Sería información DUPLICADA que puede contradecirse. Con enum +
--      timestamp acabas teniendo filas con estado='finalizada' y
--      finalizada_en NULL, o al revés, y ninguna consulta sabe a cuál
--      creerle. Una sola columna no puede estar en desacuerdo consigo
--      misma.
--   b) El timestamp lleva información que el enum no: CUÁNDO se cerró, y
--      por tanto cuánto tardó la inspección.
--   c) "where finalizada_en is null" es exactamente el predicado que
--      necesitan los índices parciales de la sección 9.
--
-- El único estado que la columna nullable no puede expresar es
-- "descartada", y eso es deliberado: un borrador sin finalizar no tiene
-- ningún valor legal, así que se BORRA (delete) en vez de marcarse. La
-- policy de DELETE (sección 15) solo permite borrar borradores propios,
-- nunca actas cerradas.


-- ============================================================================
-- 11. Inmutabilidad del acta finalizada
-- ============================================================================
-- Se implementa en TRIGGER y no solo en RLS. El motivo es concreto: este
-- proyecto usa el cliente service_role (lib/supabase/admin.ts) en las
-- páginas de administración, y ese cliente IGNORA RLS por completo. Una
-- policy "with check (finalizada_en is null)" protegería al conductor
-- pero dejaría abierta la puerta de que un futuro endpoint de admin
-- reescriba un acta cerrada por descuido.
--
-- "No se edita un acta firmada" no es una regla de ACCESO (quién), es un
-- INVARIANTE DE NEGOCIO (qué), y los invariantes van en trigger, que
-- corre para todo escritor incluido service_role. La RLS se pone igual,
-- como defensa en profundidad y para que el conductor reciba el error
-- limpio de la policy antes de llegar al trigger.
create or replace function public.bloquear_inspeccion_finalizada()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    if old.finalizada_en is not null then
      raise exception
        'La inspección % se finalizó el % y no se puede eliminar. Las actas cerradas son permanentes.',
        old.id, old.finalizada_en
        using errcode = 'restrict_violation';
    end if;
    return old;
  end if;

  -- El propio cierre pasa por aquí, y pasa: en ese UPDATE
  -- old.finalizada_en todavía es NULL. Solo se bloquea el SEGUNDO
  -- intento de tocar la fila.
  if old.finalizada_en is not null then
    raise exception
      'La inspección % se finalizó el % y ya no admite cambios.',
      old.id, old.finalizada_en
      using errcode = 'restrict_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists inspecciones_bloquear_finalizada on public.inspecciones;
create trigger inspecciones_bloquear_finalizada
  before update or delete on public.inspecciones
  for each row
  execute function public.bloquear_inspeccion_finalizada();

drop trigger if exists inspecciones_set_updated_at on public.inspecciones;
create trigger inspecciones_set_updated_at
  before update on public.inspecciones
  for each row
  execute function public.set_updated_at();

-- Misma protección para las tablas hijas: si el acta está cerrada, ni sus
-- ítems ni sus evidencias se tocan. Sin esto, la inmutabilidad de la
-- cabecera sería teatro (se cambiaría el detalle y el % quedaría
-- mintiendo).
create or replace function public.bloquear_hijo_de_inspeccion_finalizada()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inspeccion_id uuid;
  v_finalizada_en timestamptz;
begin
  v_inspeccion_id := coalesce(new.inspeccion_id, old.inspeccion_id);

  -- Evidencias de novedades sueltas no cuelgan de ninguna inspección.
  if v_inspeccion_id is null then
    return coalesce(new, old);
  end if;

  select i.finalizada_en into v_finalizada_en
    from public.inspecciones i
   where i.id = v_inspeccion_id;

  if v_finalizada_en is not null then
    raise exception
      'La inspección % ya fue finalizada: su detalle no se puede modificar.',
      v_inspeccion_id
      using errcode = 'restrict_violation';
  end if;

  -- El borrado en cascada desde inspecciones (al descartar un borrador)
  -- también pasa por aquí, y pasa, porque un borrador nunca tiene
  -- finalizada_en.
  return coalesce(new, old);
end;
$$;

drop trigger if exists inspeccion_items_bloquear_finalizada on public.inspeccion_items;
create trigger inspeccion_items_bloquear_finalizada
  before insert or update or delete on public.inspeccion_items
  for each row
  execute function public.bloquear_hijo_de_inspeccion_finalizada();

drop trigger if exists evidencias_bloquear_finalizada on public.evidencias;
create trigger evidencias_bloquear_finalizada
  before insert or update or delete on public.evidencias
  for each row
  execute function public.bloquear_hijo_de_inspeccion_finalizada();

drop trigger if exists inspeccion_items_set_updated_at on public.inspeccion_items;
create trigger inspeccion_items_set_updated_at
  before update on public.inspeccion_items
  for each row
  execute function public.set_updated_at();

drop trigger if exists novedades_set_updated_at on public.novedades;
create trigger novedades_set_updated_at
  before update on public.novedades
  for each row
  execute function public.set_updated_at();

-- El bus debe estar operativo al abrir la inspección. No se puede
-- expresar con una FK (Postgres no tiene FK condicionales) ni con un
-- check (no puede consultar otra tabla), así que va en trigger. Solo se
-- valida en INSERT: si el bus se da de baja mañana, las actas de ayer
-- siguen siendo válidas.
create or replace function public.validar_bus_operativo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (select 1 from public.buses b where b.id = new.bus_id and b.activo) then
    raise exception 'El bus seleccionado no está activo en la flota.'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists inspecciones_validar_bus on public.inspecciones;
create trigger inspecciones_validar_bus
  before insert on public.inspecciones
  for each row
  execute function public.validar_bus_operativo();


-- ============================================================================
-- 12. Cálculo del cumplimiento y el semáforo
-- ============================================================================
-- Se evaluaron tres opciones:
--
--   A) COLUMNA GENERADA. Imposible: "generated always as" solo puede ver
--      columnas de la MISMA fila, y los conteos viven en la tabla hija.
--
--   B) TRIGGER sobre inspeccion_items que recalcule el padre en cada
--      cambio. Descartado: recalcularía muchas veces durante una
--      inspección normal, tomaría un lock sobre la fila padre en cada
--      tap (con riesgo real de contención si el conductor va rápido), y
--      produciría un porcentaje "en vivo" de una inspección a medias,
--      que no significa nada.
--
--   C) CÁLCULO EN LA APP al cerrar. Funciona, pero el número sería tan
--      confiable como el código de TypeScript, y el patrón
--      leer-calcular-escribir no es atómico: dos taps sobre "Finalizar"
--      podrían escribir resultados distintos.
--
-- GANA: función en la BD invocada desde la Server Action con supabase.rpc().
-- Cuenta y escribe en UNA sola sentencia, es atómica, es idempotente (el
-- "where finalizada_en is null" hace que la segunda llamada sea un no-op
-- que devuelve el acta ya cerrada) y la regla del semáforo queda escrita
-- en un solo lugar auditable. lib/inspeccion/calculo.ts implementa la
-- MISMA regla en TypeScript, en modo lectura/preview optimista mientras
-- el conductor sigue marcando ítems; esta función SQL es la que de
-- verdad se persiste.
--
-- SECURITY INVOKER (el default, a diferencia de rol_actual() en 0001):
-- así la RLS del que llama sigue aplicando y el "solo puedo cerrar MI
-- inspección" sale gratis de la policy inspecciones_update, sin tener que
-- reimplementar la verificación de propiedad aquí dentro.
create or replace function public.cerrar_inspeccion(p_inspeccion_id uuid)
returns public.inspecciones
language plpgsql
volatile
set search_path = ''
as $$
declare
  v_total smallint;
  v_correctos smallint;
  v_revision smallint;
  v_fuera smallint;
  v_pendientes smallint;
  v_inspeccion public.inspecciones;
begin
  select
    count(*)::smallint,
    count(*) filter (where it.estado = 'correcto')::smallint,
    count(*) filter (where it.estado = 'requiere_revision')::smallint,
    count(*) filter (where it.estado = 'fuera_de_servicio')::smallint,
    count(*) filter (where it.estado = 'sin_revisar')::smallint
  into v_total, v_correctos, v_revision, v_fuera, v_pendientes
  from public.inspeccion_items it
  where it.inspeccion_id = p_inspeccion_id;

  if v_total = 0 then
    raise exception 'La inspección no tiene ítems y no se puede finalizar.'
      using errcode = 'check_violation';
  end if;

  if v_pendientes > 0 then
    raise exception 'Todavía faltan % ítems por revisar.', v_pendientes
      using errcode = 'check_violation';
  end if;

  update public.inspecciones
     set total_items              = v_total,
         items_correctos          = v_correctos,
         items_requieren_revision = v_revision,
         items_fuera_de_servicio  = v_fuera,
         -- El denominador es v_total (los ítems REALMENTE creados), no
         -- 23: en una inspección rápida el 100% significa "el subconjunto
         -- rápido está completo", que es lo correcto.
         porcentaje_cumplimiento  = round(v_correctos::numeric * 100 / v_total, 2),
         -- El semáforo NO es un promedio. Un solo componente fuera de
         -- servicio pone el bus en rojo aunque los otros estén
         -- perfectos: no es "casi bien", es un bus que no sale.
         estado_general = case
           when v_fuera > 0    then 'rojo'::public.estado_general
           when v_revision > 0 then 'amarillo'::public.estado_general
           else                     'verde'::public.estado_general
         end,
         finalizada_en = now()
   where id = p_inspeccion_id
     and finalizada_en is null
  returning * into v_inspeccion;

  -- El UPDATE no tocó nada: o ya estaba cerrada (doble tap en
  -- "Finalizar", caso normal en celular), o la RLS la ocultó.
  if v_inspeccion.id is null then
    select * into v_inspeccion
      from public.inspecciones where id = p_inspeccion_id;

    if v_inspeccion.id is null then
      raise exception 'La inspección % no existe o no te pertenece.', p_inspeccion_id
        using errcode = 'insufficient_privilege';
    end if;
  end if;

  return v_inspeccion;
end;
$$;

comment on function public.cerrar_inspeccion(uuid) is
  'Cierra la inspección calculando conteos, porcentaje y semáforo en una sola sentencia atómica. Idempotente: la segunda llamada devuelve el acta ya cerrada sin error.';

grant execute on function public.cerrar_inspeccion(uuid) to authenticated;


-- ============================================================================
-- 13. Funciones auxiliares para las policies
-- ============================================================================
-- Las policies de las tablas hijas necesitan preguntar por el padre. Se
-- encapsula en funciones SECURITY DEFINER para (a) no repetir el mismo
-- subselect en varias policies y (b) tener control explícito sobre la
-- evaluación en vez de depender de que la RLS de inspecciones se aplique
-- anidada dentro de la RLS de inspeccion_items, que es correcto pero
-- sutil y difícil de razonar cuando algo falla.
create or replace function public.inspeccion_es_mia(p_inspeccion_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.inspecciones i
     where i.id = p_inspeccion_id
       and i.conductor_id = auth.uid()
  );
$$;

create or replace function public.inspeccion_abierta_mia(p_inspeccion_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.inspecciones i
     where i.id = p_inspeccion_id
       and i.conductor_id = auth.uid()
       and i.finalizada_en is null
  );
$$;

create or replace function public.novedad_editable_mia(p_novedad_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.novedades n
     where n.id = p_novedad_id
       and n.reportada_por = auth.uid()
       and n.estado = 'abierta'
  );
$$;


-- ============================================================================
-- 14. Proteger el flujo de resolución de novedades
-- ============================================================================
-- Mismo patrón y mismo motivo que proteger_columnas_privilegiadas en
-- 0001: la RLS de Postgres no filtra de forma fiable columna por columna
-- dentro de un mismo UPDATE. El conductor puede corregir la descripción
-- y el tipo de SU novedad mientras siga abierta, pero no puede
-- autodeclararla resuelta ni subirse la severidad a 'critica' para que
-- lo atiendan primero.
create or replace function public.proteger_resolucion_novedad()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.rol_actual() is distinct from 'admin' then
    new.estado          := old.estado;
    new.severidad       := old.severidad;
    new.resuelta_por    := old.resuelta_por;
    new.resuelta_en     := old.resuelta_en;
    new.nota_resolucion := old.nota_resolucion;
    new.bus_id          := old.bus_id;
    new.reportada_por   := old.reportada_por;
  end if;
  return new;
end;
$$;

drop trigger if exists novedades_proteger_resolucion on public.novedades;
create trigger novedades_proteger_resolucion
  before update on public.novedades
  for each row
  execute function public.proteger_resolucion_novedad();


-- ============================================================================
-- 15. Row Level Security
-- ============================================================================
-- Recordatorio: Supabase concede por default privileges SELECT/INSERT/
-- UPDATE/DELETE sobre las tablas nuevas de "public" a anon, authenticated
-- y service_role. Lo único que realmente filtra es la RLS, y el "to
-- authenticated" de cada policy es lo que deja a anon sin absolutamente
-- nada (sin policy, RLS deniega por defecto).

-- ---------------------------------------------------------------- buses
alter table public.buses enable row level security;

drop policy if exists "buses_select" on public.buses;
create policy "buses_select"
  on public.buses
  for select
  to authenticated
  using (
    -- La flota activa no es secreta: todo conductor necesita poder
    -- elegir su bus del día. Los dados de baja solo los ve el admin,
    -- para que no aparezcan en el selector.
    activo
    or public.rol_actual() = 'admin'
  );

drop policy if exists "buses_insert" on public.buses;
create policy "buses_insert"
  on public.buses
  for insert
  to authenticated
  with check (public.rol_actual() = 'admin');

drop policy if exists "buses_update" on public.buses;
create policy "buses_update"
  on public.buses
  for update
  to authenticated
  using (public.rol_actual() = 'admin')
  with check (public.rol_actual() = 'admin');

-- Sin policy de DELETE, a propósito y por el mismo motivo que profiles en
-- 0001: un bus nunca se borra físicamente porque hay actas de inspección
-- apuntándolo (de hecho el "on delete restrict" lo impediría). Las bajas
-- son buses.activo = false.

-- --------------------------------------------------------- inspecciones
alter table public.inspecciones enable row level security;

drop policy if exists "inspecciones_select" on public.inspecciones;
create policy "inspecciones_select"
  on public.inspecciones
  for select
  to authenticated
  using (
    conductor_id = auth.uid()
    or public.rol_actual() = 'admin'
  );

drop policy if exists "inspecciones_insert" on public.inspecciones;
create policy "inspecciones_insert"
  on public.inspecciones
  for insert
  to authenticated
  with check (
    -- Solo a nombre propio, ni siquiera el admin puede abrir un acta
    -- firmada por otro. El acta dice quién revisó el bus; si el admin
    -- pudiera crearla por un conductor, esa firma no valdría nada.
    conductor_id = auth.uid()
    -- No se puede nacer ya cerrada: el cierre pasa obligatoriamente por
    -- cerrar_inspeccion(), que es quien calcula los resultados.
    and finalizada_en is null
  );

drop policy if exists "inspecciones_update" on public.inspecciones;
create policy "inspecciones_update"
  on public.inspecciones
  for update
  to authenticated
  using (
    -- El USING de un UPDATE se evalúa contra la fila VIEJA, así que
    -- "finalizada_en is null" aquí significa "solo borradores". Es la
    -- primera de las dos barreras de inmutabilidad; la segunda, la que
    -- de verdad aguanta, es el trigger bloquear_inspeccion_finalizada
    -- (que también corre para service_role).
    conductor_id = auth.uid()
    and finalizada_en is null
  )
  with check (conductor_id = auth.uid());

-- El admin NO tiene UPDATE sobre inspecciones. Es deliberado: el admin
-- supervisa y consulta; si pudiera editar el acta de un conductor, el
-- documento perdería todo su valor probatorio.

drop policy if exists "inspecciones_delete" on public.inspecciones;
create policy "inspecciones_delete"
  on public.inspecciones
  for delete
  to authenticated
  using (
    -- Solo borradores propios. Es la vía de escape de "abrí una
    -- inspección del bus equivocado": se descarta y se abre de nuevo.
    -- Las actas cerradas no se borran ni siendo admin (lo refuerza el
    -- trigger).
    conductor_id = auth.uid()
    and finalizada_en is null
  );

-- ---------------------------------------------------- inspeccion_items
alter table public.inspeccion_items enable row level security;

drop policy if exists "inspeccion_items_select" on public.inspeccion_items;
create policy "inspeccion_items_select"
  on public.inspeccion_items
  for select
  to authenticated
  using (
    public.inspeccion_es_mia(inspeccion_id)
    or public.rol_actual() = 'admin'
  );

drop policy if exists "inspeccion_items_insert" on public.inspeccion_items;
create policy "inspeccion_items_insert"
  on public.inspeccion_items
  for insert
  to authenticated
  with check (public.inspeccion_abierta_mia(inspeccion_id));

drop policy if exists "inspeccion_items_update" on public.inspeccion_items;
create policy "inspeccion_items_update"
  on public.inspeccion_items
  for update
  to authenticated
  using (public.inspeccion_abierta_mia(inspeccion_id))
  with check (public.inspeccion_abierta_mia(inspeccion_id));

drop policy if exists "inspeccion_items_delete" on public.inspeccion_items;
create policy "inspeccion_items_delete"
  on public.inspeccion_items
  for delete
  to authenticated
  using (public.inspeccion_abierta_mia(inspeccion_id));
-- El delete existe sobre todo para el cambio de tipo "completa" ->
-- "rapida" a mitad de borrador, no para uso normal.

-- ------------------------------------------------------------ novedades
alter table public.novedades enable row level security;

drop policy if exists "novedades_select" on public.novedades;
create policy "novedades_select"
  on public.novedades
  for select
  to authenticated
  using (
    reportada_por = auth.uid()
    or public.rol_actual() = 'admin'
  );

drop policy if exists "novedades_insert" on public.novedades;
create policy "novedades_insert"
  on public.novedades
  for insert
  to authenticated
  with check (
    reportada_por = auth.uid()
    and estado = 'abierta'
    -- Si la ata a una inspección, tiene que ser suya (y puede ser una ya
    -- cerrada: reportar una novedad después de cerrar el acta es
    -- legítimo y no modifica el acta).
    and (inspeccion_id is null or public.inspeccion_es_mia(inspeccion_id))
  );

drop policy if exists "novedades_update" on public.novedades;
create policy "novedades_update"
  on public.novedades
  for update
  to authenticated
  using (
    -- El conductor corrige su reporte mientras nadie lo haya tomado.
    -- El admin gestiona cualquiera, en cualquier estado.
    (reportada_por = auth.uid() and estado = 'abierta')
    or public.rol_actual() = 'admin'
  )
  with check (
    (reportada_por = auth.uid() and estado = 'abierta')
    or public.rol_actual() = 'admin'
  );
-- Qué COLUMNAS puede tocar cada uno lo decide el trigger
-- proteger_resolucion_novedad, no esta policy (ver sección 14).

-- Sin policy de DELETE: una novedad reportada no se borra, se pasa a
-- 'descartada'. Borrarla escondería que alguien avisó de un problema.

-- ----------------------------------------------------------- evidencias
alter table public.evidencias enable row level security;

drop policy if exists "evidencias_select" on public.evidencias;
create policy "evidencias_select"
  on public.evidencias
  for select
  to authenticated
  using (
    -- Se compara contra subida_por y no contra el dueño de la inspección
    -- a propósito: así esta policy es EXACTAMENTE equivalente a la de
    -- storage.objects (sección 16), que solo puede mirar la primera
    -- carpeta de la ruta. Dos reglas con la misma forma no se
    -- desincronizan; la restricción ruta_pertenece_a_quien_sube ata las
    -- dos cosas.
    subida_por = auth.uid()
    or public.rol_actual() = 'admin'
  );

drop policy if exists "evidencias_insert" on public.evidencias;
create policy "evidencias_insert"
  on public.evidencias
  for insert
  to authenticated
  with check (
    subida_por = auth.uid()
    and (
      (inspeccion_item_id is not null and public.inspeccion_abierta_mia(inspeccion_id))
      or (novedad_id is not null and public.novedad_editable_mia(novedad_id))
    )
  );

drop policy if exists "evidencias_delete" on public.evidencias;
create policy "evidencias_delete"
  on public.evidencias
  for delete
  to authenticated
  using (subida_por = auth.uid());
-- El trigger bloquear_hijo_de_inspeccion_finalizada impide además
-- borrarla si el acta ya cerró.

-- Sin policy de UPDATE: una foto no se corrige, se borra y se sube otra.
-- La ruta apunta a un objeto inmutable de Storage; permitir UPDATE
-- abriría la puerta a reapuntar la fila a otro objeto.


-- ============================================================================
-- 16. Storage: bucket privado de evidencias
-- ============================================================================
-- Si el SQL Editor responde "must be owner of table objects", crea el
-- bucket y las policies desde el dashboard (Storage -> New bucket /
-- Policies); el texto de las expresiones es el mismo.
--
-- PRIVADO (public = false). Una foto de una inspección muestra la placa
-- del bus y a veces al conductor; con bucket público cualquiera que
-- adivine o filtre una URL la ve para siempre, sin sesión. Se sirven con
-- signed URLs de vida corta (ver lib/inspeccion/evidencias.ts).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'evidencias',
  'evidencias',
  false,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- file_size_limit y allowed_mime_types NO son cosmética: los valida el
-- servidor de Storage. Como la subida va directo del navegador a
-- Supabase (sin pasar por Next), esta es la ÚNICA defensa real contra
-- que alguien suba un video de 400 MB o un ejecutable renombrado a .jpg.
-- La validación en el cliente es solo UX.

-- CONVENCIÓN DE RUTAS
--   ítem de inspección: {conductor_id}/{inspeccion_id}/{codigo_componente}/{uuid}.webp
--   novedad suelta:     {conductor_id}/novedades/{novedad_id}/{uuid}.webp
--
-- El conductor_id va PRIMERO, antes que el inspeccion_id, y es la
-- decisión que hace que todo esto funcione. Motivo: una policy sobre
-- storage.objects solo puede ver bucket_id, name, owner y
-- storage.foldername(name). Con el uid primero, la regla es una
-- comparación de texto y, sobre todo, NO NECESITA QUE LA FILA DE
-- public.evidencias YA EXISTA. Eso es indispensable porque el orden real
-- es: el navegador sube el archivo -> luego la Server Action registra la
-- fila. Si la ruta empezara por inspeccion_id, la policy de INSERT
-- tendría que hacer un join contra public.inspecciones en cada objeto
-- subido, acoplando Storage al esquema de la app y pagando una consulta
-- por foto.

drop policy if exists "evidencias_storage_insert" on storage.objects;
create policy "evidencias_storage_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'evidencias'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "evidencias_storage_select" on storage.objects;
create policy "evidencias_storage_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'evidencias'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.rol_actual() = 'admin'
    )
  );

drop policy if exists "evidencias_storage_delete" on storage.objects;
create policy "evidencias_storage_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'evidencias'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Sin policy de UPDATE sobre storage.objects: los objetos de este bucket
-- son inmutables. Reemplazar el contenido de una evidencia sin cambiar su
-- ruta permitiría alterar la prueba de un acta ya cerrada sin dejar
-- rastro en public.evidencias.

-- ============================================================================
-- Nota de verificación
-- ============================================================================
-- La columna generada `fecha` (sección 4) exige que
-- (iniciada_en at time zone 'America/Bogota')::date sea IMMUTABLE. Lo es
-- en Postgres (la variante de dos argumentos de timezone() está marcada
-- inmutable). Si tu versión la rechazara, el reemplazo es:
--   fecha date not null default (now() at time zone 'America/Bogota')::date
-- más un "before insert" que la fije desde iniciada_en.
