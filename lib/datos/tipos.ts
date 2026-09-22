import type { NombreIcono } from "@/components/ui/icono";

/**
 * Tipos compartidos por el contenido estático de los módulos académicos
 * (aprendizaje, normativa, señales, primeros auxilios) y por el
 * componente de evaluación. Vive aparte de los datos para que cada
 * archivo de datos (lib/datos/*.ts) importe solo lo que necesita.
 */

/* ------------------------------------------------------------------ */
/* Bloques de contenido                                                */
/* ------------------------------------------------------------------ */
/*
 * Vocabulario común de los módulos académicos (normativa, primeros
 * auxilios, aprendizaje). En vez de "un párrafo por sección", cada entrada
 * es una lista de bloques tipados que renderiza components/ui/
 * bloques-contenido.tsx: así el orden y la mezcla de texto, video,
 * imágenes y piezas interactivas viven en los datos, no en el JSX de cada
 * página. Regla editorial: ningún bloque "texto" pasa de ~400 caracteres;
 * lo enumerable va en "lista", "pasos", "comparativa" o "tarjetas-icono".
 */

/** Video de YouTube. El `id` debe verificarse con scripts/verificar-videos.mjs. */
export interface VideoTema {
  id: string;
  titulo: string;
  /** Quién lo publica (ej. "Cruz Roja Colombiana"). */
  fuente?: string;
  /** Texto libre, ej. "4 min". */
  duracion?: string;
}

export interface PasoGuia {
  texto: string;
  /** Aclaración corta bajo el paso. */
  detalle?: string;
}

export interface TarjetaIcono {
  titulo: string;
  /** Una línea visible en la tarjeta. */
  resumen: string;
  /** Icono SVG del set de dominio vehicular... */
  icono?: NombreIcono;
  /** ...o un emoji, cuando no hay glifo propio. Uno de los dos. */
  emoji?: string;
  /** Detalle que se abre al tocar la tarjeta; sin él la tarjeta no es táctil. */
  detalle?: string[];
}

export interface FilaComparativa {
  etiqueta: string;
  valor: string;
  nota?: string;
}

export type BloqueContenido =
  | { tipo: "texto"; texto: string }
  | { tipo: "lista"; titulo?: string; items: string[] }
  | { tipo: "pasos"; titulo?: string; pasos: PasoGuia[] }
  | { tipo: "video"; video: VideoTema }
  | { tipo: "imagen"; src: string; alt: string; pie?: string }
  /** `ids` son `Senal.id` de lib/datos/senales.ts (pictogramas ya en public/senales). */
  | { tipo: "senales"; titulo?: string; ids: string[] }
  | { tipo: "tarjetas-icono"; titulo?: string; items: TarjetaIcono[] }
  | { tipo: "comparativa"; titulo?: string; filas: FilaComparativa[] }
  | { tipo: "cita-legal"; cita: CitaLegal }
  /** Enlace a un recurso oficial externo (guía, norma, portal educativo). */
  | { tipo: "enlace"; titulo: string; url: string; fuente: string; descripcion?: string }
  | { tipo: "alerta"; variante: "info" | "peligro"; texto: string }
  /** Interactivo: el conductor marca lo que ya cumple. Estado solo en el cliente. */
  | { tipo: "checklist"; titulo?: string; items: string[] };

export type CategoriaNormativa = "documentos" | "vehiculo" | "conducta" | "operacion";

export interface EntradaNormativa {
  id: string;
  icono: string;
  titulo: string;
  /** Una línea visible bajo el título y usada por el buscador. */
  resumen: string;
  fuente: string;
  categoria: CategoriaNormativa;
  bloques: BloqueContenido[];
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

export type CategoriaAprendizaje =
  | "conduccion"
  | "vehiculo"
  | "pasajeros"
  | "salud"
  | "emergencias"
  | "gestion";

export interface TemaAprendizaje {
  /** También es la clave de su banco de preguntas en lib/datos/evaluaciones.ts. */
  slug: string;
  titulo: string;
  resumen: string;
  icono: string;
  categoria: CategoriaAprendizaje;
  /** Cuerpo del tema: mezcla de texto, listas, tarjetas, señales, enlaces, etc. */
  bloques: BloqueContenido[];
  puntosClave: string[];
  /** Videos recomendados (de lib/datos/videos.ts, ya verificados). */
  videos: VideoTema[];
}

/**
 * Qué tan urgente es pedir ayuda en esa situación: ordena y colorea las
 * guías para que, bajo estrés, lo más grave se encuentre primero.
 * "vital" = riesgo para la vida (llamar al 123 de inmediato),
 * "urgente" = atención médica pronta, "general" = procedimiento inicial.
 */
export type GravedadAuxilio = "vital" | "urgente" | "general";

export interface GuiaAuxilio {
  id: string;
  titulo: string;
  icono: string;
  gravedad: GravedadAuxilio;
  /** Una línea: en qué situación se usa esta guía. */
  resumen: string;
  /** Cuándo llamar al 123 en esta situación, en una frase. */
  cuandoLlamar: string;
  pasos: PasoGuia[];
  queNoHacer: string[];
  video?: VideoTema;
}

export interface ItemBotiquin {
  nombre: string;
  paraQueSirve: string;
  emoji: string;
}

export interface ContactoEmergencia {
  nombre: string;
  numero: string;
  descripcion: string;
}

export interface Pregunta {
  id: string;
  /** Imagen opcional sobre el enunciado (ej. el pictograma de una señal). */
  imagen?: string;
  /** Texto alternativo de `imagen`. Para preguntas de "¿qué señal es?" debe
   * quedar vacío (o no definirse): describirla en el alt entregaría la respuesta. */
  alt?: string;
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
