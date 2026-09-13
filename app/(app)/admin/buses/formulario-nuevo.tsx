"use client";

import { useActionState, useRef, useEffect } from "react";
import { crearBus, type EstadoFormularioBus } from "@/app/(app)/admin/buses/acciones";

const estadoInicial: EstadoFormularioBus = {};

export function FormularioNuevoBus() {
  const [estado, accion, pendiente] = useActionState(crearBus, estadoInicial);
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
      <h2 className="text-sm font-semibold">Nuevo bus</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="placa" className="text-sm font-medium">
            Placa
          </label>
          <input
            id="placa"
            name="placa"
            type="text"
            required
            placeholder="ABC123"
            className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm uppercase outline-none focus:border-acento"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="numero_interno" className="text-sm font-medium">
            Número interno
          </label>
          <input
            id="numero_interno"
            name="numero_interno"
            type="text"
            required
            placeholder="200"
            className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="modelo" className="text-sm font-medium">
            Modelo (opcional)
          </label>
          <input
            id="modelo"
            name="modelo"
            type="text"
            className="rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento"
          />
        </div>
      </div>

      {estado.error && (
        <p role="alert" className="text-sm text-error">
          {estado.error}
        </p>
      )}
      {estado.exito && <p className="text-sm text-exito">Bus creado correctamente.</p>}

      <button
        type="submit"
        disabled={pendiente}
        className="self-start rounded-md bg-acento px-4 py-2 text-sm font-medium text-fondo disabled:opacity-60"
      >
        {pendiente ? "Creando..." : "Crear bus"}
      </button>
    </form>
  );
}
