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
