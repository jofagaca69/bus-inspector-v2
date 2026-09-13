import type { NextRequest } from "next/server";
import { actualizarSesion } from "@/lib/supabase/proxy";

// Next.js 16 renombró middleware.ts a proxy.ts (misma funcionalidad, mismo
// motor). Ver node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
export async function proxy(request: NextRequest) {
  return actualizarSesion(request);
}

export const config = {
  matcher: [
    // Excluye assets estáticos, optimización de imágenes e íconos/imágenes
    // servidos desde /public. Sin esto, el proxy corre también sobre CSS,
    // JS e imágenes y puede bloquear su carga.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
