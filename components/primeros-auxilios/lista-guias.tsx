"use client";

import { useState } from "react";
import { HojaInferior } from "@/components/ui/hoja-inferior";
import {
  GRAVEDAD_CLASE,
  GRAVEDAD_ETIQUETA,
  GuiaPasoAPaso,
} from "@/components/primeros-auxilios/guia-paso-a-paso";
import { cx } from "@/lib/utils";
import type { GravedadAuxilio, GuiaAuxilio } from "@/lib/datos/tipos";

const ORDEN: GravedadAuxilio[] = ["vital", "urgente", "general"];

const BORDE: Record<GravedadAuxilio, string> = {
  vital: "border-error/40",
  urgente: "border-atencion/40",
  general: "border-borde",
};

/**
 * Guías agrupadas por gravedad: lo que pone en riesgo la vida va primero y
 * en rojo. Al tocar una se abre en modo paso a paso (GuiaPasoAPaso).
 */
export function ListaGuias({ guias }: { guias: GuiaAuxilio[] }) {
  const [abierta, setAbierta] = useState<GuiaAuxilio | null>(null);

  return (
    <div className="flex flex-col gap-5">
      {ORDEN.map((gravedad) => {
        const delGrupo = guias.filter((g) => g.gravedad === gravedad);
        if (delGrupo.length === 0) return null;
        return (
          <section key={gravedad} className="flex flex-col gap-2">
            <h3
              className={cx(
                "w-fit rounded-full px-3 py-1 text-xs font-bold",
                GRAVEDAD_CLASE[gravedad],
              )}
            >
              {GRAVEDAD_ETIQUETA[gravedad]}
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {delGrupo.map((guia) => (
                <button
                  key={guia.id}
                  type="button"
                  onClick={() => setAbierta(guia)}
                  className={cx(
                    "flex items-center gap-3 rounded-xl border bg-superficie p-3.5 text-left transition-colors active:bg-superficie-2",
                    BORDE[gravedad],
                  )}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-superficie-2 text-2xl">
                    {guia.icono}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-tight">{guia.titulo}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-texto-suave">
                      {guia.resumen}
                    </span>
                  </span>
                  <span aria-hidden className="text-texto-suave">
                    ›
                  </span>
                </button>
              ))}
            </div>
          </section>
        );
      })}

      <HojaInferior
        abierta={abierta !== null}
        onCerrar={() => setAbierta(null)}
        titulo={abierta ? `${abierta.icono} ${abierta.titulo}` : undefined}
      >
        {/* key: al cambiar de guía se reinicia el paso a paso */}
        {abierta && <GuiaPasoAPaso key={abierta.id} guia={abierta} />}
      </HojaInferior>
    </div>
  );
}
