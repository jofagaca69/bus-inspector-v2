"use server";

import { redirect } from "next/navigation";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cedulaAEmail, esquemaCedula, esquemaContrasena } from "@/lib/auth/cedula";

export interface EstadoLogin {
  error?: string;
}

const esquemaLogin = {
  cedula: esquemaCedula,
  contrasena: esquemaContrasena,
};

export async function iniciarSesion(
  _prevState: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const cedulaResultado = esquemaLogin.cedula.safeParse(formData.get("cedula"));
  const contrasenaResultado = esquemaLogin.contrasena.safeParse(
    formData.get("contrasena"),
  );

  // Mensaje genérico a propósito: nunca decir "esa cédula no existe", eso
  // permitiría a alguien enumerar qué cédulas están registradas.
  if (!cedulaResultado.success || !contrasenaResultado.success) {
    return { error: "Cédula o contraseña incorrecta" };
  }

  const supabase = await crearClienteServidor();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cedulaAEmail(cedulaResultado.data),
    password: contrasenaResultado.data,
  });

  if (error || !data.user) {
    return { error: "Cédula o contraseña incorrecta" };
  }

  const { data: perfil } = await supabase
    .from("profiles")
    .select("activo")
    .eq("id", data.user.id)
    .single<{ activo: boolean }>();

  if (!perfil || !perfil.activo) {
    await supabase.auth.signOut();
    return {
      error: "Este usuario está inactivo. Comunícate con un administrador.",
    };
  }

  redirect("/inicio");
}

export async function cerrarSesion(): Promise<void> {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}
