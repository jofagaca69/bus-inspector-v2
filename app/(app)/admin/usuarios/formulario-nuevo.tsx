"use client";

import { useActionState, useRef, useEffect } from "react";
import {
  crearConductor,
  type EstadoFormularioUsuario,
} from "@/app/(app)/admin/usuarios/acciones";

const estadoInicial: EstadoFormularioUsuario = {};

export function FormularioNuevoUsuario() {
  const [estado, accion, pendiente] = useActionState(
    crearConductor,
    estadoInicial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (estado.exito) {
      formRef.current?.reset();
    }
  }, [estado.exito]);

  return (
    <form
      ref={formRef}
      action={accion}
      className="flex flex-col gap-3 rounded-lg border border-borde bg-superficie p-4"
    >
      <h2 className="text-sm font-semibold">Nuevo conductor</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cedula" className="text-sm font-medium">
            Cédula
          </label>
          <input
            id="cedula"
            name="cedula"
            type="text"
            inputMode="numeric"
            required
            placeholder="1012345678"
            className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nombre_completo" className="text-sm font-medium">
            Nombre completo
          </label>
          <input
            id="nombre_completo"
            name="nombre_completo"
            type="text"
            required
            className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefono" className="text-sm font-medium">
            Teléfono (opcional)
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            inputMode="numeric"
            className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="contrasena" className="text-sm font-medium">
            Contraseña inicial
          </label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
          />
        </div>
      </div>

      {estado.error && (
        <p role="alert" className="text-sm text-error">
          {estado.error}
        </p>
      )}
      {estado.exito && (
        <p className="text-sm text-exito">
          Conductor creado correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="self-start rounded-md bg-acento px-4 py-2 text-sm font-medium text-fondo disabled:opacity-60"
      >
        {pendiente ? "Creando..." : "Crear conductor"}
      </button>
    </form>
  );
}
