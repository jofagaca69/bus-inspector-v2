import "server-only";

import { cache } from "react";
import { crearClienteServidor } from "@/lib/supabase/servidor";
import type {
  Bus,
  Evidencia,
  InspeccionConBus,
  InspeccionItem,
  Novedad,
} from "@/lib/inspeccion/tipos";

/**
 * Lecturas del módulo de Inspección Diaria. No son Server Actions (no
 * llevan "use server"): son funciones de lectura envueltas en cache() de
 * React, igual que lib/auth/dal.ts, para que llamarlas dos veces en el
 * mismo render (ej. layout + page) no repita la consulta. La
 * autorización real la da RLS (ver supabase/migrations/0003_inspecciones.sql):
 * estas funciones nunca usan crearClienteAdmin().
 */

export const obtenerBusesActivos = cache(async (): Promise<Bus[]> => {
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("buses")
    .select("*")
    .eq("activo", true)
    .order("numero_interno")
    .returns<Bus[]>();
  return data ?? [];
});

export const obtenerTodosLosBuses = cache(async (): Promise<Bus[]> => {
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("buses")
    .select("*")
    .order("numero_interno")
    .returns<Bus[]>();
  return data ?? [];
});

/** La inspección en curso del conductor, o null si no tiene ninguna abierta. */
export const obtenerInspeccionAbierta = cache(
  async (conductorId: string): Promise<InspeccionConBus | null> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("inspecciones")
      .select("*, bus:buses(placa, numero_interno)")
      .eq("conductor_id", conductorId)
      .is("finalizada_en", null)
      .maybeSingle<InspeccionConBus>();
    return data ?? null;
  },
);

export const obtenerInspeccionPorId = cache(
  async (id: string): Promise<InspeccionConBus | null> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("inspecciones")
      .select("*, bus:buses(placa, numero_interno)")
      .eq("id", id)
      .maybeSingle<InspeccionConBus>();
    return data ?? null;
  },
);

export const obtenerItemsDeInspeccion = cache(
  async (inspeccionId: string): Promise<InspeccionItem[]> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("inspeccion_items")
      .select("*")
      .eq("inspeccion_id", inspeccionId)
      .order("orden")
      .returns<InspeccionItem[]>();
    return data ?? [];
  },
);

export const obtenerEvidenciasDeInspeccion = cache(
  async (inspeccionId: string): Promise<Evidencia[]> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("evidencias")
      .select("*")
      .eq("inspeccion_id", inspeccionId)
      .returns<Evidencia[]>();
    return data ?? [];
  },
);

/** Historial del conductor autenticado: solo actas ya finalizadas. */
export const listarHistorialPropio = cache(
  async (conductorId: string, limite = 30): Promise<InspeccionConBus[]> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("inspecciones")
      .select("*, bus:buses(placa, numero_interno)")
      .eq("conductor_id", conductorId)
      .not("finalizada_en", "is", null)
      .order("iniciada_en", { ascending: false })
      .limit(limite)
      .returns<InspeccionConBus[]>();
    return data ?? [];
  },
);

/** Historial de toda la flota, para /admin. RLS ya exige rol admin para ver ajenas. */
export interface InspeccionConBusYConductor extends InspeccionConBus {
  conductor: { nombre_completo: string; cedula: string } | null;
}

export const listarHistorialFlota = cache(
  async (limite = 50): Promise<InspeccionConBusYConductor[]> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("inspecciones")
      .select(
        "*, bus:buses(placa, numero_interno), conductor:profiles(nombre_completo, cedula)",
      )
      .not("finalizada_en", "is", null)
      .order("iniciada_en", { ascending: false })
      .limit(limite)
      .returns<InspeccionConBusYConductor[]>();
    return data ?? [];
  },
);

/** Novedades abiertas o en proceso. Para el conductor son solo las suyas
 * (RLS); para el admin, las de toda la flota. */
export const listarNovedadesPendientes = cache(async (): Promise<Novedad[]> => {
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("novedades")
    .select("*")
    .in("estado", ["abierta", "en_proceso"])
    .order("severidad", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<Novedad[]>();
  return data ?? [];
});

export const listarNovedadesDeInspeccion = cache(
  async (inspeccionId: string): Promise<Novedad[]> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("novedades")
      .select("*")
      .eq("inspeccion_id", inspeccionId)
      .returns<Novedad[]>();
    return data ?? [];
  },
);

/* ------------------------------------------------------------------ */
/* Lecturas para el resumen estadístico                                */
/* ------------------------------------------------------------------ */
/*
 * OJO con el alcance: la RLS de inspecciones/novedades solo deja a un
 * conductor ver lo SUYO (el admin ve todo). Por eso, para un conductor,
 * "el historial del bus" son sus propias inspecciones de ese bus. No se
 * usa el cliente admin para ampliarlo: estas lecturas nunca lo usan.
 */

/**
 * Actas ya cerradas de un bus, anteriores a `antesDe` (ISO), de la más
 * reciente a la más antigua.
 */
export const listarHistorialDeBus = cache(
  async (busId: string, antesDe: string, limite = 8): Promise<InspeccionConBus[]> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("inspecciones")
      .select("*, bus:buses(placa, numero_interno)")
      .eq("bus_id", busId)
      .not("finalizada_en", "is", null)
      .lt("iniciada_en", antesDe)
      .order("iniciada_en", { ascending: false })
      .limit(limite)
      .returns<InspeccionConBus[]>();
    return data ?? [];
  },
);

export type ItemConNovedad = Pick<
  InspeccionItem,
  "inspeccion_id" | "codigo_componente" | "estado"
>;

/**
 * Ítems que requirieron revisión o quedaron fuera de servicio en las
 * inspecciones dadas. Sin cache(): recibe un arreglo y React cachea por
 * identidad de argumentos, así que nunca acertaría. Usa el índice parcial
 * inspeccion_items_fallas_idx (ver 0003_inspecciones.sql).
 */
export async function listarItemsConNovedad(
  inspeccionIds: string[],
): Promise<ItemConNovedad[]> {
  if (inspeccionIds.length === 0) return [];
  const supabase = await crearClienteServidor();
  const { data } = await supabase
    .from("inspeccion_items")
    .select("inspeccion_id, codigo_componente, estado")
    .in("inspeccion_id", inspeccionIds)
    .in("estado", ["requiere_revision", "fuera_de_servicio"])
    .returns<ItemConNovedad[]>();
  return data ?? [];
}

/** Novedades abiertas o en proceso de un bus, las más graves primero. */
export const listarNovedadesAbiertasDeBus = cache(
  async (busId: string): Promise<Novedad[]> => {
    const supabase = await crearClienteServidor();
    const { data } = await supabase
      .from("novedades")
      .select("*")
      .eq("bus_id", busId)
      .in("estado", ["abierta", "en_proceso"])
      .order("severidad", { ascending: false })
      .order("created_at", { ascending: false })
      .returns<Novedad[]>();
    return data ?? [];
  },
);
