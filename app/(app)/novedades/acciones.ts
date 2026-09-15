"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { obtenerPerfil, requerirAdmin } from "@/lib/auth/dal";
import { crearClienteServidor } from "@/lib/supabase/servidor";

/**
 * Server Actions de Novedades. Las de resolución exigen requerirAdmin()
 * (primera línea) pero, igual que app/(app)/perfil/acciones.ts, usan el
 * cliente NORMAL y no crearClienteAdmin(): quien de verdad decide qué
 * columnas puede tocar cada rol es el trigger
 * proteger_resolucion_novedad() de la base de datos (ver
 * 0003_inspecciones.sql, sección 14), no este archivo. requerirAdmin()
 * está para dar el 403 limpio y temprano en la ruta de admin.
 */

export interface EstadoNovedadForm {
  error?: string;
  exito?: boolean;
  /** Id de la novedad recién creada, para poder adjuntarle evidencia justo después. */
  novedadId?: string;
}

const esquemaReporte = z.object({
  busId: z.string().uuid(),
  inspeccionId: z.string().uuid().optional(),
  inspeccionItemId: z.string().uuid().optional(),
  tipo: z.enum([
    "mecanica",
    "electrica",
    "carroceria",
    "seguridad",
    "documentacion",
    "limpieza",
    "otra",
  ]),
  severidad: z.enum(["baja", "media", "alta", "critica"]).default("media"),
  descripcion: z.string().trim().min(10, "Describe la novedad con un poco más de detalle").max(2000),
});

export async function reportarNovedad(
  _prevState: EstadoNovedadForm,
  formData: FormData,
): Promise<EstadoNovedadForm> {
  const perfil = await obtenerPerfil();

  const resultado = esquemaReporte.safeParse({
    busId: formData.get("busId"),
    inspeccionId: formData.get("inspeccionId") || undefined,
    inspeccionItemId: formData.get("inspeccionItemId") || undefined,
    tipo: formData.get("tipo"),
    severidad: formData.get("severidad") || undefined,
    descripcion: formData.get("descripcion"),
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("novedades")
    .insert({
      bus_id: resultado.data.busId,
      inspeccion_id: resultado.data.inspeccionId ?? null,
      inspeccion_item_id: resultado.data.inspeccionItemId ?? null,
      reportada_por: perfil.id,
      tipo: resultado.data.tipo,
      severidad: resultado.data.severidad,
      descripcion: resultado.data.descripcion,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "No se pudo registrar la novedad. Intenta de nuevo." };

  revalidatePath("/alertas");
  if (resultado.data.inspeccionId) revalidatePath(`/inspeccion/${resultado.data.inspeccionId}`);
  return { exito: true, novedadId: data.id };
}

/** Registra la ruta de una evidencia ya subida a Storage y asociada a una
 * novedad (no a un ítem de inspección). Ver registrarEvidencia en
 * app/(app)/inspeccion/acciones.ts para la misma lógica del lado de ítems. */
export async function registrarEvidenciaNovedad(datos: {
  novedadId: string;
  ruta: string;
  mime: string;
  bytes: number;
}): Promise<void> {
  const perfil = await obtenerPerfil();
  const supabase = await crearClienteServidor();

  await supabase.from("evidencias").insert({
    novedad_id: datos.novedadId,
    ruta: datos.ruta,
    mime: datos.mime,
    bytes: datos.bytes,
    subida_por: perfil.id,
  });

  revalidatePath("/alertas");
}

export async function eliminarEvidenciaNovedad(evidenciaId: string, ruta: string): Promise<void> {
  await obtenerPerfil();
  const supabase = await crearClienteServidor();
  await supabase.from("evidencias").delete().eq("id", evidenciaId);
  await supabase.storage.from("evidencias").remove([ruta]);
  revalidatePath("/alertas");
}

const esquemaResolucion = z.object({
  id: z.string().uuid(),
  notaResolucion: z.string().trim().max(2000).optional(),
});

export async function resolverNovedad(
  _prevState: EstadoNovedadForm,
  formData: FormData,
): Promise<EstadoNovedadForm> {
  const perfil = await requerirAdmin();

  const resultado = esquemaResolucion.safeParse({
    id: formData.get("id"),
    notaResolucion: formData.get("notaResolucion") || undefined,
  });
  if (!resultado.success) return { error: "Datos inválidos" };

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("novedades")
    .update({
      estado: "resuelta",
      resuelta_por: perfil.id,
      resuelta_en: new Date().toISOString(),
      nota_resolucion: resultado.data.notaResolucion ?? null,
    })
    .eq("id", resultado.data.id);

  if (error) return { error: "No se pudo resolver la novedad." };

  revalidatePath("/alertas");
  return { exito: true };
}

export async function marcarEnProcesoNovedad(id: string): Promise<void> {
  await requerirAdmin();
  const supabase = await crearClienteServidor();
  await supabase.from("novedades").update({ estado: "en_proceso" }).eq("id", id);
  revalidatePath("/alertas");
}

export async function descartarNovedad(id: string, notaResolucion?: string): Promise<void> {
  const perfil = await requerirAdmin();
  const supabase = await crearClienteServidor();
  await supabase
    .from("novedades")
    .update({
      estado: "descartada",
      resuelta_por: perfil.id,
      resuelta_en: new Date().toISOString(),
      nota_resolucion: notaResolucion ?? null,
    })
    .eq("id", id);
  revalidatePath("/alertas");
}

export async function cambiarSeveridadNovedad(
  id: string,
  severidad: "baja" | "media" | "alta" | "critica",
): Promise<void> {
  await requerirAdmin();
  const supabase = await crearClienteServidor();
  await supabase.from("novedades").update({ severidad }).eq("id", id);
  revalidatePath("/alertas");
}
