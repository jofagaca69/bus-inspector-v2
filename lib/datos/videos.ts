import type { VideoTema } from "@/lib/datos/tipos";

/**
 * Registro ÚNICO de todos los videos de YouTube de la app. Los módulos de
 * contenido (normativa, primeros auxilios, aprendizaje) referencian
 * `videos.<clave>` en vez de repetir el ID, y así un mismo video (ej. la
 * RCP) se corrige en un solo lugar.
 *
 * Reglas para agregar uno:
 *  1. Un video se incorpora solo si `node scripts/verificar-videos.mjs
 *     --candidatos <ID>` lo encuentra. Un ID inválido rompe el reproductor.
 *  2. `titulo` y `fuente` salen de lo que devuelve oEmbed (título y canal
 *     reales, sin emojis, hashtags ni marcas repetidas), no se inventan: la
 *     fuente que se muestra al conductor debe ser quien de verdad publicó
 *     el video.
 *  3. Antes de una demostración o entrega: `node scripts/verificar-videos.mjs`
 *     (sale con error si alguno fue retirado). Ese script lee ESTE archivo,
 *     por eso aquí no debe aparecer ningún otro campo de nombre "id".
 *
 * Los videos son de terceros: el contenido médico es de referencia y no
 * reemplaza una certificación en primeros auxilios (ver el descargo de
 * responsabilidad de /primeros-auxilios).
 */
export const videos = {
  // --- Primeros auxilios ---
  rcp: {
    id: "4_o3eLNIZ7o",
    titulo: "Cómo hacer RCP paso a paso",
    fuente: "Cruz Roja Colombiana",
  },
  primerosAuxilios: {
    id: "Bn7GpIBc38Q",
    titulo: "¡Aprende primeros auxilios y salva vidas!",
    fuente: "Cruz Roja Colombiana",
  },
  atragantamiento: {
    id: "HDsBQJhIRZc",
    titulo: "Atragantamientos en personas adultas y niños (maniobra de Heimlich)",
    fuente: "Cruz Roja en Euskadi",
  },
  fracturas: {
    id: "Hhg2HKiAN-o",
    titulo: "¿Qué hacer en caso de una fractura?",
    fuente: "Cruz Roja Mexicana IAP",
  },
  hemorragias: {
    id: "JG1wfNUTzCc",
    titulo: "Primeros auxilios: hemorragias",
    fuente: "Achs",
  },
  quemaduras: {
    id: "8Ez1-DXOhD0",
    titulo: "Recomendaciones en caso de quemaduras",
    fuente: "Superintendencia de Riesgos del Trabajo",
  },
  convulsiones: {
    id: "8TK3N3ZT_TQ",
    titulo: "Primeros auxilios en caso de convulsión",
    fuente: "Centro Médico ABC",
  },

  // --- Accidentes y emergencias en vía ---
  protocoloPas: {
    id: "3RARqV5cABg",
    titulo: "Protocolo PAS",
    fuente: "Agencia Nacional de Seguridad Vial",
  },
  evacuacionEscolar: {
    id: "2IwK7aNvxkE",
    titulo: "Evacuación en centros escolares",
    fuente: "Fundación Mapfre",
  },

  // --- Gestión y PESV ---
  pesv: {
    id: "VLexki9naPE",
    titulo: "Conoce qué es el Plan Estratégico de Seguridad Vial (PESV) y cómo está estructurado",
    fuente: "Seguros SURA",
  },

  // --- Conducción ---
  defensivaTecnicas: {
    id: "2r7itD8DmS0",
    titulo: "Técnicas de manejo defensivo",
    fuente: "Conducir Colombia",
  },
  defensivaDomina: {
    id: "-agXrYApHaw",
    titulo: "¡Domina el manejo defensivo!",
    fuente: "Conducir Colombia",
  },
  lluvia: {
    id: "NXR31U4vnYo",
    titulo: "Si manejas con lluvia, asegúrate de no cometer estos errores",
    fuente: "Velocidad Total",
  },
  frenado: {
    id: "2mXxv5Rusro",
    titulo: "Cómo parar y detener un vehículo",
    fuente: "Fundación Mapfre",
  },
  ecoConduccion: {
    id: "7ej4_XZe2dM",
    titulo: "Conducción eficiente",
    fuente: "Fundación Mapfre",
  },
  ecoIntroduccion: {
    id: "yLfAD-X6RlQ",
    titulo: "Introducción a las técnicas de conducción eficiente",
    fuente: "Fundación Mapfre",
  },
  ecoPendientes: {
    id: "LIEJaoda3S0",
    titulo: "Conducción eficiente en rampas y pendientes",
    fuente: "Fundación Mapfre",
  },

  // --- Mantenimiento ---
  mantenimientoTes: {
    id: "3_wbsrHvx2I",
    titulo: "Mantenimiento preventivo del vehículo",
    fuente: "Elizari Consultora",
  },
  mantenimientoFlota: {
    id: "ukBuEzkPeqc",
    titulo: "Mantenimiento preventivo de un vehículo",
    fuente: "Advanced Fleet Management Tube",
  },

  // --- Salud del conductor ---
  fatigaSomnolencia: {
    id: "WXcXJ8gE4Yg",
    titulo: "La somnolencia causa accidentes de tráfico",
    fuente: "NOSOLOMOTOR",
  },
  pausasActivas: {
    id: "IAvlZMMpuoo",
    titulo: "Pausas activas para conductores",
    fuente: "Producciones Charria",
  },
  ergonomiaSura: {
    id: "Xvw0rj2HwTM",
    titulo: "Ergonomía de la conducción",
    fuente: "Centro Experiencias Movilidad SURA",
  },
  ergonomiaEjercicios: {
    id: "KUXhkUH7L_c",
    titulo: "Ergonomía en el vehículo y en el camión: ejercicios",
    fuente: "Egarsat Mutua",
  },
} satisfies Record<string, VideoTema>;
