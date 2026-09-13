"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  cambiarContrasenaPropia,
  type EstadoFormularioPerfil,
} from "@/app/(app)/perfil/acciones";

const estadoInicial: EstadoFormularioPerfil = {};

export function FormularioContrasena() {
  const [estado, accion, pendiente] = useActionState(
    cambiarContrasenaPropia,
    estadoInicial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.exito) formRef.current?.reset();
  }, [estado.exito]);

  return (
    <form
      ref={formRef}
      action={accion}
      className="flex flex-col gap-3 rounded-xl border border-borde bg-superficie p-4"
    >
      <h2 className="text-sm font-semibold">Cambiar contraseña</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contrasenaActual" className="text-sm font-medium">
          Contraseña actual
        </label>
        <input
          id="contrasenaActual"
          name="contrasenaActual"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contrasenaNueva" className="text-sm font-medium">
          Contraseña nueva
        </label>
        <input
          id="contrasenaNueva"
          name="contrasenaNueva"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmarContrasena" className="text-sm font-medium">
          Confirmar contraseña nueva
        </label>
        <input
          id="confirmarContrasena"
          name="confirmarContrasena"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
        />
      </div>

      {estado.error && <p role="alert" className="text-sm text-error">{estado.error}</p>}
      {estado.exito && (
        <p className="text-sm text-exito">Contraseña actualizada.</p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="self-start rounded-md bg-acento px-4 py-2 text-sm font-medium text-fondo disabled:opacity-60"
      >
        {pendiente ? "Cambiando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
