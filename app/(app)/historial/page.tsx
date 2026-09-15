import { obtenerPerfil } from "@/lib/auth/dal";
import { listarHistorialFlota, listarHistorialPropio } from "@/lib/inspeccion/consultas";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { TarjetaHistorial } from "@/components/inspeccion/tarjeta-historial";

/**
 * El admin ve el historial de TODA la flota (RLS se lo permite); el
 * conductor solo el propio. Es la misma diferenciación por rol que
 * app/(app)/admin/usuarios usa para gestión de cuentas.
 */
export default async function PaginaHistorial() {
  const perfil = await obtenerPerfil();
  const esAdmin = perfil.rol === "admin";

  const inspecciones = esAdmin
    ? await listarHistorialFlota()
    : await listarHistorialPropio(perfil.id);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Historial de inspecciones"
        subtitulo={esAdmin ? "Toda la flota" : "Tus inspecciones anteriores"}
      />

      {inspecciones.length === 0 ? (
        <p className="text-sm text-texto-suave">Todavía no hay inspecciones finalizadas.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {inspecciones.map((inspeccion) => (
            <TarjetaHistorial
              key={inspeccion.id}
              inspeccion={inspeccion}
              mostrarConductor={esAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
