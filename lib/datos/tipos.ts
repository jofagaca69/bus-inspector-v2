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
