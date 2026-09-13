import type { ZonaBus } from "@/lib/datos/tipos";

/**
 * Mapa de hotspots táctiles sobre las 3 fotos del bus (public/buses/).
 * Un componente puede aparecer en varias zonas (las luces se ven desde
 * frontal y trasera), pero tiene un único estado en la inspección: tocar
 * cualquiera de sus zonas abre la misma ficha (ver lib/datos/componentes.ts).
 *
 * Las coordenadas (x, y) son PORCENTAJE del ancho/alto de la imagen, no
 * píxeles, para que el hotspot se mantenga alineado en cualquier tamaño
 * de pantalla. Son una estimación inicial: components/inspeccion/
 * plano-bus.tsx expone un modo de calibración solo en desarrollo
 * (NODE_ENV === "development") que imprime {x, y} al hacer clic sobre la
 * imagen, para ajustarlas contra las fotos reales antes de publicar.
 */
export const zonasBus: ZonaBus[] = [
  // ---- Lateral (public/buses/lateral.png) ----
  {
    id: "puerta-servicio",
    vista: "lateral",
    x: 35,
    y: 70,
    etiqueta: "Puerta de servicio",
    componentes: ["puertas", "cinturones", "botiquin", "extintor"],
  },
  {
    id: "espejo-lateral",
    vista: "lateral",
    x: 8,
    y: 25,
    etiqueta: "Espejo lateral",
    componentes: ["espejos"],
  },
  {
    id: "ventanas-laterales",
    vista: "lateral",
    x: 55,
    y: 35,
    etiqueta: "Ventanas laterales",
    componentes: ["ventanas", "salidas-martillos-emergencia"],
  },
  {
    id: "tren-delantero",
    vista: "lateral",
    x: 15,
    y: 88,
    etiqueta: "Tren delantero",
    componentes: ["llantas", "frenos", "suspension", "direccion"],
  },
  {
    id: "tren-trasero",
    vista: "lateral",
    x: 85,
    y: 88,
    etiqueta: "Tren trasero",
    componentes: ["llantas", "frenos", "suspension"],
  },
  {
    id: "bodega-equipaje",
    vista: "lateral",
    x: 70,
    y: 65,
    etiqueta: "Bodega de equipaje",
    componentes: ["herramientas-gato", "senales-triangulos"],
  },

  // ---- Frontal (public/buses/frontal.png) ----
  {
    id: "capo-motor",
    vista: "frontal",
    x: 50,
    y: 75,
    etiqueta: "Motor",
    componentes: [
      "motor",
      "aceite",
      "refrigerante",
      "filtro-aire",
      "bateria",
      "alternador",
      "sistema-electrico",
    ],
  },
  {
    id: "parabrisas",
    vista: "frontal",
    x: 50,
    y: 40,
    etiqueta: "Parabrisas",
    componentes: ["limpiabrisas"],
  },
  {
    id: "cabina-conductor",
    vista: "frontal",
    x: 25,
    y: 45,
    etiqueta: "Cabina del conductor",
    componentes: ["tacografo", "direccion"],
  },
  {
    id: "faros-izq",
    vista: "frontal",
    x: 15,
    y: 80,
    etiqueta: "Faro izquierdo",
    componentes: ["luces"],
  },
  {
    id: "faros-der",
    vista: "frontal",
    x: 85,
    y: 80,
    etiqueta: "Faro derecho",
    componentes: ["luces"],
  },
  {
    id: "espejo-frontal-izq",
    vista: "frontal",
    x: 5,
    y: 45,
    etiqueta: "Espejo izquierdo",
    componentes: ["espejos"],
  },
  {
    id: "espejo-frontal-der",
    vista: "frontal",
    x: 95,
    y: 45,
    etiqueta: "Espejo derecho",
    componentes: ["espejos"],
  },

  // ---- Trasera (public/buses/trasera.png) ----
  {
    id: "luces-traseras-izq",
    vista: "trasera",
    x: 15,
    y: 75,
    etiqueta: "Luz trasera izquierda",
    componentes: ["luces"],
  },
  {
    id: "luces-traseras-der",
    vista: "trasera",
    x: 85,
    y: 75,
    etiqueta: "Luz trasera derecha",
    componentes: ["luces"],
  },
  {
    id: "luneta-trasera",
    vista: "trasera",
    x: 50,
    y: 35,
    etiqueta: "Luneta trasera",
    componentes: ["salidas-martillos-emergencia", "ventanas"],
  },
  {
    id: "tren-trasero-posterior",
    vista: "trasera",
    x: 50,
    y: 90,
    etiqueta: "Tren trasero",
    componentes: ["llantas"],
  },
];

export function zonasDeVista(vista: ZonaBus["vista"]): ZonaBus[] {
  return zonasBus.filter((z) => z.vista === vista);
}

export function zonasDeComponente(componenteId: string): ZonaBus[] {
  return zonasBus.filter((z) => z.componentes.includes(componenteId));
}
