import type {
  ContactoEmergencia,
  GuiaAuxilio,
  ItemBotiquin,
} from "@/lib/datos/tipos";

/** Números de emergencia de cobertura nacional en Colombia. */
export const contactosEmergencia: ContactoEmergencia[] = [
  {
    nombre: "Línea Nacional de Emergencias",
    numero: "123",
    descripcion: "Policía, bomberos, ambulancia y Defensa Civil, unificados.",
  },
  {
    nombre: "Cruz Roja Colombiana",
    numero: "132",
    descripcion: "Atención prehospitalaria y traslado de heridos.",
  },
  {
    nombre: "Bomberos",
    numero: "119",
    descripcion: "Incendios, rescates y materiales peligrosos.",
  },
  {
    nombre: "Defensa Civil",
    numero: "144",
    descripcion: "Atención de emergencias y desastres.",
  },
  {
    nombre: "Policía de Tránsito y Carreteras",
    numero: "#767",
    descripcion: "Accidentes e incidentes en vías nacionales, desde celular.",
  },
];

/**
 * Contenido de referencia del botiquín de carretera. El Código Nacional
 * de Tránsito exige portar botiquín (ver lib/datos/normativa.ts,
 * "equipo-carretera"); esta lista detalla qué debería contener y para
 * qué sirve cada elemento.
 */
export const botiquin: ItemBotiquin[] = [
  { nombre: "Guantes de látex o nitrilo", paraQueSirve: "Protegerte de fluidos antes de atender a alguien." },
  { nombre: "Gasas estériles", paraQueSirve: "Cubrir y limpiar heridas sin contaminarlas." },
  { nombre: "Vendas elásticas", paraQueSirve: "Sujetar gasas, inmovilizar o hacer presión sobre una hemorragia." },
  { nombre: "Esparadrapo o cinta médica", paraQueSirve: "Fijar gasas y vendajes." },
  { nombre: "Alcohol antiséptico o suero fisiológico", paraQueSirve: "Limpiar heridas y desinfectar antes de cubrirlas." },
  { nombre: "Tijeras de punta roma", paraQueSirve: "Cortar ropa o vendas sin riesgo de herir más a la persona." },
  { nombre: "Tapabocas", paraQueSirve: "Protección básica de vías respiratorias, tuyas y de quien auxiliás." },
  { nombre: "Guantes y bolsa para desechos", paraQueSirve: "Descartar material contaminado de forma segura." },
  { nombre: "Manual básico de primeros auxilios", paraQueSirve: "Consulta rápida si no recordás un procedimiento." },
  { nombre: "Linterna", paraQueSirve: "Visibilidad en accidentes nocturnos o dentro del vehículo." },
];

