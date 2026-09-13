import type { TemaAprendizaje } from "@/lib/datos/tipos";

/**
 * Temas del centro de aprendizaje. Los IDs de video fueron verificados
 * uno por uno contra el endpoint oEmbed de YouTube
 * (https://www.youtube.com/oembed?url=...&format=json) antes de
 * incluirlos aquí: todos devuelven 200 y corresponden al título
 * indicado en el comentario. No agregues un ID nuevo sin repetir esa
 * verificación — uno inválido rompe el reproductor en la página.
 */
export const temasAprendizaje: TemaAprendizaje[] = [
  {
    slug: "conduccion-defensiva",
    titulo: "Conducción defensiva",
    resumen:
      "Técnicas para anticipar riesgos en la vía y reducir la probabilidad de un accidente.",
    icono: "🛡️",
    secciones: [
      {
        titulo: "¿Qué es la conducción defensiva?",
        contenido:
          "Es la técnica de conducir anticipando los errores de los demás y las condiciones cambiantes de la vía, para poder reaccionar a tiempo. No se trata de manejar más lento, sino de manejar con más atención y criterio.",
      },
      {
        titulo: "Distancia de seguimiento",
        contenido:
          "Mantené al menos 3 segundos de distancia con el vehículo de adelante en condiciones normales, y ampliala a 5-6 segundos con lluvia, niebla o carga de pasajeros de pie. En un bus, la distancia de frenado es mayor que la de un carro.",
      },
      {
        titulo: "Zonas ciegas y espejos",
        contenido:
          "Revisá los espejos cada 5-8 segundos, no solo antes de girar o cambiar de carril. Recordá que un bus tiene puntos ciegos mucho más grandes que un vehículo liviano, especialmente en los costados y justo detrás.",
      },
      {
        titulo: "Anticipación en intersecciones y paraderos",
        contenido:
          "Reducí la velocidad al acercarte a paraderos, cruces peatonales y colegios. Un peatón o ciclista puede aparecer sin previo aviso; anticipar te da tiempo de frenar sin maniobras bruscas.",
      },
    ],
    puntosClave: [
      "Anticipar es más importante que reaccionar rápido.",
      "Ampliá la distancia de seguimiento con mal clima o carga completa.",
      "Los puntos ciegos de un bus son más grandes: revisá espejos con frecuencia.",
      "Reducí velocidad en zonas con alta presencia de peatones.",
    ],
    videos: ["2r7itD8DmS0", "-agXrYApHaw"],
  },
  {
    slug: "mantenimiento-preventivo",
    titulo: "Mantenimiento preventivo",
    resumen:
      "Por qué revisar el vehículo antes de fallas evita accidentes y varadas en ruta.",
    icono: "🔧",
    secciones: [
      {
        titulo: "Mantenimiento preventivo vs. correctivo",
        contenido:
          "El mantenimiento preventivo se hace según kilometraje o tiempo, antes de que aparezca una falla. El correctivo se hace después de que algo ya falló, casi siempre en el peor momento: en plena ruta y con pasajeros a bordo.",
      },
      {
        titulo: "Puntos críticos en un bus de servicio público",
        contenido:
          "Frenos, llantas (presión y desgaste), niveles de aceite y refrigerante, luces, limpiaparabrisas y batería son los puntos que con más frecuencia causan varadas o incidentes si se descuidan.",
      },
      {
        titulo: "Tu rol como conductor",
        contenido:
          "No sos el mecánico, pero sos quien primero nota un ruido extraño, una vibración o una luz de advertencia encendida. Reportar a tiempo evita que una falla pequeña se vuelva una reparación mayor o un accidente.",
      },
    ],
    puntosClave: [
      "Prevenir es más barato y más seguro que reparar sobre la marcha.",
      "Frenos, llantas y luces son los puntos de mayor riesgo si fallan.",
      "Reportá cualquier ruido, vibración o testigo encendido apenas lo notes.",
    ],
    videos: ["3_wbsrHvx2I", "ukBuEzkPeqc"],
  },
  {
    slug: "manejo-de-pasajeros",
    titulo: "Manejo de pasajeros y paradas seguras",
    resumen:
      "Buenas prácticas para subir, transportar y bajar pasajeros sin poner en riesgo a nadie.",
    icono: "🧑‍🤝‍🧑",
    secciones: [
      {
        titulo: "Antes de arrancar",
        contenido:
          "Verificá que las puertas estén completamente cerradas y que ningún pasajero esté en tránsito de subir o bajar antes de mover el vehículo.",
      },
      {
        titulo: "Paradas en el paradero",
        contenido:
          "Deteneté completamente pegado al andén, en el paradero autorizado, antes de abrir puertas. Esperá a que los pasajeros terminen de bajar antes de dejar subir a los siguientes.",
      },
      {
        titulo: "Pasajeros de pie y con movilidad reducida",
        contenido:
          "Arrancá y frená de forma suave cuando haya pasajeros de pie. Da tiempo extra a personas mayores, con movilidad reducida o con niños antes de cerrar puertas o arrancar.",
      },
      {
        titulo: "Manejo de conflictos",
        contenido:
          "Mantené un tono calmado ante quejas o discusiones entre pasajeros. Tu prioridad es la seguridad de la conducción, no resolver el conflicto mientras el bus está en movimiento.",
      },
    ],
    puntosClave: [
      "Nunca arranques con puertas abiertas o pasajeros en tránsito.",
      "Detenete completamente en el paradero antes de abrir puertas.",
      "Frená y acelerá con suavidad si hay pasajeros de pie.",
      "Ante un conflicto entre pasajeros, priorizá la conducción segura.",
    ],
    videos: [],
  },
  {
    slug: "fatiga-y-somnolencia",
    titulo: "Fatiga y somnolencia al volante",
    resumen:
      "Cómo reconocer las señales de cansancio y por qué son tan peligrosas como el alcohol.",
    icono: "😴",
    secciones: [
      {
        titulo: "Por qué es tan riesgosa",
        contenido:
          "Los factores comportamentales explican la mayoría de los siniestros viales, y la fatiga es uno de los más importantes. Un microsueño de solo 2-3 segundos, a velocidad de vía urbana, puede significar recorrer una distancia considerable sin control del vehículo.",
      },
      {
        titulo: "Señales de alerta",
        contenido:
          "Párpados pesados, bostezos frecuentes, dificultad para mantener el carril, no recordar los últimos minutos de vía recorrida, o sentir la necesidad de abrir la ventana para 'despertarte' son señales de que ya estás en riesgo, no una advertencia temprana.",
      },
      {
        titulo: "Pausas activas",
        contenido:
          "Cada 2 horas o 200 km de recorrido, tomá una pausa de 5 a 10 minutos: bajate del vehículo, estirate y camina un poco. La cafeína ayuda a corto plazo, pero no reemplaza el descanso real.",
      },
      {
        titulo: "Qué hacer si sentís sueño en ruta",
        contenido:
          "Si es posible, detenete en un lugar seguro apenas notes las señales de alerta. Seguir manejando 'un poco más' es la decisión que más se repite en accidentes por fatiga.",
      },
    ],
    puntosClave: [
      "La fatiga reduce tu reacción tanto como el alcohol.",
      "Los microsueños ocurren sin previo aviso.",
      "Programá pausas activas cada 2 horas o 200 km.",
      "Ante señales de sueño, detenete en un lugar seguro cuanto antes.",
    ],
    videos: ["WXcXJ8gE4Yg", "IAvlZMMpuoo"],
  },
];

export function obtenerTema(slug: string): TemaAprendizaje | undefined {
  return temasAprendizaje.find((t) => t.slug === slug);
}
