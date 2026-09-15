/**
 * Tipos a mano, espejo 1:1 de las tablas creadas en
 * supabase/migrations/0003_inspecciones.sql. El proyecto no genera
 * database.types.ts (ver lib/auth/tipos.ts para el mismo patrón con
 * `Perfil`): `string` para uuid/timestamptz/date (PostgREST los entrega
 * como ISO 8601), `number` para smallint/numeric.
 */

export type TipoInspeccion = "completa" | "rapida";
export type EstadoGeneralInspeccion = "verde" | "amarillo" | "rojo";
export type TipoNovedad =
  | "mecanica"
  | "electrica"
  | "carroceria"
  | "seguridad"
  | "documentacion"
  | "limpieza"
  | "otra";
export type SeveridadNovedad = "baja" | "media" | "alta" | "critica";
export type EstadoNovedad = "abierta" | "en_proceso" | "resuelta" | "descartada";

export interface Bus {
  id: string;
  placa: string;
  numero_interno: string;
  modelo: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inspeccion {
  id: string;
  conductor_id: string;
  bus_id: string;
  tipo: TipoInspeccion;
  kilometraje: number | null;
  observaciones: string | null;
  // Todos null mientras finalizada_en sea null (ver cerrar_inspeccion() en el SQL).
  total_items: number | null;
  items_correctos: number | null;
  items_requieren_revision: number | null;
  items_fuera_de_servicio: number | null;
  porcentaje_cumplimiento: number | null;
  estado_general: EstadoGeneralInspeccion | null;
  iniciada_en: string;
  finalizada_en: string | null;
  fecha: string;
  created_at: string;
  updated_at: string;
}

/** `.select("*, bus:buses(placa, numero_interno)")`. */
export interface InspeccionConBus extends Inspeccion {
  bus: Pick<Bus, "placa" | "numero_interno"> | null;
}

export function inspeccionEnCurso(i: Pick<Inspeccion, "finalizada_en">): boolean {
  return i.finalizada_en === null;
}

/** Estado que tiene un ítem en la BD. "sin_revisar" incluido: al abrir la
 * inspección se crean de una vez los N renglones con este valor por
 * defecto (ver comentario de inspeccion_items en el SQL). */
export type { EstadoItem } from "@/lib/datos/tipos";

export interface InspeccionItem {
  id: string;
  inspeccion_id: string;
  codigo_componente: string;
  nombre_componente: string;
  orden: number;
  estado: import("@/lib/datos/tipos").EstadoItem;
  nota: string | null;
  revisado_en: string | null;
  created_at: string;
  updated_at: string;
}

export interface Novedad {
  id: string;
  inspeccion_id: string | null;
  inspeccion_item_id: string | null;
  bus_id: string;
  reportada_por: string;
  tipo: TipoNovedad;
  severidad: SeveridadNovedad;
  descripcion: string;
  estado: EstadoNovedad;
  resuelta_por: string | null;
  resuelta_en: string | null;
  nota_resolucion: string | null;
  created_at: string;
  updated_at: string;
}

export interface Evidencia {
  id: string;
  inspeccion_id: string | null;
  inspeccion_item_id: string | null;
  novedad_id: string | null;
  ruta: string;
  mime: string;
  bytes: number | null;
  subida_por: string;
  created_at: string;
}

/** Evidencia con su signed URL ya generada. No persistir ni cachear la url. */
export interface EvidenciaFirmada extends Evidencia {
  url: string;
}

/** Ítem con sus fotos ya firmadas, listo para renderizar en el detalle. */
export interface ItemConEvidencias extends InspeccionItem {
  evidencias: EvidenciaFirmada[];
}
