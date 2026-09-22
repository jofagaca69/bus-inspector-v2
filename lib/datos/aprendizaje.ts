import type { BloqueContenido, TemaAprendizaje } from "@/lib/datos/tipos";
import { PASO_16_RES_40595 } from "@/lib/datos/normativa-inspeccion";
import { videos } from "@/lib/datos/videos";

/**
 * Temas del centro de aprendizaje. Cada tema se arma con bloques (ver
 * BloqueContenido en lib/datos/tipos.ts) y sus videos vienen del registro
 * único lib/datos/videos.ts, que verifica scripts/verificar-videos.mjs.
 *
 * Convenciones:
 *  - El `slug` es también la clave del banco de preguntas del tema en
 *    lib/datos/evaluaciones.ts: un tema nuevo recibe su quiz solo con
 *    agregar esa entrada.
 *  - Lo rotulado "Buena práctica" es recomendación operativa, no cita de
 *    una norma. Los datos normativos (transporte escolar, PESV, PAS) salen
 *    de fuentes oficiales y coinciden con lib/datos/normativa.ts.
 *  - Los cuatro primeros temas conservan el contenido original; solo se
 *    reorganizó su presentación y se ampliaron.
 */
export const temasAprendizaje: TemaAprendizaje[] = [
  {
    slug: "conduccion-defensiva",
    titulo: "Conducción defensiva",
    resumen:
      "Técnicas para anticipar riesgos en la vía y reducir la probabilidad de un accidente.",
    icono: "🛡️",
    categoria: "conduccion",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Es la técnica de conducir anticipando los errores de los demás y las condiciones cambiantes de la vía, para poder reaccionar a tiempo. No se trata de manejar más lento, sino de manejar con más atención y criterio.",
      },
      {
        tipo: "comparativa",
        titulo: "Distancia de seguimiento",
        filas: [
          { etiqueta: "Condiciones normales", valor: "3 s", nota: "Con el vehículo de adelante" },
          {
            etiqueta: "Lluvia, niebla o pasajeros de pie",
            valor: "5-6 s",
            nota: "En un bus, la distancia de frenado es mayor que la de un carro",
          },
        ],
      },
      {
        tipo: "lista",
        titulo: "Zonas ciegas y espejos",
        items: [
          "Revisa los espejos cada 5-8 segundos, no solo antes de girar o cambiar de carril.",
          "Un bus tiene puntos ciegos mucho más grandes que un vehículo liviano, sobre todo en los costados y justo detrás.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Intersecciones y paraderos",
        items: [
          "Reduce la velocidad al acercarte a paraderos, cruces peatonales y colegios.",
          "Un peatón o ciclista puede aparecer sin previo aviso: anticipar te da tiempo de frenar sin maniobras bruscas.",
        ],
      },
      {
        tipo: "senales",
        titulo: "Señales que te piden anticipar",
        ids: ["sp47_zona_escolar", "si24_cruce_peatonal", "sr02_ceda_el_paso", "sp23_semaforo"],
      },
    ],
    puntosClave: [
      "Anticipar es más importante que reaccionar rápido.",
      "Amplía la distancia de seguimiento con mal clima o carga completa.",
      "Los puntos ciegos de un bus son más grandes: revisa espejos con frecuencia.",
      "Reduce velocidad en zonas con alta presencia de peatones.",
    ],
    videos: [videos.defensivaTecnicas, videos.defensivaDomina, videos.frenado],
  },
  {
    slug: "mantenimiento-preventivo",
    titulo: "Mantenimiento preventivo",
    resumen:
      "Por qué revisar el vehículo antes de fallas evita accidentes y varadas en ruta.",
    icono: "🔧",
    categoria: "vehiculo",
    bloques: [
      {
        tipo: "comparativa",
        titulo: "Preventivo vs. correctivo",
        filas: [
          {
            etiqueta: "Preventivo",
            valor: "Antes",
            nota: "Se hace según kilometraje o tiempo, antes de que aparezca una falla",
          },
          {
            etiqueta: "Correctivo",
            valor: "Después",
            nota: "Casi siempre en el peor momento: en plena ruta y con pasajeros a bordo",
          },
        ],
      },
      {
        tipo: "tarjetas-icono",
        titulo: "Puntos críticos de un bus de servicio público",
        items: [
          { titulo: "Frenos", resumen: "Respuesta del pedal y ruidos", icono: "freno" },
          { titulo: "Llantas", resumen: "Presión y desgaste", icono: "llanta" },
          { titulo: "Aceite", resumen: "Nivel", icono: "aceite" },
          { titulo: "Refrigerante", resumen: "Nivel", icono: "refrigerante" },
          { titulo: "Luces", resumen: "Todas funcionando", icono: "luz" },
          { titulo: "Limpiaparabrisas", resumen: "Plumillas y agua", icono: "limpiaparabrisas" },
          { titulo: "Batería", resumen: "Bornes y carga", icono: "bateria" },
        ],
      },
      {
        tipo: "lista",
        titulo: "Tu rol como conductor",
        items: [
          "No eres el mecánico, pero eres quien primero nota un ruido extraño, una vibración o una luz de advertencia encendida.",
          "Reportar a tiempo evita que una falla pequeña se vuelva una reparación mayor o un accidente.",
        ],
      },
      {
        tipo: "alerta",
        variante: "info",
        texto: "Estos puntos hacen parte de tu Inspección diaria en la app: cada día, antes de salir.",
      },
    ],
    puntosClave: [
      "Prevenir es más barato y más seguro que reparar sobre la marcha.",
      "Frenos, llantas y luces son los puntos de mayor riesgo si fallan.",
      "Reporta cualquier ruido, vibración o testigo encendido apenas lo notes.",
    ],
    videos: [videos.mantenimientoTes, videos.mantenimientoFlota],
  },
  {
    slug: "manejo-de-pasajeros",
    titulo: "Manejo de pasajeros y paradas seguras",
    resumen:
      "Buenas prácticas para subir, transportar y bajar pasajeros sin poner en riesgo a nadie.",
    icono: "🧑‍🤝‍🧑",
    categoria: "pasajeros",
    bloques: [
      {
        tipo: "pasos",
        titulo: "En cada parada",
        pasos: [
          { texto: "Detente por completo, pegado al andén, en el paradero autorizado." },
          { texto: "Abre las puertas solo con el bus detenido." },
          { texto: "Deja que terminen de bajar antes de dejar subir a los siguientes." },
          {
            texto: "Verifica que las puertas estén completamente cerradas.",
            detalle: "Y que ningún pasajero esté en tránsito de subir o bajar.",
          },
          { texto: "Arranca con suavidad." },
        ],
      },
      {
        tipo: "lista",
        titulo: "Pasajeros de pie y con movilidad reducida",
        items: [
          "Arranca y frena de forma suave cuando haya pasajeros de pie.",
          "Da tiempo extra a personas mayores, con movilidad reducida o con niños antes de cerrar puertas o arrancar.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Ante un conflicto",
        items: [
          "Mantén un tono calmado ante quejas o discusiones entre pasajeros.",
          "Tu prioridad es la seguridad de la conducción, no resolver el conflicto mientras el bus está en movimiento.",
        ],
      },
      {
        tipo: "senales",
        titulo: "Señales de paradero",
        ids: ["si08_paradero_buses", "sr40_paradero"],
      },
      {
        tipo: "checklist",
        titulo: "Antes de arrancar de cada parada",
        items: [
          "Puertas completamente cerradas",
          "Nadie subiendo ni bajando",
          "Espejos revisados",
          "Pasajeros de pie bien sujetos",
        ],
      },
    ],
    puntosClave: [
      "Nunca arranques con puertas abiertas o pasajeros en tránsito.",
      "Detente completamente en el paradero antes de abrir puertas.",
      "Frena y acelera con suavidad si hay pasajeros de pie.",
      "Ante un conflicto entre pasajeros, prioriza la conducción segura.",
    ],
    videos: [],
  },
  {
    slug: "fatiga-y-somnolencia",
    titulo: "Fatiga y somnolencia al volante",
    resumen:
      "Cómo reconocer las señales de cansancio y por qué son tan peligrosas como el alcohol.",
    icono: "😴",
    categoria: "salud",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Los factores comportamentales explican la mayoría de los siniestros viales, y la fatiga es uno de los más importantes.",
      },
      {
        tipo: "alerta",
        variante: "peligro",
        texto:
          "Un microsueño de solo 2-3 segundos, a velocidad de vía urbana, puede significar recorrer una distancia considerable sin control del vehículo.",
      },
      {
        tipo: "lista",
        titulo: "Señales de alerta",
        items: [
          "Párpados pesados.",
          "Bostezos frecuentes.",
          "Dificultad para mantener el carril.",
          "No recordar los últimos minutos de vía recorrida.",
          "Sentir la necesidad de abrir la ventana para «despertarte».",
        ],
      },
      {
        tipo: "texto",
        texto: "Si notas alguna de estas señales, ya estás en riesgo: no es una advertencia temprana.",
      },
      {
        tipo: "comparativa",
        titulo: "Pausas activas",
        filas: [
          { etiqueta: "Cada", valor: "2 h o 200 km", nota: "De recorrido" },
          {
            etiqueta: "Duración",
            valor: "5-10 min",
            nota: "Bájate del vehículo, estírate y camina un poco",
          },
        ],
      },
      {
        tipo: "alerta",
        variante: "info",
        texto: "La cafeína ayuda a corto plazo, pero no reemplaza el descanso real.",
      },
      {
        tipo: "lista",
        titulo: "Si sientes sueño en ruta",
        items: [
          "Detente en un lugar seguro apenas notes las señales de alerta.",
          "Seguir manejando «un poco más» es la decisión que más se repite en accidentes por fatiga.",
        ],
      },
    ],
    puntosClave: [
      "La fatiga reduce tu reacción tanto como el alcohol.",
      "Los microsueños ocurren sin previo aviso.",
      "Programa pausas activas cada 2 horas o 200 km.",
      "Ante señales de sueño, detente en un lugar seguro cuanto antes.",
    ],
    videos: [videos.fatigaSomnolencia, videos.pausasActivas],
  },

  // ---------------------------------------------------------------
  // Temas nuevos
  // ---------------------------------------------------------------
  {
    slug: "evacuacion-bus-escolar",
    titulo: "Evacuación del bus escolar",
    resumen: "Qué hacer, en qué orden, si hay que sacar a todos del bus rápidamente.",
    icono: "🚪",
    categoria: "emergencias",
    bloques: [
      {
        tipo: "texto",
        texto:
          "En una emergencia cada segundo cuenta. Un plan claro, conocido y ensayado evita el pánico y los empujones.",
      },
      {
        tipo: "tarjetas-icono",
        titulo: "Conoce tu bus antes de necesitarlo",
        items: [
          {
            titulo: "Salidas de emergencia",
            resumen: "Puertas y ventanas",
            icono: "salida-emergencia",
            detalle: [
              "Buena práctica: ubica todas las salidas de emergencia y comprueba que abran.",
              "Buena práctica: mantenlas libres de bolsos, cajas o cualquier obstáculo.",
            ],
          },
          {
            titulo: "Martillo",
            resumen: "Para romper el vidrio",
            icono: "martillo",
            detalle: [
              "Buena práctica: verifica que esté en su sitio y al alcance.",
              "Buena práctica: que el acompañante también sepa dónde está.",
            ],
          },
          {
            titulo: "Extintor",
            resumen: "Vigente y accesible",
            icono: "extintor",
            detalle: [
              "Buena práctica: revisa la fecha de vencimiento y que el indicador de presión esté en la zona correcta.",
            ],
          },
          {
            titulo: "Botiquín",
            resumen: "Completo y a mano",
            icono: "botiquin",
            detalle: [
              "Buena práctica: revisa las fechas de vencimiento de los insumos.",
            ],
          },
        ],
      },
      {
        tipo: "pasos",
        titulo: "Si hay que evacuar",
        pasos: [
          { texto: "Detén el bus en un lugar seguro y apaga el motor." },
          { texto: "Pide a los pasajeros mantener la calma y salir sin correr." },
          { texto: "Abre las puertas y, si es necesario, las salidas de emergencia." },
          {
            texto: "Que salgan primero los más cercanos a la salida.",
            detalle: "El acompañante guía a los niños.",
          },
          { texto: "Reúne a todos lejos del vehículo y de la vía." },
          { texto: "Cuenta a los pasajeros y confirma que nadie quedó dentro." },
          { texto: "Llama al 123." },
        ],
      },
      {
        tipo: "alerta",
        variante: "info",
        texto:
          "Buena práctica: ensaya la evacuación de forma periódica con el acompañante y los estudiantes, para que cada uno sepa qué hacer.",
      },
    ],
    puntosClave: [
      "Conoce dónde están las salidas de emergencia, el martillo y el extintor.",
      "Evacúa en orden y sin correr; el acompañante guía a los niños.",
      "Reúne a todos lejos del vehículo y de la vía, y cuéntalos.",
      "Nunca dejes a nadie dentro de un bus en emergencia.",
    ],
    videos: [videos.evacuacionEscolar],
  },
  {
    slug: "conduccion-adversa",
    titulo: "Lluvia, niebla y montaña",
    resumen: "Cómo ajustar tu forma de conducir cuando la vía o el clima se ponen difíciles.",
    icono: "🌧️",
    categoria: "conduccion",
    bloques: [
      {
        tipo: "lista",
        titulo: "Con lluvia",
        items: [
          "Antes de salir revisa llantas, luces, frenos y limpiaparabrisas.",
          "Reduce la velocidad y amplía la distancia de seguimiento (5-6 segundos).",
          "Enciende las luces.",
          "Evita frenadas y giros bruscos.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Con niebla",
        items: [
          "Reduce la velocidad y usa las luces bajas.",
          "Aumenta la distancia con el vehículo de adelante.",
          "Si casi no ves, detente en un lugar seguro y espera a que mejore.",
        ],
      },
      {
        tipo: "lista",
        titulo: "En montaña",
        items: [
          "En descensos largos usa cambios bajos y el freno motor para no sobrecalentar los frenos.",
          "No bajes en neutro: pierdes el freno motor.",
          "No adelantes en curvas y mantén la distancia.",
        ],
      },
      {
        tipo: "senales",
        titulo: "Señales que anuncian estas condiciones",
        ids: ["sp44_superficie_deslizante", "sp42_zona_derrumbe", "sr35_circulacion_luces_bajas"],
      },
      {
        tipo: "enlace",
        titulo: "ANSV: recomendaciones para conducir bajo la lluvia",
        url: "https://mintransporte.gov.co/publicaciones/9031/ansv-recuerda-recomendaciones-para-prevenir-siniestros-viales-al-conducir-bajo-la-lluvia/",
        fuente: "Ministerio de Transporte",
      },
    ],
    puntosClave: [
      "Con mal clima, menos velocidad y más distancia.",
      "Revisa llantas, luces, frenos y limpiaparabrisas antes de salir.",
      "En bajadas largas usa el freno motor, no solo el pedal.",
      "Si no ves, detente en un lugar seguro.",
    ],
    videos: [videos.lluvia, videos.ecoPendientes],
  },
  {
    slug: "proteccion-de-menores",
    titulo: "Protección de menores y rol del acompañante",
    resumen: "Lo que exige el transporte escolar y cómo cuidar a cada niño durante la ruta.",
    icono: "🧒",
    categoria: "pasajeros",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Transportar niños exige un cuidado adicional: no siempre reconocen el peligro. El acompañante adulto y tú forman un equipo.",
      },
      {
        tipo: "lista",
        titulo: "El rol del acompañante",
        items: [
          "Cuida a los estudiantes y supervisa su ascenso y descenso del vehículo.",
          "Vela por el uso permanente del cinturón de seguridad durante el trayecto.",
          "Supervisa el comportamiento a bordo.",
          "Mantiene comunicación constante con el conductor.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Lo que se espera de los niños a bordo",
        items: [
          "Permanecer sentados y usar siempre el cinturón.",
          "No distraer al conductor.",
          "Seguir las indicaciones del acompañante.",
          "No sacar la cabeza ni los brazos por la ventana.",
        ],
      },
      {
        tipo: "lista",
        titulo: "Tu responsabilidad como conductor",
        items: [
          "El número de estudiantes debe corresponder a los asientos disponibles: ningún asiento con más de un niño.",
          "No inicies la ruta sin el acompañante a bordo.",
          "Buena práctica: al terminar la ruta, recorre el bus fila por fila antes de cerrarlo.",
        ],
      },
      {
        tipo: "checklist",
        titulo: "Antes de iniciar la ruta",
        items: [
          "Acompañante a bordo",
          "Cada niño sentado y con el cinturón puesto",
          "Ningún asiento con más de un niño",
          "Puertas cerradas",
          "Salidas de emergencia libres",
        ],
      },
      {
        tipo: "enlace",
        titulo: "Guía para la prestación del servicio de transporte escolar",
        url: "https://www.supertransporte.gov.co/documentos/2022/Abril/OTIC_28/guia-transporte-escolar.pdf",
        fuente: "Superintendencia de Transporte",
        descripcion: "PDF oficial",
      },
      {
        tipo: "enlace",
        titulo: "La seguridad vial en el transporte escolar",
        url: "https://www.cesvicolombia.com/la-seguridad-vial-en-el-transporte-escolar/",
        fuente: "Cesvi Colombia",
      },
      {
        tipo: "enlace",
        titulo: "Rutas escolares seguras: esto es lo que debe exigirles",
        url: "https://educacionbogota.edu.co/portal_institucional/node/4849",
        fuente: "Secretaría de Educación del Distrito",
      },
    ],
    puntosClave: [
      "El acompañante adulto es obligatorio: sin él no se presta el servicio.",
      "Cada niño sentado, con cinturón, y un solo niño por asiento.",
      "Al terminar la ruta, recorre el bus fila por fila.",
      "Conductor y acompañante se comunican constantemente.",
    ],
    videos: [],
  },
  {
    slug: "situaciones-dificiles",
    titulo: "Situaciones difíciles a bordo",
    resumen: "Conflictos, pasajeros indispuestos y fallas en ruta: cómo actuar con calma.",
    icono: "⚠️",
    categoria: "pasajeros",
    bloques: [
      {
        tipo: "pasos",
        titulo: "Pasajero agresivo o discusión",
        pasos: [
          { texto: "Mantén un tono calmado pero firme." },
          { texto: "No respondas a provocaciones." },
          {
            texto: "Prioriza conducir con seguridad.",
            detalle: "Si es necesario, detente en un lugar seguro.",
          },
          { texto: "Si hay riesgo, pide ayuda a la empresa o llama al 123." },
        ],
      },
      {
        tipo: "pasos",
        titulo: "Pasajero enfermo o indispuesto",
        pasos: [
          { texto: "Detente en un lugar seguro." },
          {
            texto: "Comprueba si responde y si respira con normalidad.",
          },
          { texto: "Llama al 123 si es grave." },
          {
            texto: "Sigue la guía correspondiente.",
            detalle: "En el módulo de Primeros auxilios.",
          },
        ],
      },
      {
        tipo: "pasos",
        titulo: "Falla mecánica en ruta",
        pasos: [
          { texto: "Enciende las luces de emergencia." },
          { texto: "Detén el bus en un lugar seguro, fuera de la calzada si es posible." },
          { texto: "Coloca los triángulos reflectivos." },
          { texto: "Si no es seguro permanecer dentro, evacúa a los pasajeros lejos de la vía." },
          { texto: "Avisa a la empresa." },
        ],
      },
      {
        tipo: "alerta",
        variante: "peligro",
        texto:
          "Ningún horario ni presión justifica seguir manejando con una falla o en condiciones inseguras.",
      },
    ],
    puntosClave: [
      "Tono calmado pero firme; no respondas a provocaciones.",
      "La seguridad de la conducción va primero.",
      "Ante una falla: luces, lugar seguro, triángulos y aviso a la empresa.",
      "Ningún horario justifica manejar en condiciones inseguras.",
    ],
    videos: [],
  },
  {
    slug: "pesv-y-tu-rol",
    titulo: "El PESV y tu rol como conductor",
    resumen: "El plan de seguridad vial de tu empresa es obligatorio, y tú lo haces realidad en la vía.",
    icono: "📋",
    categoria: "gestion",
    bloques: [
      {
        tipo: "texto",
        texto:
          "El Plan Estratégico de Seguridad Vial (PESV) reúne los mecanismos y medidas que una organización adopta para prevenir siniestros viales. Es obligatorio para las organizaciones con más de diez vehículos o que contraten o administren conductores.",
      },
      {
        tipo: "lista",
        titulo: "Cómo lo aplicas tú (buena práctica)",
        items: [
          "Haz la inspección diaria completa, todos los días: es la inspección preoperacional del Paso 16.",
          "Reporta fallas y novedades a tiempo: alimentan el plan de mantenimiento del Paso 17.",
          "Cumple los límites de velocidad y la normativa de tránsito.",
          "Descansa lo suficiente y conduce siempre sin alcohol ni sustancias.",
        ],
      },
      { tipo: "cita-legal", cita: PASO_16_RES_40595 },
      {
        tipo: "enlace",
        titulo: "Planes Estratégicos de Seguridad Vial",
        url: "https://ansv.gov.co/es/escuela/10446",
        fuente: "Agencia Nacional de Seguridad Vial",
      },
    ],
    puntosClave: [
      "El PESV es una obligación de la empresa; la ejecución diaria es tuya.",
      "Tu inspección diaria es el registro de la inspección preoperacional (Paso 16).",
      "Reportar a tiempo alimenta el mantenimiento (Paso 17).",
    ],
    videos: [videos.pesv],
  },
  {
    slug: "ergonomia-y-salud",
    titulo: "Ergonomía y salud del conductor",
    resumen: "Postura, pausas y ejercicios para cuidar tu espalda, cuello y articulaciones.",
    icono: "🧘",
    categoria: "salud",
    bloques: [
      {
        tipo: "texto",
        texto:
          "Pasar muchas horas sentado, en la misma postura y con vibración, cansa el cuerpo y baja tu atención. Cuidar tu postura también es seguridad vial.",
      },
      {
        tipo: "lista",
        titulo: "Postura al volante (buena práctica)",
        items: [
          "Ajusta el asiento para alcanzar los pedales sin estirar del todo las piernas.",
          "Apoya toda la espalda en el respaldo.",
          "Ajusta el apoyacabezas a la altura de tu cabeza.",
          "Mantén los brazos ligeramente flexionados al sujetar el volante.",
        ],
      },
      {
        tipo: "comparativa",
        titulo: "Pausas y estiramientos",
        filas: [
          { etiqueta: "Pausa en ruta", valor: "5-10 min", nota: "Cada 2 horas o 200 km" },
          {
            etiqueta: "Estira",
            valor: "Cuello, hombros y espalda",
            nota: "También muñecas y piernas",
          },
        ],
      },
      {
        tipo: "alerta",
        variante: "info",
        texto:
          "Si tienes dolor persistente en la espalda, el cuello o los hombros, consúltalo con tu EPS o tu ARL: no lo normalices.",
      },
    ],
    puntosClave: [
      "Una buena postura reduce la fatiga y el dolor.",
      "Haz pausas activas: bájate, estírate y camina.",
      "No normalices el dolor persistente: consúltalo.",
    ],
    videos: [videos.ergonomiaSura, videos.ergonomiaEjercicios, videos.pausasActivas],
  },
  {
    slug: "accidente-pas",
    titulo: "Qué hacer ante un accidente",
    resumen: "El protocolo PAS y los primeros minutos después de un choque.",
    icono: "🚨",
    categoria: "emergencias",
    bloques: [
      {
        tipo: "pasos",
        titulo: "Protocolo PAS",
        pasos: [
          {
            texto: "Proteger",
            detalle:
              "Detén el vehículo en un lugar seguro, enciende las luces de emergencia y coloca los triángulos reflectivos.",
          },
          {
            texto: "Avisar",
            detalle:
              "Llama al 123 en ciudad o al #767 en carretera. Da tu ubicación exacta y cuántos heridos hay.",
          },
          {
            texto: "Socorrer",
            detalle:
              "Presta primeros auxilios solo si tienes la formación para hacerlo, y espera a las autoridades.",
          },
        ],
      },
      {
        tipo: "lista",
        titulo: "Si solo hay daños materiales",
        items: [
          "Retira los vehículos para no interrumpir el tránsito.",
          "Antes de moverlos, toma fotos y videos de la posición final.",
          "Buena práctica: avisa a tu empresa apenas puedas.",
        ],
      },
      {
        tipo: "alerta",
        variante: "peligro",
        texto:
          "Abandonar a una persona herida sin auxiliarla ni avisar a las autoridades puede constituir el delito de omisión de socorro.",
      },
      {
        tipo: "enlace",
        titulo: "Nueva circular para resolver choques simples",
        url: "https://mintransporte.gov.co/publicaciones/11167/ministerio-de-transporte-expidio-una-nueva-circular-para-resolver-choques-simples-en-las-vias-del-pais/",
        fuente: "Ministerio de Transporte",
      },
      {
        tipo: "enlace",
        titulo: "Capacitación en primer respondiente ante siniestros viales",
        url: "https://ansv.gov.co/es/escuela/7914",
        fuente: "Agencia Nacional de Seguridad Vial",
      },
    ],
    puntosClave: [
      "PAS: Proteger, Avisar, Socorrer, en ese orden.",
      "123 en ciudad, #767 en carretera.",
      "Antes de mover los vehículos, documenta con fotos.",
      "Nunca abandones a un herido.",
    ],
    videos: [videos.protocoloPas],
  },
  {
    slug: "eco-conduccion",
    titulo: "Eco-conducción y ahorro de combustible",
    resumen: "Manejar de forma eficiente ahorra combustible, desgasta menos el bus y es más seguro.",
    icono: "⛽",
    categoria: "conduccion",
    bloques: [
      {
        tipo: "texto",
        texto:
          "La conducción eficiente reduce el consumo, el desgaste del vehículo y las emisiones, y además es una conducción más suave y segura para los pasajeros.",
      },
      {
        tipo: "lista",
        titulo: "Reglas básicas",
        items: [
          "Arranca con suavidad y evita acelerones y frenazos.",
          "Usa la primera marcha solo para arrancar y pasa pronto a la siguiente.",
          "Mantén una velocidad constante y anticipa el tráfico para no frenar de más.",
          "Si vas a estar detenido más de un minuto, apaga el motor.",
          "Mantén las llantas con la presión correcta.",
        ],
      },
      {
        tipo: "comparativa",
        titulo: "¿Cuánto se ahorra?",
        filas: [
          {
            etiqueta: "Combustible",
            valor: "≈ 15 %",
            nota: "Según Fundación MAPFRE, con una conducción eficiente bien ejecutada",
          },
        ],
      },
      {
        tipo: "enlace",
        titulo: "10 reglas de oro de la conducción eficiente",
        url: "https://www.idae.es/movilidad-sostenible/10-reglas-de-oro-de-la-conduccion-eficiente",
        fuente: "IDAE",
      },
    ],
    puntosClave: [
      "Suavidad al arrancar, frenar y acelerar.",
      "Velocidad constante y anticipación.",
      "Apaga el motor en paradas largas.",
      "Llantas con la presión correcta.",
    ],
    videos: [videos.ecoIntroduccion, videos.ecoConduccion, videos.ecoPendientes],
  },
];

