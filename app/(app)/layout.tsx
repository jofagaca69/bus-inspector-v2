import Link from "next/link";
import { obtenerPerfil } from "@/lib/auth/dal";
import { cerrarSesion } from "@/lib/auth/acciones";

// Nota: este layout SÍ llama a obtenerPerfil() para mostrar el nombre del
// usuario en la cabecera, pero eso no reemplaza el control de acceso de
// cada página. Por Partial Rendering, un layout no se vuelve a ejecutar en
// cada navegación entre sus rutas hijas, así que la verificación real de
// sesión y rol vive en cada page.tsx (a través del DAL), no aquí.
export default async function LayoutApp({
  children,
}: LayoutProps<"/">) {
  const perfil = await obtenerPerfil();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/15">
        <Link href="/inicio" className="text-sm font-semibold">
          Cootranszipa
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-foreground/60 sm:inline">
            {perfil.nombre_completo || perfil.cedula}
          </span>
          {perfil.rol === "admin" && (
            <Link
              href="/admin/usuarios"
              className="text-sm font-medium underline underline-offset-2"
            >
              Usuarios
            </Link>
          )}
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="text-sm font-medium text-foreground/70 hover:text-foreground"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
