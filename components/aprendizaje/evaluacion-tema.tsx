"use client";

import { Evaluacion } from "@/components/ui/evaluacion";
import { registrarResultado } from "@/lib/aprendizaje/progreso";
import type { Pregunta } from "@/lib/datos/tipos";

/**
 * El quiz de un tema, que además recuerda el mejor resultado en el progreso
 * local. Es un envoltorio cliente porque la página del tema es un Server
 * Component y no puede pasar funciones como `onFinalizar`.
 */
export function EvaluacionTema({
  usuarioId,
  slug,
  preguntas,
}: {
  usuarioId: string;
  slug: string;
  preguntas: Pregunta[];
}) {
  return (
    <Evaluacion
      preguntas={preguntas}
      onFinalizar={(porcentaje) => registrarResultado(usuarioId, slug, porcentaje)}
    />
  );
}
