"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Icono } from "@/components/ui/icono";
import { HojaInferior } from "@/components/ui/hoja-inferior";
import { PlanoBus } from "@/components/inspeccion/plano-bus";
import { FichaTecnica } from "@/components/inspeccion/ficha-tecnica";
import { SubirEvidencia } from "@/components/inspeccion/subir-evidencia";
import { FormularioNovedad } from "@/components/inspeccion/formulario-novedad";
import { BarraProgreso } from "@/components/inspeccion/barra-progreso";
import { obtenerComponente } from "@/lib/datos/componentes";
import { zonasDeVista } from "@/lib/datos/zonas-bus";
import { estadoGeneral } from "@/lib/inspeccion/calculo";
import {
  guardarItem,
  registrarEvidencia,
  finalizarInspeccion,
  descartarInspeccion,
  cambiarBusDeInspeccion,
} from "@/app/(app)/inspeccion/acciones";
import type { EstadoItem, VistaBus, ZonaBus } from "@/lib/datos/tipos";
import type { Bus, InspeccionConBus, InspeccionItem } from "@/lib/inspeccion/tipos";

type EstadoHoja =
  | { tipo: "lista"; zona: ZonaBus }
  | { tipo: "ficha"; componenteId: string }
  // componenteId opcional: presente cuando la novedad se abrió desde la
  // ficha de un componente ("Reportar novedad detallada"), ausente
  // cuando se abrió desde el botón general "Reportar novedad".
  | { tipo: "novedad-general"; componenteId?: string }
  | null;

/**
 * Orquestador de la inspección en curso: mantiene el estado de los ~23
 * ítems en memoria (inicializado desde la BD), lo persiste ítem a ítem
 * con guardarItem (sin revalidar en cada tap: Next 16 despacha las
 * Server Actions de a una por cliente, y revalidar en cada toque sería
 * un round-trip visible por cada tap) y calcula el veredicto en vivo con
 * lib/inspeccion/calculo.ts para la previsualización optimista.
 */
