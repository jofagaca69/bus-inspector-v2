import type { NombreIcono } from "@/components/ui/icono";

/**
 * Tipos compartidos por el contenido estático de los módulos académicos
 * (aprendizaje, normativa, señales, primeros auxilios) y por el
 * componente de evaluación. Vive aparte de los datos para que cada
 * archivo de datos (lib/datos/*.ts) importe solo lo que necesita.
 */

export interface EntradaNormativa {
  id: string;
  icono: string;
  titulo: string;
  fuente: string;
  cuerpo: string;
  tip: string;
}

export type CategoriaSenal = "reglamentarias" | "preventivas" | "informativas";

export interface Senal {
  /** Slug de archivo, único por señal (usar para keys de React). */
  id: string;
  /** Código oficial mostrado (ej. "SR-01"). Puede repetirse entre dos
   * señales por una inconsistencia del sitio de origen; no es único. */
  codigo: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: CategoriaSenal;
}

export interface SeccionTema {
  titulo: string;
  contenido: string;
}

export interface TemaAprendizaje {
  slug: string;
  titulo: string;
  resumen: string;
  icono: string;
  secciones: SeccionTema[];
  puntosClave: string[];
  /** IDs de video de YouTube, validados contra el endpoint oEmbed. */
  videos: string[];
}

export interface GuiaAuxilio {
  id: string;
  titulo: string;
  icono: string;
  pasos: string[];
  queNoHacer: string[];
}

export interface ItemBotiquin {
  nombre: string;
  paraQueSirve: string;
}

export interface ContactoEmergencia {
  nombre: string;
  numero: string;
  descripcion: string;
}

export interface Pregunta {
  id: string;
  enunciado: string;
  opciones: string[];
  /** Índice (0-based) de la opción correcta dentro de `opciones`. */
  correcta: number;
  explicacion: string;
}

/**
 * Tipos del módulo de Inspección Diaria. Viven en el mismo archivo que el
 * resto del contenido estático porque siguen el mismo patrón: catálogo en
 * lib/datos/*.ts, tipos aparte para que cada consumidor importe solo lo
 * que necesita.
 */

/** Semáforo de criticidad de un componente del bus. */
export type Criticidad = "verde" | "amarillo" | "rojo";

export type VistaBus = "lateral" | "frontal" | "trasera";

/**
 * Estado de un ítem dentro de una inspección. "sin_revisar" no es un valor
 * que se persista: es la ausencia de fila en inspeccion_items. Se incluye
 * aquí porque la UI sí necesita representarlo (un hotspot sin tocar).
 */
export type EstadoItem =
  | "sin_revisar"
  | "correcto"
  | "requiere_revision"
  | "fuera_de_servicio";

/**
 * Cita normativa literal. `texto` se transcribe verbatim de la fuente
 * oficial y nunca se parafrasea: si algún fragmento no puede verificarse
 * palabra por palabra, no se incluye como CitaLegal (se documenta como
 * buena práctica en su lugar).
 */
export interface CitaLegal {
  texto: string;
  fuente: string;
  url: string;
  /** Fecha (YYYY-MM-DD) en la que se verificó el texto contra la fuente. */
  consultadoEl: string;
}

export interface ComponenteBus {
  id: string;
  nombre: string;
  icono: NombreIcono;
  criticidad: Criticidad;
  descripcion: string;
  funcion: string;
  importancia: string;
  pasosInspeccion: string[];
  senalesDesgaste: string[];
  fallasComunes: string[];
  riesgos: string[];
  mantenimientoPreventivo: string[];
  frecuencia: string;
  /** null cuando el sustento es buena práctica mecánica, no una norma. */
  citasLegales: CitaLegal[] | null;
  /** Obligatorio cuando citasLegales es null. */
  buenaPractica?: string;
  /** Tipos de novedad predefinidos para el formulario de reporte de este componente. */
  tiposNovedad: string[];
  /** Pertenece al subconjunto del "check rápido" (ver ZonaBus / recorrido guiado). */
  enChequeoRapido: boolean;
}

/** Un punto táctil sobre una de las 3 vistas del bus. Puede agrupar 1..n componentes. */
export interface ZonaBus {
  id: string;
  vista: VistaBus;
  /** Porcentaje del ancho/alto de la imagen (0-100), no píxeles. */
  x: number;
  y: number;
  etiqueta: string;
  componentes: string[];
}
