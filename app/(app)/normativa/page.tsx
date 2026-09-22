import { obtenerPerfil } from "@/lib/auth/dal";
import { CabeceraModulo } from "@/components/ui/cabecera-modulo";
import { Acordeon } from "@/components/ui/acordeon";
import { BloquesContenido } from "@/components/ui/bloques-contenido";
import { Evaluacion } from "@/components/ui/evaluacion";
import { normativa } from "@/lib/datos/normativa";
import { obtenerEvaluacion } from "@/lib/datos/evaluaciones";
import { normalizarBusqueda } from "@/lib/utils";
import {
  FiltroNormativa,
  type EntradaFiltrable,
} from "@/app/(app)/normativa/filtro-normativa";

export default async function PaginaNormativa() {
  await obtenerPerfil();
  const preguntas = obtenerEvaluacion("normativa");

  // El servidor arma cada acordeón; el filtro (cliente) solo elige cuáles mostrar.
  const entradas: EntradaFiltrable[] = normativa.map((entrada) => ({
    id: entrada.id,
    categoria: entrada.categoria,
    textoBusqueda: normalizarBusqueda(`${entrada.titulo} ${entrada.resumen} ${entrada.fuente}`),
    nodo: (
      <Acordeon
        icono={entrada.icono}
        titulo={entrada.titulo}
        resumen={entrada.resumen}
        fuente={entrada.fuente}
        tip={entrada.tip}
      >
        <BloquesContenido bloques={entrada.bloques} />
      </Acordeon>
    ),
  }));

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6">
      <CabeceraModulo
        titulo="Normativa de tránsito"
        subtitulo="Lo que exige el Código Nacional de Tránsito a un conductor de servicio público"
      />

      <FiltroNormativa entradas={entradas} />

      {preguntas.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Ponte a prueba</p>
          <Evaluacion preguntas={preguntas} />
        </div>
      )}
    </div>
  );
}
