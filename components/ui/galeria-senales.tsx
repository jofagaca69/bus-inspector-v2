"use client";

import { useState } from "react";
import { HojaInferior } from "@/components/ui/hoja-inferior";
import type { Senal } from "@/lib/datos/tipos";

/**
 * Pictogramas de señales (los que ya viven en public/senales) embebidos
 * dentro de una entrada de contenido. Al tocar uno se abre su detalle:
 * el nombre y la descripción que el catálogo ya tiene.
 */
export function GaleriaSenales({
  titulo,
  senales,
}: {
  titulo?: string;
  senales: Senal[];
}) {
  const [activa, setActiva] = useState<Senal | null>(null);

  if (senales.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {titulo && <p className="text-sm font-semibold">{titulo}</p>}

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {senales.map((senal) => (
          <button
            key={senal.id}
            type="button"
            onClick={() => setActiva(senal)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-borde bg-superficie p-2 active:bg-superficie-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- pictogramas estáticos pequeños de public/, sin necesidad de next/image */}
            <img
              src={senal.imagen}
              alt={senal.nombre}
              loading="lazy"
              className="h-16 w-16 object-contain"
            />
            <span className="rounded-full bg-superficie-2 px-2 py-0.5 text-[10px] font-semibold text-texto-suave">
              {senal.codigo}
            </span>
          </button>
        ))}
      </div>

      <HojaInferior abierta={activa !== null} onCerrar={() => setActiva(null)} titulo={activa?.nombre}>
        {activa && (
          <div className="flex flex-col items-center gap-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- ver nota arriba */}
            <img src={activa.imagen} alt={activa.nombre} className="h-40 w-40 object-contain" />
            <span className="rounded-full bg-superficie-2 px-3 py-1 text-xs font-semibold text-texto-suave">
              {activa.codigo}
            </span>
            <p className="text-sm leading-relaxed text-texto/90">{activa.descripcion}</p>
          </div>
        )}
      </HojaInferior>
    </div>
  );
}