/** Guías rápidas por tipo de auxilio. Pasos generales, no reemplazan una certificación en primeros auxilios. */
export const guiasAuxilio: GuiaAuxilio[] = [
  {
    id: "quemaduras",
    titulo: "Quemaduras",
    icono: "🔥",
    pasos: [
      "Alejá a la persona de la fuente de calor.",
      "Enfriá la zona con agua limpia a temperatura ambiente durante 10-15 minutos.",
      "Cubrí la quemadura con una gasa limpia y seca, sin apretar.",
      "Si es extensa, en cara, manos o genitales, trasladá de inmediato a un centro médico.",
    ],
    queNoHacer: [
      "No apliques hielo directo, ni pasta dental, mantequilla o remedios caseros.",
      "No revientes ampollas.",
      "No retires ropa pegada a la piel quemada.",
    ],
  },
  {
    id: "hemorragias",
    titulo: "Hemorragias",
    icono: "🩸",
    pasos: [
      "Ponete guantes si es posible.",
      "Hacé presión directa sobre la herida con una gasa o tela limpia.",
      "Elevá la extremidad afectada por encima del nivel del corazón, si no hay sospecha de fractura.",
      "Mantené la presión constante hasta que llegue ayuda médica.",
    ],
    queNoHacer: [
      "No retires la gasa para 'revisar' si paró: agregá otra encima.",
      "No apliques torniquete salvo hemorragia masiva incontrolable y personal entrenado.",
    ],
  },
  {
    id: "accidente-transito",
    titulo: "Accidente de tránsito",
    icono: "🚑",
    pasos: [
      "Asegurá la escena: señaliza con los conos/triángulos reflectivos antes de acercarte.",
      "Llamá de inmediato a la línea 123 o al #767 e informá ubicación y número de heridos.",
      "No muevas a los heridos salvo peligro inminente (fuego, tránsito).",
      "Mantené a la persona consciente, hablándole, hasta que llegue ayuda especializada.",
    ],
    queNoHacer: [
      "No muevas a alguien con sospecha de lesión en cuello o espalda.",
      "No le des de comer, beber, ni medicamentos a la persona herida.",
    ],
  },
  {
    id: "fracturas",
    titulo: "Fracturas",
    icono: "🦴",
    pasos: [
      "Inmovilizá la zona afectada tal como está, sin intentar acomodarla.",
      "Si hay una férula o material rígido disponible, fijá la extremidad por encima y por debajo de la fractura.",
      "Aplicá frío indirecto (con tela de por medio) para reducir la inflamación.",
      "Trasladá a la persona a un centro médico lo antes posible.",
    ],
    queNoHacer: [
      "No intentes enderezar el hueso ni forzar el movimiento.",
      "No apliques presión directa sobre la posible fractura.",
    ],
  },
  {
    id: "atragantamiento",
    titulo: "Atragantamiento",
    icono: "🫁",
    pasos: [
      "Preguntá si la persona puede toser o hablar; si puede, animala a seguir tosiendo.",
      "Si no puede respirar, toser ni hablar, aplicá la maniobra de Heimlich: compresiones abdominales firmes hacia arriba.",
      "Repetí hasta que expulse el objeto o pierda la conciencia.",
      "Si pierde la conciencia, iniciá RCP y pedí ayuda de inmediato.",
    ],
    queNoHacer: [
      "No des golpes en la espalda a una persona sentada sin inclinarla hacia adelante primero.",
      "No metas los dedos a ciegas en la boca para sacar el objeto.",
    ],
  },
  {
    id: "desmayo-convulsion",
    titulo: "Desmayo o convulsión",
    icono: "🧠",
    pasos: [
      "Ante un desmayo: recostá a la persona y elevale las piernas para favorecer el flujo de sangre al cerebro.",
      "Ante una convulsión: alejá objetos con los que pueda golpearse y colocá algo blando bajo la cabeza.",
      "Girá a la persona de lado una vez termine la convulsión, para evitar que se ahogue con sus propios fluidos.",
      "Llamá al 123 si es la primera convulsión de la persona, dura más de 5 minutos, o no recupera la conciencia.",
    ],
    queNoHacer: [
      "No sujetes a la persona con fuerza durante una convulsión.",
      "No le pongas nada en la boca (ni objetos, ni tus dedos).",
    ],
  },
  {
    id: "paro-cardiorrespiratorio",
    titulo: "Paro cardiorrespiratorio (RCP)",
    icono: "❤️",
    pasos: [
      "Verificá que la persona no responde y no respira con normalidad.",
      "Pedí ayuda y llamá al 123 de inmediato (o que alguien más lo haga mientras actuás).",
      "Iniciá compresiones torácicas: centro del pecho, fuertes y rápidas, unas 100-120 por minuto.",
      "Si sabés hacerlo, alterná 30 compresiones con 2 ventilaciones. Si no, continuá solo con compresiones hasta que llegue ayuda.",
    ],
    queNoHacer: [
      "No dejes de hacer compresiones para 'ver si reacciona': continuá hasta que llegue ayuda médica o la persona reaccione.",
      "No improvises RCP sin formación si hay alguien capacitado disponible; cedele el lugar.",
    ],
  },
];
