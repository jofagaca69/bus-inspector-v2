"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requerirAdmin } from "@/lib/auth/dal";
import { crearClienteServidor } from "@/lib/supabase/servidor";

/**
 * Gestión de flota. A diferencia de app/(app)/admin/usuarios/acciones.ts
 * (que usa crearClienteAdmin() porque necesita auth.admin.createUser,
 * fuera del alcance de RLS), aquí basta el cliente NORMAL: la policy
 * "buses_insert"/"buses_update" de 0003_inspecciones.sql ya exige
 * rol_actual() = 'admin', así que RLS es garantía suficiente y no hace
 * falta saltársela con service_role.
 */

export interface EstadoFormularioBus {
  error?: string;
  exito?: boolean;
}

const esquemaBus = z.object({
  placa: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}[0-9]{3}$/, "La placa debe tener el formato AAA000"),
  numero_interno: z.string().trim().min(1, "El número interno es obligatorio").max(10),
  modelo: z.string().trim().max(120).optional(),
});

export async function crearBus(
  _prevState: EstadoFormularioBus,
  formData: FormData,
): Promise<EstadoFormularioBus> {
  await requerirAdmin();

  const resultado = esquemaBus.safeParse({
    placa: formData.get("placa"),
    numero_interno: formData.get("numero_interno"),
    modelo: formData.get("modelo") || undefined,
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.from("buses").insert(resultado.data);

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un bus con esa placa o número interno." };
    }
    return { error: "No se pudo crear el bus. Intenta de nuevo." };
  }

  revalidatePath("/admin/buses");
  return { exito: true };
}

export async function cambiarEstadoBus(id: string, activo: boolean): Promise<void> {
  await requerirAdmin();
  const supabase = await crearClienteServidor();
  await supabase.from("buses").update({ activo }).eq("id", id);
  revalidatePath("/admin/buses");
}

export async function asignarBusAConductor(conductorId: string, busId: string | null): Promise<void> {
  await requerirAdmin();
  const supabase = await crearClienteServidor();
  await supabase.from("profiles").update({ bus_id: busId }).eq("id", conductorId);
  revalidatePath("/admin/buses");
  revalidatePath("/admin/usuarios");
}
