import { obtenerComponente } from "@/lib/datos/componentes";
import { zonasBus } from "@/lib/datos/zonas-bus";
import type { Criticidad, EstadoItem, VistaBus } from "@/lib/datos/tipos";

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

/* ------------------------------------------------------------------ */
/* Resumen estadístico de un acta ya cerrada                           */
/* ------------------------------------------------------------------ */
/*
 * Todo lo de abajo es DERIVADO en lectura a partir de los ítems del acta
 * (nunca se persiste: tras el cierre los ítems quedan congelados por
 * trigger). El veredicto global (porcentaje y semáforo) NO se recalcula
 * aquí: se lee de inspecciones.porcentaje_cumplimiento / .estado_general,
 * que son la fotografía firmada del cierre.
 */

/** Lo mínimo que necesitan estas funciones de un renglón de inspeccion_items. */
export interface ItemResumible {
  codigo_componente: string;
  estado: EstadoItem;
}

export interface ConteoEstados {
  total: number;
  correcto: number;
  requiere_revision: number;
  fuera_de_servicio: number;
}

function conteoVacio(): ConteoEstados {
  return { total: 0, correcto: 0, requiere_revision: 0, fuera_de_servicio: 0 };
}

function sumarAlConteo(conteo: ConteoEstados, estado: EstadoItem): void {
  // "sin_revisar" no se cuenta: en un acta cerrada nunca existe (el cierre
  // lo exige), y si apareciera no es ni conforme ni no conforme.
  if (estado === "sin_revisar") return;
  conteo.total += 1;
  conteo[estado] += 1;
}

/** Cantidad de ítems no conformes (requieren revisión o fuera de servicio). */
export function conNovedad(conteo: ConteoEstados): number {
  return conteo.requiere_revision + conteo.fuera_de_servicio;
}

/**
 * Desglose por criticidad del componente (rojo = crítico). Los ítems cuyo
 * código ya no existe en el catálogo (componente renombrado o retirado
 * después de firmar el acta) se omiten: no hay criticidad que asignarles.
 */
export function resumirPorCriticidad(
  items: ItemResumible[],
): Record<Criticidad, ConteoEstados> {
  const resumen: Record<Criticidad, ConteoEstados> = {
    rojo: conteoVacio(),
    amarillo: conteoVacio(),
    verde: conteoVacio(),
  };
  for (const item of items) {
    const componente = obtenerComponente(item.codigo_componente);
    if (!componente) continue;
    sumarAlConteo(resumen[componente.criticidad], item.estado);
  }
  return resumen;
}

export interface ResumenZona {
  id: string;
  etiqueta: string;
  vista: VistaBus;
  conteo: ConteoEstados;
  /** El peor estado entre los componentes de la zona. */
  peor: Exclude<EstadoItem, "sin_revisar">;
}

const GRAVEDAD: Record<EstadoItem, number> = {
  sin_revisar: 0,
  correcto: 1,
  requiere_revision: 2,
  fuera_de_servicio: 3,
};

/**
 * Estado por zona del bus. Un componente que vive en varias zonas (las
 * llantas están en tres) se cuenta en CADA una: cada zona informa su propio
 * estado. Por eso los conteos por zona no se deben sumar entre sí — para
 * totales del vehículo se usa el desglose por estado o por criticidad.
 * Solo se devuelven zonas con al menos un ítem, de la más grave a la menos.
 */
export function resumirPorZona(items: ItemResumible[]): ResumenZona[] {
  const estadoPorComponente = new Map<string, EstadoItem>();
  for (const item of items) estadoPorComponente.set(item.codigo_componente, item.estado);

  const zonas: ResumenZona[] = [];
  for (const zona of zonasBus) {
    const conteo = conteoVacio();
    let peor: ResumenZona["peor"] = "correcto";
    for (const id of zona.componentes) {
      const estado = estadoPorComponente.get(id);
      if (!estado || estado === "sin_revisar") continue;
      sumarAlConteo(conteo, estado);
      if (GRAVEDAD[estado] > GRAVEDAD[peor]) peor = estado;
    }
    if (conteo.total === 0) continue;
    zonas.push({ id: zona.id, etiqueta: zona.etiqueta, vista: zona.vista, conteo, peor });
  }

  return zonas.sort(
    (a, b) =>
      GRAVEDAD[b.peor] - GRAVEDAD[a.peor] ||
      conNovedad(b.conteo) - conNovedad(a.conteo) ||
      a.etiqueta.localeCompare(b.etiqueta, "es"),
  );
}

export interface FallaFrecuente {
  codigo: string;
  nombre: string;
  /** En cuántas inspecciones distintas apareció con novedad. */
  veces: number;
  /** De esas, cuántas fue "fuera de servicio". */
  fueraDeServicio: number;
}

/**
 * Componentes que más fallan a lo largo de varias inspecciones. Recibe los
 * ítems con novedad de todas ellas: como hay un solo renglón por componente
 * y por inspección, contar renglones equivale a contar inspecciones.
 */
export function contarFallasPorComponente(
  itemsConNovedad: ItemResumible[],
  limite = 5,
): FallaFrecuente[] {
  const porCodigo = new Map<string, FallaFrecuente>();
  for (const item of itemsConNovedad) {
    if (item.estado !== "requiere_revision" && item.estado !== "fuera_de_servicio") continue;
    const actual = porCodigo.get(item.codigo_componente) ?? {
      codigo: item.codigo_componente,
      nombre: obtenerComponente(item.codigo_componente)?.nombre ?? item.codigo_componente,
      veces: 0,
      fueraDeServicio: 0,
    };
    actual.veces += 1;
    if (item.estado === "fuera_de_servicio") actual.fueraDeServicio += 1;
    porCodigo.set(item.codigo_componente, actual);
  }
  return [...porCodigo.values()]
    .sort(
      (a, b) =>
        b.veces - a.veces ||
        b.fueraDeServicio - a.fueraDeServicio ||
        a.nombre.localeCompare(b.nombre, "es"),
    )
    .slice(0, limite);
}

/** Minutos entre el inicio y el cierre (nunca negativo). */
export function duracionMinutos(iniciadaEn: string, finalizadaEn: string): number {
  const ms = new Date(finalizadaEn).getTime() - new Date(iniciadaEn).getTime();
  return Math.max(0, Math.round(ms / 60000));
}

export function formatearDuracion(minutos: number): string {
  if (minutos < 1) return "menos de 1 min";
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `${horas} h` : `${horas} h ${String(resto).padStart(2, "0")} min`;
}

/**
 * Diferencia en puntos porcentuales contra la inspección anterior, o null
 * si no hay con qué comparar. Positivo = el bus mejoró.
 */
export function diferenciaConAnterior(
  actual: number | null,
  anterior: number | null,
): number | null {
  if (actual === null || anterior === null) return null;
  return Math.round((actual - anterior) * 10) / 10;
}
