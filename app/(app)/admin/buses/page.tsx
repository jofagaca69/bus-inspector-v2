import { requerirAdmin } from "@/lib/auth/dal";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import type { Perfil } from "@/lib/auth/tipos";
import type { Bus } from "@/lib/inspeccion/tipos";
import { FormularioNuevoBus } from "@/app/(app)/admin/buses/formulario-nuevo";
import { BotonEstadoBus } from "@/app/(app)/admin/buses/boton-estado";
import { AsignarBus } from "@/app/(app)/admin/buses/asignar-bus";

export default async function PaginaBuses() {
  await requerirAdmin();

  // Cliente admin (service_role) solo para el listado completo: como
  // admin ya fue verificado arriba, es correcto ver toda la flota y
  // todos los conductores sin las restricciones de RLS pensadas para el
  // rol conductor. Mismo criterio que app/(app)/admin/usuarios/page.tsx.
  const supabaseAdmin = crearClienteAdmin();
  const [{ data: buses }, { data: conductores }] = await Promise.all([
    supabaseAdmin.from("buses").select("*").order("numero_interno").returns<Bus[]>(),
    supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("rol", "conductor")
      .order("nombre_completo")
      .returns<Perfil[]>(),
  ]);

  const busesActivos = (buses ?? []).filter((bus) => bus.activo);

  return (
    <div className="flex flex-1 flex-col gap-8 px-4 py-6">
      <div>
        <h1 className="text-lg font-semibold">Flota</h1>
        <p className="text-sm text-texto-suave">Buses y asignación a conductores.</p>
      </div>

      <FormularioNuevoBus />

      <div className="flex flex-col divide-y divide-borde rounded-lg border border-borde bg-superficie">
        {(buses ?? []).length === 0 && (
          <p className="px-4 py-6 text-sm text-texto-suave">Todavía no hay buses registrados.</p>
        )}

        {(buses ?? []).map((bus) => (
          <div key={bus.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div>
              <p className="text-sm font-medium">
                {bus.numero_interno} · {bus.placa}
              </p>
              <p className="text-xs text-texto-suave">
                {bus.modelo || "Sin modelo"} · {bus.activo ? "Activo" : "Inactivo"}
              </p>
            </div>
            <BotonEstadoBus id={bus.id} activo={bus.activo} />
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold">Bus asignado por conductor</h2>
        <div className="flex flex-col divide-y divide-borde rounded-lg border border-borde bg-superficie">
          {(conductores ?? []).length === 0 && (
            <p className="px-4 py-6 text-sm text-texto-suave">
              Todavía no hay conductores registrados.
            </p>
          )}

          {(conductores ?? []).map((conductor) => (
            <div key={conductor.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  {conductor.nombre_completo || "(sin nombre)"}
                </p>
                <p className="text-xs text-texto-suave">Cédula {conductor.cedula}</p>
              </div>
              <AsignarBus
                conductorId={conductor.id}
                busIdActual={conductor.bus_id}
                buses={busesActivos}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
