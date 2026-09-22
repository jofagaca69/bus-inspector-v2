// Verifica que cada video de YouTube de la app siga existiendo y sea
// embebible, consultando el endpoint oEmbed público de YouTube.
//
// Todos los videos viven en un único registro: lib/datos/videos.ts. Este
// script extrae de ahí cada `id: "XXXXXXXXXXX"` y pide su metadata. Un ID
// inválido o retirado rompe el reproductor en plena sustentación, y
// lib/datos/aprendizaje.ts ya exigía esta comprobación a mano: aquí queda
// automatizada.
//
// Uso:
//   node scripts/verificar-videos.mjs
//       Verifica todo el registro. Sale con código 1 si alguno falla.
//   node scripts/verificar-videos.mjs --candidatos ID1 ID2 ...
//       Solo imprime título y canal de IDs sueltos, para decidir cuáles
//       incorporar al registro (usar el título/canal REALES que devuelve).

import { readFile } from "node:fs/promises";
import path from "node:path";

const RAIZ = path.resolve(import.meta.dirname, "..");
const ARCHIVO = path.join(RAIZ, "lib", "datos", "videos.ts");
const ID_VALIDO = /^[A-Za-z0-9_-]{11}$/;

async function consultar(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}&format=json`;
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      const motivo =
        respuesta.status === 401 || respuesta.status === 403
          ? "no embebible / privado"
          : respuesta.status === 404
            ? "no existe o fue retirado"
            : `HTTP ${respuesta.status}`;
      return { id, ok: false, motivo };
    }
    const datos = await respuesta.json();
    return { id, ok: true, titulo: datos.title, canal: datos.author_name };
  } catch (error) {
    return { id, ok: false, motivo: `error de red: ${error.message}` };
  }
}

async function main() {
  const argumentos = process.argv.slice(2);
  const modoCandidatos = argumentos[0] === "--candidatos";

  let ids;
  if (modoCandidatos) {
    ids = argumentos.slice(1);
  } else {
    const fuente = await readFile(ARCHIVO, "utf8");
    ids = [...fuente.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
    if (ids.length === 0) {
      console.error(`No se encontró ningún id en ${ARCHIVO}`);
      process.exit(1);
    }
  }

  const duplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicados.length > 0) {
    console.error(`IDs repetidos en el registro: ${[...new Set(duplicados)].join(", ")}`);
    process.exit(1);
  }

  const malFormados = ids.filter((id) => !ID_VALIDO.test(id));
  if (malFormados.length > 0) {
    console.error(`IDs con formato inválido (deben tener 11 caracteres): ${malFormados.join(", ")}`);
    process.exit(1);
  }

  // De a 5 en paralelo: suficiente para ~60 videos sin ser agresivo con YouTube.
  const resultados = [];
  for (let i = 0; i < ids.length; i += 5) {
    resultados.push(...(await Promise.all(ids.slice(i, i + 5).map(consultar))));
  }

  for (const r of resultados) {
    console.log(r.ok ? `OK    ${r.id}  ${r.canal} — ${r.titulo}` : `FALLA ${r.id}  ${r.motivo}`);
  }

  const fallidos = resultados.filter((r) => !r.ok);
  console.log(`\n${resultados.length - fallidos.length}/${resultados.length} videos disponibles.`);
  if (fallidos.length > 0 && !modoCandidatos) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
