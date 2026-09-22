import type {
  ContactoEmergencia,
  GuiaAuxilio,
  ItemBotiquin,
} from "@/lib/datos/tipos";
import { videos } from "@/lib/datos/videos";

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
  { emoji: "🧤", nombre: "Guantes de látex o nitrilo", paraQueSirve: "Protegerte de fluidos antes de atender a alguien." },
  { emoji: "🧻", nombre: "Gasas estériles", paraQueSirve: "Cubrir y limpiar heridas sin contaminarlas." },
  { emoji: "🩹", nombre: "Vendas elásticas", paraQueSirve: "Sujetar gasas, inmovilizar o hacer presión sobre una hemorragia." },
  { emoji: "📼", nombre: "Esparadrapo o cinta médica", paraQueSirve: "Fijar gasas y vendajes." },
  { emoji: "🧴", nombre: "Alcohol antiséptico o suero fisiológico", paraQueSirve: "Limpiar heridas y desinfectar antes de cubrirlas." },
  { emoji: "✂️", nombre: "Tijeras de punta roma", paraQueSirve: "Cortar ropa o vendas sin riesgo de herir más a la persona." },
  { emoji: "😷", nombre: "Tapabocas", paraQueSirve: "Protección básica de vías respiratorias, tuyas y de quien auxilias." },
  { emoji: "🗑️", nombre: "Bolsa para desechos", paraQueSirve: "Descartar material contaminado de forma segura." },
  { emoji: "📖", nombre: "Manual básico de primeros auxilios", paraQueSirve: "Consulta rápida si no recuerdas un procedimiento." },
  { emoji: "🔦", nombre: "Linterna", paraQueSirve: "Visibilidad en accidentes nocturnos o dentro del vehículo." },
];

/**
 * Guías rápidas por situación. Pasos generales, no reemplazan una
 * certificación en primeros auxilios. Se muestran una a la vez, en modo
 * paso a paso (components/primeros-auxilios/guia-paso-a-paso.tsx), así que
 * cada paso debe entenderse solo y de un vistazo.
 *
 * Van ordenadas por gravedad (vital, urgente, general), no por antigüedad.
 * Siete conservan el contenido original (RCP, hemorragias, atragantamiento,
 * accidente, quemaduras, fracturas, desmayo o convulsión); seis son nuevas y
 * cubren lo propio de un bus: shock, incendio en el vehículo, golpe de
 * calor, crisis de asma, evaluar la escena y emergencias con niños a
 * bordo. Son procedimientos estándar de primeros auxilios y de seguridad
 * en transporte; los videos son de terceros (ver lib/datos/videos.ts).
 */
