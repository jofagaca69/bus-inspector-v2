"use client";

import { useState } from "react";
import { Icono } from "@/components/ui/icono";
import { HojaInferior } from "@/components/ui/hoja-inferior";
import type { TarjetaIcono } from "@/lib/datos/tipos";

/**
 * Cuadrícula de tarjetas con icono. Las que traen `detalle` son táctiles y
 * abren una hoja inferior con el desarrollo; las que no, son solo
 * informativas. Reemplaza los párrafos enumerados (ej. el equipo de
 * carretera del Art. 30) por algo que se pueda escanear de un vistazo.
 */
export function TarjetasIcono({
  titulo,
  items,
}: {
  titulo?: string;
  items: TarjetaIcono[];
}) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const activa = abierta !== null ? items[abierta] : null;

  return (
    <div className="flex flex-col gap-2">
      {titulo && <p className="text-sm font-semibold">{titulo}</p>}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item, i) => {
          const contenido = (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-acento-suave text-xl text-acento">
                {item.icono ? <Icono nombre={item.icono} className="h-6 w-6" /> : item.emoji}
              </span>
              <span className="text-sm font-semibold leading-tight">{item.titulo}</span>
              <span className="text-xs leading-snug text-texto-suave">{item.resumen}</span>
            </>
          );
          const clases =
            "flex flex-col items-start gap-1.5 rounded-xl border border-borde bg-superficie p-3 text-left";

          return item.detalle ? (
            <button
              key={item.titulo}
              type="button"
              onClick={() => setAbierta(i)}
              className={`${clases} transition-colors hover:border-acento/50 active:bg-superficie-2`}
            >
              {contenido}
              <span className="mt-auto text-[11px] font-medium text-acento">Ver más ›</span>
            </button>
          ) : (
            <div key={item.titulo} className={clases}>
              {contenido}
            </div>
          );
        })}
      </div>

      <HojaInferior abierta={activa !== null} onCerrar={() => setAbierta(null)} titulo={activa?.titulo}>
        <p className="text-sm text-texto-suave">{activa?.resumen}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {activa?.detalle?.map((linea) => (
            <li key={linea} className="flex gap-2 text-sm leading-relaxed text-texto/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acento" />
              {linea}
            </li>
          ))}
        </ul>
      </HojaInferior>
    </div>
  );
}
