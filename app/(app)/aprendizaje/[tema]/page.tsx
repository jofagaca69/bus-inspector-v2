import { notFound } from "next/navigation";
import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { VideoYoutube } from "@/components/ui/video-youtube";
import { Evaluacion } from "@/components/ui/evaluacion";
import { obtenerTema, temasAprendizaje } from "@/lib/datos/aprendizaje";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";

export function generateStaticParams() {
  return temasAprendizaje.map((tema) => ({ tema: tema.slug }));
}

export default async function PaginaTemaAprendizaje({
  params,
}: PageProps<"/aprendizaje/[tema]">) {
  await obtenerPerfil();
  const { tema: slug } = await params;
  const tema = obtenerTema(slug);

  if (!tema) notFound();

  const preguntas = obtenerEvaluacion(tema.slug);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo titulo={tema.titulo} subtitulo={tema.resumen} />

      <div className="flex flex-col gap-4">
        {tema.secciones.map((seccion) => (
          <div
            key={seccion.titulo}
            className="rounded-xl border border-borde bg-superficie p-4"
          >
            <p className="mb-1.5 text-sm font-semibold">{seccion.titulo}</p>
            <p className="text-sm leading-relaxed text-texto/90">
              {seccion.contenido}
            </p>
          </div>
        ))}
      </div>

      {tema.puntosClave.length > 0 && (
        <div className="rounded-xl bg-acento-suave p-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-acento">
            💡 PUNTOS CLAVE
          </p>
          <ul className="flex flex-col gap-1.5">
            {tema.puntosClave.map((punto) => (
              <li key={punto} className="flex gap-2 text-sm text-texto/90">
                <span className="text-acento">•</span>
                {punto}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tema.videos.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Videos recomendados</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tema.videos.map((id) => (
              <VideoYoutube key={id} id={id} titulo={tema.titulo} />
            ))}
          </div>
        </div>
      )}

      {preguntas.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <Evaluacion preguntas={preguntas} />
        </div>
      )}
    </div>
  );
}
