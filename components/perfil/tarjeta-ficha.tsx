import { cx } from "@/lib/utils";
import { estadoLicencia, formatearFecha, type NivelLicencia } from "@/lib/auth/licencia";
import type { PerfilConFicha } from "@/lib/auth/tipos";

const CHIP: Record<NivelLicencia, string> = {
  sin_dato: "bg-neutro/20 text-texto-suave",
  vigente: "bg-exito/15 text-exito",
  por_vencer: "bg-atencion/15 text-atencion",
  vencida: "bg-error/15 text-error",
};

/**
 * Ficha del conductor, de solo lectura: quién es, su licencia (con el
 * estado de vigencia calculado de hoy) y los datos que importan en una
 * emergencia. La usa /perfil y la vista de un admin en /admin/usuarios/[id].
 */
export function TarjetaFicha({ perfil }: { perfil: PerfilConFicha }) {
  const licencia = estadoLicencia(perfil.licencia_vence);
  const categoria = perfil.licencia_categoria;
  // Regla de lib/datos/normativa.ts ("licencia-categoria"): un bus de
  // servicio público exige C2 o C3.
  const categoriaInsuficiente = !!categoria && categoria !== "C2" && categoria !== "C3";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-acento-suave text-lg font-bold text-acento">
          {(perfil.nombre_completo || perfil.cedula).trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">
            {perfil.nombre_completo || "(sin nombre)"}
          </p>
          <p className="text-xs text-texto-suave">
            Cédula {perfil.cedula} · {perfil.rol === "admin" ? "Administrador" : "Conductor"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-borde pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">🪪 Licencia de conducción</p>
          <span
            className={cx("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold", CHIP[licencia.nivel])}
          >
            {licencia.texto}
          </span>
        </div>
        <Fila etiqueta="Categoría" valor={categoria} />
        <Fila etiqueta="Número" valor={perfil.licencia_numero} />
        <Fila
          etiqueta="Vence"
          valor={perfil.licencia_vence ? formatearFecha(perfil.licencia_vence) : null}
        />
        {categoriaInsuficiente && (
          <p className="rounded-lg border border-atencion/40 bg-atencion/10 px-3 py-2 text-xs text-atencion">
            ⚠️ La normativa exige categoría C2 o C3 para conducir un bus de servicio público.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-borde pt-3">
        <p className="text-sm font-semibold">🩺 En caso de emergencia</p>
        <Fila etiqueta="Tipo de sangre" valor={perfil.rh} />
        <Fila etiqueta="EPS" valor={perfil.eps} />
        <Fila etiqueta="Contacto" valor={perfil.contacto_emergencia_nombre} />
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="text-texto-suave">Teléfono del contacto</span>
          {perfil.contacto_emergencia_telefono ? (
            <a
              href={`tel:${perfil.contacto_emergencia_telefono}`}
              className="font-medium text-acento hover:underline"
            >
              {perfil.contacto_emergencia_telefono}
            </a>
          ) : (
            <span className="text-texto-suave">—</span>
          )}
        </div>
      </div>

      {perfil.fecha_ingreso && (
        <div className="border-t border-borde pt-3">
          <Fila etiqueta="Ingresó a la empresa" valor={formatearFecha(perfil.fecha_ingreso)} />
        </div>
      )}
    </div>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string | null | undefined }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-texto-suave">{etiqueta}</span>
      <span className={cx("text-right font-medium", !valor && "text-texto-suave")}>
        {valor || "—"}
      </span>
    </div>
  );
}
