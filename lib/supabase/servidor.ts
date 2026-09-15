import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route
 * Handlers. Lee la sesión desde las cookies de la petición.
 *
 * Nota: escribir cookies (setAll) durante el render de un Server Component
 * lanza un error en Next.js — solo está permitido en Server Actions y Route
 * Handlers. El try/catch cubre ese caso; cuando el proxy ya refresca la
 * sesión en cada petición, ese error es inofensivo de ignorar aquí.
 */
export async function crearClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Se llamó desde un Server Component durante el render.
            // El proxy (proxy.ts) ya se encarga de refrescar y propagar
            // la sesión en cada petición, así que esto es seguro de ignorar.
          }
        },
      },
    },
  );
}
