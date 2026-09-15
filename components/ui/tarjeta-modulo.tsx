import Link from "next/link";
import type { ItemNavegacion } from "@/lib/navegacion";

/** Tarjeta-enlace usada en la cuadrícula de /inicio y en índices de módulos. */
export function TarjetaModulo({ item }: { item: ItemNavegacion }) {
  if (!item.disponible) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie/50 p-4 text-texto-suave/50">
        <span className="text-2xl">{item.icono}</span>
        <div>
          <p className="text-sm font-semibold">{item.etiqueta}</p>
          <p className="text-xs">Próximamente</p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-4 transition-colors hover:border-acento/50 hover:bg-superficie-2"
    >
      <span className="text-2xl">{item.icono}</span>
      <div>
        <p className="text-sm font-semibold">{item.etiqueta}</p>
        <p className="text-xs text-texto-suave">{item.descripcion}</p>
      </div>
    </Link>
  );
}
