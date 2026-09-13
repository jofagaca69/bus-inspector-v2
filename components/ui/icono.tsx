import { cx } from "@/lib/utils";

/**
 * Set de iconos SVG hechos a mano. El resto de la app usa emojis en string
 * (lib/navegacion.ts, lib/datos/*), suficiente para módulos y navegación.
 * Pero un emoji no distingue un alternador de una batería: el catálogo de
 * inspección necesita iconografía de dominio vehicular que no existe en
 * ninguna librería de iconos genérica, así que se dibuja a mano en vez de
 * añadir una dependencia (lucide, heroicons) solo para una docena de casos.
 */
export type NombreIcono =
  | "check"
  | "equis"
  | "alerta"
  | "guion"
  | "reloj"
  | "camara"
  | "motor"
  | "aceite"
  | "refrigerante"
  | "filtro-aire"
  | "freno"
  | "suspension"
  | "direccion"
  | "llanta"
  | "electrico"
  | "bateria"
  | "alternador"
  | "luz"
  | "limpiaparabrisas"
  | "espejo"
  | "puerta"
  | "ventana"
  | "cinturon"
  | "salida-emergencia"
  | "martillo"
  | "botiquin"
  | "extintor"
  | "triangulo"
  | "herramientas"
  | "tacografo"
  | "direccional"
  | "placa"
  | "faro"
  | "reversa";

const TRAZOS: Record<NombreIcono, React.ReactNode> = {
  check: <path d="M4.5 12.75l6 6 9-13.5" />,
  equis: <path d="M6 6l12 12M6 18L18 6" />,
  alerta: (
    <>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </>
  ),
  guion: <path d="M5 12h14" />,
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  camara: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.3" />
      <path d="M8 7l1.4-2.4h5.2L16 7" />
    </>
  ),
  motor: (
    <>
      <rect x="3" y="9" width="13" height="8" rx="1.5" />
      <path d="M16 11h3l2 2v4h-5" />
      <path d="M6 9V6h5v3M9.5 17v2M13 17v2" />
    </>
  ),
  aceite: (
    <>
      <path d="M12 3c2.5 3 5 6.2 5 9.3A5 5 0 0 1 7 12.3C7 9.2 9.5 6 12 3Z" />
      <path d="M9.5 13.5h5" />
    </>
  ),
  refrigerante: (
    <>
      <path d="M12 2v20M6 6l12 12M18 6 6 18M4 12h4m8 0h4" />
    </>
  ),
  "filtro-aire": (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M8 9v6M12 9v6M16 9v6" />
    </>
  ),
  freno: (
    <>
      <path d="M8.5 3h7L20 7.5v9L15.5 21h-7L4 16.5v-9L8.5 3Z" />
      <path d="M9 12h6" />
    </>
  ),
  suspension: (
    <>
      <path d="M7 3v18M17 3v18" />
      <path d="M7 6.5h10M7 10h10M7 13.5h10M7 17h10" strokeDasharray="1.5 2.2" />
    </>
  ),
  direccion: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v3M12 14v3M7 12h3M14 12h3" />
    </>
  ),
  llanta: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.7" />
      <path d="M12 4v3.3M12 16.7V20M4 12h3.3M16.7 12H20" />
    </>
  ),
  electrico: (
    <>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </>
  ),
  bateria: (
    <>
      <rect x="3" y="8" width="16" height="10" rx="1.5" />
      <path d="M19 11v4M8 8V6h6v2" />
      <path d="M7 13h3M10 11v4" />
    </>
  ),
  alternador: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8.5v7M8.5 12h7" />
      <path d="M5.5 12a6.5 6.5 0 0 1 13 0" strokeDasharray="1.5 2" />
    </>
  ),
  luz: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>
  ),
  limpiaparabrisas: (
    <>
      <path d="M5 20 12 5l7 15" />
      <path d="M8.5 13a4 4 0 0 0 7 0" />
    </>
  ),
  espejo: (
    <>
      <ellipse cx="12" cy="8" rx="6" ry="4" />
      <path d="M12 12v8M9 20h6" />
    </>
  ),
  puerta: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <circle cx="15" cy="12" r="1" />
    </>
  ),
  ventana: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="1.5" />
      <path d="M12 5v14M4 12h16" />
    </>
  ),
  cinturon: (
    <>
      <path d="M5 3v9a7 7 0 0 0 14 0V3" />
      <rect x="9" y="15" width="6" height="6" rx="1" />
    </>
  ),
  "salida-emergencia": (
    <>
      <path d="M4 12h11M11 7l5 5-5 5" />
      <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
    </>
  ),
  martillo: (
    <>
      <path d="M14 3 21 10l-3 3-7-7 3-3Z" />
      <path d="M12.5 11.5 4 20l-1-1 8.5-8.5" />
    </>
  ),
  botiquin: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M12 11v6M9 14h6" />
    </>
  ),
  extintor: (
    <>
      <rect x="8" y="9" width="8" height="12" rx="2" />
      <rect x="10" y="4" width="4" height="5" rx="1" />
      <path d="M14 4h3l-1 3" />
    </>
  ),
  triangulo: (
    <>
      <path d="M12 4 21 20H3L12 4Z" />
      <path d="M12 11v4M12 17h.01" />
    </>
  ),
  herramientas: (
    <>
      <path d="M14.7 6.3a3 3 0 0 0-4 4l-6.2 6.2a1.6 1.6 0 0 0 2.3 2.3l6.2-6.2a3 3 0 0 0 4-4L14.7 6.3Z" />
    </>
  ),
  tacografo: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
      <path d="M12 4V2M12 22v-2M20 12h2M2 12h2" />
    </>
  ),
  direccional: (
    <>
      <path d="M4 12h11" />
      <path d="M11 7l5 5-5 5" />
    </>
  ),
  placa: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 12h4M7 14.5h6" />
    </>
  ),
  faro: (
    <>
      <circle cx="9" cy="12" r="3.2" />
      <path d="M13.5 9.3l5.8-2M13.5 12h6M13.5 14.7l5.8 2" />
    </>
  ),
  reversa: (
    <>
      <path d="M4 12a8 8 0 1 1 3 6.2" />
      <path d="M4 12V8M4 12h4" />
    </>
  ),
};

export function Icono({
  nombre,
  className,
  grosorTrazo = 1.8,
}: {
  nombre: NombreIcono;
  className?: string;
  grosorTrazo?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={grosorTrazo}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("shrink-0", className)}
      aria-hidden="true"
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
