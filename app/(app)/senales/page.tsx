import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { Evaluacion } from "@/components/ui/evaluacion";
import { senales } from "@/lib/datos/senales";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";
import { FiltroSenales } from "@/app/(app)/senales/filtro-senales";

export default async function PaginaSenales() {
  await obtenerPerfil();
  const preguntas = obtenerEvaluacion("senales");

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Señales de tránsito"
        subtitulo="Reglamentarias, preventivas e informativas"
      />

      <FiltroSenales senales={senales} />

      {preguntas.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <Evaluacion preguntas={preguntas} />
        </div>
      )}

      <p className="text-xs text-texto-suave">
        Pictogramas de referencia tomados de{" "}
        <a
          href="https://practicatest.co/senales-transito-colombia"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          practicatest.co
        </a>
        , basados en el Manual de Señalización Vial del Ministerio de Transporte de Colombia.
      </p>
    </div>
  );
}
