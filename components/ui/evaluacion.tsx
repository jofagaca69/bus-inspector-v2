"use client";

import { useMemo, useState } from "react";
import type { Pregunta } from "@/lib/datos/tipos";

/**
 * Orden pseudoaleatorio pero DETERMINISTA de las opciones de una pregunta.
 * En los bancos casi siempre la respuesta correcta estaba en la segunda
 * opción (y solía ser la más larga), así que el quiz se adivinaba sin leer.
 * Se mezcla con una semilla derivada del id de la pregunta y del intento:
 * servidor y cliente calculan el mismo orden (sin desajuste de hidratación)
 * y, al pulsar "Reintentar", cambia. Fisher-Yates con PRNG mulberry32.
 */
function ordenDeOpciones(cantidad: number, semilla: string): number[] {
  let h = 2166136261;
  for (let i = 0; i < semilla.length; i++) {
    h ^= semilla.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let estado = h >>> 0;
  const aleatorio = () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const orden = Array.from({ length: cantidad }, (_, i) => i);
  for (let i = cantidad - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  return orden;
}

/**
 * Quiz reutilizable para el "espacio evaluativo" de cada módulo
 * académico. Corre 100% en el cliente: no persiste nada en Supabase (es
 * autoevaluación, no una calificación oficial), solo lleva el estado de
 * la sesión actual en memoria. Quien quiera recordar el resultado (ej. el
 * progreso del centro de aprendizaje) lo recibe por `onFinalizar`.
 */
export function Evaluacion({
  preguntas,
  onFinalizar,
}: {
  preguntas: Pregunta[];
  /** Se llama una vez por intento, al terminar la última pregunta. */
  onFinalizar?: (porcentaje: number, aprobado: boolean) => void;
}) {
  const [indice, setIndice] = useState(0);
  // Índice de la opción tal como se MUESTRA (ya mezclada), no el original.
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [intento, setIntento] = useState(0);

  const ordenes = useMemo(
    () => preguntas.map((p) => ordenDeOpciones(p.opciones.length, `${p.id}:${intento}`)),
    [preguntas, intento],
  );

  if (preguntas.length === 0) return null;

  const pregunta = preguntas[indice];
  const orden = ordenes[indice];
  const esUltima = indice === preguntas.length - 1;
  const respondida = seleccion !== null;
  // Posición, ya mezclada, en la que quedó la opción correcta.
  const correctaMostrada = orden.indexOf(pregunta.correcta);

  function elegir(opcionMostrada: number) {
    if (respondida) return; // ya respondió esta pregunta
    setSeleccion(opcionMostrada);
    if (opcionMostrada === correctaMostrada) setAciertos((a) => a + 1);
  }

  function siguiente() {
    if (esUltima) {
      const porcentaje = Math.round((aciertos / preguntas.length) * 100);
      onFinalizar?.(porcentaje, porcentaje >= 70);
      setTerminado(true);
      return;
    }
    setIndice((i) => i + 1);
    setSeleccion(null);
  }

  function reiniciar() {
    setIndice(0);
    setSeleccion(null);
    setAciertos(0);
    setTerminado(false);
    setIntento((n) => n + 1);
  }

  if (terminado) {
    const porcentaje = Math.round((aciertos / preguntas.length) * 100);
    const aprobado = porcentaje >= 70;

    return (
      <div className="rounded-xl border border-borde bg-superficie p-6 text-center">
        <p className="text-3xl font-bold text-acento">{porcentaje}%</p>
        <p className="mt-1 text-sm text-texto-suave">
          {aciertos} de {preguntas.length} respuestas correctas
        </p>
        <p
          className={`mt-3 text-sm font-medium ${
            aprobado ? "text-exito" : "text-error"
          }`}
        >
          {aprobado
            ? "¡Buen trabajo! Dominas este tema."
            : "Repasa el contenido e inténtalo de nuevo."}
        </p>
        <button
          type="button"
          onClick={reiniciar}
          className="mt-4 rounded-md bg-acento px-4 py-2 text-sm font-medium text-fondo"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-borde bg-superficie p-5">
      <div className="mb-4 flex items-center justify-between text-xs text-texto-suave">
        <span>
          Pregunta {indice + 1} de {preguntas.length}
        </span>
        <span>{aciertos} correctas</span>
      </div>

      {/* Avanza al responder: llega al 100 % al contestar la última. */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-superficie-2">
        <div
          className="h-full rounded-full bg-acento transition-all"
          style={{ width: `${((indice + (respondida ? 1 : 0)) / preguntas.length) * 100}%` }}
        />
      </div>

      {pregunta.imagen && (
        <div className="mb-4 flex justify-center rounded-lg bg-superficie-2 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- pictograma estático de public/ */}
          <img
            src={pregunta.imagen}
            alt={pregunta.alt ?? ""}
            className="h-32 w-32 object-contain"
          />
        </div>
      )}

      <p className="mb-4 text-sm font-semibold">{pregunta.enunciado}</p>

      <div className="flex flex-col gap-2">
        {orden.map((original, mostrada) => {
          const esCorrecta = mostrada === correctaMostrada;
          const esSeleccionada = mostrada === seleccion;

          let estilo = "border-borde hover:border-texto-suave";
          if (respondida && esCorrecta) {
            estilo = "border-exito bg-exito/10 text-exito";
          } else if (respondida && esSeleccionada && !esCorrecta) {
            estilo = "border-error bg-error/10 text-error";
          }

          return (
            <button
              key={original}
              type="button"
              onClick={() => elegir(mostrada)}
              disabled={respondida}
              className={`rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${estilo}`}
            >
              {pregunta.opciones[original]}
            </button>
          );
        })}
      </div>

      {respondida && (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-texto-suave">{pregunta.explicacion}</p>
          <button
            type="button"
            onClick={siguiente}
            className="self-start rounded-md bg-acento px-4 py-2 text-sm font-medium text-fondo"
          >
            {esUltima ? "Ver resultado" : "Siguiente"}
          </button>
        </div>
      )}
    </div>
  );
}
