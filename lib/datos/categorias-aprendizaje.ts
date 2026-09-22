import type { CategoriaAprendizaje } from "@/lib/datos/tipos";

/**
 * Etiquetas de las categorías del centro de aprendizaje. Van en su propio
 * archivo, sin el contenido de los temas, porque las usan componentes
 * cliente (filtro y tarjetas del índice): importarlas desde
 * lib/datos/aprendizaje.ts arrastraría todo el contenido al bundle del
 * navegador.
 */
export const ETIQUETA_CATEGORIA: Record<CategoriaAprendizaje, string> = {
  conduccion: "Conducción",
  vehiculo: "Vehículo",
  pasajeros: "Pasajeros",
  salud: "Salud",
  emergencias: "Emergencias",
  gestion: "Gestión",
};

export const ORDEN_CATEGORIAS: CategoriaAprendizaje[] = [
  "conduccion",
  "vehiculo",
  "pasajeros",
  "salud",
  "emergencias",
  "gestion",
];
