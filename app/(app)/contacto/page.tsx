import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { empresa } from "@/lib/datos/empresa";

export default async function PaginaContacto() {
  await obtenerPerfil();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Contacto"
        subtitulo={`Comunícate con ${empresa.razonSocial}`}
      />

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-borde bg-superficie p-4">
          <p className="text-sm font-semibold">{empresa.razonSocial}</p>
          <p className="text-xs text-texto-suave">NIT {empresa.nit}</p>
          <p className="mt-2 text-sm text-texto/90">{empresa.direccion}</p>
          <p className="text-sm text-texto/90">{empresa.ciudad}</p>
          <p className="mt-2 text-xs text-texto-suave">{empresa.horarioAtencion}</p>
        </div>

        <a
          href={`tel:${empresa.telefonoFijo}`}
          className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-4 transition-colors hover:border-acento/50"
        >
          <span className="text-xl">📞</span>
          <div>
            <p className="text-sm font-medium">Llamar a la oficina</p>
            <p className="text-xs text-texto-suave">{empresa.telefonoFijo}</p>
          </div>
        </a>

        <a
          href={`https://wa.me/${empresa.telefonoWhatsapp.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-4 transition-colors hover:border-acento/50"
        >
          <span className="text-xl">💬</span>
          <div>
            <p className="text-sm font-medium">Escribir por WhatsApp</p>
            <p className="text-xs text-texto-suave">{empresa.telefonoWhatsapp}</p>
          </div>
        </a>

        <a
          href={`mailto:${empresa.correo}`}
          className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-4 transition-colors hover:border-acento/50"
        >
          <span className="text-xl">✉️</span>
          <div>
            <p className="text-sm font-medium">Enviar un correo</p>
            <p className="text-xs text-texto-suave">{empresa.correo}</p>
          </div>
        </a>

        <a
          href={empresa.enlaceMapa}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl border border-borde bg-superficie p-4 transition-colors hover:border-acento/50"
        >
          <span className="text-xl">📍</span>
          <div>
            <p className="text-sm font-medium">Ver ubicación en el mapa</p>
            <p className="text-xs text-texto-suave">{empresa.ciudad}</p>
          </div>
        </a>
      </div>

      <p className="text-xs text-texto-suave">
        Los datos de contacto se administran desde lib/datos/empresa.ts.
      </p>
    </div>
  );
}
