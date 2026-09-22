"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { obtenerPerfil, requerirAdmin } from "@/lib/auth/dal";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { cedulaAEmail, esquemaContrasena } from "@/lib/auth/cedula";
import { CATEGORIAS_LICENCIA, GRUPOS_RH } from "@/lib/auth/licencia";

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

/** "YYYY-MM-DD" que además sea una fecha real (rechaza 2026-02-31). */
const fechaCalendario = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida")
  .refine((f) => new Date(`${f}T00:00:00Z`).toISOString().slice(0, 10) === f, "Fecha inválida");

// Los campos vacíos llegan como undefined (ver `|| undefined` más abajo) y se
// guardan como NULL: dejar un campo en blanco es la forma de borrarlo.
// Los rangos y valores permitidos son los mismos de los CHECK de la migración
// 0004_ficha_conductor.sql; aquí se validan antes para dar un mensaje claro
// en vez del error crudo de Postgres.
const esquemaFicha = z.object({
  perfilId: z.string().uuid().optional(),
  licencia_numero: z.string().trim().min(4, "El número de licencia es muy corto").max(20, "El número de licencia es muy largo").optional(),
  licencia_categoria: z.enum(CATEGORIAS_LICENCIA, "Categoría de licencia no válida").optional(),
  licencia_vence: fechaCalendario.optional(),
  rh: z.enum(GRUPOS_RH, "Tipo de sangre no válido").optional(),
  eps: z.string().trim().min(2, "La EPS es muy corta").max(80, "La EPS es muy larga").optional(),
  contacto_emergencia_nombre: z.string().trim().min(3, "El nombre del contacto es muy corto").max(100, "El nombre del contacto es muy largo").optional(),
  contacto_emergencia_telefono: z.string().trim().regex(/^[0-9]{7,12}$/, "El teléfono del contacto debe tener entre 7 y 12 dígitos").optional(),
  fecha_ingreso: fechaCalendario.optional(),
});

/**
 * Guarda la ficha del conductor. Sirve a dos pantallas: /perfil (el
 * conductor edita la suya, sin `perfilId`) y /admin/usuarios/[id] (un admin
 * edita la de otro, con `perfilId`). Editar la ficha de OTRO exige ser
 * admin; además la policy "profiles_update" de la RLS (id = auth.uid() o
 * admin) lo garantiza aunque este chequeo fallara, por eso se usa el
 * cliente normal y no el de service_role.
 */
export async function actualizarFicha(
  _prevState: EstadoFormularioPerfil,
  formData: FormData,
): Promise<EstadoFormularioPerfil> {
  const perfil = await obtenerPerfil();

  const campo = (nombre: string) => formData.get(nombre) || undefined;
  const resultado = esquemaFicha.safeParse({
    perfilId: campo("perfilId"),
    licencia_numero: campo("licencia_numero"),
    licencia_categoria: campo("licencia_categoria"),
    licencia_vence: campo("licencia_vence"),
    rh: campo("rh"),
    eps: campo("eps"),
    contacto_emergencia_nombre: campo("contacto_emergencia_nombre"),
    contacto_emergencia_telefono: campo("contacto_emergencia_telefono"),
    fecha_ingreso: campo("fecha_ingreso"),
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { perfilId, ...datos } = resultado.data;
  const objetivo = perfilId ?? perfil.id;
  if (objetivo !== perfil.id) await requerirAdmin();

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("profiles")
    .update({
      licencia_numero: datos.licencia_numero ?? null,
      licencia_categoria: datos.licencia_categoria ?? null,
      licencia_vence: datos.licencia_vence ?? null,
      rh: datos.rh ?? null,
      eps: datos.eps ?? null,
      contacto_emergencia_nombre: datos.contacto_emergencia_nombre ?? null,
      contacto_emergencia_telefono: datos.contacto_emergencia_telefono ?? null,
      fecha_ingreso: datos.fecha_ingreso ?? null,
    })
    .eq("id", objetivo);

  if (error) {
    // 42703 (Postgres) / PGRST204 (PostgREST): la columna no existe, o sea
    // que falta aplicar la migración 0004 en Supabase.
    if (error.code === "42703" || error.code === "PGRST204") {
      return {
        error:
          "La base de datos aún no tiene los campos de la ficha. Falta aplicar la migración 0004_ficha_conductor.sql en Supabase.",
      };
    }
    return { error: "No se pudo guardar la ficha. Intenta de nuevo." };
  }

  revalidatePath("/perfil");
  revalidatePath("/alertas");
  revalidatePath(`/admin/usuarios/${objetivo}`);
  return { exito: true };
}