export const guiasAuxilio: GuiaAuxilio[] = [
  {
    id: "paro-cardiorrespiratorio",
    titulo: "Paro cardiorrespiratorio (RCP)",
    icono: "❤️",
    gravedad: "vital",
    resumen: "La persona no responde y no respira con normalidad",
    cuandoLlamar: "De inmediato: pide ayuda y llama al 123 antes de empezar.",
    pasos: [
      { texto: "Verifica que la persona no responde y no respira con normalidad." },
      { texto: "Pide ayuda y llama al 123 de inmediato.", detalle: "O pide a alguien más que lo haga mientras tú actúas." },
      {
        texto: "Inicia compresiones torácicas.",
        detalle: "En el centro del pecho, fuertes y rápidas, unas 100-120 por minuto.",
      },
      {
        texto: "Continúa hasta que llegue ayuda.",
        detalle:
          "Si sabes hacerlo, alterna 30 compresiones con 2 ventilaciones. Si no, continúa solo con compresiones.",
      },
    ],
    queNoHacer: [
      "No dejes de hacer compresiones para «ver si reacciona»: continúa hasta que llegue ayuda médica o la persona reaccione.",
      "No improvises RCP sin formación si hay alguien capacitado disponible; cédele el lugar.",
    ],
    video: videos.rcp,
  },
  {
    id: "hemorragias",
    titulo: "Hemorragias",
    icono: "🩸",
    gravedad: "vital",
    resumen: "Sangrado abundante o que no se detiene",
    cuandoLlamar: "Si el sangrado es abundante o no cede con la presión.",
    pasos: [
      { texto: "Ponte guantes si es posible." },
      { texto: "Haz presión directa sobre la herida con una gasa o tela limpia." },
      {
        texto: "Eleva la extremidad afectada por encima del nivel del corazón.",
        detalle: "Solo si no hay sospecha de fractura.",
      },
      { texto: "Mantén la presión constante hasta que llegue ayuda médica." },
    ],
    queNoHacer: [
      "No retires la gasa para «revisar» si paró: agrega otra encima.",
      "No apliques torniquete salvo hemorragia masiva incontrolable y personal entrenado.",
    ],
    video: videos.hemorragias,
  },
  {
    id: "atragantamiento",
    titulo: "Atragantamiento",
    icono: "🫁",
    gravedad: "vital",
    resumen: "La persona no puede respirar, toser ni hablar",
    cuandoLlamar: "Si no puede respirar, toser ni hablar: pide ayuda y llama al 123.",
    pasos: [
      {
        texto: "Pregunta si puede toser o hablar.",
        detalle: "Si puede, anímala a seguir tosiendo.",
      },
      {
        texto: "Si no puede respirar, toser ni hablar, aplica la maniobra de Heimlich.",
        detalle: "Compresiones abdominales firmes hacia arriba.",
      },
      { texto: "Repite hasta que expulse el objeto o pierda la conciencia." },
      { texto: "Si pierde la conciencia, inicia RCP y pide ayuda de inmediato." },
    ],
    queNoHacer: [
      "No des golpes en la espalda a una persona sentada sin inclinarla hacia adelante primero.",
      "No metas los dedos a ciegas en la boca para sacar el objeto.",
    ],
    video: videos.atragantamiento,
  },
  {
    id: "accidente-transito",
    titulo: "Accidente de tránsito",
    icono: "🚑",
    gravedad: "vital",
    resumen: "Choque o volcamiento con personas heridas",
    cuandoLlamar: "De inmediato: 123 en ciudad o #767 en carretera.",
    pasos: [
      {
        texto: "Asegura la escena.",
        detalle: "Señaliza con los conos o triángulos reflectivos antes de acercarte.",
      },
      {
        texto: "Llama de inmediato al 123 o al #767.",
        detalle: "Informa la ubicación y el número de heridos.",
      },
      { texto: "No muevas a los heridos salvo peligro inminente.", detalle: "Fuego o tránsito sobre la vía." },
      {
        texto: "Mantén a la persona consciente, hablándole, hasta que llegue ayuda especializada.",
      },
    ],
    queNoHacer: [
      "No muevas a alguien con sospecha de lesión en cuello o espalda.",
      "No le des de comer, beber ni medicamentos a la persona herida.",
    ],
    video: videos.protocoloPas,
  },
  {
    id: "shock",
    titulo: "Shock",
    icono: "🥶",
    gravedad: "vital",
    resumen: "Piel pálida y fría, sudor, pulso rápido, confusión",
    cuandoLlamar: "De inmediato: el shock es una emergencia que puede empeorar rápido.",
    pasos: [
      { texto: "Llama al 123." },
      {
        texto: "Acuesta a la persona.",
        detalle:
          "Si no hay sospecha de fractura ni de lesión de cuello o espalda, eleva sus piernas unos 30 cm.",
      },
      { texto: "Afloja la ropa ajustada.", detalle: "Cuello, cinturón, corbata." },
      { texto: "Cúbrela con una manta o chaqueta para que no pierda calor." },
      { texto: "Vigila su respiración y su conciencia hasta que llegue ayuda." },
    ],
    queNoHacer: [
      "No le des de comer ni de beber.",
      "No la dejes sola.",
      "No le apliques calor directo (bolsas calientes, secadores).",
    ],
  },
  {
    id: "incendio-vehiculo",
    titulo: "Incendio o humo en el vehículo",
    icono: "🧯",
    gravedad: "vital",
    resumen: "Llamas o humo en el motor o dentro del bus",
    cuandoLlamar: "Apenas todos estén a salvo: Bomberos 119 o línea 123.",
    pasos: [
      { texto: "Detén el bus en un lugar seguro y apaga el motor." },
      {
        texto: "Evacúa a todos los pasajeros por las puertas y salidas de emergencia.",
        detalle: "Aléjalos del vehículo, lejos del tráfico y contra el viento.",
      },
      { texto: "Llama a Bomberos (119) o al 123." },
      {
        texto: "Usa el extintor solo si el fuego es pequeño y tienes la salida despejada.",
        detalle: "Si el fuego crece, aléjate.",
      },
      { texto: "Verifica que todos salieron y no vuelvas a entrar." },
    ],
    queNoHacer: [
      "No abras el capó si hay llamas o mucho humo: el aire aviva el fuego.",
      "No apliques agua sobre fuego de combustible o eléctrico.",
      "No vuelvas por objetos personales.",
    ],
  },
  {
    id: "golpe-calor",
    titulo: "Golpe de calor",
    icono: "🌡️",
    gravedad: "vital",
    resumen: "Piel muy caliente, confusión, mareo o desmayo con calor intenso",
    cuandoLlamar: "De inmediato: puede poner en riesgo la vida.",
    pasos: [
      { texto: "Lleva a la persona a la sombra o a un lugar fresco." },
      { texto: "Llama al 123." },
      { texto: "Afloja o retira la ropa que sobre." },
      {
        texto: "Enfría su cuerpo con paños húmedos o agua fresca.",
        detalle: "Cuello, axilas e ingles.",
      },
      { texto: "Si está consciente, dale pequeños sorbos de agua." },
    ],
    queNoHacer: [
      "No le des líquidos si está inconsciente o confundida.",
      "No la dejes sola.",
      "No dejes a un niño ni a nadie dentro del vehículo cerrado: al terminar la ruta, recorre el bus fila por fila.",
    ],
  },
  {
    id: "quemaduras",
    titulo: "Quemaduras",
    icono: "🔥",
    gravedad: "urgente",
    resumen: "Contacto con fuego, líquidos calientes o el motor",
    cuandoLlamar: "Si es extensa o está en cara, manos o genitales.",
    pasos: [
      { texto: "Aleja a la persona de la fuente de calor." },
      {
        texto: "Enfría la zona con agua limpia a temperatura ambiente.",
        detalle: "Durante 10-15 minutos.",
      },
      { texto: "Cubre la quemadura con una gasa limpia y seca, sin apretar." },
      {
        texto: "Si es extensa, en cara, manos o genitales, traslada de inmediato a un centro médico.",
      },
    ],
    queNoHacer: [
      "No apliques hielo directo, ni pasta dental, mantequilla o remedios caseros.",
      "No revientes ampollas.",
      "No retires ropa pegada a la piel quemada.",
    ],
    video: videos.quemaduras,
  },
  {
    id: "fracturas",
    titulo: "Fracturas",
    icono: "🦴",
    gravedad: "urgente",
    resumen: "Sospecha de hueso roto tras un golpe o caída",
    cuandoLlamar: "Si no puede moverse, hay sospecha de lesión de cuello o espalda, o el hueso está expuesto.",
    pasos: [
      { texto: "Inmoviliza la zona afectada tal como está, sin intentar acomodarla." },
      {
        texto: "Fija la extremidad por encima y por debajo de la fractura.",
        detalle: "Si hay una férula o material rígido disponible.",
      },
      {
        texto: "Aplica frío indirecto para reducir la inflamación.",
        detalle: "Con una tela de por medio.",
      },
      { texto: "Traslada a la persona a un centro médico lo antes posible." },
    ],
    queNoHacer: [
      "No intentes enderezar el hueso ni forzar el movimiento.",
      "No apliques presión directa sobre la posible fractura.",
    ],
    video: videos.fracturas,
  },
  {
    id: "desmayo-convulsion",
    titulo: "Desmayo o convulsión",
    icono: "🧠",
    gravedad: "urgente",
    resumen: "Pérdida de conocimiento o movimientos involuntarios",
    cuandoLlamar:
      "Si es la primera convulsión de la persona, dura más de 5 minutos o no recupera la conciencia.",
    pasos: [
      {
        texto: "Ante un desmayo: recuesta a la persona y elévale las piernas.",
        detalle: "Favorece el flujo de sangre al cerebro.",
      },
      {
        texto: "Ante una convulsión: aleja los objetos con los que pueda golpearse.",
        detalle: "Coloca algo blando bajo su cabeza.",
      },
      {
        texto: "Gira a la persona de lado cuando termine la convulsión.",
        detalle: "Para evitar que se ahogue con sus propios fluidos.",
      },
      {
        texto: "Llama al 123 si es la primera convulsión, dura más de 5 minutos o no recupera la conciencia.",
      },
    ],
    queNoHacer: [
      "No sujetes a la persona con fuerza durante una convulsión.",
      "No le pongas nada en la boca (ni objetos, ni tus dedos).",
    ],
    video: videos.convulsiones,
  },
  {
    id: "crisis-asma",
    titulo: "Crisis de asma",
    icono: "😮‍💨",
    gravedad: "urgente",
    resumen: "Dificultad para respirar, silbidos en el pecho",
    cuandoLlamar: "Si no mejora en pocos minutos, le cuesta hablar o se pone azulada.",
    pasos: [
      {
        texto: "Mantén la calma y ayuda a la persona a sentarse cómoda.",
        detalle: "Ligeramente inclinada hacia adelante.",
      },
      {
        texto: "Pregunta si tiene su inhalador y ayúdala a usarlo.",
        detalle: "Según su indicación médica.",
      },
      { texto: "Afloja la ropa y ventila el lugar." },
      {
        texto: "Llama al 123 si no mejora en pocos minutos, si le cuesta hablar o se pone azulada.",
      },
    ],
    queNoHacer: [
      "No la acuestes: respira peor recostada.",
      "No uses el inhalador de otra persona.",
      "No la dejes sola.",
    ],
  },
  {
    id: "evaluar-escena",
    titulo: "Evaluar la escena y a la víctima",
    icono: "👀",
    gravedad: "general",
    resumen: "Lo primero que haces ante cualquier emergencia",
    cuandoLlamar: "Siempre que haya heridos o no sepas cómo actuar.",
    pasos: [
      {
        texto: "Detente y mira: ¿hay peligro para ti?",
        detalle: "Tráfico, fuego, cables, derrames. Si no es seguro, no te acerques y llama al 123.",
      },
      {
        texto: "Protege la escena.",
        detalle: "Luces de emergencia y triángulos reflectivos antes de acercarte.",
      },
      {
        texto: "Comprueba si la persona responde.",
        detalle: "Háblale fuerte y toca suavemente sus hombros.",
      },
      {
        texto: "Comprueba si respira con normalidad.",
        detalle: "Mira si el pecho sube y baja durante unos 10 segundos.",
      },
      {
        texto: "Llama al 123 y sigue la guía que corresponda.",
        detalle: "Da tu ubicación exacta, cuántas personas hay y en qué estado.",
      },
    ],
    queNoHacer: [
      "No te expongas al peligro para llegar a la víctima: si te lesionas, no puedes ayudar.",
      "No muevas a la persona sin necesidad, sobre todo si hay sospecha de lesión de cuello o espalda.",
    ],
    video: videos.primerosAuxilios,
  },
  {
    id: "menores-a-bordo",
    titulo: "Emergencia con niños a bordo",
    icono: "🧒",
    gravedad: "general",
    resumen: "Falla, choque o peligro con estudiantes en el bus",
    cuandoLlamar: "Ante cualquier lesión o peligro: 123, y avisa a la empresa.",
    pasos: [
      {
        texto: "Mantén la calma.",
        detalle: "Los niños reaccionan a tu tono de voz y a tu cara.",
      },
      {
        texto: "Pide al acompañante que se encargue de los niños.",
        detalle: "Mientras tú manejas la emergencia.",
      },
      {
        texto: "Decide si es más seguro que permanezcan sentados o que evacuen.",
        detalle: "Evacúa de inmediato solo si hay peligro: fuego, humo o riesgo de otro choque.",
      },
      {
        texto: "Si evacuan, hazlo por las salidas de emergencia, en orden.",
        detalle: "Reúnelos lejos de la vía, todos juntos.",
      },
      { texto: "Cuenta a los niños y no dejes a nadie atrás." },
      {
        texto: "Llama al 123 y avisa a la empresa.",
        detalle: "Ella se encarga de contactar a los acudientes por el canal oficial.",
      },
    ],
    queNoHacer: [
      "No dejes a ningún niño solo dentro del vehículo ni sobre la vía.",
      "No evacúes a todos a la vez y sin orden: genera empujones y caídas.",
      "No sigas la ruta con un niño lesionado sin que reciba atención.",
    ],
  },
];
