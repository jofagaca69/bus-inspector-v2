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
      className="flex flex-col gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15"
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
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
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
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
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
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
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
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
          />
        </div>
      </div>

      {estado.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {estado.error}
        </p>
      )}
      {estado.exito && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Conductor creado correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="self-start rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60"
      >
        {pendiente ? "Creando..." : "Crear conductor"}
      </button>
    </form>
  );
}
