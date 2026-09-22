import { notFound } from "next/navigation";
import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { BloquesContenido } from "@/components/ui/bloques-contenido";
import { VideoYoutube } from "@/components/ui/video-youtube";
import { EvaluacionTema } from "@/components/aprendizaje/evaluacion-tema";
import { MarcarVisto } from "@/components/aprendizaje/marcar-visto";
import { minutosDeLectura, obtenerTema, temasAprendizaje } from "@/lib/datos/aprendizaje";
import { ETIQUETA_CATEGORIA } from "@/lib/datos/categorias-aprendizaje";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";

export function generateStaticParams() {
  return temasAprendizaje.map((tema) => ({ tema: tema.slug }));
}

export default async function PaginaTemaAprendizaje({
  params,
}: PageProps<"/aprendizaje/[tema]">) {
  const perfil = await obtenerPerfil();
  const { tema: slug } = await params;
  const tema = obtenerTema(slug);

  if (!tema) notFound();

  const preguntas = obtenerEvaluacion(tema.slug);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <MarcarVisto usuarioId={perfil.id} slug={tema.slug} />

      <CabeceraModulo titulo={tema.titulo} subtitulo={tema.resumen} />

      <p className="-mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-texto-suave">
        <span className="rounded-full bg-superficie-2 px-2.5 py-0.5 font-medium">
          {ETIQUETA_CATEGORIA[tema.categoria]}
        </span>
        <span>≈ {minutosDeLectura(tema)} min de lectura</span>
        {tema.videos.length > 0 && (
          <span>
            🎬 {tema.videos.length} {tema.videos.length === 1 ? "video" : "videos"}
          </span>
        )}
        {preguntas.length > 0 && <span>📝 {preguntas.length} preguntas</span>}
      </p>

      <BloquesContenido bloques={tema.bloques} />

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
            {tema.videos.map((video) => (
              <figure key={video.id} className="flex flex-col gap-1.5">
                <VideoYoutube id={video.id} titulo={video.titulo} />
                {video.fuente && (
                  <figcaption className="text-xs text-texto-suave">{video.fuente}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}

      {preguntas.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <EvaluacionTema usuarioId={perfil.id} slug={tema.slug} preguntas={preguntas} />
        </div>
      )}
    </div>
  );
}
