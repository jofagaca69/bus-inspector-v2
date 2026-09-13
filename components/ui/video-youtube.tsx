"use client";

import { useState } from "react";

/**
 * "Lite embed" de YouTube: muestra la miniatura y solo inserta el
 * <iframe> real (de youtube-nocookie.com) al hacer clic. Evita cargar
 * el reproductor completo de YouTube en cada página de aprendizaje que
 * tenga varios videos.
 */
export function VideoYoutube({
  id,
  titulo,
}: {
  id: string;
  titulo: string;
}) {
  const [reproduciendo, setReproduciendo] = useState(false);

  if (reproduciendo) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-borde bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setReproduciendo(true)}
      className="group relative aspect-video w-full overflow-hidden rounded-xl border border-borde bg-superficie-2"
      aria-label={`Reproducir video: ${titulo}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- miniatura externa de YouTube, no vale la pena el paso por next/image */}
      <img
        src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
        alt=""
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-acento text-fondo">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-6 w-6">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-left text-xs font-medium text-white">
        {titulo}
      </span>
    </button>
  );
}
