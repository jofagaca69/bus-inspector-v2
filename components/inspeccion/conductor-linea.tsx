import { cx } from "@/lib/utils";
import { estadoLicencia, type NivelLicencia } from "@/lib/auth/licencia";
import type { PerfilConFicha } from "@/lib/auth/tipos";

const CLASE: Record<NivelLicencia, string> = {
  sin_dato: "text-texto-suave",
  vigente: "text-texto-suave",
  por_vencer: "text-atencion",
  vencida: "text-error",
};

/**
 * Una línea con el conductor y el estado de su licencia, para la cabecera
 * de la inspección y del resumen. Solo informa: no bloquea iniciar ni
 * cerrar una inspección (esa decisión sería de la empresa, no de la app).
 */
export function ConductorLinea({ perfil }: { perfil: PerfilConFicha | null }) {
  if (!perfil) return null;

  const licencia = estadoLicencia(perfil.licencia_vence);
  const categoria = perfil.licencia_categoria;

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-texto-suave">
      <span>👤 {perfil.nombre_completo || `Cédula ${perfil.cedula}`}</span>
      {licencia.nivel !== "sin_dato" && (
        <>
          <span aria-hidden>·</span>
          <span className={cx(CLASE[licencia.nivel])}>
            Licencia{categoria ? ` ${categoria}` : ""}: {licencia.texto.replace("Vigente · ", "")}
          </span>
        </>
      )}
    </p>
  );
}
