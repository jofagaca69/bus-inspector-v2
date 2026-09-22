import Link from "next/link";
import { notFound } from "next/navigation";
import { requerirAdmin } from "@/lib/auth/dal";
import { obtenerPerfilConFicha } from "@/lib/auth/ficha";
import { TarjetaFicha } from "@/components/perfil/tarjeta-ficha";
import { FormularioFicha } from "@/app/(app)/perfil/formulario-ficha";

/**
 * Ficha de un conductor vista por un administrador. La lectura y la
 * edición usan el cliente de sesión: la RLS de profiles ya permite al admin
 * leer y actualizar cualquier perfil, así que no hace falta el cliente
 * service_role (a diferencia del listado de /admin/usuarios, que sí lo usa).
 */
export default async function PaginaFichaConductor({
  params,
}: PageProps<"/admin/usuarios/[id]">) {
  await requerirAdmin();
  const { id } = await params;

  const perfil = await obtenerPerfilConFicha(id);
  if (!perfil) notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/admin/usuarios"
          className="w-fit text-sm text-texto-suave hover:text-texto"
        >
          ‹ Conductores
        </Link>
        <h1 className="text-lg font-semibold">Ficha del conductor</h1>
        <p className="text-sm text-texto-suave">
          {perfil.activo ? "Cuenta activa" : "Cuenta inactiva"}
        </p>
      </div>

      <TarjetaFicha perfil={perfil} />

      <FormularioFicha ficha={perfil} perfilId={perfil.id} />
    </div>
  );
}
