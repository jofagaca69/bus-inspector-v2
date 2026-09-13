"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requerirAdmin } from "@/lib/auth/dal";
import { crearClienteAdmin } from "@/lib/supabase/admin";
import { cedulaAEmail, esquemaCedula, esquemaContrasena } from "@/lib/auth/cedula";

export interface EstadoFormularioUsuario {
  error?: string;
  exito?: boolean;
}

const esquemaCrearConductor = z.object({
  cedula: esquemaCedula,
  nombre_completo: z.string().trim().min(3, "El nombre es obligatorio"),
  telefono: z.string().trim().optional(),
  contrasena: esquemaContrasena,
});

export async function crearConductor(
  _prevState: EstadoFormularioUsuario,
  formData: FormData,
): Promise<EstadoFormularioUsuario> {
  // Primera línea, siempre: el proxy solo hace un chequeo optimista de
  // sesión y puede no cubrir esta acción si su matcher cambia en el
  // futuro. La autorización real de "quién puede crear usuarios" vive aquí.
  await requerirAdmin();

  const resultado = esquemaCrearConductor.safeParse({
    cedula: formData.get("cedula"),
    nombre_completo: formData.get("nombre_completo"),
    telefono: formData.get("telefono") || undefined,
    contrasena: formData.get("contrasena"),
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { cedula, nombre_completo, telefono, contrasena } = resultado.data;
  const supabaseAdmin = crearClienteAdmin();

  const { data: existente } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("cedula", cedula)
    .maybeSingle();

  if (existente) {
    return { error: "Ya existe un usuario con esa cédula" };
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: cedulaAEmail(cedula),
    password: contrasena,
    email_confirm: true,
    user_metadata: {
      cedula,
      nombre_completo,
      rol: "conductor",
    },
  });

  if (error) {
    return { error: "No se pudo crear el usuario. Intenta de nuevo." };
  }

  if (telefono) {
    await supabaseAdmin
      .from("profiles")
      .update({ telefono })
      .eq("cedula", cedula);
  }

  revalidatePath("/admin/usuarios");
  return { exito: true };
}

export async function cambiarEstadoUsuario(
  id: string,
  activo: boolean,
): Promise<void> {
  await requerirAdmin();

  const supabaseAdmin = crearClienteAdmin();
  await supabaseAdmin.from("profiles").update({ activo }).eq("id", id);

  revalidatePath("/admin/usuarios");
}

const esquemaRestablecer = z.object({
  id: z.string().uuid(),
  nuevaContrasena: esquemaContrasena,
});

export async function restablecerContrasena(
  _prevState: EstadoFormularioUsuario,
  formData: FormData,
): Promise<EstadoFormularioUsuario> {
  await requerirAdmin();

  const resultado = esquemaRestablecer.safeParse({
    id: formData.get("id"),
    nuevaContrasena: formData.get("nuevaContrasena"),
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabaseAdmin = crearClienteAdmin();
  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    resultado.data.id,
    { password: resultado.data.nuevaContrasena },
  );

  if (error) {
    return { error: "No se pudo restablecer la contraseña." };
  }

  return { exito: true };
}
