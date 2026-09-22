export type Rol = "conductor" | "admin";

export interface Perfil {
  id: string;
  cedula: string;
  nombre_completo: string;
  telefono: string | null;
  rol: Rol;
  activo: boolean;
  /** Bus asignado por defecto (ver supabase/migrations/0003_inspecciones.sql). Editable por el propio conductor. */
  bus_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Ficha del conductor: columnas agregadas por
 * supabase/migrations/0004_ficha_conductor.sql. Todas son opcionales y
 * `null` cuando aún no se han capturado. Si la migración todavía no se ha
 * aplicado, PostgREST simplemente no devuelve estas columnas: por eso el
 * código las trata como `null | undefined` y nunca asume que existen.
 */
export interface FichaConductor {
  licencia_numero?: string | null;
  licencia_categoria?: string | null;
  /** YYYY-MM-DD (columna `date`). */
  licencia_vence?: string | null;
  rh?: string | null;
  eps?: string | null;
  contacto_emergencia_nombre?: string | null;
  contacto_emergencia_telefono?: string | null;
  /** YYYY-MM-DD (columna `date`). */
  fecha_ingreso?: string | null;
}

export type PerfilConFicha = Perfil & FichaConductor;
