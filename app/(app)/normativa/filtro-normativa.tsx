"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cx, normalizarBusqueda } from "@/lib/utils";
import type { CategoriaNormativa } from "@/lib/datos/tipos";

/**
 * Buscador y filtro por categoría de la normativa. Mismo patrón que
 * app/(app)/senales/filtro-senales.tsx, pero con una diferencia: aquí el
 * SERVIDOR ya armó cada acordeón (con sus bloques) y lo pasa como `nodo`;
 * este componente solo decide cuáles mostrar. Así el contenido no se
 * duplica en el bundle del cliente.
 */

export interface EntradaFiltrable {
  id: string;
  categoria: CategoriaNormativa;
  /** Título + resumen + fuente, ya en minúsculas y sin tildes. */
  textoBusqueda: string;
  nodo: ReactNode;
}

const CATEGORIAS: { clave: CategoriaNormativa | "todas"; etiqueta: string }[] = [
  { clave: "todas", etiqueta: "Todas" },
  { clave: "documentos", etiqueta: "Documentos" },
  { clave: "vehiculo", etiqueta: "Vehículo" },
  { clave: "conducta", etiqueta: "Conducta" },
  { clave: "operacion", etiqueta: "Operación" },
];

export function FiltroNormativa({ entradas }: { entradas: EntradaFiltrable[] }) {
  const [categoria, setCategoria] = useState<CategoriaNormativa | "todas">("todas");
  const [busqueda, setBusqueda] = useState("");

  const visibles = useMemo(() => {
    const consulta = normalizarBusqueda(busqueda);
    return entradas.filter(
      (e) =>
        (categoria === "todas" || e.categoria === categoria) &&
        (consulta === "" || e.textoBusqueda.includes(consulta)),
    );
  }, [entradas, categoria, busqueda]);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar: SOAT, velocidad, extintor…"
        aria-label="Buscar en la normativa"
        className="rounded-xl border border-borde bg-superficie px-4 py-3 text-sm text-texto placeholder:text-neutro"
      />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {CATEGORIAS.map(({ clave, etiqueta }) => (
          <button
            key={clave}
            type="button"
            onClick={() => setCategoria(clave)}
            aria-pressed={categoria === clave}
            className={cx(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              categoria === clave
                ? "bg-acento text-fondo"
                : "bg-superficie-2 text-texto-suave hover:text-texto",
            )}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      <p className="text-xs text-texto-suave" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? "tema" : "temas"}
      </p>

      {visibles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-borde px-4 py-8 text-center text-sm text-texto-suave">
          Ningún tema coincide con tu búsqueda.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visibles.map((e) => (
            <div key={e.id}>{e.nodo}</div>
          ))}
        </div>
      )}
    </div>
  );
}
