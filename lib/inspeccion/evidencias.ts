import "server-only";

import { crearClienteServidor } from "@/lib/supabase/servidor";

/**
 * El bucket "evidencias" es privado (ver supabase/migrations/0003_inspecciones.sql,
 * sección 16): las fotos nunca se sirven por URL pública. Este helper
 * firma rutas para lectura de corta duración.
 *
 * Usa el cliente de SESIÓN (crearClienteServidor), nunca crearClienteAdmin():
 * así la policy evidencias_storage_select vuelve a verificar la
 * propiedad en el momento de firmar. Si este código tuviera un bug de
 * filtrado, la policy de RLS lo atajaría igual.
 *
 * TTL corto (15 min): una signed URL es un bearer token en el query
 * string, quien la copie la usa sin sesión hasta que expire. Por la
 * misma razón, la página que las use debe ser dinámica (ya lo es: llama
 * a cookies() vía crearClienteServidor) y NUNCA debe envolverse en
 * `unstable_cache`/`"use cache"`: cachear una URL que expira sirve
 * imágenes rotas el resto de la ventana de caché.
 */
const TTL_SEGUNDOS = 900;

export async function firmarEvidencias(rutas: string[]): Promise<Map<string, string>> {
  const mapa = new Map<string, string>();
  if (rutas.length === 0) return mapa;

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.storage
    .from("evidencias")
    .createSignedUrls(rutas, TTL_SEGUNDOS);

  if (error || !data) return mapa;

  for (const item of data) {
    if (item.signedUrl && !item.error) {
      mapa.set(item.path ?? "", item.signedUrl);
    }
  }
  return mapa;
}
