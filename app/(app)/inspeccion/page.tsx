import { redirect } from "next/navigation";
import { obtenerPerfil } from "@/lib/auth/dal";
import { obtenerBusesActivos, obtenerInspeccionAbierta } from "@/lib/inspeccion/consultas";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { SelectorInicioInspeccion } from "@/components/inspeccion/selector-inicio-inspeccion";

/**
 * Punto de entrada del módulo. Si el conductor ya tiene una inspección en
 * curso (finalizada_en is null), redirige directo a ella: nunca debe ver
 * dos veces la pantalla de "elegir bus" para el mismo turno.
 */
export default async function PaginaInspeccion() {
  const perfil = await obtenerPerfil();
  const abierta = await obtenerInspeccionAbierta(perfil.id);

  if (abierta) {
    redirect(`/inspeccion/${abierta.id}`);
  }

  const buses = await obtenerBusesActivos();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Inspección diaria"
        subtitulo="Revisa el bus antes de salir a ruta"
      />
      <SelectorInicioInspeccion buses={buses} busAsignadoId={perfil.bus_id} />
    </div>
  );
}
