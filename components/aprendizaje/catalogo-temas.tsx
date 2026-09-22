"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cx, normalizarBusqueda } from "@/lib/utils";
import { estaCompleto, useProgreso } from "@/lib/aprendizaje/progreso";
import { ETIQUETA_CATEGORIA, ORDEN_CATEGORIAS } from "@/lib/datos/categorias-aprendizaje";
import type { CategoriaAprendizaje } from "@/lib/datos/tipos";

/** Lo que el índice necesita de un tema (serializable; sin el contenido). */
export interface TarjetaTema {
  slug: string;
  titulo: string;
  resumen: string;
  icono: string;
  categoria: CategoriaAprendizaje;
  minutosLectura: number;
  videos: number;
  preguntas: number;
}

/**
 * Índice del centro de aprendizaje: buscador, filtro por categoría, avance
 * del conductor (localStorage, ver lib/aprendizaje/progreso.ts) y tarjetas
 * con lo que contiene cada tema.
 */
export function CatalogoTemas({
  temas,
  usuarioId,
}: {
  temas: TarjetaTema[];
  usuarioId: string;
}) {
  const progreso = useProgreso(usuarioId);
  const [categoria, setCategoria] = useState<CategoriaAprendizaje | "todas">("todas");
  const [busqueda, setBusqueda] = useState("");

  const completados = temas.filter((t) => estaCompleto(progreso[t.slug])).length;

  const visibles = useMemo(() => {
    const consulta = normalizarBusqueda(busqueda);
    return temas.filter(
      (t) =>
        (categoria === "todas" || t.categoria === categoria) &&
        (consulta === "" ||
          normalizarBusqueda(`${t.titulo} ${t.resumen}`).includes(consulta)),
    );
  }, [temas, categoria, busqueda]);

  return (
    <div className="flex flex-col gap-4">
      {/* Avance general */}
      <div className="rounded-xl border border-borde bg-superficie p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold">Tu avance</p>
          <p className="text-xs text-texto-suave">
            {completados} de {temas.length} temas completados
          </p>
        </div>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-superficie-2"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={temas.length}
          aria-valuenow={completados}
        >
          <div
            className="h-full rounded-full bg-exito transition-[width] duration-500"
            style={{ width: `${(completados / temas.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-texto-suave">
          Un tema se completa al abrirlo y aprobar su quiz (70 % o más). El avance se guarda en
          este dispositivo.
        </p>
      </div>

      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar: fatiga, lluvia, evacuación…"
        aria-label="Buscar temas"
        className="rounded-xl border border-borde bg-superficie px-4 py-3 text-sm text-texto placeholder:text-neutro"
      />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(["todas", ...ORDEN_CATEGORIAS] as const).map((clave) => (
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
            {clave === "todas" ? "Todos" : ETIQUETA_CATEGORIA[clave]}
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visibles.map((tema) => {
            const p = progreso[tema.slug];
            const completo = estaCompleto(p);
            return (
              <Link
                key={tema.slug}
                href={`/aprendizaje/${tema.slug}`}
                className={cx(
                  "flex flex-col gap-2 rounded-xl border bg-superficie p-4 transition-colors hover:bg-superficie-2",
                  completo ? "border-exito/40" : "border-borde hover:border-acento/50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{tema.icono}</span>
                  {completo ? (
                    <span className="rounded-full bg-exito/15 px-2.5 py-0.5 text-[11px] font-semibold text-exito">
                      ✓ Completado
                    </span>
                  ) : p?.visto ? (
                    <span className="rounded-full bg-atencion/15 px-2.5 py-0.5 text-[11px] font-semibold text-atencion">
                      En curso
                    </span>
                  ) : null}
                </div>

                <p className="text-sm font-semibold">{tema.titulo}</p>
                <p className="text-xs text-texto-suave">{tema.resumen}</p>

                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-texto-suave">
                  <span className="rounded-full bg-superficie-2 px-2 py-0.5 font-medium">
                    {ETIQUETA_CATEGORIA[tema.categoria]}
                  </span>
                  <span>≈ {tema.minutosLectura} min de lectura</span>
                  {tema.videos > 0 && (
                    <span>
                      🎬 {tema.videos} {tema.videos === 1 ? "video" : "videos"}
                    </span>
                  )}
                  {tema.preguntas > 0 && <span>📝 {tema.preguntas} preguntas</span>}
                  {p?.mejor !== undefined && <span>Mejor: {p.mejor}%</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
