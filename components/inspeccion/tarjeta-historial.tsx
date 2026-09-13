import Link from "next/link";
import type { InspeccionConBus } from "@/lib/inspeccion/tipos";

const CLASE_ESTADO: Record<string, string> = {
  verde: "bg-exito/15 text-exito",
  amarillo: "bg-atencion/15 text-atencion",
  rojo: "bg-error/15 text-error",
};

export function TarjetaHistorial({
  inspeccion,
  mostrarConductor,
}: {
  inspeccion: InspeccionConBus & {
    conductor?: { nombre_completo: string; cedula: string } | null;
  };
  mostrarConductor?: boolean;
}) {
  const fecha = new Date(inspeccion.iniciada_en);

  return (
    <Link
      href={`/historial/${inspeccion.id}`}
      className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-4 transition-colors hover:border-acento/50"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold">
          Bus {inspeccion.bus?.numero_interno} · {inspeccion.bus?.placa}
        </p>
        <p className="text-xs text-texto-suave">
          {fecha.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
          {" · "}
          {fecha.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
          {mostrarConductor && inspeccion.conductor
            ? ` · ${inspeccion.conductor.nombre_completo || inspeccion.conductor.cedula}`
            : ""}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
          CLASE_ESTADO[inspeccion.estado_general ?? "verde"]
        }`}
      >
        {inspeccion.porcentaje_cumplimiento}%
      </span>
    </Link>
  );
}
