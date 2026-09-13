-- Corrige handle_new_user(): crear un usuario desde el dashboard de
-- Supabase (Authentication -> Add user) no permite fijar user_metadata,
-- así que raw_user_meta_data->>'cedula' llega NULL y el insert en
-- profiles fallaba contra la restricción NOT NULL / el check de formato,
-- lo que GoTrue reporta como el genérico "Database error creating new
-- user". Ahora, si falta en los metadatos, se toma la parte local del
-- email (cedula@dominio) como respaldo, y si tampoco es válida se lanza
-- un mensaje de error claro en vez de un fallo silencioso de constraint.
--
-- Cómo aplicar: pega este archivo completo en el SQL Editor y ejecútalo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_cedula text;
begin
  v_cedula := new.raw_user_meta_data ->> 'cedula';

  if v_cedula is null or v_cedula = '' then
    -- Respaldo para usuarios creados a mano desde el dashboard (no exponen
    -- user_metadata): usa la parte del email antes de la @, que en este
    -- proyecto siempre debería ser la cédula (cedula@dominio).
    v_cedula := split_part(new.email, '@', 1);
  end if;

  if v_cedula !~ '^[0-9]{6,12}$' then
    raise exception
      'No se pudo crear el perfil: la cédula "%" debe tener entre 6 y 12 dígitos. '
      'Usa un email con el formato <cedula>@<dominio> (ej. 1012345678@cootranszipa.invalid) '
      'o define user_metadata.cedula al crear el usuario.',
      v_cedula;
  end if;

  insert into public.profiles (id, cedula, nombre_completo, rol)
  values (
    new.id,
    v_cedula,
    coalesce(nullif(new.raw_user_meta_data ->> 'nombre_completo', ''), v_cedula),
    coalesce((new.raw_user_meta_data ->> 'rol')::public.user_role, 'conductor')
  );
  return new;
end;
$$;
