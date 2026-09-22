import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { BloquesContenido } from "@/components/ui/bloques-contenido";
import { VideoYoutube } from "@/components/ui/video-youtube";
import { Evaluacion } from "@/components/ui/evaluacion";
import { ListaGuias } from "@/components/primeros-auxilios/lista-guias";
import {
  botiquin,
  contactosEmergencia,
  guiasAuxilio,
} from "@/lib/datos/primeros-auxilios";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";
import { videos } from "@/lib/datos/videos";
import type { BloqueContenido } from "@/lib/datos/tipos";

const bloquesBotiquin: BloqueContenido[] = [
  {
    tipo: "tarjetas-icono",
    items: botiquin.map((item) => ({
      titulo: item.nombre,
      resumen: item.paraQueSirve,
      emoji: item.emoji,
    })),
  },
  {
    tipo: "checklist",
    titulo: "¿Está completo tu botiquín?",
    items: botiquin.map((item) => item.nombre),
  },
  {
    tipo: "alerta",
    variante: "info",
    texto: "Revisa también las fechas de vencimiento de los insumos: un botiquín vencido no sirve.",
  },
];

export default async function PaginaPrimerosAuxilios() {
  await obtenerPerfil();
  const preguntas = obtenerEvaluacion("primeros-auxilios");

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Primeros auxilios"
        subtitulo="Guías paso a paso para emergencias, botiquín y contactos"
      />

      {/* Llamar al 123, siempre a la vista mientras se recorre el módulo */}
      <div className="sticky top-2 z-20">
        <a
          href="tel:123"
          className="flex items-center justify-center gap-2 rounded-xl bg-error px-5 py-4 text-base font-bold text-fondo shadow-lg shadow-black/40"
        >
          📞 Emergencia: llamar al 123
        </a>
      </div>

      {/* Guías por gravedad, cada una en modo paso a paso */}
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold">¿Qué está pasando?</p>
          <p className="text-xs text-texto-suave">
            Toca la situación y sigue los pasos uno a uno.
          </p>
        </div>
        <ListaGuias guias={guiasAuxilio} />
      </div>

      {/* Botiquín */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold">🧰 Qué debe llevar el botiquín</p>
        <BloquesContenido bloques={bloquesBotiquin} />
      </div>

      {/* Videos de referencia */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Videos de la Cruz Roja Colombiana</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <VideoYoutube id={videos.rcp.id} titulo={videos.rcp.titulo} />
          <VideoYoutube id={videos.primerosAuxilios.id} titulo={videos.primerosAuxilios.titulo} />
        </div>
        <p className="text-xs text-texto-suave">
          Cada guía incluye además un video propio de su tema, al final de sus pasos.
        </p>
      </div>

      {/* Otros números de emergencia */}
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

      {preguntas.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <Evaluacion preguntas={preguntas} />
        </div>
      )}

      <p className="text-xs text-texto-suave">
        Esta guía es de referencia rápida y no reemplaza una certificación oficial en
        primeros auxilios. Ante cualquier emergencia, llama primero a la línea 123. Los videos
        pertenecen a sus respectivos canales.
      </p>
    </div>
  );
}
