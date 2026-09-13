// Script de un solo uso: importa las señales de tránsito colombianas
// desde https://practicatest.co/senales-transito-colombia.
//
// Descarga cada pictograma a public/senales/<categoria>/<id>.png y
// genera lib/datos/senales.ts con { id, codigo, nombre, descripcion,
// imagen, categoria } para cada señal encontrada.
//
// El HTML de origen no siempre es 1 imagen -> 1 párrafo: varias señales
// vienen en parejas izquierda/derecha que comparten un solo párrafo
// ("SP-01 y SP-02 <b>CURVA PELIGROSA A LA IZQUIERDA o DERECHA</b>..."),
// así que el parseo asocia párrafos con las imágenes que los preceden en
// vez de asumir una correspondencia 1 a 1.
//
// Uso: node scripts/importar-senales.mjs

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const URL_ORIGEN = "https://practicatest.co/senales-transito-colombia";
const RAIZ = path.resolve(import.meta.dirname, "..");
const CATEGORIAS = ["reglamentarias", "preventivas", "informativas"];

function limpiarTexto(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function direccionDeArchivo(archivo) {
  if (archivo.endsWith("_izquierda")) return "izquierda";
  if (archivo.endsWith("_derecha")) return "derecha";
  return null;
}

/** Si el nombre alterna "IZQUIERDA o DERECHA" (en cualquier orden), lo
 * reduce a la dirección que corresponde a esta imagen puntual. */
function ajustarNombrePorDireccion(nombre, direccion) {
  if (!direccion) return nombre;
  const propia = direccion === "izquierda" ? "IZQUIERDA" : "DERECHA";
  const otra = direccion === "izquierda" ? "DERECHA" : "IZQUIERDA";
  const patron = new RegExp(`(?:${propia}\\s+o\\s+${otra}|${otra}\\s+o\\s+${propia})`, "i");
  return patron.test(nombre) ? nombre.replace(patron, propia) : nombre;
}

async function main() {
  console.log(`Descargando ${URL_ORIGEN} ...`);
  const respuesta = await fetch(URL_ORIGEN);
  if (!respuesta.ok) {
    throw new Error(`No se pudo descargar la página: HTTP ${respuesta.status}`);
  }
  const html = await respuesta.text();

  // --- Paso 1: recolectar todas las imágenes de señal, en orden ---
  const regexImagen =
    /<img[^>]*src="(https:\/\/practicatest\.co\/static\/img\/co\/temario\/senales_(reglamentarias|preventivas|informativas)\/([a-z0-9_]+)\.png)"[^>]*>/g;

  const imagenes = [];
  let m;
  while ((m = regexImagen.exec(html))) {
    imagenes.push({
      tipo: "img",
      indice: m.index,
      finIndice: m.index + m[0].length,
      urlImagen: m[1],
      categoria: m[2],
      archivo: m[3],
    });
  }

  // --- Paso 2: recolectar todos los párrafos "SR-01 <b>NOMBRE</b><br>desc" ---
  // Admite más de un código por párrafo ("SP-01 y SP-02 <b>...</b>").
  const regexParrafo =
    /<p>\s*((?:S[RPI]-\d+)(?:\s*(?:y|,)\s*S[RPI]-\d+)*)\s*<b>([^<]*)<\/b>\s*<br\s*\/?>([\s\S]*?)<\/p>/g;

  const parrafos = [];
  while ((m = regexParrafo.exec(html))) {
    parrafos.push({
      tipo: "p",
      indice: m.index,
      codigos: m[1].split(/\s*(?:y|,)\s*/i).map((c) => c.trim()),
      nombreCrudo: m[2].trim(),
      descripcion: limpiarTexto(m[3]),
    });
  }

  // --- Paso 3: emparejar caminando el documento en orden ---
  // Cada párrafo "reclama" todas las imágenes acumuladas desde el
  // párrafo anterior.
  const eventos = [...imagenes, ...parrafos].sort((a, b) => a.indice - b.indice);

  const encontradas = [];
  const noEmparejadas = [];
  let pendientes = [];

  for (const evento of eventos) {
    if (evento.tipo === "img") {
      pendientes.push(evento);
      continue;
    }

    // evento.tipo === "p"
    if (pendientes.length === 0) continue; // párrafo sin imágenes (p.ej. intro de categoría)

    if (pendientes.length !== evento.codigos.length) {
      // No sabemos emparejar de forma confiable: se reportan como
      // pendientes de revisión y se detiene la generación al final.
      for (const img of pendientes) noEmparejadas.push(img.archivo);
      pendientes = [];
      continue;
    }

    pendientes.forEach((img, i) => {
      const direccion = direccionDeArchivo(img.archivo);
      const nombre = ajustarNombrePorDireccion(evento.nombreCrudo, direccion);
      const descripcion =
        evento.descripcion.length > 0
          ? evento.descripcion
          : `Señal ${img.categoria === "reglamentarias" ? "reglamentaria" : img.categoria === "preventivas" ? "preventiva" : "informativa"}: ${nombre.toLowerCase()}.`;

      encontradas.push({
        id: img.archivo,
        codigo: evento.codigos[i],
        nombre,
        descripcion,
        categoria: img.categoria,
        urlImagen: img.urlImagen,
      });
    });
    pendientes = [];
  }

  if (pendientes.length > 0) {
    for (const img of pendientes) noEmparejadas.push(img.archivo);
  }

  console.log(`Señales emparejadas: ${encontradas.length}`);
  for (const cat of CATEGORIAS) {
    console.log(`  ${cat}: ${encontradas.filter((s) => s.categoria === cat).length}`);
  }

  if (noEmparejadas.length > 0) {
    console.error(
      `\nERROR: ${noEmparejadas.length} imágenes de señal no se pudieron emparejar con su descripción:`,
    );
    console.error(noEmparejadas.join(", "));
    console.error(
      "\nRevisá el HTML de origen y ajustá el parseo antes de continuar. Abortando sin escribir archivos.",
    );
    process.exit(1);
  }

  // --- Paso 4: descargar imágenes ---
  for (const cat of CATEGORIAS) {
    await mkdir(path.join(RAIZ, "public", "senales", cat), { recursive: true });
  }

  console.log("\nDescargando imágenes...");
  let descargadas = 0;
  for (const senal of encontradas) {
    const destino = path.join(RAIZ, "public", "senales", senal.categoria, `${senal.id}.png`);
    const res = await fetch(senal.urlImagen);
    if (!res.ok) {
      throw new Error(`No se pudo descargar ${senal.urlImagen}: HTTP ${res.status}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(destino, buffer);
    descargadas++;
    if (descargadas % 20 === 0) console.log(`  ${descargadas}/${encontradas.length}...`);
  }
  console.log(`Descargadas ${descargadas} imágenes.`);

  // --- Paso 5: generar lib/datos/senales.ts ---
  const lineas = encontradas
    .sort((a, b) => a.codigo.localeCompare(b.codigo, "es") || a.id.localeCompare(b.id))
    .map(
      (s) =>
        `  { id: ${JSON.stringify(s.id)}, codigo: ${JSON.stringify(s.codigo)}, nombre: ${JSON.stringify(s.nombre)}, descripcion: ${JSON.stringify(s.descripcion)}, imagen: ${JSON.stringify(`/senales/${s.categoria}/${s.id}.png`)}, categoria: ${JSON.stringify(s.categoria)} },`,
    )
    .join("\n");

  const contenido = `import type { Senal } from "@/lib/datos/tipos";

/**
 * GENERADO por scripts/importar-senales.mjs a partir de
 * https://practicatest.co/senales-transito-colombia — no editar a mano
 * los datos de cada señal; volver a correr el script si hace falta
 * actualizarlas. Los pictogramas viven en public/senales/<categoria>/.
 *
 * Nota: unas pocas señales reglamentarias comparten el mismo código
 * mostrado (ej. SR-06) por una inconsistencia del sitio de origen; el
 * campo "id" (slug de archivo) es el que garantiza unicidad para keys
 * de React y no debe usarse como código oficial visible.
 */
export const senales: Senal[] = [
${lineas}
];
`;

  await writeFile(path.join(RAIZ, "lib", "datos", "senales.ts"), contenido, "utf8");
  console.log("\nGenerado lib/datos/senales.ts");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
