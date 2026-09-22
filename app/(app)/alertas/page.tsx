import Link from "next/link";
import { obtenerPerfil } from "@/lib/auth/dal";
import { listarLicenciasPorVencer } from "@/lib/auth/ficha";
import { estadoLicencia, formatearFecha, type EstadoLicencia } from "@/lib/auth/licencia";
import { listarNovedadesPendientes } from "@/lib/inspeccion/consultas";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { TarjetaNovedad } from "@/components/inspeccion/tarjeta-novedad";
import { cx } from "@/lib/utils";

/**
 * Centro de alertas: novedades abiertas o en proceso, más el aviso de
 * licencias por vencer. Ninguna tiene tabla propia de "alertas": son vistas
 * derivadas de public.novedades (ver supabase/migrations/0003_inspecciones.sql)
 * y de la ficha en public.profiles (0004_ficha_conductor.sql). RLS decide el
 * alcance: el conductor ve lo suyo, el admin el de toda la flota.
 */
export default async function PaginaAlertas() {
  const perfil = await obtenerPerfil();
  const esAdmin = perfil.rol === "admin";

  const [novedades, licenciasFlota] = await Promise.all([
    listarNovedadesPendientes(),
    esAdmin ? listarLicenciasPorVencer() : Promise.resolve([]),
  ]);

  // El conductor ve un aviso solo por SU licencia; el admin, la lista de la flota.
  const propia = estadoLicencia(perfil.licencia_vence);
  const avisoPropio =
    !esAdmin && (propia.nivel === "por_vencer" || propia.nivel === "vencida");

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Centro de alertas"
        subtitulo={
          esAdmin
            ? "Licencias por vencer y novedades de toda la flota"
            : "Tus documentos y tus novedades abiertas o en proceso"
        }
      />

      {avisoPropio && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Documentos</p>
          <Link href="/perfil" className="block">
            <AvisoLicencia
              titulo="Tu licencia de conducción"
              detalle={
                perfil.licencia_vence ? `Vence el ${formatearFecha(perfil.licencia_vence)}` : ""
              }
              estado={propia}
            />
          </Link>
        </div>
      )}

      {esAdmin && licenciasFlota.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Licencias por vencer</p>
          {licenciasFlota.map((conductor) => (
            <Link key={conductor.id} href={`/admin/usuarios/${conductor.id}`} className="block">
              <AvisoLicencia
                titulo={conductor.nombre_completo || `Cédula ${conductor.cedula}`}
                detalle={
                  conductor.licencia_vence
                    ? `${conductor.licencia_categoria ?? "Licencia"} · vence el ${formatearFecha(conductor.licencia_vence)}`
                    : ""
                }
                estado={estadoLicencia(conductor.licencia_vence)}
              />
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {(avisoPropio || (esAdmin && licenciasFlota.length > 0)) && (
          <p className="text-sm font-semibold">Novedades</p>
        )}
        {novedades.length === 0 ? (
          <p className="text-sm text-texto-suave">No hay novedades pendientes.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {novedades.map((novedad) => (
              <TarjetaNovedad key={novedad.id} novedad={novedad} esAdmin={esAdmin} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AvisoLicencia({
  titulo,
  detalle,
  estado,
}: {
  titulo: string;
  detalle: string;
  estado: EstadoLicencia;
}) {
  const vencida = estado.nivel === "vencida";
  return (
    <div
      className={cx(
        "flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-superficie-2",
        vencida ? "border-error/40 bg-error/10" : "border-atencion/40 bg-atencion/10",
      )}
    >
      <div className="min-w-0">
        <p className="truncate font-medium">🪪 {titulo}</p>
        {detalle && <p className="text-xs text-texto-suave">{detalle}</p>}
      </div>
      <span
        className={cx(
          "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
          vencida ? "bg-error/15 text-error" : "bg-atencion/15 text-atencion",
        )}
      >
        {estado.texto}
      </span>
    </div>
  );
}
