import { obtenerPerfil } from "@/lib/auth/dal";
import { listarNovedadesPendientes } from "@/lib/inspeccion/consultas";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { TarjetaNovedad } from "@/components/inspeccion/tarjeta-novedad";

/**
 * Centro de alertas: novedades abiertas o en proceso. No tiene tabla
 * propia de "alertas" — es una vista derivada de public.novedades (ver
 * supabase/migrations/0003_inspecciones.sql). RLS decide el alcance: el
 * conductor ve solo las suyas, el admin las de toda la flota.
 */
export default async function PaginaAlertas() {
  const perfil = await obtenerPerfil();
  const novedades = await listarNovedadesPendientes();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Centro de alertas"
        subtitulo={
          perfil.rol === "admin"
            ? "Novedades abiertas o en proceso de toda la flota"
            : "Tus novedades abiertas o en proceso"
        }
      />

      {novedades.length === 0 ? (
        <p className="text-sm text-texto-suave">No hay novedades pendientes.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {novedades.map((novedad) => (
            <TarjetaNovedad
              key={novedad.id}
              novedad={novedad}
              esAdmin={perfil.rol === "admin"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
