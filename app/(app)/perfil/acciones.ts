"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { obtenerPerfil } from "@/lib/auth/dal";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cedulaAEmail, esquemaContrasena } from "@/lib/auth/cedula";

export interface EstadoFormularioPerfil {
  error?: string;
  exito?: boolean;
}

const esquemaDatosPerfil = z.object({
  nombre_completo: z.string().trim().min(3, "El nombre es obligatorio"),
  telefono: z.string().trim().optional(),
});

/**
 * Actualiza nombre y teléfono del propio usuario autenticado.
 *
 * Deliberadamente usa el cliente de servidor normal (no el admin): así
 * la policy RLS "profiles_update" (id = auth.uid()) y el trigger
 * proteger_columnas_privilegiadas (supabase/migrations/0001_perfiles.sql)
 * son quienes garantizan que este UPDATE solo pueda tocar el perfil
 * propio y nunca "rol" ni "activo", sin depender de que este código lo
 * valide correctamente.
 */
export async function actualizarPerfil(
  _prevState: EstadoFormularioPerfil,
  formData: FormData,
): Promise<EstadoFormularioPerfil> {
  const perfil = await obtenerPerfil();

  const resultado = esquemaDatosPerfil.safeParse({
    nombre_completo: formData.get("nombre_completo"),
    telefono: formData.get("telefono") || undefined,
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("profiles")
    .update({
      nombre_completo: resultado.data.nombre_completo,
      telefono: resultado.data.telefono ?? null,
    })
    .eq("id", perfil.id);

  if (error) {
    return { error: "No se pudo actualizar el perfil. Intenta de nuevo." };
  }

  revalidatePath("/perfil");
  return { exito: true };
}

const esquemaCambioContrasena = z
  .object({
    contrasenaActual: z.string().min(1, "Ingresa tu contraseña actual"),
    contrasenaNueva: esquemaContrasena,
    confirmarContrasena: z.string(),
  })
  .refine((datos) => datos.contrasenaNueva === datos.confirmarContrasena, {
    message: "Las contraseñas nuevas no coinciden",
    path: ["confirmarContrasena"],
  });

/**
 * Cambia la contraseña del usuario autenticado. Reautentica con la
 * contraseña actual antes de aplicar el cambio: aunque ya hay sesión
 * activa, esto evita que alguien con el celular desbloqueado de otra
 * persona le cambie la contraseña sin conocerla.
 */
export async function cambiarContrasenaPropia(
  _prevState: EstadoFormularioPerfil,
  formData: FormData,
): Promise<EstadoFormularioPerfil> {
  const perfil = await obtenerPerfil();

  const resultado = esquemaCambioContrasena.safeParse({
    contrasenaActual: formData.get("contrasenaActual"),
    contrasenaNueva: formData.get("contrasenaNueva"),
    confirmarContrasena: formData.get("confirmarContrasena"),
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await crearClienteServidor();

  const { error: errorAuth } = await supabase.auth.signInWithPassword({
    email: cedulaAEmail(perfil.cedula),
    password: resultado.data.contrasenaActual,
  });

  if (errorAuth) {
    return { error: "La contraseña actual no es correcta" };
  }

  const { error: errorCambio } = await supabase.auth.updateUser({
    password: resultado.data.contrasenaNueva,
  });

  if (errorCambio) {
    return { error: "No se pudo cambiar la contraseña. Intenta de nuevo." };
  }

  revalidatePath("/perfil");
  return { exito: true };
}
