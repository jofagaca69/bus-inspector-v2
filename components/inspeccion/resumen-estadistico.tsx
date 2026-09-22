import { BarraProgreso } from "@/components/inspeccion/barra-progreso";
import { cx } from "@/lib/utils";
import { obtenerComponente } from "@/lib/datos/componentes";
import type { Criticidad } from "@/lib/datos/tipos";
import {
  conNovedad,
  contarFallasPorComponente,
  diferenciaConAnterior,
  duracionMinutos,
  formatearDuracion,
  resumirPorCriticidad,
  resumirPorZona,
  type ConteoEstados,
} from "@/lib/inspeccion/calculo";
import {
  listarHistorialDeBus,
  listarItemsConNovedad,
  listarNovedadesAbiertasDeBus,
} from "@/lib/inspeccion/consultas";
import type {
  EstadoGeneralInspeccion,
  Evidencia,
  InspeccionConBus,
  InspeccionItem,
  Novedad,
  SeveridadNovedad,
} from "@/lib/inspeccion/tipos";

/**
 * Resumen estadístico de un acta CERRADA. Es un Server Component asíncrono
 * que trae por sí mismo el contexto histórico del bus, para poder montarse
 * igual en /historial/[id]/resumen (destino al finalizar) y arriba del
 * detalle del acta.
 *
 * El veredicto (porcentaje y semáforo) se LEE de la fila de la inspección:
 * es la fotografía firmada al cierre y no se recalcula desde el catálogo.
 * Todo lo demás (criticidad, zonas, comparativa) se deriva en lectura con
 * las funciones puras de lib/inspeccion/calculo.ts. Los gráficos son div +
 * porcentajes de Tailwind: el repo no usa librerías de charts (ver
 * barra-progreso.tsx).
 */

const SEMAFORO: Record<EstadoGeneralInspeccion, { etiqueta: string; clase: string }> = {
  verde: { etiqueta: "Sin novedades", clase: "bg-exito/15 text-exito" },
  amarillo: { etiqueta: "Con observaciones", clase: "bg-atencion/15 text-atencion" },
  rojo: { etiqueta: "Componentes fuera de servicio", clase: "bg-error/15 text-error" },
};

const COLOR_BARRA: Record<EstadoGeneralInspeccion, string> = {
  verde: "bg-exito",
  amarillo: "bg-atencion",
  rojo: "bg-error",
};

const CRITICIDAD: { clave: Criticidad; etiqueta: string }[] = [
  { clave: "rojo", etiqueta: "Críticos" },
  { clave: "amarillo", etiqueta: "Importantes" },
  { clave: "verde", etiqueta: "Complementarios" },
];

const SEVERIDAD_CLASE: Record<SeveridadNovedad, string> = {
  baja: "bg-neutro/20 text-texto-suave",
  media: "bg-atencion/15 text-atencion",
  alta: "bg-error/15 text-error",
  critica: "bg-error text-fondo",
};
const SEVERIDADES: SeveridadNovedad[] = ["critica", "alta", "media", "baja"];

const ESTADO_ETIQUETA = {
  requiere_revision: "Requiere revisión",
  fuera_de_servicio: "Fuera de servicio",
} as const;
const ESTADO_CLASE = {
  requiere_revision: "bg-atencion/15 text-atencion",
  fuera_de_servicio: "bg-error/15 text-error",
} as const;

const VISTA_ETIQUETA = { lateral: "lateral", frontal: "frontal", trasera: "trasera" } as const;

function plural(n: number, singular: string, pluralForma: string): string {
  return `${n} ${n === 1 ? singular : pluralForma}`;
}

function fechaCorta(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    timeZone: "America/Bogota",
  });
}