export function obtenerTema(slug: string): TemaAprendizaje | undefined {
  return temasAprendizaje.find((t) => t.slug === slug);
}

/** Palabras de un bloque, para estimar el tiempo de lectura. */
function palabrasDeBloque(bloque: BloqueContenido): number {
  const contar = (texto: string | undefined) =>
    texto ? texto.trim().split(/\s+/).filter(Boolean).length : 0;

  switch (bloque.tipo) {
    case "texto":
      return contar(bloque.texto);
    case "lista":
    case "checklist":
      return contar(bloque.titulo) + bloque.items.reduce((n, i) => n + contar(i), 0);
    case "pasos":
      return (
        contar(bloque.titulo) +
        bloque.pasos.reduce((n, p) => n + contar(p.texto) + contar(p.detalle), 0)
      );
    case "tarjetas-icono":
      return (
        contar(bloque.titulo) +
        bloque.items.reduce(
          (n, i) =>
            n +
            contar(i.titulo) +
            contar(i.resumen) +
            (i.detalle ?? []).reduce((m, d) => m + contar(d), 0),
          0,
        )
      );
    case "comparativa":
      return (
        contar(bloque.titulo) +
        bloque.filas.reduce((n, f) => n + contar(f.etiqueta) + contar(f.valor) + contar(f.nota), 0)
      );
    case "alerta":
      return contar(bloque.texto);
    default:
      return 0;
  }
}

/**
 * Minutos de LECTURA estimados (≈ 180 palabras por minuto). Se calcula del
 * contenido en vez de fijarse a mano, para que nunca quede desactualizado;
 * los videos se cuentan aparte porque su duración no está en los datos.
 */
export function minutosDeLectura(tema: TemaAprendizaje): number {
  const palabras =
    tema.bloques.reduce((n, b) => n + palabrasDeBloque(b), 0) +
    tema.puntosClave.reduce((n, p) => n + p.trim().split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(palabras / 180));
}
