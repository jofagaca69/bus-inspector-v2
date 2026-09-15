import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { Acordeon } from "@/components/ui/acordeon";
import { VideoYoutube } from "@/components/ui/video-youtube";
import { Evaluacion } from "@/components/ui/evaluacion";
import {
  botiquin,
  contactosEmergencia,
  guiasAuxilio,
} from "@/lib/datos/primeros-auxilios";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";

export default async function PaginaPrimerosAuxilios() {
  await obtenerPerfil();
  const preguntas = obtenerEvaluacion("primeros-auxilios");

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Primeros auxilios"
        subtitulo="Contactos de emergencia, botiquín y guías rápidas por tipo de auxilio"
      />

      {/* Contactos de emergencia: lo primero y más accesible */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Números de emergencia</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {contactosEmergencia.map((c) => (
            <a
              key={c.numero}
              href={`tel:${c.numero.replace("#", "%23")}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-borde bg-superficie p-3.5 transition-colors hover:border-acento/50"
            >
              <div>
                <p className="text-sm font-medium">{c.nombre}</p>
                <p className="text-xs text-texto-suave">{c.descripcion}</p>
              </div>
              <span className="shrink-0 rounded-lg bg-acento-suave px-3 py-1.5 text-sm font-bold text-acento">
                {c.numero}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Botiquín */}
      <div className="rounded-xl border border-borde bg-superficie p-4">
        <p className="mb-3 text-sm font-semibold">🧰 Qué debe llevar el botiquín</p>
        <ul className="flex flex-col gap-2.5">
          {botiquin.map((item) => (
            <li key={item.nombre} className="text-sm">
              <span className="font-medium">{item.nombre}</span>
              <span className="text-texto-suave"> — {item.paraQueSirve}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Video de referencia: RCP de Cruz Roja Colombiana */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Video de referencia</p>
        <div className="max-w-md">
          <VideoYoutube id="4_o3eLNIZ7o" titulo="Cómo hacer RCP paso a paso — Cruz Roja Colombiana" />
        </div>
      </div>

      {/* Guías por tipo de auxilio */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">Guías rápidas por tipo de auxilio</p>
        {guiasAuxilio.map((guia) => (
          <Acordeon key={guia.id} icono={guia.icono} titulo={guia.titulo}>
            <div className="flex flex-col gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wide text-texto-suave">
                  PASOS A SEGUIR
                </p>
                <ol className="flex flex-col gap-1">
                  {guia.pasos.map((paso, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="shrink-0 text-acento">{i + 1}.</span>
                      {paso}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-lg bg-error/10 px-3.5 py-3">
                <p className="mb-1 text-xs font-semibold tracking-wide text-error">
                  ⚠️ QUÉ NO HACER
                </p>
                <ul className="flex flex-col gap-1">
                  {guia.queNoHacer.map((item, i) => (
                    <li key={i} className="text-sm text-texto/90">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Acordeon>
        ))}
      </div>

      {preguntas.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <Evaluacion preguntas={preguntas} />
        </div>
      )}

      <p className="text-xs text-texto-suave">
        Esta guía es de referencia rápida y no reemplaza una certificación oficial en
        primeros auxilios. Ante cualquier emergencia, llamá primero a la línea 123.
      </p>
    </div>
  );
}
