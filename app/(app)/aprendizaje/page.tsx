import Link from "next/link";
import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { temasAprendizaje } from "@/lib/datos/aprendizaje";

export default async function PaginaAprendizaje() {
  await obtenerPerfil();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Centro de aprendizaje"
        subtitulo="Temas de formación para manejar mejor y más seguro"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {temasAprendizaje.map((tema) => (
          <Link
            key={tema.slug}
            href={`/aprendizaje/${tema.slug}`}
            className="flex flex-col gap-2 rounded-xl border border-borde bg-superficie p-4 transition-colors hover:border-acento/50 hover:bg-superficie-2"
          >
            <span className="text-2xl">{tema.icono}</span>
            <p className="text-sm font-semibold">{tema.titulo}</p>
            <p className="text-xs text-texto-suave">{tema.resumen}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <p className="mb-3 text-sm font-semibold">Otros recursos relacionados</p>
        <div className="flex flex-col gap-2">
          <Link href="/normativa" className="text-sm text-acento hover:underline">
            📖 Normativa de tránsito
          </Link>
          <Link href="/senales" className="text-sm text-acento hover:underline">
            🚸 Señales de tránsito
          </Link>
          <Link href="/primeros-auxilios" className="text-sm text-acento hover:underline">
            🩹 Primeros auxilios
          </Link>
        </div>
      </div>
    </div>
  );
}
