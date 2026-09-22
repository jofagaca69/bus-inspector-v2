/**
 * Utilidades genéricas sin dependencias externas. El proyecto no usa
 * `clsx`/`tailwind-merge`: con dos funciones de tres líneas alcanza.
 */

export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(" ");
}

/**
 * Minúsculas, sin tildes y sin espacios en los bordes: para que un buscador
 * encuentre "señal" escribiendo "senal". Vive aquí (y no dentro de un
 * componente cliente) porque también la llaman Server Components.
 */
export function normalizarBusqueda(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

/**
 * `crypto.randomUUID()` exige contexto seguro (localhost cuenta, una IP LAN
 * por HTTP no). Este fallback evita que probar por LAN en el celular rompa
 * el primer guardado. Postgres también puede generar el id con
 * `gen_random_uuid()`; esta función es para ids generados en el cliente
 * (ej. archivos temporales) antes de llegar al servidor.
 */
export function nuevoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // cae al fallback
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ahoraISO(): string {
  return new Date().toISOString();
}
