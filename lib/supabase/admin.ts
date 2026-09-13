import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la service_role key.
 *
 * ADVERTENCIA: este cliente ignora Row Level Security por completo y puede
 * leer y escribir cualquier fila de cualquier tabla. Úsalo únicamente
 * dentro de Server Actions que ya hayan verificado con requerirAdmin()
 * (ver lib/auth/dal.ts) que quien invoca la acción es un administrador.
 *
 * `import "server-only"` garantiza en build time que este módulo no puede
 * terminar en el bundle del navegador.
 */
export function crearClienteAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
