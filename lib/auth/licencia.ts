/**
 * Vigencia de la licencia de conducción. Funciones puras, sin Supabase ni
 * React, para poder razonarlas (y probarlas) aparte.
 *
 * Las fechas de la ficha son columnas `date` de Postgres: llegan como
 * "YYYY-MM-DD", sin hora ni zona. Por eso se comparan como fechas de
 * calendario y "hoy" se toma en America/Bogota (la misma zona con la que
 * la BD calcula inspecciones.fecha), no en la del servidor: un servidor en
 * UTC daría "mañana" por las noches y adelantaría el aviso un día.
 */

export const CATEGORIAS_LICENCIA = ["A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3"] as const;
export const GRUPOS_RH = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

/** Días de anticipación con los que una licencia se considera "por vencer". */
export const DIAS_AVISO_LICENCIA = 30;

export type NivelLicencia = "sin_dato" | "vigente" | "por_vencer" | "vencida";

export interface EstadoLicencia {
  nivel: NivelLicencia;
  /** Días que faltan (0 = vence hoy); negativo si ya venció; null si no hay fecha. */
  dias: number | null;
  /** Frase lista para mostrar. */
  texto: string;
}

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/** Hoy en Bogotá como "YYYY-MM-DD". `ahora` se inyecta para poder probar. */
export function hoyEnBogota(ahora: Date = new Date()): string {
  return ahora.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

/** Días de calendario entre dos "YYYY-MM-DD" (hasta - desde), sin efectos de horario de verano. */
export function diasEntre(desde: string, hasta: string): number {
  const a = Date.parse(`${desde}T00:00:00Z`);
  const b = Date.parse(`${hasta}T00:00:00Z`);
  return Math.round((b - a) / MS_POR_DIA);
}

export function estadoLicencia(
  vence: string | null | undefined,
  hoy: string = hoyEnBogota(),
): EstadoLicencia {
  if (!vence) return { nivel: "sin_dato", dias: null, texto: "Sin fecha de vencimiento registrada" };

  const dias = diasEntre(hoy, vence);

  if (dias < 0) {
    const atras = Math.abs(dias);
    return {
      nivel: "vencida",
      dias,
      texto: `Vencida hace ${atras} ${atras === 1 ? "día" : "días"}`,
    };
  }
  if (dias === 0) return { nivel: "por_vencer", dias, texto: "Vence hoy" };
  if (dias <= DIAS_AVISO_LICENCIA) {
    return {
      nivel: "por_vencer",
      dias,
      texto: `Vence en ${dias} ${dias === 1 ? "día" : "días"}`,
    };
  }
  return { nivel: "vigente", dias, texto: `Vigente · vence en ${dias} días` };
}

/** "2026-11-05" -> "5 de noviembre de 2026". Sin pasar por Date para no correr el día por zona horaria. */
export function formatearFecha(fecha: string): string {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${dia} de ${meses[mes - 1]} de ${anio}`;
}
