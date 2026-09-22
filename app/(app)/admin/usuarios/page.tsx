import Link from "next/link";
import { requerirAdmin } from "@/lib/auth/dal";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import type { Perfil } from "@/lib/auth/tipos";
import { FormularioNuevoUsuario } from "@/app/(app)/admin/usuarios/formulario-nuevo";
import { BotonEstadoUsuario } from "@/app/(app)/admin/usuarios/boton-estado";

export default async function PaginaUsuarios() {
  await requerirAdmin();

  // Se usa el cliente admin (service_role) solo para el listado completo:
  // como admin ya fue verificado arriba, es correcto ver a todos los
  // usuarios sin las restricciones de RLS pensadas para el rol conductor.
  const supabaseAdmin = crearClienteAdmin();
  const { data: usuarios } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Perfil[]>();

  return (
    <div className="flex flex-1 flex-col gap-8 px-4 py-6">
      <div>
        <h1 className="text-lg font-semibold">Conductores</h1>
        <p className="text-sm text-texto-suave">
          Alta y gestión de las cuentas de los conductores.
        </p>
      </div>

      <FormularioNuevoUsuario />

      <div className="flex flex-col divide-y divide-borde rounded-lg border border-borde bg-superficie">
        {(usuarios ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-texto-suave">
            Todavía no hay conductores registrados.
          </p>
        )}

        {(usuarios ?? []).map((usuario) => (
          <div
            key={usuario.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <Link href={`/admin/usuarios/${usuario.id}`} className="min-w-0 flex-1 hover:opacity-80">
              <p className="text-sm font-medium">
                {usuario.nombre_completo || "(sin nombre)"}
              </p>
              <p className="text-xs text-texto-suave">
                Cédula {usuario.cedula} ·{" "}
                {usuario.rol === "admin" ? "Administrador" : "Conductor"} ·{" "}
                {usuario.activo ? "Activo" : "Inactivo"}
              </p>
              <p className="mt-0.5 text-[11px] text-acento">Ver ficha ›</p>
            </Link>

            {usuario.rol !== "admin" && (
              <BotonEstadoUsuario id={usuario.id} activo={usuario.activo} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
