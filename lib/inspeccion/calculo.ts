import { obtenerComponente } from "@/lib/datos/componentes";
import type { Criticidad, EstadoItem } from "@/lib/datos/tipos";

/**
 * Funciones puras del veredicto de una inspección. Viven separadas de
 * Supabase y de React a propósito: se pueden probar sin base de datos ni
 * DOM, y son las mismas tanto si se llaman desde una Server Action como
 * desde la UI en optimista (useOptimistic) para previsualizar el
 * porcentaje mientras el conductor sigue marcando ítems.
 *
 * `porcentajeCumplimiento` y `estadoGeneral` se calculan aquí y se
 * PERSISTEN en inspecciones.porcentaje_cumplimiento / .estado_general al
 * finalizar (ver supabase/migrations/0003_inspecciones.sql): no son
 * columnas generadas en Postgres, porque la criticidad de cada componente
 * vive en este archivo de TypeScript, y porque el resultado debe quedar
 * como una fotografía histórica — si mañana se reclasifica un componente,
 * una inspección ya firmada no debe recalcularse ni cambiar de veredicto.
 */

/** Mapa componente_id -> estado, tal como se acumula durante la inspección en curso. */
export type EstadoPorComponente = Record<string, EstadoItem>;

export interface ResultadoInspeccion {
  porcentaje: number;
  nivel: Criticidad;
  veredicto: string;
  motivo: string;
}

/**
 * `idsRevisables` es el subconjunto de componentes que aplica a ESTA
 * inspección (los 23 en una completa, o solo los de chequeo rápido en una
 * rápida). Los que no están en `estados` cuentan como "sin_revisar" y
 * penalizan el porcentaje: una inspección a medias nunca debe mostrar
 * 100%.
 */
export function porcentajeCumplimiento(
  estados: EstadoPorComponente,
  idsRevisables: string[],
): number {
  if (idsRevisables.length === 0) return 0;

  const correctos = idsRevisables.filter((id) => estados[id] === "correcto").length;
  return Math.round((correctos / idsRevisables.length) * 100);
}

export function estadoGeneral(
  estados: EstadoPorComponente,
  idsRevisables: string[],
): ResultadoInspeccion {
  const porcentaje = porcentajeCumplimiento(estados, idsRevisables);

  const fueraDeServicio = idsRevisables.filter((id) => estados[id] === "fuera_de_servicio");
  const requiereRevision = idsRevisables.filter((id) => estados[id] === "requiere_revision");
  const sinRevisar = idsRevisables.filter((id) => !estados[id] || estados[id] === "sin_revisar");

  const criticosFueraDeServicio = fueraDeServicio.filter(
    (id) => obtenerComponente(id)?.criticidad === "rojo",
  );

  // Rojo: cualquier componente de criticidad roja fuera de servicio hace
  // que el bus no deba operar, sin importar qué tan bien esté el resto.
  if (criticosFueraDeServicio.length > 0) {
    const nombres = criticosFueraDeServicio
      .map((id) => obtenerComponente(id)?.nombre ?? id)
      .join(", ");
    return {
      porcentaje,
      nivel: "rojo",
      veredicto: "El vehículo NO debe operar",
      motivo: `Componente crítico fuera de servicio: ${nombres}.`,
    };
  }

  // Amarillo: hay algo que atender (revisión pendiente, un componente no
  // crítico fuera de servicio, o ítems sin revisar en una inspección que
  // se cerró incompleta).
  if (requiereRevision.length > 0 || fueraDeServicio.length > 0 || sinRevisar.length > 0) {
    const partes: string[] = [];
    if (fueraDeServicio.length > 0) partes.push(`${fueraDeServicio.length} fuera de servicio`);
    if (requiereRevision.length > 0) partes.push(`${requiereRevision.length} requiere(n) revisión`);
    if (sinRevisar.length > 0) partes.push(`${sinRevisar.length} sin revisar`);

    return {
      porcentaje,
      nivel: "amarillo",
      veredicto: "El vehículo puede operar con precaución",
      motivo: partes.join(" · "),
    };
  }

  return {
    porcentaje,
    nivel: "verde",
    veredicto: "El vehículo puede operar",
    motivo: "Todos los componentes revisados están correctos.",
  };
}
