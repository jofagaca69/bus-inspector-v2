"use client";

import { useActionState } from "react";
import {
  actualizarPerfil,
  type EstadoFormularioPerfil,
} from "@/app/(app)/perfil/acciones";

const estadoInicial: EstadoFormularioPerfil = {};

export function FormularioDatosPerfil({
  nombreCompleto,
  telefono,
}: {
  nombreCompleto: string;
  telefono: string | null;
}) {
  const [estado, accion, pendiente] = useActionState(
    actualizarPerfil,
    estadoInicial,
  );

  return (
    <form action={accion} className="flex flex-col gap-3 rounded-xl border border-borde bg-superficie p-4">
      <h2 className="text-sm font-semibold">Mis datos</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="nombre_completo" className="text-sm font-medium">
          Nombre completo
        </label>
        <input
          id="nombre_completo"
          name="nombre_completo"
          type="text"
          required
          defaultValue={nombreCompleto}
          className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="telefono" className="text-sm font-medium">
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="numeric"
          defaultValue={telefono ?? ""}
          className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
        />
      </div>

      {estado.error && <p role="alert" className="text-sm text-error">{estado.error}</p>}
      {estado.exito && <p className="text-sm text-exito">Datos actualizados.</p>}

      <button
        type="submit"
        disabled={pendiente}
        className="self-start rounded-md bg-acento px-4 py-2 text-sm font-medium text-fondo disabled:opacity-60"
      >
        {pendiente ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
