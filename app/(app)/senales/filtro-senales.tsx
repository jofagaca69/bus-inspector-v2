"use client";

import { useMemo, useState } from "react";
import type { CategoriaSenal, Senal } from "@/lib/datos/tipos";

const CATEGORIAS: { valor: CategoriaSenal | "todas"; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "reglamentarias", etiqueta: "Reglamentarias" },
  { valor: "preventivas", etiqueta: "Preventivas" },
  { valor: "informativas", etiqueta: "Informativas" },
];

export function FiltroSenales({ senales }: { senales: Senal[] }) {
  const [categoria, setCategoria] = useState<CategoriaSenal | "todas">("todas");
  const [busqueda, setBusqueda] = useState("");

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return senales.filter((s) => {
      const coincideCategoria = categoria === "todas" || s.categoria === categoria;
      const coincideBusqueda =
        q === "" ||
        s.codigo.toLowerCase().includes(q) ||
        s.nombre.toLowerCase().includes(q);
      return coincideCategoria && coincideBusqueda;
    });
  }, [senales, categoria, busqueda]);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por código o nombre (ej. PARE, SR-01)"
        className="rounded-md border border-borde bg-transparent px-3 py-2.5 text-sm outline-none focus:border-acento"
      />

      <div className="flex gap-2 overflow-x-auto">
        {CATEGORIAS.map((c) => (
          <button
            key={c.valor}
            type="button"
            onClick={() => setCategoria(c.valor)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              categoria === c.valor
                ? "bg-acento text-fondo"
                : "bg-superficie-2 text-texto-suave hover:text-texto"
            }`}
          >
            {c.etiqueta}
          </button>
        ))}
      </div>

      <p className="text-xs text-texto-suave">
        {filtradas.length} señal{filtradas.length === 1 ? "" : "es"}
      </p>

      {filtradas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-borde p-6 text-center text-sm text-texto-suave">
          No se encontraron señales con ese filtro.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtradas.map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center gap-2 rounded-xl border border-borde bg-superficie p-3 text-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- pictogramas propios en /public, tamaño fijo pequeño */}
              <img src={s.imagen} alt={s.nombre} loading="lazy" decoding="async" className="h-16 w-16 object-contain" />
              <span className="rounded-full bg-superficie-2 px-2 py-0.5 text-[10px] font-medium text-texto-suave">
                {s.codigo}
              </span>
              <p className="text-xs font-medium leading-tight">{s.nombre}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
