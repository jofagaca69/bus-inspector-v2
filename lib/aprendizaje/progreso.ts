"use client";

import { useSyncExternalStore } from "react";

/**
 * Progreso del centro de aprendizaje: qué temas abrió el conductor y su
 * mejor resultado en el quiz. Vive SOLO en localStorage del navegador, no
 * en Supabase: es una ayuda de estudio, no un registro oficial (igual que
 * el quiz, ver components/ui/evaluacion.tsx). La clave incluye el id del
 * usuario para que, en un celular compartido, cada conductor vea su avance.
 *
 * Consecuencias de guardarlo en el navegador: no se sincroniza entre
 * dispositivos y se pierde al borrar los datos del sitio. Si más adelante
 * se necesita progreso real (ej. que el admin vea quién estudió qué), hace
 * falta una tabla nueva en Supabase con RLS y Server Actions.
 *
 * localStorage puede lanzar (modo privado, cuota, política del navegador):
 * toda lectura y escritura va en try/catch y, si falla, la app sigue sin
 * progreso en vez de romperse.
 */

export interface ProgresoTema {
  visto?: boolean;
  /** Mejor porcentaje obtenido en el quiz del tema. */
  mejor?: number;
}

export type ProgresoAprendizaje = Record<string, ProgresoTema>;

/** Porcentaje mínimo del quiz para dar el tema por dominado (igual que Evaluacion). */
export const MINIMO_APROBADO = 70;

const VACIO: ProgresoAprendizaje = {};

function clave(usuarioId: string): string {
  return `bus-inspector:aprendizaje:v1:${usuarioId}`;
}

function leerCrudo(usuarioId: string): string | null {
  try {
    return window.localStorage.getItem(clave(usuarioId));
  } catch {
    return null;
  }
}

function interpretar(crudo: string | null): ProgresoAprendizaje {
  if (!crudo) return VACIO;
  try {
    const datos: unknown = JSON.parse(crudo);
    return datos && typeof datos === "object" ? (datos as ProgresoAprendizaje) : VACIO;
  } catch {
    return VACIO;
  }
}

/** Un tema cuenta como completado si lo abrió y aprobó su quiz. */
export function estaCompleto(progreso: ProgresoTema | undefined): boolean {
  return !!progreso?.visto && (progreso.mejor ?? 0) >= MINIMO_APROBADO;
}

// --- Suscripción (mismo patrón que cualquier store externo de React) ---

const oyentes = new Set<() => void>();

function notificar() {
  oyentes.forEach((oyente) => oyente());
}

function suscribir(oyente: () => void): () => void {
  oyentes.add(oyente);
  // "storage" avisa de cambios hechos desde OTRA pestaña.
  window.addEventListener("storage", oyente);
  return () => {
    oyentes.delete(oyente);
    window.removeEventListener("storage", oyente);
  };
}

function escribir(usuarioId: string, cambio: (previo: ProgresoAprendizaje) => ProgresoAprendizaje) {
  try {
    const previo = interpretar(leerCrudo(usuarioId));
    window.localStorage.setItem(clave(usuarioId), JSON.stringify(cambio(previo)));
  } catch {
    // Sin almacenamiento disponible: se ignora, el progreso simplemente no se guarda.
  }
  notificar();
}

export function marcarVisto(usuarioId: string, slug: string): void {
  const actual = interpretar(leerCrudo(usuarioId))[slug];
  if (actual?.visto) return; // ya estaba: evita escribir en cada visita
  escribir(usuarioId, (previo) => ({ ...previo, [slug]: { ...previo[slug], visto: true } }));
}

export function registrarResultado(usuarioId: string, slug: string, porcentaje: number): void {
  escribir(usuarioId, (previo) => ({
    ...previo,
    [slug]: {
      ...previo[slug],
      visto: true,
      mejor: Math.max(previo[slug]?.mejor ?? 0, porcentaje),
    },
  }));
}

/**
 * Progreso del usuario. En el servidor (y en la primera pasada de
 * hidratación) devuelve un objeto vacío, y ya en el cliente se actualiza:
 * así el HTML inicial coincide y no hay error de hidratación.
 */
export function useProgreso(usuarioId: string): ProgresoAprendizaje {
  // useSyncExternalStore exige que getSnapshot devuelva el MISMO valor
  // mientras nada cambie: por eso el "snapshot" es el texto crudo (un
  // string, comparable por valor) y el JSON se interpreta después.
  const crudo = useSyncExternalStore(
    suscribir,
    () => leerCrudo(usuarioId),
    () => null,
  );
  return interpretar(crudo);
}
