"use client";

import { useEffect } from "react";
import { marcarVisto } from "@/lib/aprendizaje/progreso";

/** No renderiza nada: al abrir un tema lo anota como visto en el progreso local. */
export function MarcarVisto({ usuarioId, slug }: { usuarioId: string; slug: string }) {
  useEffect(() => {
    marcarVisto(usuarioId, slug);
  }, [usuarioId, slug]);

  return null;
}