export async function ResumenEstadistico({
  inspeccion,
  items,
  novedades,
  evidencias,
  esAdmin,
  detallado = false,
}: {
  inspeccion: InspeccionConBus;
  items: InspeccionItem[];
  novedades: Novedad[];
  evidencias: Evidencia[];
  esAdmin: boolean;
  /** Agrega la lista de ítems no conformes (la usa la pantalla post-cierre). */
  detallado?: boolean;
}) {
  const { finalizada_en, porcentaje_cumplimiento, estado_general } = inspeccion;
  if (finalizada_en === null || porcentaje_cumplimiento === null || estado_general === null) {
    return null;
  }

  const [anteriores, abiertasDelBus] = await Promise.all([
    listarHistorialDeBus(inspeccion.bus_id, inspeccion.iniciada_en, 8),
    listarNovedadesAbiertasDeBus(inspeccion.bus_id),
  ]);
  const itemsConNovedad = await listarItemsConNovedad([
    inspeccion.id,
    ...anteriores.map((a) => a.id),
  ]);

  const conteo: ConteoEstados = {
    total: inspeccion.total_items ?? items.length,
    correcto: inspeccion.items_correctos ?? 0,
    requiere_revision: inspeccion.items_requieren_revision ?? 0,
    fuera_de_servicio: inspeccion.items_fuera_de_servicio ?? 0,
  };

  const porCriticidad = resumirPorCriticidad(items);
  const zonasConNovedad = resumirPorZona(items).filter((z) => conNovedad(z.conteo) > 0);
  const criticosFuera = items.filter(
    (i) =>
      i.estado === "fuera_de_servicio" &&
      obtenerComponente(i.codigo_componente)?.criticidad === "rojo",
  );
  const noConformes = items.filter(
    (i) => i.estado === "requiere_revision" || i.estado === "fuera_de_servicio",
  );

  const fotosPorItem = new Map<string, number>();
  for (const e of evidencias) {
    if (!e.inspeccion_item_id) continue;
    fotosPorItem.set(e.inspeccion_item_id, (fotosPorItem.get(e.inspeccion_item_id) ?? 0) + 1);
  }

  const anterior = anteriores[0] ?? null;
  const diferencia = diferenciaConAnterior(
    porcentaje_cumplimiento,
    anterior?.porcentaje_cumplimiento ?? null,
  );
  const kmRecorridos =
    inspeccion.kilometraje !== null &&
    anterior?.kilometraje !== null &&
    anterior?.kilometraje !== undefined &&
    inspeccion.kilometraje >= anterior.kilometraje
      ? inspeccion.kilometraje - anterior.kilometraje
      : null;

  // Serie cronológica (izquierda = más antigua) que termina en el acta actual.
  const serie = [...anteriores].reverse().concat(inspeccion);
  const fallas = contarFallasPorComponente(itemsConNovedad);
  const arrastradas = abiertasDelBus.filter((n) => n.inspeccion_id !== inspeccion.id);

  const novedadesPorSeveridad = SEVERIDADES.map((s) => ({
    severidad: s,
    cantidad: novedades.filter((n) => n.severidad === s).length,
  })).filter((s) => s.cantidad > 0);

  return (
    <section className="flex flex-col gap-4" aria-label="Resumen estadístico de la inspección">
      {/* A — Veredicto */}
      <div className="rounded-xl border border-borde bg-superficie p-4">
        <div className="flex items-center gap-4">
          <BarraProgreso
            porcentaje={porcentaje_cumplimiento}
            tamano={96}
            grosor={8}
            etiqueta="correctos"
          />
          <div className="flex min-w-0 flex-col gap-2">
            <span
              className={cx(
                "w-fit rounded-full px-3 py-1 text-xs font-bold",
                SEMAFORO[estado_general].clase,
              )}
            >
              {SEMAFORO[estado_general].etiqueta}
            </span>
            <p className="text-sm text-texto-suave">
              {conteo.correcto} de {plural(conteo.total, "componente", "componentes")} en buen
              estado.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <BarraSegmentada conteo={conteo} alto="h-3" />
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-texto-suave">
            <Leyenda color="bg-exito" texto={`${conteo.correcto} correctos`} />
            <Leyenda color="bg-atencion" texto={`${conteo.requiere_revision} por revisar`} />
            <Leyenda color="bg-error" texto={`${conteo.fuera_de_servicio} fuera de servicio`} />
          </ul>
        </div>

        {criticosFuera.length > 0 && (
          <p className="mt-4 rounded-lg border border-error/40 bg-error/10 p-3 text-sm text-error">
            ⚠️ Componente crítico fuera de servicio:{" "}
            {criticosFuera.map((i) => i.nombre_componente).join(", ")}. El vehículo no debe
            operar hasta repararlo.
          </p>
        )}
      </div>

      {/* Datos rápidos */}
      <div className="grid grid-cols-3 gap-2">
        <Dato
          etiqueta="Duración"
          valor={formatearDuracion(duracionMinutos(inspeccion.iniciada_en, finalizada_en))}
        />
        <Dato etiqueta="Fotos" valor={String(evidencias.length)} />
        <Dato etiqueta="Novedades" valor={String(novedades.length)} />
      </div>

      {/* B — Desglose */}
      <div className="rounded-xl border border-borde bg-superficie p-4">
        <h2 className="text-sm font-semibold">Por criticidad del componente</h2>
        <div className="mt-3 flex flex-col gap-3">
          {CRITICIDAD.map(({ clave, etiqueta }) => {
            const c = porCriticidad[clave];
            if (c.total === 0) return null;
            return (
              <div key={clave} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-medium">{etiqueta}</span>
                  <span className="text-texto-suave">
                    {conNovedad(c) === 0
                      ? `${c.total} de ${c.total} correctos`
                      : `${conNovedad(c)} con novedad de ${c.total}`}
                  </span>
                </div>
                <BarraSegmentada conteo={c} alto="h-2" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <h2 className="text-sm font-semibold">Zonas del bus con novedad</h2>
        {zonasConNovedad.length === 0 ? (
          <p className="mt-2 text-sm text-texto-suave">Ninguna zona presentó novedades. 👌</p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-borde">
            {zonasConNovedad.map((zona) => (
              <li
                key={zona.id}
                className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <span className="flex min-w-0 items-center gap-2 text-sm">
                  <span
                    className={cx(
                      "h-2.5 w-2.5 shrink-0 rounded-full",
                      zona.peor === "fuera_de_servicio" ? "bg-error" : "bg-atencion",
                    )}
                  />
                  <span className="truncate">{zona.etiqueta}</span>
                  <span className="shrink-0 text-xs text-texto-suave">
                    ({VISTA_ETIQUETA[zona.vista]})
                  </span>
                </span>
                <span className="shrink-0 text-xs text-texto-suave">
                  {conNovedad(zona.conteo)} de {zona.conteo.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {novedadesPorSeveridad.length > 0 && (
        <div className="rounded-xl border border-borde bg-superficie p-4">
          <h2 className="text-sm font-semibold">Novedades reportadas por severidad</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {novedadesPorSeveridad.map(({ severidad, cantidad }) => (
              <li
                key={severidad}
                className={cx(
                  "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                  SEVERIDAD_CLASE[severidad],
                )}
              >
                {cantidad} {severidad}
              </li>
            ))}
          </ul>
        </div>
      )}

      {detallado && noConformes.length > 0 && (
        <div className="rounded-xl border border-borde bg-superficie p-4">
          <h2 className="text-sm font-semibold">Componentes por atender</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {noConformes.map((item) => {
              const estado = item.estado as keyof typeof ESTADO_ETIQUETA;
              const fotos = fotosPorItem.get(item.id) ?? 0;
              return (
                <li key={item.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{item.nombre_componente}</span>
                    <span
                      className={cx(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        ESTADO_CLASE[estado],
                      )}
                    >
                      {ESTADO_ETIQUETA[estado]}
                    </span>
                  </div>
                  {item.nota && <p className="text-xs text-texto-suave">{item.nota}</p>}
                  {fotos > 0 && (
                    <p className="text-xs text-texto-suave">
                      📷 {plural(fotos, "foto", "fotos")} en el acta
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* C — Comparativa con el historial del bus */}
      <div className="rounded-xl border border-borde bg-superficie p-4">
        <h2 className="text-sm font-semibold">Evolución de este bus</h2>
        <p className="mt-1 text-xs text-texto-suave">
          {esAdmin
            ? "Últimas inspecciones cerradas de este vehículo."
            : "Tus últimas inspecciones cerradas de este vehículo."}
        </p>

        {anterior === null ? (
          <p className="mt-3 text-sm text-texto-suave">
            Es la primera inspección registrada de este bus: desde la próxima verás cómo evoluciona.
          </p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {diferencia !== null && (
                <span
                  className={cx(
                    "font-semibold",
                    diferencia > 0 && "text-exito",
                    diferencia < 0 && "text-error",
                    diferencia === 0 && "text-texto-suave",
                  )}
                >
                  {diferencia > 0 ? "▲ +" : diferencia < 0 ? "▼ " : "= "}
                  {diferencia} pts
                  <span className="font-normal text-texto-suave"> vs. la anterior</span>
                </span>
              )}
              {kmRecorridos !== null && (
                <span className="text-texto-suave">
                  {kmRecorridos.toLocaleString("es-CO")} km desde la anterior
                </span>
              )}
            </div>

            <ol className="mt-4 flex items-end gap-1.5" aria-label="Porcentaje por inspección">
              {serie.map((acta) => {
                const pct = acta.porcentaje_cumplimiento ?? 0;
                const actual = acta.id === inspeccion.id;
                return (
                  <li key={acta.id} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-24 w-full items-end">
                      <div
                        className={cx(
                          "w-full rounded-t",
                          COLOR_BARRA[acta.estado_general ?? "verde"],
                          actual ? "opacity-100 ring-2 ring-texto" : "opacity-70",
                        )}
                        style={{ height: `${Math.max(4, pct)}%` }}
                        title={`${fechaCorta(acta.iniciada_en)}: ${Math.round(pct)}%`}
                      />
                    </div>
                    <span className="text-[10px] font-semibold">{Math.round(pct)}%</span>
                    <span className="text-[10px] text-texto-suave">
                      {actual ? "Hoy" : fechaCorta(acta.iniciada_en)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <h2 className="text-sm font-semibold">Componentes que más fallan en este bus</h2>
        {fallas.length === 0 ? (
          <p className="mt-2 text-sm text-texto-suave">
            Ningún componente con novedad en {plural(serie.length, "inspección", "inspecciones")}.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {fallas.map((falla) => (
              <li key={falla.codigo} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="text-sm font-medium">{falla.nombre}</span>
                  <span className="shrink-0 text-texto-suave">
                    {falla.veces} de {serie.length}
                    {falla.fueraDeServicio > 0 && ` · ${falla.fueraDeServicio} fuera de servicio`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-superficie-2">
                  <div
                    className={cx(
                      "h-full rounded-full",
                      falla.fueraDeServicio > 0 ? "bg-error" : "bg-atencion",
                    )}
                    style={{ width: `${(falla.veces / serie.length) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {arrastradas.length > 0 && (
        <div className="rounded-xl border border-borde bg-superficie p-4">
          <h2 className="text-sm font-semibold">
            {plural(arrastradas.length, "novedad abierta", "novedades abiertas")} de este bus
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {arrastradas.slice(0, 5).map((novedad) => (
              <li key={novedad.id} className="flex items-start gap-2 text-sm">
                <span
                  className={cx(
                    "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                    SEVERIDAD_CLASE[novedad.severidad],
                  )}
                >
                  {novedad.severidad}
                </span>
                <span className="line-clamp-2">{novedad.descripcion}</span>
              </li>
            ))}
          </ul>
          {arrastradas.length > 5 && (
            <p className="mt-2 text-xs text-texto-suave">
              y {arrastradas.length - 5} más en el centro de alertas.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function BarraSegmentada({ conteo, alto }: { conteo: ConteoEstados; alto: string }) {
  if (conteo.total === 0) return null;
  const ancho = (n: number) => `${(n / conteo.total) * 100}%`;
  return (
    <div
      className={cx("flex w-full overflow-hidden rounded-full bg-superficie-2", alto)}
      role="img"
      aria-label={`${conteo.correcto} correctos, ${conteo.requiere_revision} por revisar, ${conteo.fuera_de_servicio} fuera de servicio`}
    >
      <div className="bg-exito" style={{ width: ancho(conteo.correcto) }} />
      <div className="bg-atencion" style={{ width: ancho(conteo.requiere_revision) }} />
      <div className="bg-error" style={{ width: ancho(conteo.fuera_de_servicio) }} />
    </div>
  );
}

function Leyenda({ color, texto }: { color: string; texto: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span className={cx("h-2.5 w-2.5 rounded-full", color)} />
      {texto}
    </li>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-xl border border-borde bg-superficie px-3 py-3 text-center">
      <p className="text-base font-bold leading-tight">{valor}</p>
      <p className="mt-1 text-[11px] text-texto-suave">{etiqueta}</p>
    </div>
  );
}
