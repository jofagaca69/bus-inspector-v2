import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { Acordeon } from "@/components/ui/acordeon";
import { Evaluacion } from "@/components/ui/evaluacion";
import { normativa } from "@/lib/datos/normativa";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";

export default async function PaginaNormativa() {
  await obtenerPerfil();
  const preguntas = obtenerEvaluacion("normativa");

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Normativa de tránsito"
        subtitulo="Lo que exige el Código Nacional de Tránsito a un conductor de servicio público"
      />

      <div className="flex flex-col gap-3">
        {normativa.map((entrada) => (
          <Acordeon
            key={entrada.id}
            icono={entrada.icono}
            titulo={entrada.titulo}
            fuente={entrada.fuente}
            tip={entrada.tip}
          >
            {entrada.cuerpo}
          </Acordeon>
        ))}
      </div>

      {preguntas.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <Evaluacion preguntas={preguntas} />
        </div>
      )}
    </div>
  );
}
