import { z } from "zod";

/**
 * Quita puntos, espacios y guiones de una cédula escrita a mano
 * (ej. "1.012.345.678" o "1012345678") dejando solo dígitos.
 * Debe aplicarse SIEMPRE antes de tocar la base de datos, tanto al crear
 * un usuario como al iniciar sesión: si no, "1.012.345.678" y
 * "1012345678" se tratarían como dos identidades distintas.
 */
export function normalizarCedula(valor: string): string {
  return valor.replace(/[.\s-]/g, "");
}

export const esquemaCedula = z
  .string()
  .transform(normalizarCedula)
  .pipe(
    z
      .string()
      .regex(/^[0-9]{6,12}$/, "La cédula debe tener entre 6 y 12 dígitos"),
  );

export const esquemaContrasena = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres");

/**
 * Construye el email sintético usado internamente por Supabase Auth a
 * partir de una cédula ya normalizada. Nunca se muestra al usuario.
 */
export function cedulaAEmail(cedulaNormalizada: string): string {
  const dominio = process.env.NEXT_PUBLIC_DOMINIO_CEDULA;
  if (!dominio) {
    throw new Error(
      "Falta la variable de entorno NEXT_PUBLIC_DOMINIO_CEDULA",
    );
  }
  return `${cedulaNormalizada}@${dominio}`;
}
