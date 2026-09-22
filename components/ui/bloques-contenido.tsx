import { VideoYoutube } from "@/components/ui/video-youtube";
import { TarjetasIcono } from "@/components/ui/tarjetas-icono";
import { ChecklistInteractivo } from "@/components/ui/checklist-interactivo";
import { GaleriaSenales } from "@/components/ui/galeria-senales";
import { cx } from "@/lib/utils";
import { senales } from "@/lib/datos/senales";
import type { BloqueContenido, Senal } from "@/lib/datos/tipos";

/**
 * Renderiza una lista de BloqueContenido (ver lib/datos/tipos.ts). Es un
 * Server Component: solo los bloques interactivos (tarjetas con detalle,
 * checklist, galería de señales) delegan en componentes cliente, así el
 * grueso del contenido no envía JavaScript al navegador.
 */

const senalPorId = new Map<string, Senal>(senales.map((s) => [s.id, s]));

export function BloquesContenido({ bloques }: { bloques: BloqueContenido[] }) {
  return (
    <div className="flex flex-col gap-4">
      {bloques.map((bloque, i) => (
        <Bloque key={i} bloque={bloque} />
      ))}
    </div>
  );
}

function Bloque({ bloque }: { bloque: BloqueContenido }) {
  switch (bloque.tipo) {
    case "texto":
      return <p className="text-sm leading-relaxed text-texto/90">{bloque.texto}</p>;

    case "lista":
      return (
        <div className="flex flex-col gap-2">
          {bloque.titulo && <p className="text-sm font-semibold">{bloque.titulo}</p>}
          <ul className="flex flex-col gap-2">
            {bloque.items.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-texto/90">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acento" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "pasos":
      return (
        <div className="flex flex-col gap-2">
          {bloque.titulo && <p className="text-sm font-semibold">{bloque.titulo}</p>}
          <ol className="flex flex-col gap-3">
            {bloque.pasos.map((paso, i) => (
              <li key={paso.texto} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-acento text-sm font-bold text-fondo">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <p className="text-sm font-medium leading-snug">{paso.texto}</p>
                  {paso.detalle && (
                    <p className="text-xs leading-relaxed text-texto-suave">{paso.detalle}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      );

    case "video":
      return (
        <figure className="flex flex-col gap-1.5">
          <VideoYoutube id={bloque.video.id} titulo={bloque.video.titulo} />
          {(bloque.video.fuente || bloque.video.duracion) && (
            <figcaption className="text-xs text-texto-suave">
              {[bloque.video.fuente, bloque.video.duracion].filter(Boolean).join(" · ")}
            </figcaption>
          )}
        </figure>
      );

    case "imagen":
      return (
        <figure className="flex flex-col gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- imágenes estáticas de public/, mismo criterio que el resto del repo */}
          <img
            src={bloque.src}
            alt={bloque.alt}
            loading="lazy"
            className="w-full rounded-xl border border-borde object-cover"
          />
          {bloque.pie && <figcaption className="text-xs text-texto-suave">{bloque.pie}</figcaption>}
        </figure>
      );

    case "senales": {
      const encontradas = bloque.ids
        .map((id) => senalPorId.get(id))
        .filter((s): s is Senal => s !== undefined);
      return <GaleriaSenales titulo={bloque.titulo} senales={encontradas} />;
    }

    case "tarjetas-icono":
      return <TarjetasIcono titulo={bloque.titulo} items={bloque.items} />;

    case "comparativa":
      return (
        <div className="flex flex-col gap-2">
          {bloque.titulo && <p className="text-sm font-semibold">{bloque.titulo}</p>}
          <dl className="flex flex-col divide-y divide-borde overflow-hidden rounded-xl border border-borde bg-superficie">
            {bloque.filas.map((fila) => (
              <div key={fila.etiqueta} className="flex items-center justify-between gap-3 px-3.5 py-3">
                <div className="min-w-0">
                  <dt className="text-sm">{fila.etiqueta}</dt>
                  {fila.nota && <dd className="mt-0.5 text-xs text-texto-suave">{fila.nota}</dd>}
                </div>
                <span className="shrink-0 rounded-lg bg-acento-suave px-2.5 py-1 text-sm font-bold text-acento">
                  {fila.valor}
                </span>
              </div>
            ))}
          </dl>
        </div>
      );

    case "cita-legal":
      // Mismo tratamiento que components/inspeccion/ficha-tecnica.tsx.
      return (
        <div className="rounded-lg border border-acento/30 bg-acento-suave px-3.5 py-3">
          <p className="text-xs font-semibold tracking-wide text-acento">⚖️ SUSTENTO LEGAL</p>
          <blockquote className="mt-2 border-l-2 border-acento/50 pl-3 text-sm text-texto/90">
            <p>&ldquo;{bloque.cita.texto}&rdquo;</p>
            <footer className="mt-1 text-xs text-texto-suave">
              {bloque.cita.fuente} · consultado el {bloque.cita.consultadoEl}
            </footer>
          </blockquote>
        </div>
      );

    case "enlace":
      return (
        <a
          href={bloque.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-borde bg-superficie px-3.5 py-3 transition-colors hover:border-acento/50 active:bg-superficie-2"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-acento-suave text-base">
            🔗
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold leading-snug">{bloque.titulo}</span>
            <span className="block text-xs text-texto-suave">
              {bloque.fuente}
              {bloque.descripcion ? ` · ${bloque.descripcion}` : ""}
            </span>
          </span>
          <span aria-hidden className="text-texto-suave">
            ↗
          </span>
        </a>
      );

    case "alerta":
      return (
        <p
          className={cx(
            "rounded-lg border px-3.5 py-3 text-sm leading-relaxed",
            bloque.variante === "peligro"
              ? "border-error/40 bg-error/10 text-error"
              : "border-acento/30 bg-acento-suave text-texto/90",
          )}
        >
          {bloque.variante === "peligro" ? "⚠️ " : "💡 "}
          {bloque.texto}
        </p>
      );

    case "checklist":
      return <ChecklistInteractivo titulo={bloque.titulo} items={bloque.items} />;
  }
}
