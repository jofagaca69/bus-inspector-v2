import { notFound } from "next/navigation";
import { obtenerPerfil } from "@/lib/auth/dal";
import {
  obtenerEvidenciasDeInspeccion,
  obtenerInspeccionPorId,
  obtenerItemsDeInspeccion,
  listarNovedadesDeInspeccion,
} from "@/lib/inspeccion/consultas";
import { firmarEvidencias } from "@/lib/inspeccion/evidencias";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { Icono } from "@/components/ui/icono";
import { Evaluacion } from "@/components/ui/evaluacion";
import { ResumenEstadistico } from "@/components/inspeccion/resumen-estadistico";
import { obtenerComponente } from "@/lib/datos/componentes";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";

const ESTADO_ETIQUETA: Record<string, string> = {
  correcto: "Correcto",
  requiere_revision: "Requiere revisión",
  fuera_de_servicio: "Fuera de servicio",
  sin_revisar: "Sin revisar",
};
const ESTADO_CLASE: Record<string, string> = {
  correcto: "bg-exito/15 text-exito",
  requiere_revision: "bg-atencion/15 text-atencion",
  fuera_de_servicio: "bg-error/15 text-error",
  sin_revisar: "bg-neutro/20 text-texto-suave",
};
const SEMAFORO_CLASE: Record<string, string> = {
  rojo: "bg-error/15 text-error",
  amarillo: "bg-atencion/15 text-atencion",
  verde: "bg-exito/15 text-exito",
};

/**
 * Detalle inmutable de un acta ya cerrada. Las evidencias se firman aquí
 * (Server Component, cliente de sesión): la página es dinámica porque
 * llama a cookies() a través de crearClienteServidor(), así que NUNCA
 * debe envolverse en "use cache" ni declarar `revalidate` — una signed
 * URL de 15 min cacheada más tiempo serviría imágenes rotas.
 */
export default async function PaginaDetalleHistorial({
  params,
}: PageProps<"/historial/[id]">) {
  const { id } = await params;
  const perfil = await obtenerPerfil();

  const inspeccion = await obtenerInspeccionPorId(id);
  if (!inspeccion) notFound();
  if (inspeccion.conductor_id !== perfil.id && perfil.rol !== "admin") notFound();

  const [items, evidencias, novedades] = await Promise.all([
    obtenerItemsDeInspeccion(id),
    obtenerEvidenciasDeInspeccion(id),
    listarNovedadesDeInspeccion(id),
  ]);

  const urlsFirmadas = await firmarEvidencias(evidencias.map((e) => e.ruta));

  const evidenciasPorItem = new Map<string, { ruta: string; url: string }[]>();
  for (const evidencia of evidencias) {
    if (!evidencia.inspeccion_item_id) continue;
    const url = urlsFirmadas.get(evidencia.ruta);
    if (!url) continue;
    const lista = evidenciasPorItem.get(evidencia.inspeccion_item_id) ?? [];
    lista.push({ ruta: evidencia.ruta, url });
    evidenciasPorItem.set(evidencia.inspeccion_item_id, lista);
  }

  const fecha = new Date(inspeccion.iniciada_en);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Detalle de inspección"
        subtitulo={`Bus ${inspeccion.bus?.numero_interno} · ${inspeccion.bus?.placa}`}
      />

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">
              {fecha.toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-texto-suave">
              {fecha.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })} ·{" "}
              {inspeccion.tipo === "rapida" ? "Check rápido" : "Inspección completa"}
              {inspeccion.kilometraje ? ` · ${inspeccion.kilometraje.toLocaleString("es-CO")} km` : ""}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold ${
              SEMAFORO_CLASE[inspeccion.estado_general ?? "verde"]
            }`}
          >
            {inspeccion.porcentaje_cumplimiento}%
          </span>
        </div>
        {inspeccion.observaciones && (
          <p className="mt-3 border-t border-borde pt-3 text-sm text-texto-suave">
            {inspeccion.observaciones}
          </p>
        )}
      </div>

      <ResumenEstadistico
        inspeccion={inspeccion}
        items={items}
        novedades={novedades}
        evidencias={evidencias}
        esAdmin={perfil.rol === "admin"}
      />

      {novedades.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Novedades reportadas</p>
          {novedades.map((novedad) => (
            <div key={novedad.id} className="rounded-lg border border-borde bg-superficie p-3 text-sm">
              <p className="font-medium">{novedad.descripcion}</p>
              <p className="mt-1 text-xs capitalize text-texto-suave">
                {novedad.tipo} · severidad {novedad.severidad} · {novedad.estado.replace("_", " ")}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Componentes ({items.length})</p>
        {items.map((item) => {
          const componente = obtenerComponente(item.codigo_componente);
          const fotos = evidenciasPorItem.get(item.id) ?? [];
          return (
            <div key={item.id} className="rounded-lg border border-borde bg-superficie p-3">
              <div className="flex items-center gap-3">
                {componente && (
                  <Icono nombre={componente.icono} className="h-5 w-5 shrink-0 text-texto-suave" />
                )}
                <span className="flex-1 text-sm font-medium">{item.nombre_componente}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${ESTADO_CLASE[item.estado]}`}
                >
                  {ESTADO_ETIQUETA[item.estado]}
                </span>
              </div>
              {item.nota && <p className="mt-2 text-xs text-texto-suave">{item.nota}</p>}
              {fotos.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {fotos.map((foto) => (
                    // eslint-disable-next-line @next/next/no-img-element -- signed URL de 15 min, next/image no debe cachearla
                    <img
                      key={foto.ruta}
                      src={foto.url}
                      alt={`Evidencia de ${item.nombre_componente}`}
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {inspeccion.conductor_id === perfil.id && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <Evaluacion preguntas={obtenerEvaluacion("inspeccion")} />
        </div>
      )}
    </div>
  );
}
