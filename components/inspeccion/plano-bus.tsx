"use client";

import { cx } from "@/lib/utils";
import type { EstadoItem, VistaBus, ZonaBus } from "@/lib/datos/tipos";

const IMAGENES: Record<VistaBus, { src: string; ancho: number; alto: number; alt: string }> = {
  lateral: { src: "/buses/lateral.png", ancho: 1400, alto: 591, alt: "Vista lateral del bus" },
  frontal: { src: "/buses/frontal.png", ancho: 1087, alto: 1100, alt: "Vista frontal del bus" },
  trasera: { src: "/buses/trasera.png", ancho: 917, alto: 1100, alt: "Vista trasera del bus" },
};

const ESTADO_CLASE: Record<EstadoItem, string> = {
  sin_revisar: "bg-neutro border-neutro/60",
  correcto: "bg-exito border-exito/60",
  requiere_revision: "bg-atencion border-atencion/60",
  fuera_de_servicio: "bg-error border-error/60",
};

/**
 * Modelo 2D interactivo: 3 fotos (public/buses/) con hotspots táctiles
 * encima. Los 13 componentes que no se ven desde afuera (motor, frenos,
 * botiquín, etc.) se anclan al punto exterior más cercano; una zona
 * puede agrupar varios componentes (ver lib/datos/zonas-bus.ts), en cuyo
 * caso el color mostrado es el PEOR estado del grupo.
 *
 * Las coordenadas de zonasBus son un punto de partida: en desarrollo, un
 * clic sobre la imagen imprime {x, y} en consola para calibrarlas contra
 * las fotos reales. Ese modo no corre en producción.
 */
export function PlanoBus({
  vista,
  onCambiarVista,
  zonas,
  estados,
  onSeleccionarZona,
  zonaResaltadaId,
}: {
  vista: VistaBus;
  onCambiarVista: (vista: VistaBus) => void;
  zonas: ZonaBus[];
  estados: Record<string, EstadoItem>;
  onSeleccionarZona: (zona: ZonaBus) => void;
  zonaResaltadaId?: string;
}) {
  const imagen = IMAGENES[vista];

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Vista del bus" className="flex gap-2">
        {(["lateral", "frontal", "trasera"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={vista === v}
            onClick={() => onCambiarVista(v)}
            className={cx(
              "flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
              vista === v
                ? "border-acento bg-acento-suave text-acento"
                : "border-borde bg-superficie-2 text-texto-suave",
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <div
        className="relative w-full overflow-hidden rounded-xl border border-borde bg-superficie-2"
        style={{ aspectRatio: `${imagen.ancho} / ${imagen.alto}` }}
        onClick={
          process.env.NODE_ENV === "development"
            ? (evento) => {
                const rect = evento.currentTarget.getBoundingClientRect();
                const x = Math.round(((evento.clientX - rect.left) / rect.width) * 100);
                const y = Math.round(((evento.clientY - rect.top) / rect.height) * 100);
                // Herramienta de calibración, solo en desarrollo: imprime
                // el punto exacto tocado para ajustar zonas-bus.ts.
                console.log(`[calibración ${vista}]`, { x, y });
              }
            : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- foto de referencia a ancho completo del contenedor, next/image no aporta aquí */}
        <img src={imagen.src} alt={imagen.alt} className="h-full w-full object-contain" />

        {zonas.map((zona) => {
          const estado = peorEstado(zona.componentes, estados);
          const resaltada = zona.id === zonaResaltadaId;
          return (
            <button
              key={zona.id}
              type="button"
              onClick={() => onSeleccionarZona(zona)}
              aria-label={`${zona.etiqueta} — ${etiquetaEstado(estado)}`}
              className={cx(
                "absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 shadow-sm",
                ESTADO_CLASE[estado],
                resaltada &&
                  "ring-4 ring-marca ring-offset-2 ring-offset-superficie-2 animate-[pulse-soft_1.6s_ease-in-out_infinite]",
              )}
              style={{ left: `${zona.x}%`, top: `${zona.y}%` }}
            />
          );
        })}
      </div>

      <p className="text-center text-xs text-texto-suave">Toca un componente para inspeccionar</p>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-texto-suave">
        <Leyenda color="bg-exito" texto="Correcto" />
        <Leyenda color="bg-atencion" texto="Atención" />
        <Leyenda color="bg-error" texto="Novedad" />
        <Leyenda color="bg-neutro" texto="Sin revisar" />
      </div>
    </div>
  );
}

function Leyenda({ color, texto }: { color: string; texto: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cx("h-2.5 w-2.5 rounded-full", color)} />
      {texto}
    </span>
  );
}

function etiquetaEstado(estado: EstadoItem): string {
  switch (estado) {
    case "correcto":
      return "correcto";
    case "requiere_revision":
      return "requiere revisión";
    case "fuera_de_servicio":
      return "fuera de servicio";
    default:
      return "sin revisar";
  }
}

function peorEstado(ids: string[], estados: Record<string, EstadoItem>): EstadoItem {
  let vistoRevision = false;
  let vistoSinRevisar = false;
  for (const id of ids) {
    const estado = estados[id] ?? "sin_revisar";
    if (estado === "fuera_de_servicio") return "fuera_de_servicio";
    if (estado === "requiere_revision") vistoRevision = true;
    if (estado === "sin_revisar") vistoSinRevisar = true;
  }
  if (vistoRevision) return "requiere_revision";
  if (vistoSinRevisar) return "sin_revisar";
  return "correcto";
}
