import "server-only";

import { cache } from "react";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { DIAS_AVISO_LICENCIA, hoyEnBogota } from "@/lib/auth/licencia";
import type { PerfilConFicha } from "@/lib/auth/tipos";

/**
 * Lecturas de la ficha del conductor. Como el resto del proyecto, usan el
 * cliente de sesión (nunca el admin): la RLS de profiles (0001_perfiles.sql)
 * es la garantía de que un conductor solo lea su propia ficha y un admin la
 * de cualquiera. Si la migración 0004 aún no se ha aplicado, las columnas
 * no existen y estas consultas devuelven vacío en vez de romper la página.
 */

/** Perfil con ficha de un usuario: el propio, o cualquiera si quien consulta es admin. */
export const obtenerPerfilConFicha = cache(
  async (id: string): Promise<PerfilConFicha | null> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle<PerfilConFicha>();
    return data ?? null;
  },
);

/**
 * Conductores activos con la licencia vencida o que vence dentro de
 * DIAS_AVISO_LICENCIA días, la más próxima primero. Para un admin son los de
 * toda la flota; para un conductor, la RLS deja solo su propio perfil.
 */
export const listarLicenciasPorVencer = cache(async (): Promise<PerfilConFicha[]> => {
  const hoy = hoyEnBogota();
  const limite = new Date(Date.parse(`${hoy}T00:00:00Z`) + DIAS_AVISO_LICENCIA * 86_400_000)
    .toISOString()
    .slice(0, 10);

  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("activo", true)
    .eq("rol", "conductor")
    .not("licencia_vence", "is", null)
    .lte("licencia_vence", limite)
    .order("licencia_vence", { ascending: true })
    .returns<PerfilConFicha[]>();
  return data ?? [];
});
