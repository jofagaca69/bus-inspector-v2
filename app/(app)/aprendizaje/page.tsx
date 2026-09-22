import Link from "next/link";
import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { CatalogoTemas, type TarjetaTema } from "@/components/aprendizaje/catalogo-temas";
import { minutosDeLectura, temasAprendizaje } from "@/lib/datos/aprendizaje";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";

export default async function PaginaAprendizaje() {
  const perfil = await obtenerPerfil();

  // Solo lo que el índice muestra: el contenido de cada tema no viaja al cliente.
  const tarjetas: TarjetaTema[] = temasAprendizaje.map((tema) => ({
    slug: tema.slug,
    titulo: tema.titulo,
    resumen: tema.resumen,
    icono: tema.icono,
    categoria: tema.categoria,
    minutosLectura: minutosDeLectura(tema),
    videos: tema.videos.length,
    preguntas: obtenerEvaluacion(tema.slug).length,
  }));

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Centro de aprendizaje"
        subtitulo="Temas de formación para manejar mejor y más seguro"
      />

      <CatalogoTemas temas={tarjetas} usuarioId={perfil.id} />

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
