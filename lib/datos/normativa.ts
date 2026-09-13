import type { EntradaNormativa } from "@/lib/datos/tipos";

/**
 * Normativa de tránsito aplicable a conductores de servicio público,
 * basada en el Código Nacional de Tránsito (Ley 769 de 2002 y sus
 * modificaciones). Cada entrada alimenta un <Acordeon> en /normativa.
 */
export const normativa: EntradaNormativa[] = [
  {
    id: "documentos-obligatorios",
    icono: "📄",
    titulo: "Documentos obligatorios",
    fuente: "Requisito general de circulación",
    cuerpo:
      "Como conductor de servicio público debés portar: licencia de conducción vigente para la categoría del vehículo, SOAT, revisión tecnomecánica y de emisiones vigente, y tarjeta de operación del vehículo.",
    tip: "Llevá también una copia digital en el celular, por si olvidás la carpeta física.",
  },
  {
    id: "equipo-carretera",
    icono: "🧰",
    titulo: "Equipo de carretera obligatorio",
    fuente: "Ley 769 de 2002 · Art. 30",
    cuerpo:
      "El Código Nacional de Tránsito exige portar: llanta de repuesto, herramientas básicas, dos señales de carretera reflectivas, botiquín de primeros auxilios, extintor y linterna.",
    tip: "Revisá el vencimiento del extintor y los insumos del botiquín, no solo que estén presentes.",
  },
  {
    id: "cinturon-seguridad",
    icono: "🔶",
    titulo: "Cinturón de seguridad",
    fuente: "Código Nacional de Tránsito",
    cuerpo:
      "El uso del cinturón de seguridad es obligatorio para el conductor y, cuando el vehículo cuenta con ellos, también para los pasajeros.",
    tip: "Recordá a los pasajeros que se lo coloquen antes de arrancar, sobre todo en las primeras filas.",
  },
  {
    id: "alcohol-sustancias",
    icono: "🚫",
    titulo: "Alcohol y sustancias",
    fuente: "Ley 769 de 2002 · Art. 152",
    cuerpo:
      "Está prohibido conducir bajo efectos del alcohol o sustancias psicoactivas. Para servicio público la tolerancia es cero: cualquier nivel detectado genera sanción.",
    tip: "Si tomaste la noche anterior, verificá que hayan pasado suficientes horas antes de tomar el volante.",
  },
  {
    id: "uso-celular",
    icono: "📱",
    titulo: "Uso del celular",
    fuente: "Código Nacional de Tránsito",
    cuerpo:
      "Usar el celular en la mano mientras se conduce está prohibido. Cualquier comunicación debe hacerse con manos libres y sin distraer la atención de la vía.",
    tip: "Dejá el celular fuera de alcance mientras conducís, no solo en silencio.",
  },
  {
    id: "paraderos-rutas",
    icono: "🚏",
    titulo: "Paraderos y rutas autorizadas",
    fuente: "Normativa de transporte público",
    cuerpo:
      "El transporte público debe recoger y dejar pasajeros únicamente en los paraderos y sobre la ruta autorizada por la autoridad de tránsito competente.",
    tip: "Detenerte fuera de paradero pone en riesgo a los pasajeros que bajan y al tránsito detrás tuyo.",
  },
  {
    id: "velocidades-maximas",
    icono: "🚦",
    titulo: "Velocidades máximas",
    fuente: "Ley 769 de 2002 · Art. 106",
    cuerpo:
      "En zonas urbanas la velocidad máxima general es 50 km/h (30 km/h en zonas escolares y residenciales, salvo señal distinta). En carretera, la señalización de cada tramo indica el límite; para buses suele ser más restrictivo que para vehículos livianos.",
    tip: "Ajustá siempre la velocidad a las condiciones reales de la vía, aunque el límite permita ir más rápido.",
  },
  {
    id: "licencia-categoria",
    icono: "🪪",
    titulo: "Licencia de conducción",
    fuente: "Ley 769 de 2002 · Art. 19-20",
    cuerpo:
      "Conducir un bus de servicio público requiere licencia categoría C2 o C3 según el tipo de vehículo, vigente y sin comparendos pendientes que la suspendan.",
    tip: "Verificá la fecha de vencimiento de tu licencia con anticipación: la renovación puede tardar varios días.",
  },
  {
    id: "tarjeta-operacion",
    icono: "🧾",
    titulo: "Tarjeta de operación",
    fuente: "Decreto 431 de 2017",
    cuerpo:
      "Todo vehículo de transporte público debe portar la tarjeta de operación vigente, expedida por la empresa habilitada, que autoriza su vinculación y la ruta que presta.",
    tip: "La tarjeta de operación es del vehículo, no del conductor: confirmá que corresponda al bus que estás manejando ese día.",
  },
];
