import Link from "next/link";
import { obtenerPerfil } from "@/lib/auth/dal";
import { cerrarSesion } from "@/lib/auth/acciones";
import { MenuLateral } from "@/components/navegacion/menu-lateral";

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
      <header className="flex items-center justify-between border-b border-borde bg-superficie px-4 py-3">
        <div className="flex items-center gap-3">
          <MenuLateral rol={perfil.rol} />
          <Link href="/inicio" className="text-sm font-semibold">
            Cootranszipa
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-texto-suave sm:inline">
            {perfil.nombre_completo || perfil.cedula}
          </span>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="text-sm font-medium text-texto-suave hover:text-texto"
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
