"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { obtenerPerfil } from "@/lib/auth/dal";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import { componentes, componentesDeChequeoRapido, idsComponentes } from "@/lib/datos/componentes";
import type { TipoInspeccion } from "@/lib/inspeccion/tipos";

/**
 * Server Actions de la Inspección Diaria. Todas abren con
 * await obtenerPerfil() como primera línea: el proxy solo hace un
 * chequeo optimista de cookie (ver proxy.ts / lib/supabase/proxy.ts), y
 * una Server Action se invoca como POST a su propia ruta, así que la
 * autorización real vive aquí, igual que en el resto del proyecto.
 *
 * Todas usan el cliente NORMAL (crearClienteServidor), nunca
 * crearClienteAdmin(): la RLS de supabase/migrations/0003_inspecciones.sql
 * es la garantía real de que un conductor no toca inspecciones ajenas,
 * no el código de esta Server Action.
 */

export interface EstadoInspeccion {
  error?: string;
}

const esquemaEstadoItem = z.enum(["correcto", "requiere_revision", "fuera_de_servicio"]);
const esquemaComponente = z.enum(idsComponentes);

/**
 * Abre una inspección nueva (o retoma la que ya estaba en curso) y crea
 * de una vez los N renglones de inspeccion_items con estado
 * "sin_revisar". Así "12 de 23" en la UI es un count, no una resta
 * contra el catálogo de lib/datos/componentes.ts.
 */
export async function iniciarInspeccion(
  busId: string,
  tipo: TipoInspeccion = "completa",
): Promise<never> {
  const perfil = await obtenerPerfil();
  const supabase = await crearClienteServidor();

  const { data: abierta } = await supabase
    .from("inspecciones")
    .select("id")
    .eq("conductor_id", perfil.id)
    .is("finalizada_en", null)
    .maybeSingle();

  if (abierta) {
    redirect(`/inspeccion/${abierta.id}`);
  }

  const { data: nueva, error } = await supabase
    .from("inspecciones")
    .insert({ conductor_id: perfil.id, bus_id: busId, tipo })
    .select("id")
    .single();

  if (error || !nueva) {
    // 23505 = violó inspecciones_una_abierta_por_conductor_idx: perdió
    // una carrera contra un doble tap. Se retoma la que ganó, sin mostrar error.
    if (error?.code === "23505") {
      const { data: existente } = await supabase
        .from("inspecciones")
        .select("id")
        .eq("conductor_id", perfil.id)
        .is("finalizada_en", null)
        .maybeSingle();
      if (existente) redirect(`/inspeccion/${existente.id}`);
    }
    throw new Error("No se pudo iniciar la inspección. Intenta de nuevo.");
  }

  const lista = tipo === "rapida" ? componentesDeChequeoRapido() : componentes;
  const filas = lista.map((c, indice) => ({
    inspeccion_id: nueva.id as string,
    codigo_componente: c.id,
    nombre_componente: c.nombre,
    orden: indice,
  }));

  await supabase.from("inspeccion_items").insert(filas);

  redirect(`/inspeccion/${nueva.id}`);
}

/** Marca un ítem. Los N renglones ya existen (creados por iniciarInspeccion),
 * así que esto es un UPDATE, no un upsert. */
export async function guardarItem(
  inspeccionId: string,
  codigoComponente: string,
  estado: "correcto" | "requiere_revision" | "fuera_de_servicio",
  nota?: string,
): Promise<void> {
  await obtenerPerfil();

  const componenteValido = esquemaComponente.safeParse(codigoComponente);
  const estadoValido = esquemaEstadoItem.safeParse(estado);
  if (!componenteValido.success || !estadoValido.success) return;

  const supabase = await crearClienteServidor();
  await supabase
    .from("inspeccion_items")
    .update({
      estado: estadoValido.data,
      nota: nota?.trim() || null,
      revisado_en: new Date().toISOString(),
    })
    .eq("inspeccion_id", inspeccionId)
    .eq("codigo_componente", componenteValido.data);

  revalidatePath(`/inspeccion/${inspeccionId}`);
}

/**
 * Registra la RUTA de una evidencia ya subida a Storage. La foto en sí
 * nunca pasa por aquí: el límite de body de una Server Action en Next 16
 * es 1 MB y una foto de celular lo supera de sobra. El navegador sube
 * directo a Supabase Storage con crearClienteNavegador() (ver
 * components/inspeccion/formulario-novedad.tsx y el input de evidencia
 * de la ficha técnica); esta acción solo persiste unos bytes de metadatos.
 */
export async function registrarEvidencia(datos: {
  inspeccionId: string;
  itemId: string;
  ruta: string;
  mime: string;
  bytes: number;
}): Promise<void> {
  const perfil = await obtenerPerfil();
  const supabase = await crearClienteServidor();

  await supabase.from("evidencias").insert({
    inspeccion_id: datos.inspeccionId,
    inspeccion_item_id: datos.itemId,
    ruta: datos.ruta,
    mime: datos.mime,
    bytes: datos.bytes,
    subida_por: perfil.id,
  });

  revalidatePath(`/inspeccion/${datos.inspeccionId}`);
}

