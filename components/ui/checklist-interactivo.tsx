"use client";

import { useState } from "react";
import { cx } from "@/lib/utils";

/**
 * Lista de verificación que el conductor va marcando. El estado vive solo
 * en el cliente (no se persiste): es una ayuda de repaso, no un registro
 * oficial — para eso está la inspección diaria.
 */
export function ChecklistInteractivo({
  titulo,
  items,
}: {
  titulo?: string;
  items: string[];
}) {
  const [marcados, setMarcados] = useState<Set<number>>(() => new Set());
  const completo = marcados.size === items.length;

  function alternar(indice: number) {
    setMarcados((previo) => {
      const siguiente = new Set(previo);
      if (siguiente.has(indice)) siguiente.delete(indice);
      else siguiente.add(indice);
      return siguiente;
    });
  }

  return (
    <div className="rounded-xl border border-borde bg-superficie p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{titulo ?? "Lista de verificación"}</p>
        <span
          className={cx(
            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold",
            completo ? "bg-exito/15 text-exito" : "bg-superficie-2 text-texto-suave",
          )}
        >
          {marcados.size} de {items.length}
        </span>
      </div>

      <div
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-superficie-2"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-valuenow={marcados.size}
      >
        <div
          className="h-full rounded-full bg-exito transition-[width] duration-300"
          style={{ width: `${(marcados.size / items.length) * 100}%` }}
        />
      </div>

      <ul className="mt-3 flex flex-col gap-1">
        {items.map((item, i) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-2 text-sm active:bg-superficie-2">
              <input
                type="checkbox"
                checked={marcados.has(i)}
                onChange={() => alternar(i)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-acento"
              />
              <span className={cx(marcados.has(i) && "text-texto-suave line-through")}>{item}</span>
            </label>
          </li>
        ))}
      </ul>

      {completo && (
        <p className="mt-2 text-sm font-medium text-exito">✅ Todo en orden. ¡Listo para salir!</p>
      )}
    </div>
  );
}
