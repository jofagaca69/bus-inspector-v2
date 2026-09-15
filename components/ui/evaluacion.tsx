"use client";

import { useState } from "react";
import type { Pregunta } from "@/lib/datos/tipos";

/**
 * Quiz reutilizable para el "espacio evaluativo" de cada módulo
 * académico. Corre 100% en el cliente: no persiste nada en Supabase (es
 * autoevaluación, no una calificación oficial), solo lleva el estado de
 * la sesión actual en memoria.
 */
export function Evaluacion({ preguntas }: { preguntas: Pregunta[] }) {
  const [indice, setIndice] = useState(0);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);

  const pregunta = preguntas[indice];
  const esUltima = indice === preguntas.length - 1;

  function elegir(opcion: number) {
    if (seleccion !== null) return; // ya respondió esta pregunta
    setSeleccion(opcion);
    if (opcion === pregunta.correcta) setAciertos((a) => a + 1);
  }

  function siguiente() {
    if (esUltima) {
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
  }

  if (preguntas.length === 0) return null;

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

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-superficie-2">
        <div
          className="h-full rounded-full bg-acento transition-all"
          style={{ width: `${(indice / preguntas.length) * 100}%` }}
        />
      </div>

      <p className="mb-4 text-sm font-semibold">{pregunta.enunciado}</p>

      <div className="flex flex-col gap-2">
        {pregunta.opciones.map((opcion, i) => {
          const respondida = seleccion !== null;
          const esCorrecta = i === pregunta.correcta;
          const esSeleccionada = i === seleccion;

          let estilo = "border-borde hover:border-texto-suave";
          if (respondida && esCorrecta) {
            estilo = "border-exito bg-exito/10 text-exito";
          } else if (respondida && esSeleccionada && !esCorrecta) {
            estilo = "border-error bg-error/10 text-error";
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => elegir(i)}
              disabled={respondida}
              className={`rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${estilo}`}
            >
              {opcion}
            </button>
          );
        })}
      </div>

      {seleccion !== null && (
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