export function InspeccionEnCurso({
  inspeccion,
  itemsIniciales,
  conductorId,
  busesActivos,
}: {
  inspeccion: InspeccionConBus;
  itemsIniciales: InspeccionItem[];
  conductorId: string;
  busesActivos: Bus[];
}) {
  const [estados, setEstados] = useState<Record<string, EstadoItem>>(() =>
    Object.fromEntries(itemsIniciales.map((it) => [it.codigo_componente, it.estado])),
  );
  const [vista, setVista] = useState<VistaBus>("lateral");
  const [hoja, setHoja] = useState<EstadoHoja>(null);
  const [errorFinal, setErrorFinal] = useState<string | null>(null);
  const [kilometraje, setKilometraje] = useState("");
  const [pendiente, iniciarTransicion] = useTransition();

  const idsRevisables = useMemo(
    () => itemsIniciales.map((it) => it.codigo_componente),
    [itemsIniciales],
  );
  const itemIdPorCodigo = useMemo(
    () => Object.fromEntries(itemsIniciales.map((it) => [it.codigo_componente, it.id])),
    [itemsIniciales],
  );

  const resultado = useMemo(
    () => estadoGeneral(estados, idsRevisables),
    [estados, idsRevisables],
  );
  const faltantes = idsRevisables.filter(
    (id) => !estados[id] || estados[id] === "sin_revisar",
  ).length;

  function cambiarEstado(componenteId: string, estado: Exclude<EstadoItem, "sin_revisar">) {
    setEstados((prev) => ({ ...prev, [componenteId]: estado }));
    iniciarTransicion(() => {
      guardarItem(inspeccion.id, componenteId, estado);
    });
  }

  function alFinalizar() {
    setErrorFinal(null);

    // Vacío = no se registra kilometraje. Se acepta "12.345" o "12 345".
    const texto = kilometraje.replace(/[.\s]/g, "");
    const km = texto === "" ? null : Number(texto);
    if (km !== null && (!Number.isInteger(km) || km < 0 || km > 3_000_000)) {
      setErrorFinal("El kilometraje debe ser un número entero entre 0 y 3.000.000.");
      return;
    }

    iniciarTransicion(async () => {
      const respuesta = await finalizarInspeccion(inspeccion.id, km);
      if (respuesta?.error) setErrorFinal(respuesta.error);
    });
  }

  const componenteActivo = hoja?.tipo === "ficha" ? obtenerComponente(hoja.componenteId) : null;
  const componenteDeNovedad =
    hoja?.tipo === "novedad-general" && hoja.componenteId
      ? obtenerComponente(hoja.componenteId)
      : null;

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            Bus {inspeccion.bus?.numero_interno} · {inspeccion.bus?.placa}
          </p>
          <p className="text-xs text-texto-suave">
            {inspeccion.tipo === "rapida" ? "Check rápido" : "Inspección completa"} ·{" "}
            {idsRevisables.length - faltantes}/{idsRevisables.length} revisados
          </p>
        </div>
        <BarraProgreso porcentaje={resultado.porcentaje} tamano={64} grosor={6} />
      </div>

      {busesActivos.length > 1 && (
        <label className="flex items-center gap-2 text-xs text-texto-suave">
          ¿Te tocó otro bus hoy?
          <select
            value={inspeccion.bus_id}
            onChange={(evento) =>
              iniciarTransicion(() => cambiarBusDeInspeccion(inspeccion.id, evento.target.value))
            }
            className="rounded-md border border-borde bg-transparent px-2 py-1 text-xs"
          >
            {busesActivos.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.numero_interno} · {bus.placa}
              </option>
            ))}
          </select>
        </label>
      )}

      <PlanoBus
        vista={vista}
        onCambiarVista={setVista}
        zonas={zonasDeVista(vista)}
        estados={estados}
        onSeleccionarZona={(zona) =>
          setHoja(
            zona.componentes.length === 1
              ? { tipo: "ficha", componenteId: zona.componentes[0] }
              : { tipo: "lista", zona },
          )
        }
      />

      <div
        className={`rounded-xl border px-4 py-3 text-sm ${
          resultado.nivel === "rojo"
            ? "border-error/40 bg-error/10 text-error"
            : resultado.nivel === "amarillo"
              ? "border-atencion/40 bg-atencion/10 text-atencion"
              : "border-exito/40 bg-exito/10 text-exito"
        }`}
      >
        <p className="font-semibold">{resultado.veredicto}</p>
        <p className="mt-0.5 text-xs opacity-90">{resultado.motivo}</p>
      </div>

      {errorFinal && (
        <p role="alert" className="text-sm text-error">
          {errorFinal}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-1 text-xs text-texto-suave">
          Kilometraje del odómetro (opcional)
          <input
            type="text"
            inputMode="numeric"
            value={kilometraje}
            onChange={(e) => setKilometraje(e.target.value)}
            placeholder="Ej. 123456"
            className="rounded-md border border-borde bg-superficie px-3 py-2.5 text-sm text-texto placeholder:text-neutro"
          />
        </label>

        <button
          type="button"
          disabled={pendiente || faltantes > 0}
          onClick={alFinalizar}
          className="rounded-md bg-acento px-4 py-3 text-sm font-semibold text-fondo disabled:opacity-50"
        >
          {faltantes > 0
            ? `Finalizar inspección (faltan ${faltantes})`
            : "Finalizar inspección"}
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setHoja({ tipo: "novedad-general" })}
            className="flex-1 rounded-md border border-borde px-4 py-2.5 text-sm font-medium text-texto-suave hover:text-texto"
          >
            Reportar novedad
          </button>
          <Link
            href="/historial"
            className="flex-1 rounded-md border border-borde px-4 py-2.5 text-center text-sm font-medium text-texto-suave hover:text-texto"
          >
            Ver historial
          </Link>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm("¿Descartar esta inspección? Se perderá todo lo marcado.")) {
              iniciarTransicion(() => descartarInspeccion(inspeccion.id));
            }
          }}
          className="text-xs text-texto-suave underline decoration-dotted hover:text-error"
        >
          Descartar y empezar de nuevo
        </button>
      </div>

      {/* Lista de componentes de una zona con más de uno */}
      <HojaInferior
        abierta={hoja?.tipo === "lista"}
        onCerrar={() => setHoja(null)}
        titulo={hoja?.tipo === "lista" ? hoja.zona.etiqueta : undefined}
      >
        {hoja?.tipo === "lista" && (
          <div className="flex flex-col gap-1.5">
            {hoja.zona.componentes.map((id) => {
              const comp = obtenerComponente(id);
              if (!comp) return null;
              const estado = estados[id] ?? "sin_revisar";
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setHoja({ tipo: "ficha", componenteId: id })}
                  className="flex items-center gap-3 rounded-lg border border-borde px-3 py-2.5 text-left hover:bg-superficie-2"
                >
                  <Icono nombre={comp.icono} className="h-5 w-5 text-texto-suave" />
                  <span className="flex-1 text-sm font-medium">{comp.nombre}</span>
                  <EstadoChip estado={estado} />
                </button>
              );
            })}
          </div>
        )}
      </HojaInferior>

      {/* Ficha técnica del componente elegido */}
      <HojaInferior
        abierta={hoja?.tipo === "ficha"}
        onCerrar={() => setHoja(null)}
        titulo={componenteActivo?.nombre}
      >
        {componenteActivo && (
          <FichaTecnica
            componente={componenteActivo}
            estado={estados[componenteActivo.id] ?? "sin_revisar"}
            onCambiarEstado={(estado) => cambiarEstado(componenteActivo.id, estado)}
            onReportarNovedad={() =>
              setHoja({ tipo: "novedad-general", componenteId: componenteActivo.id })
            }
          >
            <SubirEvidencia
              carpeta={`${conductorId}/${inspeccion.id}/${componenteActivo.id}`}
              onSubida={(datos) =>
                registrarEvidencia({
                  inspeccionId: inspeccion.id,
                  itemId: itemIdPorCodigo[componenteActivo.id],
                  ...datos,
                })
              }
            />
          </FichaTecnica>
        )}
      </HojaInferior>

      {/* Novedad general / detallada */}
      <HojaInferior
        abierta={hoja?.tipo === "novedad-general"}
        onCerrar={() => setHoja(null)}
        titulo="Nueva novedad"
      >
        <FormularioNovedad
          busId={inspeccion.bus_id}
          conductorId={conductorId}
          inspeccionId={inspeccion.id}
          inspeccionItemId={
            componenteDeNovedad ? itemIdPorCodigo[componenteDeNovedad.id] : undefined
          }
          sugerencias={componenteDeNovedad?.tiposNovedad}
          onExito={() => setHoja(null)}
        />
      </HojaInferior>
    </div>
  );
}

function EstadoChip({ estado }: { estado: EstadoItem }) {
  const clases: Record<EstadoItem, string> = {
    sin_revisar: "bg-neutro/20 text-texto-suave",
    correcto: "bg-exito/15 text-exito",
    requiere_revision: "bg-atencion/15 text-atencion",
    fuera_de_servicio: "bg-error/15 text-error",
  };
  const etiquetas: Record<EstadoItem, string> = {
    sin_revisar: "Sin revisar",
    correcto: "Correcto",
    requiere_revision: "Atención",
    fuera_de_servicio: "Novedad",
  };
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${clases[estado]}`}>
      {etiquetas[estado]}
    </span>
  );
}
