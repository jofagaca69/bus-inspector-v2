"use client";

import { useActionState, useState } from "react";
import {
  reportarNovedad,
  registrarEvidenciaNovedad,
  type EstadoNovedadForm,
} from "@/app/(app)/novedades/acciones";
import { SubirEvidencia } from "@/components/inspeccion/subir-evidencia";

const TIPOS = [
  { valor: "mecanica", etiqueta: "Mecánica" },
  { valor: "electrica", etiqueta: "Eléctrica" },
  { valor: "carroceria", etiqueta: "Carrocería" },
  { valor: "seguridad", etiqueta: "Seguridad" },
  { valor: "documentacion", etiqueta: "Documentación" },
  { valor: "limpieza", etiqueta: "Limpieza" },
  { valor: "otra", etiqueta: "Otra" },
] as const;

const SEVERIDADES = [
  { valor: "baja", etiqueta: "Baja" },
  { valor: "media", etiqueta: "Media" },
  { valor: "alta", etiqueta: "Alta" },
  { valor: "critica", etiqueta: "Crítica" },
] as const;

const estadoInicial: EstadoNovedadForm = {};

/**
 * Formulario de "Nueva novedad". Tras guardar, muestra el input de
 * evidencia: la foto solo puede subirse una vez existe la fila de la
 * novedad (registrarEvidenciaNovedad necesita su id).
 */
export function FormularioNovedad({
  busId,
  conductorId,
  inspeccionId,
  inspeccionItemId,
  sugerencias,
  onExito,
}: {
  busId: string;
  conductorId: string;
  inspeccionId?: string;
  inspeccionItemId?: string;
  /** Sugerencias del catálogo (ComponenteBus.tiposNovedad) como chips rápidos. */
  sugerencias?: string[];
  onExito?: () => void;
}) {
  const [estado, accion, enProgreso] = useActionState(reportarNovedad, estadoInicial);
  const [descripcion, setDescripcion] = useState("");

  if (estado.exito && estado.novedadId) {
    const novedadId = estado.novedadId;
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-exito">Novedad registrada correctamente.</p>
        <SubirEvidencia
          carpeta={`${conductorId}/novedades/${novedadId}`}
          onSubida={(datos) => registrarEvidenciaNovedad({ novedadId, ...datos })}
        />
        <button
          type="button"
          onClick={onExito}
          className="rounded-md bg-acento px-4 py-2.5 text-sm font-medium text-fondo"
        >
          Listo
        </button>
      </div>
    );
  }

  return (
    <form action={accion} className="flex flex-col gap-4">
      <input type="hidden" name="busId" value={busId} />
      {inspeccionId && <input type="hidden" name="inspeccionId" value={inspeccionId} />}
      {inspeccionItemId && <input type="hidden" name="inspeccionItemId" value={inspeccionItemId} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tipo" className="text-sm font-medium">
          Tipo de novedad
        </label>
        <select
          id="tipo"
          name="tipo"
          required
          className="rounded-md border border-borde bg-transparent px-3 py-2.5 text-sm outline-none focus:border-acento"
        >
          {TIPOS.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="severidad" className="text-sm font-medium">
          Severidad
        </label>
        <select
          id="severidad"
          name="severidad"
          defaultValue="media"
          className="rounded-md border border-borde bg-transparent px-3 py-2.5 text-sm outline-none focus:border-acento"
        >
          {SEVERIDADES.map((s) => (
            <option key={s.valor} value={s.valor}>
              {s.etiqueta}
            </option>
          ))}
        </select>
      </div>

      {sugerencias && sugerencias.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sugerencias.map((sugerencia) => (
            <button
              key={sugerencia}
              type="button"
              onClick={() =>
                setDescripcion((actual) => (actual ? `${actual}. ${sugerencia}` : sugerencia))
              }
              className="rounded-full border border-borde px-2.5 py-1 text-xs text-texto-suave hover:text-texto"
            >
              {sugerencia}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="descripcion" className="text-sm font-medium">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          minLength={10}
          rows={3}
          value={descripcion}
          onChange={(evento) => setDescripcion(evento.target.value)}
          placeholder="Describe la novedad con el mayor detalle posible"
          className="rounded-md border border-borde bg-transparent px-3 py-2.5 text-sm outline-none focus:border-acento"
        />
      </div>

      {estado.error && (
        <p role="alert" className="text-sm text-error">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={enProgreso}
        className="rounded-md bg-acento px-4 py-2.5 text-sm font-medium text-fondo disabled:opacity-60"
      >
        {enProgreso ? "Guardando..." : "Guardar novedad"}
      </button>
    </form>
  );
}
