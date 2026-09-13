"use client";

import { useRef, useState } from "react";
import { crearClienteNavegador } from "@/lib/supabase/cliente";
import { comprimirImagen } from "@/lib/inspeccion/comprimir-imagen";
import { nuevoId } from "@/lib/utils";
import { Icono } from "@/components/ui/icono";

/**
 * Sube una foto DIRECTO al bucket privado "evidencias" de Supabase
 * Storage desde el navegador (crearClienteNavegador, con la sesión del
 * conductor). La Server Action correspondiente (registrarEvidencia /
 * registrarEvidenciaNovedad) solo registra la ruta después: nunca ve los
 * bytes. Ver lib/inspeccion/comprimir-imagen.ts para la justificación
 * completa de por qué las fotos no pasan por una Server Action.
 */
export function SubirEvidencia({
  carpeta,
  onSubida,
  etiqueta = "Adjuntar foto",
}: {
  /** Prefijo de ruta, DEBE empezar por el uid del conductor (ver policies
   * de storage.objects en 0003_inspecciones.sql): `${conductorId}/{...}`. */
  carpeta: string;
  onSubida: (datos: { ruta: string; mime: string; bytes: number }) => void | Promise<void>;
  etiqueta?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function alElegirArchivo(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    evento.target.value = "";
    if (!archivo) return;

    setSubiendo(true);
    setError(null);
    try {
      const blob = await comprimirImagen(archivo);
      const ruta = `${carpeta}/${nuevoId()}.webp`;
      const supabase = crearClienteNavegador();
      const { error: errorSubida } = await supabase.storage
        .from("evidencias")
        .upload(ruta, blob, { contentType: "image/webp" });

      if (errorSubida) {
        setError("No se pudo subir la foto. Verifica tu conexión e intenta de nuevo.");
        return;
      }

      await onSubida({ ruta, mime: "image/webp", bytes: blob.size });
    } catch {
      setError("No se pudo procesar la foto.");
    } finally {
      setSubiendo(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={alElegirArchivo}
        className="hidden"
      />
      <button
        type="button"
        disabled={subiendo}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-lg border border-borde bg-superficie px-3 py-2 text-sm font-medium disabled:opacity-60"
      >
        <Icono nombre="camara" className="h-4 w-4" />
        {subiendo ? "Subiendo..." : etiqueta}
      </button>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
