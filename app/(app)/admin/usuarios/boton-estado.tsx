"use client";

import { useTransition } from "react";
import { cambiarEstadoUsuario } from "@/app/(app)/admin/usuarios/acciones";

export function BotonEstadoUsuario({
  id,
  activo,
}: {
  id: string;
  activo: boolean;
}) {
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <button
      type="button"
      disabled={pendiente}
      onClick={() => {
        iniciarTransicion(() => {
          cambiarEstadoUsuario(id, !activo);
        });
      }}
      className="shrink-0 rounded-md border border-borde px-3 py-1.5 text-xs font-medium disabled:opacity-60"
    >
      {activo ? "Desactivar" : "Activar"}
    </button>
  );
}
