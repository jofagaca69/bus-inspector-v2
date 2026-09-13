import type { Rol } from "@/lib/auth/tipos";

/**
 * Fuente única de verdad del menú de la app. Tanto el menú lateral
 * (drawer) como la cuadrícula de /inicio se generan a partir de este
 * array, así que agregar o reordenar un módulo es editar solo este
 * archivo.
 */
export interface ItemNavegacion {
  href: string;
  etiqueta: string;
  descripcion: string;
  icono: string;
  /**
   * false = módulo aún no implementado (ej. inspección diaria, que se
   * construirá en una iteración futura). Se muestra atenuado y sin
   * navegación.
   */
  disponible: boolean;
  /** Si se define, el ítem solo aparece para ese rol. */
  soloRol?: Rol;
}

export const itemsNavegacion: ItemNavegacion[] = [
  {
    href: "/inspeccion",
    etiqueta: "Inspección diaria",
    descripcion: "Lista de chequeo preventiva del bus",
    icono: "📋",
    disponible: true,
  },
  {
    href: "/historial",
    etiqueta: "Historial de inspecciones",
    descripcion: "Consulta inspecciones anteriores",
    icono: "🗂️",
    disponible: true,
  },
  {
    href: "/alertas",
    etiqueta: "Centro de alertas",
    descripcion: "Novedades abiertas y recordatorios",
    icono: "🔔",
    disponible: true,
  },
  {
    href: "/aprendizaje",
    etiqueta: "Centro de aprendizaje",
    descripcion: "Conducción defensiva, mantenimiento y más",
    icono: "🎓",
    disponible: true,
  },
  {
    href: "/normativa",
    etiqueta: "Normativa de tránsito",
    descripcion: "Documentos, equipo obligatorio y reglas clave",
    icono: "📖",
    disponible: true,
  },
  {
    href: "/senales",
    etiqueta: "Señales de tránsito",
    descripcion: "Reglamentarias, preventivas e informativas",
    icono: "🚸",
    disponible: true,
  },
  {
    href: "/primeros-auxilios",
    etiqueta: "Primeros auxilios",
    descripcion: "Emergencias, botiquín y guías rápidas",
    icono: "🩹",
    disponible: true,
  },
  {
    href: "/perfil",
    etiqueta: "Mi perfil",
    descripcion: "Tus datos y contraseña",
    icono: "👤",
    disponible: true,
  },
  {
    href: "/contacto",
    etiqueta: "Contacto",
    descripcion: "Comunícate con la empresa",
    icono: "📞",
    disponible: true,
  },
  {
    href: "/acerca-de",
    etiqueta: "Acerca de",
    descripcion: "Sobre esta aplicación",
    icono: "ℹ️",
    disponible: true,
  },
];

/** Ítems exclusivos de administradores, se agregan aparte al menú/portada. */
export const itemAdmin: ItemNavegacion = {
  href: "/admin/usuarios",
  etiqueta: "Conductores",
  descripcion: "Alta y gestión de cuentas",
  icono: "🛠️",
  disponible: true,
  soloRol: "admin",
};

export const itemAdminBuses: ItemNavegacion = {
  href: "/admin/buses",
  etiqueta: "Flota",
  descripcion: "Buses y asignación a conductores",
  icono: "🚌",
  disponible: true,
  soloRol: "admin",
};

export function itemsParaRol(rol: Rol): ItemNavegacion[] {
  const items = [...itemsNavegacion];
  if (rol === "admin") items.push(itemAdminBuses, itemAdmin);
  return items;
}
