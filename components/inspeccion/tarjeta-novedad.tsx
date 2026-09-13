"use client";

import { useActionState, useTransition } from "react";
import {
  marcarEnProcesoNovedad,
  resolverNovedad,
  type EstadoNovedadForm,
} from "@/app/(app)/novedades/acciones";
import type { Novedad } from "@/lib/inspeccion/tipos";

const SEVERIDAD_CLASE: Record<string, string> = {
  baja: "bg-neutro/20 text-texto-suave",
  media: "bg-atencion/15 text-atencion",
  alta: "bg-error/15 text-error",
  critica: "bg-error/25 text-error",
};

const estadoInicial: EstadoNovedadForm = {};

/** Solo el admin ve los controles de gestión (marcar en proceso / resolver):
 * el trigger proteger_resolucion_novedad de la BD los rechazaría igual si
 * un conductor los invocara, pero no tiene sentido mostrarlos. */
export function TarjetaNovedad({
  novedad,
  esAdmin,
}: {
  novedad: Novedad;
  esAdmin: boolean;
}) {
  const [pendiente, iniciarTransicion] = useTransition();
  const [estado, accionResolver, resolviendo] = useActionState(resolverNovedad, estadoInicial);

  return (
    <div className="rounded-xl border border-borde bg-superficie p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">{novedad.descripcion}</p>
          <p className="mt-1 text-xs capitalize text-texto-suave">
            {novedad.tipo} · {new Date(novedad.created_at).toLocaleDateString("es-CO")}
            {novedad.estado === "en_proceso" && " · en proceso"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${SEVERIDAD_CLASE[novedad.severidad]}`}
        >
          {novedad.severidad}
        </span>
      </div>

      {esAdmin && (
        <div className="mt-3 flex flex-col gap-2 border-t border-borde pt-3">
          {novedad.estado === "abierta" && (
            <button
              type="button"
              disabled={pendiente}
              onClick={() => iniciarTransicion(() => marcarEnProcesoNovedad(novedad.id))}
              className="w-fit rounded-md border border-borde px-3 py-1.5 text-xs font-medium disabled:opacity-60"
            >
              Marcar en proceso
            </button>
          )}
          <form action={accionResolver} className="flex flex-col gap-2">
            <input type="hidden" name="id" value={novedad.id} />
            <input
              name="notaResolucion"
              placeholder="Nota de resolución (opcional)"
              className="rounded-md border border-borde bg-transparent px-3 py-1.5 text-xs outline-none focus:border-acento"
            />
            <button
              type="submit"
              disabled={resolviendo}
              className="w-fit rounded-md bg-acento px-3 py-1.5 text-xs font-semibold text-fondo disabled:opacity-60"
            >
              {resolviendo ? "Resolviendo..." : "Marcar resuelta"}
            </button>
            {estado.error && <p className="text-xs text-error">{estado.error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