export async function eliminarEvidencia(
  evidenciaId: string,
  ruta: string,
  inspeccionId: string,
): Promise<void> {
  await obtenerPerfil();
  const supabase = await crearClienteServidor();

  await supabase.from("evidencias").delete().eq("id", evidenciaId);
  // Best-effort: si falla el borrado del objeto en Storage, queda un
  // huérfano inofensivo (bucket privado, bajo la carpeta del propio
  // conductor); no revertir la fila por eso.
  await supabase.storage.from("evidencias").remove([ruta]);

  revalidatePath(`/inspeccion/${inspeccionId}`);
}

export interface EstadoObservaciones {
  error?: string;
  exito?: boolean;
}

const esquemaObservaciones = z.object({
  inspeccionId: z.string().uuid(),
  kilometraje: z.coerce.number().int().min(0).max(3_000_000).optional(),
  observaciones: z.string().trim().max(2000).optional(),
});

export async function guardarObservaciones(
  _prevState: EstadoObservaciones,
  formData: FormData,
): Promise<EstadoObservaciones> {
  await obtenerPerfil();

  const resultado = esquemaObservaciones.safeParse({
    inspeccionId: formData.get("inspeccionId"),
    kilometraje: formData.get("kilometraje") || undefined,
    observaciones: formData.get("observaciones") || undefined,
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase
    .from("inspecciones")
    .update({
      kilometraje: resultado.data.kilometraje ?? null,
      observaciones: resultado.data.observaciones ?? null,
    })
    .eq("id", resultado.data.inspeccionId);

  if (error) return { error: "No se pudo guardar la información." };

  revalidatePath(`/inspeccion/${resultado.data.inspeccionId}`);
  return { exito: true };
}

const esquemaKilometraje = z.number().int().min(0).max(3_000_000).nullable();

/**
 * Cierra el acta. El cálculo real (conteos, %, semáforo) lo hace la
 * función SQL cerrar_inspeccion() en una sola sentencia atómica (ver
 * 0003_inspecciones.sql, sección 12): así dos taps sobre "Finalizar" no
 * pueden escribir resultados distintos. lib/inspeccion/calculo.ts
 * calcula lo mismo en TypeScript solo para la previsualización optimista
 * mientras el conductor sigue marcando ítems.
 *
 * `kilometraje` es opcional y se guarda ANTES de cerrar: después del cierre
 * el acta es inmutable (trigger bloquear_inspeccion_finalizada). Con él, el
 * resumen puede mostrar los km recorridos desde la inspección anterior.
 */
export async function finalizarInspeccion(
  inspeccionId: string,
  kilometraje: number | null = null,
): Promise<EstadoInspeccion> {
  await obtenerPerfil();

  // Un Server Action recibe argumentos no confiables: se valida el rango
  // (el mismo del CHECK kilometraje_razonable) antes de tocar la BD.
  const km = esquemaKilometraje.safeParse(kilometraje);
  if (!km.success) {
    return { error: "El kilometraje debe ser un número entero entre 0 y 3.000.000." };
  }

  const supabase = await crearClienteServidor();

  if (km.data !== null) {
    const { error: errorKm } = await supabase
      .from("inspecciones")
      .update({ kilometraje: km.data })
      .eq("id", inspeccionId);
    if (errorKm) {
      return { error: "No se pudo guardar el kilometraje. Intenta de nuevo." };
    }
  }

  const { error } = await supabase.rpc("cerrar_inspeccion", {
    p_inspeccion_id: inspeccionId,
  });

  if (error) {
    // 23514 = check_violation: la función lanzó "Todavía faltan N ítems
    // por revisar." o "La inspección no tiene ítems...". Ese mensaje ya
    // es apto para mostrar al conductor tal cual.
    if (error.code === "23514") {
      return { error: error.message };
    }
    return { error: "No se pudo finalizar la inspección. Intenta de nuevo." };
  }

  revalidatePath("/inspeccion");
  revalidatePath("/historial");
  revalidatePath("/inicio");
  redirect(`/historial/${inspeccionId}/resumen`);
}

/** Descarta un borrador (nunca un acta finalizada: la RLS solo lo permite en curso). */
export async function descartarInspeccion(inspeccionId: string): Promise<void> {
  await obtenerPerfil();
  const supabase = await crearClienteServidor();
  await supabase.from("inspecciones").delete().eq("id", inspeccionId);
  revalidatePath("/inspeccion");
}

/** Cambia el bus de ESTA inspección en curso (ese día le tocó otro). */
export async function cambiarBusDeInspeccion(inspeccionId: string, busId: string): Promise<void> {
  await obtenerPerfil();
  const supabase = await crearClienteServidor();
  await supabase.from("inspecciones").update({ bus_id: busId }).eq("id", inspeccionId);
  revalidatePath(`/inspeccion/${inspeccionId}`);
}

/** Cambia el bus asignado por defecto al propio conductor (solo precarga el formulario). */
export async function cambiarBusAsignado(busId: string): Promise<void> {
  const perfil = await obtenerPerfil();
  const supabase = await crearClienteServidor();
  await supabase.from("profiles").update({ bus_id: busId }).eq("id", perfil.id);
  revalidatePath("/inspeccion");
  revalidatePath("/perfil");
}
