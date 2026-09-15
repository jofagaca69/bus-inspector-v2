"use client";

import { useState, useTransition } from "react";
import { iniciarInspeccion } from "@/app/(app)/inspeccion/acciones";
import type { Bus, TipoInspeccion } from "@/lib/inspeccion/tipos";

export function SelectorInicioInspeccion({
  buses,
  busAsignadoId,
}: {
  buses: Bus[];
  busAsignadoId: string | null;
}) {
  const [busId, setBusId] = useState(busAsignadoId ?? buses[0]?.id ?? "");
  const [tipo, setTipo] = useState<TipoInspeccion>("completa");
  const [pendiente, iniciarTransicion] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (buses.length === 0) {
    return (
      <p className="text-sm text-texto-suave">
        Todavía no hay buses activos en la flota. Pídele al administrador que registre uno en
        Flota.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="bus" className="text-sm font-medium">
          Bus a inspeccionar
        </label>
        <select
          id="bus"
          value={busId}
          onChange={(evento) => setBusId(evento.target.value)}
          className="rounded-md border border-borde bg-transparent px-3 py-2.5 text-base outline-none focus:border-acento"
        >
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.numero_interno} · {bus.placa}
              {bus.modelo ? ` · ${bus.modelo}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTipo("completa")}
          className={`rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors ${
            tipo === "completa"
              ? "border-acento bg-acento-suave text-acento"
              : "border-borde text-texto-suave"
          }`}
        >
          Inspección completa
          <span className="mt-0.5 block text-xs font-normal opacity-80">Los 23 componentes</span>
        </button>
        <button
          type="button"
          onClick={() => setTipo("rapida")}
          className={`rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors ${
            tipo === "rapida"
              ? "border-acento bg-acento-suave text-acento"
              : "border-borde text-texto-suave"
          }`}
        >
          Check rápido
          <span className="mt-0.5 block text-xs font-normal opacity-80">Solo lo crítico</span>
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={pendiente || !busId}
        onClick={() => {
          setError(null);
          iniciarTransicion(async () => {
            try {
              await iniciarInspeccion(busId, tipo);
            } catch {
              // El propio redirect() de la Server Action nunca llega
              // aquí (Next lo intercepta en su wrapper del lado del
              // servidor); si este catch se dispara, fue un error real.
              setError("No se pudo iniciar la inspección. Intenta de nuevo.");
            }
          });
        }}
        className="rounded-md bg-acento px-4 py-3 text-sm font-semibold text-fondo disabled:opacity-60"
      >
        {pendiente ? "Iniciando..." : "Iniciar inspección"}
      </button>
    </div>
  );
}
