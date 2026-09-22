/**
 * Acordeón de contenido académico (normativa, primeros auxilios, etc.),
 * réplica del patrón visual de las capturas de referencia: ícono en
 * cuadro redondeado, título, badge de fuente, cuerpo y recuadro de tip.
 *
 * Implementado con <details>/<summary> nativos a propósito: sigue
 * siendo un Server Component (no necesita useState para abrir/cerrar) y
 * funciona sin JavaScript, algo que un acordeón hecho con estado de
 * React no da gratis.
 */
export function Acordeon({
  icono,
  titulo,
  resumen,
  fuente,
  children,
  tip,
}: {
  icono: string;
  titulo: string;
  /** Línea corta bajo el título, visible con el acordeón cerrado. */
  resumen?: string;
  fuente?: string;
  children: React.ReactNode;
  tip?: string;
}) {
  return (
    <details className="group rounded-xl border border-borde bg-superficie open:pb-4">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 marker:content-none">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-acento-suave text-lg">
          {icono}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold">{titulo}</span>
          {resumen && (
            <span className="mt-0.5 text-xs font-normal leading-snug text-texto-suave">
              {resumen}
            </span>
          )}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4 shrink-0 text-texto-suave transition-transform group-open:rotate-180"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div className="flex flex-col gap-3 px-4">
        {fuente && (
          <span className="w-fit rounded-full bg-superficie-2 px-2.5 py-1 text-xs font-medium text-texto-suave">
            {fuente}
          </span>
        )}

        <div className="text-sm leading-relaxed text-texto/90">{children}</div>

        {tip && (
          <div className="rounded-lg bg-acento-suave px-3.5 py-3">
            <p className="text-xs font-semibold tracking-wide text-acento">
              💡 TIP PRÁCTICO
            </p>
            <p className="mt-1 text-sm text-texto/90">{tip}</p>
          </div>
        )}
      </div>
    </details>
  );
}
