"use client";

import { useActionState } from "react";
import {
  actualizarFicha,
  type EstadoFormularioPerfil,
} from "@/app/(app)/perfil/acciones";
import { CATEGORIAS_LICENCIA, GRUPOS_RH } from "@/lib/auth/licencia";
import type { FichaConductor } from "@/lib/auth/tipos";

const estadoInicial: EstadoFormularioPerfil = {};

const CLASE_INPUT =
  "rounded-md border border-borde bg-transparent px-3 py-2 text-sm outline-none focus:border-acento";

/**
 * Formulario de la ficha del conductor. Sin `perfilId` edita la ficha de
 * quien está conectado (/perfil); con `perfilId` un admin edita la de otro
 * (/admin/usuarios/[id]). Un campo en blanco se guarda como vacío: es la
 * forma de borrarlo.
 */
export function FormularioFicha({
  ficha,
  perfilId,
}: {
  ficha: FichaConductor;
  perfilId?: string;
}) {
  const [estado, accion, pendiente] = useActionState(actualizarFicha, estadoInicial);

  return (
    <form
      action={accion}
      className="flex flex-col gap-4 rounded-xl border border-borde bg-superficie p-4"
    >
      <h2 className="text-sm font-semibold">Datos del conductor</h2>
      {perfilId && <input type="hidden" name="perfilId" value={perfilId} />}

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-semibold tracking-wide text-texto-suave">
          LICENCIA DE CONDUCCIÓN
        </legend>

        <div className="grid grid-cols-2 gap-3">
          <Campo id="licencia_categoria" etiqueta="Categoría">
            <select
              id="licencia_categoria"
              name="licencia_categoria"
              defaultValue={ficha.licencia_categoria ?? ""}
              className={`${CLASE_INPUT} bg-superficie`}
            >
              <option value="">—</option>
              {CATEGORIAS_LICENCIA.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="licencia_numero" etiqueta="Número">
            <input
              id="licencia_numero"
              name="licencia_numero"
              type="text"
              maxLength={20}
              defaultValue={ficha.licencia_numero ?? ""}
              className={CLASE_INPUT}
            />
          </Campo>
        </div>

        <Campo id="licencia_vence" etiqueta="Fecha de vencimiento">
          <input
            id="licencia_vence"
            name="licencia_vence"
            type="date"
            defaultValue={ficha.licencia_vence ?? ""}
            className={CLASE_INPUT}
          />
        </Campo>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-xs font-semibold tracking-wide text-texto-suave">
          EN CASO DE EMERGENCIA
        </legend>

        <div className="grid grid-cols-2 gap-3">
          <Campo id="rh" etiqueta="Tipo de sangre">
            <select
              id="rh"
              name="rh"
              defaultValue={ficha.rh ?? ""}
              className={`${CLASE_INPUT} bg-superficie`}
            >
              <option value="">—</option>
              {GRUPOS_RH.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="eps" etiqueta="EPS">
            <input
              id="eps"
              name="eps"
              type="text"
              maxLength={80}
              defaultValue={ficha.eps ?? ""}
              className={CLASE_INPUT}
            />
          </Campo>
        </div>

        <Campo id="contacto_emergencia_nombre" etiqueta="Contacto de emergencia">
          <input
            id="contacto_emergencia_nombre"
            name="contacto_emergencia_nombre"
            type="text"
            maxLength={100}
            defaultValue={ficha.contacto_emergencia_nombre ?? ""}
            className={CLASE_INPUT}
          />
        </Campo>

        <Campo id="contacto_emergencia_telefono" etiqueta="Teléfono del contacto">
          <input
            id="contacto_emergencia_telefono"
            name="contacto_emergencia_telefono"
            type="tel"
            inputMode="numeric"
            maxLength={12}
            defaultValue={ficha.contacto_emergencia_telefono ?? ""}
            className={CLASE_INPUT}
          />
        </Campo>
      </fieldset>

      <Campo id="fecha_ingreso" etiqueta="Fecha de ingreso a la empresa">
        <input
          id="fecha_ingreso"
          name="fecha_ingreso"
          type="date"
          defaultValue={ficha.fecha_ingreso ?? ""}
          className={CLASE_INPUT}
        />
      </Campo>

      {estado.error && (
        <p role="alert" className="text-sm text-error">
          {estado.error}
        </p>
      )}
      {estado.exito && <p className="text-sm text-exito">Ficha actualizada.</p>}

      <button
        type="submit"
        disabled={pendiente}
        className="self-start rounded-md bg-acento px-4 py-2 text-sm font-medium text-fondo disabled:opacity-60"
      >
        {pendiente ? "Guardando..." : "Guardar ficha"}
      </button>
    </form>
  );
}

function Campo({
  id,
  etiqueta,
  children,
}: {
  id: string;
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </label>
      {children}
    </div>
  );
}
