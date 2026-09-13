"use client";

import { useActionState } from "react";
import { iniciarSesion, type EstadoLogin } from "@/lib/auth/acciones";

const estadoInicial: EstadoLogin = {};

export function FormularioLogin() {
  const [estado, accion, pendiente] = useActionState(
    iniciarSesion,
    estadoInicial,
  );

  return (
    <form action={accion} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cedula" className="text-sm font-medium">
          Cédula
        </label>
        <input
          id="cedula"
          name="cedula"
          type="text"
          inputMode="numeric"
          autoComplete="username"
          required
          placeholder="1012345678"
          className="rounded-md border border-black/10 bg-transparent px-3 py-2.5 text-base outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contrasena" className="text-sm font-medium">
          Contraseña
        </label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-md border border-black/10 bg-transparent px-3 py-2.5 text-base outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/30"
        />
      </div>

      {estado.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="mt-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background disabled:opacity-60"
      >
        {pendiente ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
