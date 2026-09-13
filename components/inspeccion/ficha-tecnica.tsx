"use client";

import { Icono } from "@/components/ui/icono";
import { Acordeon } from "@/components/ui/acordeon";
import { SelectorEstado } from "@/components/inspeccion/selector-estado";
import type { ComponenteBus, EstadoItem } from "@/lib/datos/tipos";

const CRITICIDAD_ETIQUETA: Record<ComponenteBus["criticidad"], string> = {
  rojo: "Crítico para la seguridad",
  amarillo: "Importante",
  verde: "Rutinario",
};

const CRITICIDAD_CLASE: Record<ComponenteBus["criticidad"], string> = {
  rojo: "bg-error/15 text-error",
  amarillo: "bg-atencion/15 text-atencion",
  verde: "bg-exito/15 text-exito",
};

/**
 * Ficha técnica completa de un componente: las 10 secciones pedidas
 * (descripción, función, importancia, inspección, desgaste, fallas,
 * riesgos, mantenimiento, frecuencia, sustento legal) más el semáforo de
 * criticidad y el selector de estado. El sustento legal se renderiza
 * distinto según sea cita textual (citasLegales) o buena práctica
 * (buenaPractica): nunca deben verse iguales, para que una recomendación
 * nunca se confunda con una obligación legal.
 */
export function FichaTecnica({
  componente,
  estado,
  onCambiarEstado,
  onReportarNovedad,
  children,
}: {
  componente: ComponenteBus;
  estado: EstadoItem;
  onCambiarEstado: (estado: Exclude<EstadoItem, "sin_revisar">) => void;
  onReportarNovedad?: () => void;
  /** Slot para el input de evidencia (SubirEvidencia), inyectado por el padre. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-acento-suave text-acento">
          <Icono nombre={componente.icono} className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold">{componente.nombre}</p>
          <span
            className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${CRITICIDAD_CLASE[componente.criticidad]}`}
          >
            {CRITICIDAD_ETIQUETA[componente.criticidad]}
          </span>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-texto-suave">{componente.descripcion}</p>

      <SelectorEstado estadoActual={estado} onCambiar={onCambiarEstado} />

      {estado === "requiere_revision" || estado === "fuera_de_servicio" ? (
        <div className="flex flex-col gap-2 rounded-lg border border-borde bg-superficie-2 p-3">
          <p className="text-xs font-semibold text-texto-suave">Adjunta evidencia (opcional)</p>
          {children}
          {onReportarNovedad && (
            <button
              type="button"
              onClick={onReportarNovedad}
              className="w-fit text-xs font-medium text-acento hover:underline"
            >
              Reportar como novedad detallada →
            </button>
          )}
        </div>
      ) : null}

      <div className="flex flex-col gap-2.5">
        <Acordeon icono="🔧" titulo="Función e importancia">
          <p>{componente.funcion}</p>
          <p className="mt-2 text-texto-suave">{componente.importancia}</p>
        </Acordeon>

        <Acordeon icono="🔍" titulo="Cómo inspeccionarlo, paso a paso">
          <ol className="list-decimal space-y-1.5 pl-4">
            {componente.pasosInspeccion.map((paso, i) => (
              <li key={i}>{paso}</li>
            ))}
          </ol>
        </Acordeon>

        <Acordeon icono="⚠️" titulo="Señales de desgaste y fallas comunes">
          <p className="font-medium text-texto">Señales de desgaste</p>
          <ul className="list-disc space-y-1 pl-4">
            {componente.senalesDesgaste.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 font-medium text-texto">Fallas comunes</p>
          <ul className="list-disc space-y-1 pl-4">
            {componente.fallasComunes.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Acordeon>

        <Acordeon icono="🚨" titulo="Riesgos si falla">
          <ul className="list-disc space-y-1 pl-4">
            {componente.riesgos.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Acordeon>

        <Acordeon icono="🛠️" titulo="Mantenimiento preventivo">
          <ul className="list-disc space-y-1 pl-4">
            {componente.mantenimientoPreventivo.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
          <p className="mt-2 text-texto-suave">Frecuencia: {componente.frecuencia}</p>
        </Acordeon>
      </div>

      {componente.citasLegales ? (
        <div className="rounded-lg border border-acento/30 bg-acento-suave px-3.5 py-3">
          <p className="text-xs font-semibold tracking-wide text-acento">⚖️ SUSTENTO LEGAL</p>
          <div className="mt-2 flex flex-col gap-3">
            {componente.citasLegales.map((cita, i) => (
              <blockquote key={i} className="border-l-2 border-acento/50 pl-3 text-sm text-texto/90">
                <p>&ldquo;{cita.texto}&rdquo;</p>
                <footer className="mt-1 text-xs text-texto-suave">
                  {cita.fuente} · consultado el {cita.consultadoEl}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-borde bg-superficie-2 px-3.5 py-3">
          <p className="text-xs font-semibold tracking-wide text-texto-suave">
            🔩 BUENA PRÁCTICA DE MANTENIMIENTO
          </p>
          <p className="mt-1 text-sm text-texto/90">{componente.buenaPractica}</p>
        </div>
      )}
    </div>
  );
}
