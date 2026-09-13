import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { empresa } from "@/lib/datos/empresa";
import { itemsNavegacion } from "@/lib/navegacion";

export default async function PaginaAcercaDe() {
  await obtenerPerfil();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo titulo="Acerca de" subtitulo={empresa.razonSocial} />

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <p className="text-sm leading-relaxed text-texto/90">
          {empresa.descripcionApp}
        </p>
        <p className="mt-3 text-xs text-texto-suave">Versión {empresa.version}</p>
      </div>

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <p className="mb-3 text-sm font-semibold">Módulos disponibles</p>
        <ul className="flex flex-col gap-2">
          {itemsNavegacion.map((item) => (
            <li key={item.href} className="flex items-center gap-2.5 text-sm">
              <span>{item.icono}</span>
              <span className={item.disponible ? "" : "text-texto-suave/60"}>
                {item.etiqueta}
                {!item.disponible && " (próximamente)"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-borde bg-superficie p-4">
        <p className="mb-2 text-sm font-semibold">Fuentes normativas</p>
        <ul className="flex flex-col gap-1.5 text-sm text-texto/90">
          <li>• Ley 769 de 2002 — Código Nacional de Tránsito Terrestre</li>
          <li>• Decreto 431 de 2017 — Reglamento del transporte terrestre automotor</li>
          <li>• Manual de Señalización Vial de Colombia, Ministerio de Transporte</li>
        </ul>
      </div>

      <p className="text-xs text-texto-suave">
        Aplicación desarrollada para uso interno de {empresa.razonSocial}. El
        contenido educativo es de referencia y no reemplaza la normativa
        oficial vigente ni una certificación formal en primeros auxilios.
      </p>
    </div>
  );
}
