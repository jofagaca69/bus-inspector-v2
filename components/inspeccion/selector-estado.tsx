"use client";

import { Icono, type NombreIcono } from "@/components/ui/icono";
import { cx } from "@/lib/utils";
import type { EstadoItem } from "@/lib/datos/tipos";

type EstadoMarcable = Exclude<EstadoItem, "sin_revisar">;

const OPCIONES: {
  estado: EstadoMarcable;
  etiqueta: string;
  icono: NombreIcono;
  claseActiva: string;
}[] = [
  {
    estado: "correcto",
    etiqueta: "Correcto",
    icono: "check",
    claseActiva: "border-exito bg-exito/15 text-exito",
  },
  {
    estado: "requiere_revision",
    etiqueta: "Requiere revisión",
    icono: "alerta",
    claseActiva: "border-atencion bg-atencion/15 text-atencion",
  },
  {
    estado: "fuera_de_servicio",
    etiqueta: "Fuera de servicio",
    icono: "equis",
    claseActiva: "border-error bg-error/15 text-error",
  },
];

export function SelectorEstado({
  estadoActual,
  onCambiar,
}: {
  estadoActual: EstadoItem;
  onCambiar: (estado: EstadoMarcable) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Estado del componente">
      {OPCIONES.map((opcion) => {
        const activo = estadoActual === opcion.estado;
        return (
          <button
            key={opcion.estado}
            type="button"
            aria-pressed={activo}
            onClick={() => onCambiar(opcion.estado)}
            className={cx(
              "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-colors",
              activo
                ? opcion.claseActiva
                : "border-borde bg-superficie-2 text-texto-suave hover:text-texto",
            )}
          >
            <Icono nombre={opcion.icono} className="h-5 w-5" />
            {opcion.etiqueta}
          </button>
        );
      })}
    </div>
  );
}
