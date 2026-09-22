import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { obtenerPerfil } from "@/lib/auth/dal";
import {
  obtenerEvidenciasDeInspeccion,
  obtenerInspeccionPorId,
  obtenerItemsDeInspeccion,
  listarNovedadesDeInspeccion,
} from "@/lib/inspeccion/consultas";
import { obtenerPerfilConFicha } from "@/lib/auth/ficha";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { ConductorLinea } from "@/components/inspeccion/conductor-linea";
import { ResumenEstadistico } from "@/components/inspeccion/resumen-estadistico";

/**
 * Pantalla a la que llega el conductor justo después de finalizar la
 * inspección (ver finalizarInspeccion en app/(app)/inspeccion/acciones.ts).
 * No firma URLs de evidencia (solo cuenta fotos), pero sí lee con el cliente
 * de sesión vía cookies(), así que es dinámica: no envolver en "use cache".
 */
export default async function PaginaResumenInspeccion({
  params,
}: PageProps<"/historial/[id]/resumen">) {
  const { id } = await params;
  const perfil = await obtenerPerfil();

  const inspeccion = await obtenerInspeccionPorId(id);
  if (!inspeccion) notFound();
  if (inspeccion.conductor_id !== perfil.id && perfil.rol !== "admin") notFound();
  // Un borrador no tiene resultados que resumir: se sigue en la pantalla de captura.
  if (!inspeccion.finalizada_en) redirect(`/inspeccion/${id}`);

  const [items, evidencias, novedades, conductor] = await Promise.all([
    obtenerItemsDeInspeccion(id),
    obtenerEvidenciasDeInspeccion(id),
    listarNovedadesDeInspeccion(id),
    obtenerPerfilConFicha(inspeccion.conductor_id),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Inspección finalizada"
        subtitulo={`Bus ${inspeccion.bus?.numero_interno} · ${inspeccion.bus?.placa}`}
      />

      <ConductorLinea perfil={conductor} />

      <ResumenEstadistico
        inspeccion={inspeccion}
        items={items}
        novedades={novedades}
        evidencias={evidencias}
        esAdmin={perfil.rol === "admin"}
        detallado
      />

      <div className="flex flex-col gap-2">
        <Link
          href={`/historial/${id}`}
          className="rounded-xl bg-acento px-4 py-3 text-center text-sm font-semibold text-fondo"
        >
          Ver acta completa con fotos
        </Link>
        <Link
          href="/inicio"
          className="rounded-xl border border-borde px-4 py-3 text-center text-sm font-medium text-texto-suave hover:text-texto"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
