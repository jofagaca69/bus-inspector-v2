/**
 * Recomprime una foto tomada desde el celular ANTES de subirla. Sin esto,
 * una foto de 3-6 MB viajaría entera a Storage y consumiría datos
 * móviles del conductor sin necesidad: en el detalle de una inspección
 * nunca se ve a más de unos cientos de píxeles.
 *
 * Es además la razón por la que las fotos jamás pasan por una Server
 * Action: el límite de body de Next 16 es 1 MB, y aunque no lo fuera,
 * subir el archivo entero al servidor para reenviarlo a Storage duplica
 * latencia y datos móviles en un patio de buses. Se sube directo del
 * navegador a Supabase Storage (ver components/inspeccion/subir-evidencia.tsx).
 */
export async function comprimirImagen(
  archivo: File,
  ladoMayor = 1280,
  calidad = 0.72,
): Promise<Blob> {
  if (typeof createImageBitmap === "undefined") return archivo;

  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, ladoMayor / Math.max(bitmap.width, bitmap.height));
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const canvas = document.createElement("canvas");
  canvas.width = ancho;
  canvas.height = alto;

  const contexto = canvas.getContext("2d");
  if (!contexto) return archivo;
  contexto.drawImage(bitmap, 0, 0, ancho, alto);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob ?? archivo),
      "image/webp",
      calidad,
    );
  });
}
