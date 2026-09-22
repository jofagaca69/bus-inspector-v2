import type { EntradaNormativa } from "@/lib/datos/tipos";
import {
  ART_30_LEY_769,
  PASO_16_RES_40595,
  PASO_17_RES_40595,
} from "@/lib/datos/normativa-inspeccion";
import { videos } from "@/lib/datos/videos";

/**
 * Normativa de tránsito aplicable a conductores de servicio público,
 * basada en el Código Nacional de Tránsito (Ley 769 de 2002 y sus
 * modificaciones). Cada entrada alimenta un <Acordeon> en /normativa y se
 * arma con bloques (ver BloqueContenido en lib/datos/tipos.ts): la regla
 * editorial es que ningún texto suelto pase de un par de líneas; lo
 * enumerable se muestra como lista, tarjetas, tabla o checklist.
 *
 * Las entradas originales conservan sus datos y su fuente; solo cambió la
 * presentación. Las citas textuales viven en normativa-inspeccion.ts y NO
 * se parafrasean (ver la regla estricta en ese archivo). Lo marcado como
 * "Buena práctica" es recomendación operativa, no texto de una norma.
 */
export const normativa: EntradaNormativa[] = [
  {
    id: "documentos-obligatorios",
    icono: "📄",
    titulo: "Documentos obligatorios",
    resumen: "Lo que debes llevar contigo cada día",
    fuente: "Requisito general de circulación",
    categoria: "documentos",
    bloques: [
      {
        tipo: "checklist",
        titulo: "¿Llevas hoy tus documentos?",
        items: [
          "Licencia de conducción vigente para la categoría del vehículo",
          "SOAT vigente",
          "Revisión técnico-mecánica y de emisiones vigente",
          "Tarjeta de operación del vehículo",
        ],
      },
    ],
    tip: "Lleva también una copia digital en el celular, por si olvidas la carpeta física.",
  },
  {
    id: "equipo-carretera",
    icono: "🧰",
    titulo: "Equipo de carretera obligatorio",
    resumen: "Los 9 elementos que todo vehículo debe portar",
    // El texto legal es la cita textual, no parafraseada: ver
    // lib/datos/normativa-inspeccion.ts, única fuente de verdad para todo el
    // módulo de Inspección Diaria (fichas técnicas incluidas).
    fuente: ART_30_LEY_769.fuente,
    categoria: "vehiculo",
    bloques: [
      {
        tipo: "tarjetas-icono",
        titulo: "Toca cada elemento para ver qué dice la norma",
        items: [
          {
            titulo: "Gato",
            resumen: "Con capacidad para elevar el vehículo",
            icono: "herramientas",
            detalle: [
              "Art. 30, numeral 1: «Un gato con capacidad para elevar el vehículo.»",
              "Buena práctica: comprueba que sea adecuado para el peso de tu bus y que esté en buen estado.",
            ],
          },
          {
            titulo: "Cruceta",
            resumen: "Para aflojar y apretar las llantas",
            icono: "herramientas",
            detalle: [
              "Art. 30, numeral 2: «Una cruceta.»",
              "Buena práctica: verifica que encaje bien en las tuercas de las llantas de tu bus.",
            ],
          },
          {
            titulo: "Señales de carretera",
            resumen: "Dos triángulos reflectivos o lámparas amarillas",
            icono: "triangulo",
            detalle: [
              "Art. 30, numeral 3: «Dos señales de carretera en forma de triángulo en material reflectivo y provistas de soportes para ser colocadas en forma vertical, o lámparas de señal de luz amarilla intermitentes o de destello.»",
              "Buena práctica: colócalas a suficiente distancia detrás del vehículo para avisar a tiempo a los demás conductores.",
            ],
          },
          {
            titulo: "Botiquín",
            resumen: "De primeros auxilios",
            icono: "botiquin",
            detalle: [
              "Art. 30, numeral 4: «Un botiquín de primeros auxilios.»",
              "Buena práctica: revisa las fechas de vencimiento de los insumos, no solo que el botiquín esté.",
            ],
          },
          {
            titulo: "Extintor",
            resumen: "Vigente y con carga",
            icono: "extintor",
            detalle: [
              "Art. 30, numeral 5: «Un extintor.»",
              "Buena práctica: revisa la fecha de vencimiento y que el indicador de presión esté en la zona correcta.",
            ],
          },
          {
            titulo: "Tacos",
            resumen: "Dos, para bloquear el vehículo",
            emoji: "🧱",
            detalle: [
              "Art. 30, numeral 6: «Dos tacos para bloquear el vehículo.»",
              "Buena práctica: úsalos cuando debas detenerte o cambiar una llanta en una pendiente.",
            ],
          },
          {
            titulo: "Caja de herramientas",
            resumen: "Básica, con lo mínimo exigido",
            icono: "herramientas",
            detalle: [
              "Art. 30, numeral 7: «Caja de herramienta básica que como mínimo deberá contener: alicate, destornilladores, llave de expansión y llaves fijas.»",
            ],
          },
          {
            titulo: "Llanta de repuesto",
            resumen: "Lista para usarse",
            icono: "llanta",
            detalle: [
              "Art. 30, numeral 8: «Llanta de repuesto.»",
              "Buena práctica: revisa su presión de aire periódicamente, no solo cuando la necesitas.",
            ],
          },
          {
            titulo: "Linterna",
            resumen: "Para emergencias de noche",
            emoji: "🔦",
            detalle: [
              "Art. 30, numeral 9: «Linterna.»",
              "Buena práctica: verifica que funcione y que las pilas no estén vencidas.",
            ],
          },
        ],
      },
      { tipo: "cita-legal", cita: ART_30_LEY_769 },
    ],
    tip: "Revisa el vencimiento del extintor y los insumos del botiquín, no solo que estén presentes.",
  },
  {
    id: "cinturon-seguridad",
    icono: "🔶",
    titulo: "Cinturón de seguridad",
    resumen: "Obligatorio para ti y para los pasajeros",
    fuente: "Código Nacional de Tránsito",
    categoria: "conducta",
    bloques: [
      {
        tipo: "lista",
        items: [
          "Obligatorio para el conductor.",
          "Obligatorio también para los pasajeros cuando el vehículo cuenta con ellos.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Antes de arrancar (buena práctica)",
        items: [
          "Revisa que las hebillas de tu asiento cierren y abran bien.",
          "Confirma con la vista que cada pasajero tenga el cinturón puesto.",
        ],
      },
    ],
    tip: "Recuerda a los pasajeros que se lo coloquen antes de arrancar, sobre todo en las primeras filas.",
  },
  {
    id: "alcohol-sustancias",
    icono: "🚫",
    titulo: "Alcohol y sustancias",
    resumen: "Tolerancia cero en servicio público",
    fuente: "Ley 769 de 2002 · Art. 152",
    categoria: "conducta",
    bloques: [
      {
        tipo: "lista",
        items: ["Está prohibido conducir bajo efectos del alcohol o de sustancias psicoactivas."],
      },
      {
        tipo: "alerta",
        variante: "peligro",
        texto: "Para servicio público la tolerancia es cero: cualquier nivel detectado genera sanción.",
      },
    ],
    tip: "Si tomaste la noche anterior, verifica que hayan pasado suficientes horas antes de tomar el volante.",
  },
  {
    id: "uso-celular",
    icono: "📱",
    titulo: "Uso del celular",
    resumen: "Solo manos libres, y sin distraerte de la vía",
    fuente: "Código Nacional de Tránsito",
    categoria: "conducta",
    bloques: [
      {
        tipo: "lista",
        items: [
          "Usar el celular en la mano mientras se conduce está prohibido.",
          "Cualquier comunicación debe hacerse con manos libres y sin distraer la atención de la vía.",
        ],
      },
    ],
    tip: "Deja el celular fuera de alcance mientras conduces, no solo en silencio.",
  },
  {
    id: "paraderos-rutas",
    icono: "🚏",
    titulo: "Paraderos y rutas autorizadas",
    resumen: "Recoge y deja pasajeros solo donde corresponde",
    fuente: "Normativa de transporte público",
    categoria: "operacion",
    bloques: [
      {
        tipo: "lista",
        items: [
          "Recoge y deja pasajeros únicamente en los paraderos.",
          "Circula solo sobre la ruta autorizada por la autoridad de tránsito competente.",
        ],
      },
      {
        tipo: "senales",
        titulo: "Así se ve un paradero",
        ids: ["si08_paradero_buses", "sr40_paradero", "sr28_prohibido_parquear"],
      },
    ],
    tip: "Detenerte fuera de paradero pone en riesgo a los pasajeros que bajan y al tránsito detrás tuyo.",
  },
  {
    id: "velocidades-maximas",
    icono: "🚦",
    titulo: "Velocidades máximas",
    resumen: "50 km/h en ciudad, 30 km/h en zonas escolares",
    fuente: "Ley 769 de 2002 · Art. 106",
    categoria: "conducta",
    bloques: [
      {
        tipo: "comparativa",
        filas: [
          { etiqueta: "Zona urbana", valor: "50 km/h", nota: "Velocidad máxima general" },
          {
            etiqueta: "Zonas escolares y residenciales",
            valor: "30 km/h",
            nota: "Salvo señal distinta",
          },
          {
            etiqueta: "Carretera",
            valor: "Según señal",
            nota: "Cada tramo indica su límite; para buses suele ser más restrictivo que para vehículos livianos",
          },
        ],
      },
      {
        tipo: "senales",
        titulo: "Señales de velocidad",
        ids: ["sr30_velocidad_maxima", "sp47_zona_escolar"],
      },
    ],
    tip: "Ajusta siempre la velocidad a las condiciones reales de la vía, aunque el límite permita ir más rápido.",
  },
  {
    id: "licencia-categoria",
    icono: "🪪",
    titulo: "Licencia de conducción",
    resumen: "Categoría C2 o C3 para un bus de servicio público",
    fuente: "Ley 769 de 2002 · Art. 19-20",
    categoria: "documentos",
    bloques: [
      {
        tipo: "lista",
        items: [
          "Categoría C2 o C3, según el tipo de vehículo.",
          "Vigente.",
          "Sin comparendos pendientes que la suspendan.",
        ],
      },
    ],
    tip: "Verifica la fecha de vencimiento de tu licencia con anticipación: la renovación puede tardar varios días.",
  },
  {
    id: "tarjeta-operacion",
    icono: "🧾",
    titulo: "Tarjeta de operación",
    resumen: "Es del vehículo, no del conductor",
    fuente: "Decreto 431 de 2017",
    categoria: "documentos",
    bloques: [
      {
        tipo: "lista",
        items: [
          "Todo vehículo de transporte público debe portarla vigente.",
          "La expide la empresa habilitada.",
          "Autoriza la vinculación del vehículo y la ruta que presta.",
        ],
      },
    ],
    tip: "La tarjeta de operación es del vehículo, no del conductor: confirma que corresponda al bus que estás manejando ese día.",
  },

  // ---------------------------------------------------------------
  // Entradas nuevas. Cada dato salió de una fuente oficial consultada
  // (Ministerio de Transporte, ANSV, Supertransporte) y se redactó sin
  // ir más allá de ella; lo que es recomendación va rotulado.
  // ---------------------------------------------------------------
  {
    id: "transporte-escolar",
    icono: "🚸",
    titulo: "Transporte escolar",
    resumen: "El acompañante adulto es obligatorio",
    fuente: "Decreto 1079 de 2015 · Decreto 431 de 2017",
    categoria: "operacion",
    bloques: [
      {
        tipo: "lista",
        titulo: "Reglas clave",
        items: [
          "Todo servicio de transporte escolar debe llevar a bordo un adulto acompañante.",
          "El acompañante debe tener formación en seguridad del vehículo, tránsito, seguridad vial y primeros auxilios.",
          "Va sentado en un lugar cercano a la puerta del vehículo.",
          "El servicio no puede prestarse sin acompañante.",
          "La empresa debe estar autorizada por el Ministerio de Transporte.",
        ],
      },
      {
        tipo: "alerta",
        variante: "info",
        texto:
          "Buena práctica: si el acompañante no está a bordo, no inicies la ruta y avisa a la empresa.",
      },
      { tipo: "senales", titulo: "Señal de zona escolar", ids: ["sp47_zona_escolar"] },
      {
        tipo: "enlace",
        titulo: "Guía para la prestación del servicio de transporte escolar",
        url: "https://www.supertransporte.gov.co/documentos/2022/Abril/OTIC_28/guia-transporte-escolar.pdf",
        fuente: "Superintendencia de Transporte",
        descripcion: "PDF oficial",
      },
    ],
    tip: "Los niños copian lo que ven: tu ejemplo con el cinturón y la calma al volante vale más que cualquier regla.",
  },
  {
    id: "accidente-pas",
    icono: "🚨",
    titulo: "Si hay un accidente: protocolo PAS",
    resumen: "Proteger, Avisar y Socorrer, en ese orden",
    fuente: "Ministerio de Transporte · ANSV",
    categoria: "operacion",
    bloques: [
      {
        tipo: "pasos",
        pasos: [
          {
            texto: "Proteger",
            detalle:
              "Detén el vehículo en un lugar seguro, enciende las luces de emergencia y coloca los triángulos reflectivos para evitar un segundo choque.",
          },
          {
            texto: "Avisar",
            detalle:
              "Llama al 123 (línea de emergencias en ciudad) o al #767 en carretera. Da tu ubicación exacta y cuántos heridos hay.",
          },
          {
            texto: "Socorrer",
            detalle:
              "Presta primeros auxilios solo si tienes la formación para hacerlo, y espera a las autoridades.",
          },
        ],
      },
      {
        tipo: "alerta",
        variante: "peligro",
        texto:
          "Abandonar a una persona herida sin auxiliarla ni avisar a las autoridades puede constituir el delito de omisión de socorro.",
      },
      { tipo: "video", video: videos.protocoloPas },
      {
        tipo: "alerta",
        variante: "info",
        texto:
          "Con pasajeros a bordo, decide con calma si es más seguro que permanezcan dentro del bus o que evacuen a un sitio alejado de la vía.",
      },
    ],
    tip: "Guarda el 123 y el #767 en favoritos del celular: en una emergencia no querrás buscarlos.",
  },
  {
    id: "senales-clave",
    icono: "🛑",
    titulo: "Señales que no puedes ignorar",
    resumen: "Las que más te afectan al volante de un bus",
    fuente: "Manual de Señalización Vial",
    categoria: "conducta",
    bloques: [
      {
        tipo: "senales",
        titulo: "Toca una señal para ver su significado",
        ids: [
          "sr01_pare",
          "sr02_ceda_el_paso",
          "sr26_prohibido_adelantar",
          "sr30_velocidad_maxima",
          "sr28_prohibido_parquear",
          "sp47_zona_escolar",
          "sp23_semaforo",
          "si24_cruce_peatonal",
        ],
      },
    ],
    tip: "En el módulo de Señales de tránsito encuentras el catálogo completo, con buscador.",
  },
  {
    id: "pesv",
    icono: "📋",
    titulo: "PESV: el plan de seguridad vial de tu empresa",
    resumen: "Por qué haces la inspección diaria",
    fuente: "Resolución 20223040040595 de 2022 (MinTransporte)",
    categoria: "operacion",
    bloques: [
      {
        tipo: "lista",
        items: [
          "El Plan Estratégico de Seguridad Vial (PESV) reúne los mecanismos y medidas que una organización adopta para prevenir siniestros viales.",
          "Deben tenerlo las organizaciones públicas o privadas con una flota de más de diez (10) vehículos, o que contraten o administren personal de conductores (Art. 2 de la Resolución).",
          "La Superintendencia de Transporte, los organismos de tránsito o el Ministerio del Trabajo pueden verificar su cumplimiento.",
        ],
      },
      { tipo: "cita-legal", cita: PASO_16_RES_40595 },
      { tipo: "cita-legal", cita: PASO_17_RES_40595 },
      {
        tipo: "enlace",
        titulo: "Planes Estratégicos de Seguridad Vial",
        url: "https://ansv.gov.co/es/escuela/10446",
        fuente: "Agencia Nacional de Seguridad Vial",
      },
    ],
    tip: "La inspección diaria de esta app te ayuda a cumplir la inspección preoperacional que exige el Paso 16.",
  },
];
