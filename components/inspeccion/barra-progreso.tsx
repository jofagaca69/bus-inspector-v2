import { cx } from "@/lib/utils";

/**
 * Anillo de progreso en SVG puro (stroke-dasharray), sin librería de
 * charts: es el mismo criterio que components/ui/icono.tsx, una docena
 * de casos no justifica una dependencia nueva.
 */
export function BarraProgreso({
  porcentaje,
  tamano = 96,
  grosor = 8,
  etiqueta,
}: {
  porcentaje: number;
  tamano?: number;
  grosor?: number;
  etiqueta?: string;
}) {
  const radio = (tamano - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia * (1 - Math.min(100, Math.max(0, porcentaje)) / 100);
  const centro = tamano / 2;

  const color =
    porcentaje >= 90 ? "stroke-exito" : porcentaje >= 60 ? "stroke-atencion" : "stroke-error";

  return (
    <div className="relative shrink-0" style={{ width: tamano, height: tamano }}>
      <svg width={tamano} height={tamano} className="-rotate-90" role="img" aria-label={`${porcentaje}% de cumplimiento`}>
        <circle
          cx={centro}
          cy={centro}
          r={radio}
          strokeWidth={grosor}
          className="fill-none stroke-superficie-2"
        />
        <circle
          cx={centro}
          cy={centro}
          r={radio}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={offset}
          className={cx("fill-none transition-[stroke-dashoffset] duration-500", color)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold leading-none">{Math.round(porcentaje)}%</span>
        {etiqueta && <span className="mt-1 text-[10px] text-texto-suave">{etiqueta}</span>}
      </div>
    </div>
  );
}
