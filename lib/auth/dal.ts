import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import type { PerfilConFicha } from "@/lib/auth/tipos";

/**
 * Data Access Layer de autenticación.
 *
 * Centraliza aquí, y solo aquí, las verificaciones de sesión y rol. Los
 * checks de autenticación NO deben hacerse en layout.tsx: por Partial
 * Rendering los layouts no se vuelven a ejecutar en cada navegación, así
 * que un chequeo ahí no protege cada cambio de ruta. Tampoco basta con el
 * proxy: las Server Actions se invocan como POST a la ruta donde se
 * definen, y un matcher del proxy que excluya esa ruta dejaría la acción
 * sin protección. Por eso cada Server Action de administración llama
 * requerirAdmin() como primera línea, además de la protección del proxy.
 *
 * cache() de React memoiza el resultado durante un mismo render, así que
 * llamar obtenerPerfil() varias veces en el árbol de componentes de una
 * misma petición no repite la consulta.
 */

export const obtenerUsuario = cache(async () => {
  const supabase = await crearClienteServidor();

  // Nunca usar getSession() aquí: solo lee la cookie, que el cliente
  // podría falsificar. getUser() valida el token contra el servidor de
  // Auth de Supabase en cada llamada.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
});

/**
 * Exige que haya una sesión válida. Redirige a /login si no la hay.
 */
export const verificarSesion = cache(async () => {
  const user = await obtenerUsuario();

  if (!user) {
    redirect("/login");
  }

  return user;
});

/**
 * Trae el perfil de negocio (tabla profiles) del usuario autenticado.
 * Si el usuario fue dado de baja (activo = false) desde el panel de admin,
 * cierra la sesión y redirige a /login inmediatamente: una baja hecha por
 * el admin surte efecto en la siguiente petición del conductor, sin
 * esperar a que expire su token.
 */
export const obtenerPerfil = cache(async (): Promise<PerfilConFicha> => {
  const user = await verificarSesion();
  const supabase = await crearClienteServidor();

  const { data: perfil } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<PerfilConFicha>();

  if (!perfil || !perfil.activo) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  return perfil;
});

/**
 * Exige que el usuario autenticado sea administrador. Redirige a /inicio
 * en caso contrario (no revela al conductor que la ruta existe).
 */
export const requerirAdmin = cache(async (): Promise<PerfilConFicha> => {
  const perfil = await obtenerPerfil();

  if (perfil.rol !== "admin") {
    redirect("/inicio");
  }

  return perfil;
});
