"use client";

import { useEffect } from "react";
import { Icono } from "@/components/ui/icono";

/**
 * Bottom-sheet genérico: panel fijo inferior + backdrop, cierre con
 * Escape o clic fuera. Mismo patrón de cierre-con-Escape que
 * components/navegacion/menu-lateral.tsx, generalizado para reutilizarlo
 * en toda la ficha técnica y los formularios del módulo de inspección.
 */
export function HojaInferior({
  abierta,
  onCerrar,
  titulo,
  children,
}: {
  abierta: boolean;
  onCerrar: () => void;
  titulo?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!abierta) return;
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [abierta, onCerrar]);

  if (!abierta) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative flex max-h-[85vh] flex-col rounded-t-2xl border-t border-borde bg-superficie">
        <div className="flex items-center gap-3 border-b border-borde px-4 py-3.5">
          <p className="flex-1 text-sm font-semibold">{titulo}</p>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-md text-texto-suave hover:bg-superficie-2 hover:text-texto"
          >
            <Icono nombre="equis" className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  );
}
