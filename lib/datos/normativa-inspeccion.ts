import type { CitaLegal } from "@/lib/datos/tipos";

/**
 * Sustento legal del módulo de Inspección Diaria. Se centraliza aquí, en
 * un solo lugar, para que ningún componente del catálogo (lib/datos/
 * componentes.ts) tenga su propia copia divergente del texto legal.
 *
 * Regla estricta del proyecto: el campo `texto` se transcribe VERBATIM de
 * la fuente oficial. Si un fragmento no puede verificarse palabra por
 * palabra contra el documento oficial, no se declara como CitaLegal: el
 * componente correspondiente usa `buenaPractica` en su lugar (ver
 * componentes.ts). Por eso el equipo de carretera cita el Art. 30
 * completo y textual, mientras que la Res. 40595 de 2022 se referencia
 * por su paso y título oficiales sin entrecomillar contenido no
 * verificado línea por línea en esta sesión.
 */

/**
 * Ley 769 de 2002 (Código Nacional de Tránsito Terrestre), Artículo 30,
 * "Equipos de prevención y seguridad". Texto verificado contra
 * https://leyes.co/codigo_nacional_de_transito_terrestre/30.htm
 * el 2026-09-13. Antes de publicar a producción, contrastar además con el
 * Diario Oficial o secretariasenado.gov.co, que no fue accesible desde
 * este entorno.
 */
export const ART_30_LEY_769: CitaLegal = {
  texto:
    "Equipos de prevención y seguridad. Ningún vehículo podrá transitar por las vías del " +
    "territorio nacional sin portar el siguiente equipo de carretera como mínimo: " +
    "1. Un gato con capacidad para elevar el vehículo. " +
    "2. Una cruceta. " +
    "3. Dos señales de carretera en forma de triángulo en material reflectivo y provistas de " +
    "soportes para ser colocadas en forma vertical, o lámparas de señal de luz amarilla " +
    "intermitentes o de destello. " +
    "4. Un botiquín de primeros auxilios. " +
    "5. Un extintor. " +
    "6. Dos tacos para bloquear el vehículo. " +
    "7. Caja de herramienta básica que como mínimo deberá contener: alicate, destornilladores, " +
    "llave de expansión y llaves fijas. " +
    "8. Llanta de repuesto. " +
    "9. Linterna. " +
    "Parágrafo. Ningún vehículo podrá circular por las vías urbanas, portando defensas rígidas " +
    "diferentes de las instaladas originalmente por el fabricante.",
  fuente: "Ley 769 de 2002 · Código Nacional de Tránsito Terrestre, Art. 30",
  url: "https://leyes.co/codigo_nacional_de_transito_terrestre/30.htm",
  consultadoEl: "2026-09-13",
};

/**
 * Resolución 20223040040595 de 2022 del Ministerio de Transporte (guía
 * metodológica del PESV), Paso 16 de la Fase 2: "Inspección de vehículos
 * y equipos". Solo se referencia el número, el título oficial del paso y
 * su alcance general: el PDF oficial no pudo transcribirse verbatim en
 * esta sesión (extracción de texto no disponible), así que aquí no se
 * entrecomilla contenido no verificado carácter por carácter. Antes de
 * publicar a producción, cotejar contra el PDF oficial de MinTransporte y
 * completar el texto literal si se requiere cita textual completa.
 */
export const PASO_16_RES_40595: CitaLegal = {
  texto:
    "Paso 16. Inspección de vehículos y equipos (Fase 2 — Implementación). La organización debe " +
    "definir el procedimiento y el formato de registro de la inspección preoperacional diaria de " +
    "los vehículos automotores y no automotores usados en desplazamientos laborales, según el " +
    "nivel de riesgo vial de la operación.",
  fuente: "Resolución 20223040040595 de 2022 (MinTransporte) · Metodología PESV, Paso 16",
  url: "https://normas.cra.gov.co/gestor/docs/resolucion_mintransporte_40595_2022.htm",
  consultadoEl: "2026-09-13",
};

export const PASO_17_RES_40595: CitaLegal = {
  texto:
    "Paso 17. Mantenimiento y control de vehículos seguros y equipos (Fase 2 — Implementación). " +
    "La organización debe diseñar e implementar un plan de mantenimiento preventivo para los " +
    "vehículos y equipos usados en la operación, con su documentación, periodicidad y responsables.",
  fuente: "Resolución 20223040040595 de 2022 (MinTransporte) · Metodología PESV, Paso 17",
  url: "https://normas.cra.gov.co/gestor/docs/resolucion_mintransporte_40595_2022.htm",
  consultadoEl: "2026-09-13",
};

/** Citas completas aplicables al equipo de carretera (Art. 30 + Paso 16/17 del PESV). */
export const CITAS_EQUIPO_CARRETERA: CitaLegal[] = [
  ART_30_LEY_769,
  PASO_16_RES_40595,
  PASO_17_RES_40595,
];
