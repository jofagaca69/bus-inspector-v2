"use client";

import { useTransition } from "react";
import { asignarBusAConductor } from "@/app/(app)/admin/buses/acciones";
import type { Bus } from "@/lib/inspeccion/tipos";

export function AsignarBus({
  conductorId,
  busIdActual,
  buses,
}: {
  conductorId: string;
  busIdActual: string | null;
  buses: Bus[];
}) {
  const [pendiente, iniciarTransicion] = useTransition();

  return (
    <select
      defaultValue={busIdActual ?? ""}
      disabled={pendiente}
      onChange={(evento) => {
        const valor = evento.target.value || null;
        iniciarTransicion(() => asignarBusAConductor(conductorId, valor));
      }}
      className="rounded-md border border-borde bg-transparent px-2 py-1.5 text-xs outline-none focus:border-acento"
    >
      <option value="">Sin asignar</option>
      {buses.map((bus) => (
        <option key={bus.id} value={bus.id}>
          {bus.numero_interno} · {bus.placa}
        </option>
      ))}
    </select>
  );
}
