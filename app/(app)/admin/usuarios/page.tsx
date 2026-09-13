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
        <p className="text-sm text-foreground/60">
          Alta y gestión de las cuentas de los conductores.
        </p>
      </div>

      <FormularioNuevoUsuario />

      <div className="flex flex-col divide-y divide-black/10 rounded-lg border border-black/10 dark:divide-white/10 dark:border-white/15">
        {(usuarios ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-foreground/60">
            Todavía no hay conductores registrados.
          </p>
        )}

        {(usuarios ?? []).map((usuario) => (
          <div
            key={usuario.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">
                {usuario.nombre_completo || "(sin nombre)"}
              </p>
              <p className="text-xs text-foreground/60">
                Cédula {usuario.cedula} ·{" "}
                {usuario.rol === "admin" ? "Administrador" : "Conductor"} ·{" "}
                {usuario.activo ? "Activo" : "Inactivo"}
              </p>
            </div>

            {usuario.rol !== "admin" && (
              <BotonEstadoUsuario id={usuario.id} activo={usuario.activo} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
