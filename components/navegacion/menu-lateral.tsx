"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Rol } from "@/lib/auth/tipos";
import { itemsParaRol } from "@/lib/navegacion";

export function MenuLateral({ rol }: { rol: Rol }) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();
  const items = itemsParaRol(rol);

  // Cierra el panel al navegar a otra ruta. Se compara con el pathname
  // renderizado en vez de reaccionar a su cambio en un efecto (eso
  // dispara un set-state-in-effect innecesario): si el panel sigue
  // abierto en la ruta a la que se acaba de navegar, se cierra durante
  // el propio render.
  const [pathnameAlAbrir, setPathnameAlAbrir] = useState(pathname);
  if (abierto && pathname !== pathnameAlAbrir) {
    setAbierto(false);
  }

  // Cierra con Escape mientras está abierto.
  useEffect(() => {
    if (!abierto) return;
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAbierto(false);
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPathnameAlAbrir(pathname);
          setAbierto(true);
        }}
        aria-label="Abrir menú"
        aria-expanded={abierto}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md hover:bg-superficie-2"
      >
        <span className="h-0.5 w-5 rounded-full bg-texto" />
        <span className="h-0.5 w-5 rounded-full bg-texto" />
        <span className="h-0.5 w-5 rounded-full bg-texto" />
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay: clic para cerrar */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-black/60"
          />

          <nav className="relative flex h-full w-72 max-w-[85vw] flex-col gap-1 overflow-y-auto border-r border-borde bg-superficie p-3">
            <div className="mb-2 px-2 py-2">
              <p className="text-sm font-semibold">Cootranszipa</p>
              <p className="text-xs text-texto-suave">
                Inspección de buses
              </p>
            </div>

            {items.map((item) => {
              const activo = pathname === item.href;

              if (!item.disponible) {
                return (
                  <div
                    key={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-texto-suave/50"
                  >
                    <span className="text-lg">{item.icono}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.etiqueta}</p>
                      <p className="text-xs">Próximamente</p>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    activo
                      ? "bg-acento-suave text-acento"
                      : "hover:bg-superficie-2"
                  }`}
                >
                  <span className="text-lg">{item.icono}</span>
                  <span className="text-sm font-medium">{item.etiqueta}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
