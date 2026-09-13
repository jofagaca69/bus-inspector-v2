export type Rol = "conductor" | "admin";

export interface Perfil {
  id: string;
  cedula: string;
  nombre_completo: string;
  telefono: string | null;
  rol: Rol;
  activo: boolean;
  created_at: string;
  updated_at: string;
}
