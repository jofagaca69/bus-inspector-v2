"use client";

import { useState } from "react";
import { VideoYoutube } from "@/components/ui/video-youtube";
import { cx } from "@/lib/utils";
import type { GravedadAuxilio, GuiaAuxilio } from "@/lib/datos/tipos";

export const GRAVEDAD_ETIQUETA: Record<GravedadAuxilio, string> = {
  vital: "Riesgo vital",
  urgente: "Urgente",
  general: "Procedimiento general",
};

export const GRAVEDAD_CLASE: Record<GravedadAuxilio, string> = {
  vital: "bg-error/15 text-error",
  urgente: "bg-atencion/15 text-atencion",
  general: "bg-superficie-2 text-texto-suave",
};

/**
 * Una guía de primeros auxilios en modo emergencia: UN paso a la vez, con
 * letra grande y botones amplios, pensado para leerse bajo estrés (un
 * acordeón con todos los pasos juntos no lo es). Tras el último paso viene
 * la pantalla de "qué NO hacer" con el video y el botón para llamar.
 * "Ver todos los pasos" da la vista completa para repasar con calma.
 */
export function GuiaPasoAPaso({ guia }: { guia: GuiaAuxilio }) {
  const [paso, setPaso] = useState(0);
  const [verTodos, setVerTodos] = useState(false);

  const total = guia.pasos.length;
  const enCierre = paso >= total;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span
          className={cx(
            "w-fit rounded-full px-3 py-1 text-xs font-bold",
            GRAVEDAD_CLASE[guia.gravedad],
          )}
        >
          {GRAVEDAD_ETIQUETA[guia.gravedad]}
        </span>
        <p className="text-sm text-texto-suave">
          <span className="font-semibold text-texto">Cuándo llamar al 123: </span>
          {guia.cuandoLlamar}
        </p>
      </div>

      {verTodos ? (
        <>
          <ol className="flex flex-col gap-3">
            {guia.pasos.map((p, i) => (
              <li key={p.texto} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-acento text-sm font-bold text-fondo">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-medium leading-snug">{p.texto}</p>
                  {p.detalle && <p className="text-xs text-texto-suave">{p.detalle}</p>}
                </div>
              </li>
            ))}
          </ol>
          <QueNoHacer items={guia.queNoHacer} />
          {guia.video && <VideoYoutube id={guia.video.id} titulo={guia.video.titulo} />}
          <BotonSecundario onClick={() => setVerTodos(false)}>Volver al paso a paso</BotonSecundario>
        </>
      ) : enCierre ? (
        <>
          <QueNoHacer items={guia.queNoHacer} />

          {guia.video && (
            <figure className="flex flex-col gap-1.5">
              <VideoYoutube id={guia.video.id} titulo={guia.video.titulo} />
              {guia.video.fuente && (
                <figcaption className="text-xs text-texto-suave">{guia.video.fuente}</figcaption>
              )}
            </figure>
          )}

          <div className="flex gap-2">
            <BotonSecundario onClick={() => setPaso(total - 1)}>‹ Último paso</BotonSecundario>
            <BotonSecundario onClick={() => setPaso(0)}>Empezar de nuevo</BotonSecundario>
          </div>
        </>
      ) : (
        <>
          <div
            className="flex gap-1.5"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={paso + 1}
            aria-label={`Paso ${paso + 1} de ${total}`}
          >
            {guia.pasos.map((p, i) => (
              <span
                key={p.texto}
                className={cx(
                  "h-1.5 flex-1 rounded-full",
                  i <= paso ? "bg-acento" : "bg-superficie-2",
                )}
              />
            ))}
          </div>

          <div className="flex min-h-40 flex-col gap-3 rounded-2xl border border-borde bg-superficie-2 p-5">
            <p className="text-xs font-semibold tracking-wide text-acento">
              PASO {paso + 1} DE {total}
            </p>
            <p className="text-xl font-semibold leading-snug">{guia.pasos[paso].texto}</p>
            {guia.pasos[paso].detalle && (
              <p className="text-base leading-relaxed text-texto/80">{guia.pasos[paso].detalle}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPaso((p) => Math.max(0, p - 1))}
              disabled={paso === 0}
              className="rounded-xl border border-borde px-5 py-4 text-sm font-semibold text-texto-suave disabled:opacity-30"
            >
              ‹ Anterior
            </button>
            <button
              type="button"
              onClick={() => setPaso((p) => p + 1)}
              className="flex-1 rounded-xl bg-acento px-5 py-4 text-base font-bold text-fondo"
            >
              {paso === total - 1 ? "Qué NO hacer ›" : "Siguiente ›"}
            </button>
          </div>
        </>
      )}

      {!verTodos && (
        <button
          type="button"
          onClick={() => setVerTodos(true)}
          className="w-fit text-xs text-texto-suave underline decoration-dotted hover:text-texto"
        >
          Ver todos los pasos
        </button>
      )}

      <a
        href="tel:123"
        className="flex items-center justify-center gap-2 rounded-xl bg-error px-5 py-4 text-base font-bold text-fondo"
      >
        📞 Llamar al 123
      </a>
    </div>
  );
}

function QueNoHacer({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg bg-error/10 px-3.5 py-3">
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-error">⚠️ QUÉ NO HACER</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-texto/90">
            <span className="shrink-0 text-error">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BotonSecundario({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-xl border border-borde px-4 py-3 text-sm font-semibold text-texto-suave hover:text-texto"
    >
      {children}
    </button>
  );
}
