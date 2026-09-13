"use client";

import { useTransition } from "react";
import { cambiarEstadoBus } from "@/app/(app)/admin/buses/acciones";

export function BotonEstadoBus({ id, activo }: { id: string; activo: boolean }) {
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => {
        iniciarTransicion(() => {
          cambiarEstadoBus(id, !activo);
        });
      }}
      className="shrink-0 rounded-md border border-borde px-3 py-1.5 text-xs font-medium disabled:opacity-60"
    >
      {activo ? "Desactivar" : "Activar"}
    </button>
  );
}
