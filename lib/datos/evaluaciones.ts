import type { Pregunta } from "@/lib/datos/tipos";

/**
 * Banco de preguntas del "espacio evaluativo" de cada módulo académico.
 * Clave = slug del módulo (coincide con el slug de tema en aprendizaje,
 * o con el nombre del módulo para normativa/señales/primeros auxilios).
 */
export const evaluaciones: Record<string, Pregunta[]> = {
  normativa: [
    {
      id: "normativa-1",
      enunciado: "¿Qué documentos debe portar un conductor de servicio público?",
      opciones: [
        "Solo la licencia de conducción",
        "Licencia, SOAT, tecnomecánica vigente y tarjeta de operación",
        "Solo el SOAT",
        "Ninguno, basta con el carné de la empresa",
      ],
      correcta: 1,
      explicacion:
        "Los cuatro documentos son obligatorios: licencia vigente para la categoría del vehículo, SOAT, revisión tecnomecánica y de emisiones, y tarjeta de operación.",
    },
    {
      id: "normativa-2",
      enunciado: "Según la Ley 769 de 2002, ¿qué debe incluir el equipo de carretera obligatorio?",
      opciones: [
        "Solo el botiquín",
        "Llanta de repuesto, herramientas, señales reflectivas, botiquín, extintor y linterna",
        "Solo el extintor y la linterna",
        "Un cargador de celular",
      ],
      correcta: 1,
      explicacion:
        "El Art. 30 exige el conjunto completo: repuesto, herramientas básicas, dos señales reflectivas, botiquín, extintor y linterna.",
    },
    {
      id: "normativa-3",
      enunciado: "¿Es obligatorio el cinturón de seguridad para los pasajeros?",
      opciones: [
        "No, solo para el conductor",
        "Sí, para el conductor y para los pasajeros cuando el vehículo cuente con ellos",
        "Solo en carretera, no en ciudad",
        "Solo si el pasajero va en la primera fila",
      ],
      correcta: 1,
      explicacion:
        "El uso es obligatorio tanto para el conductor como para los pasajeros, siempre que el vehículo tenga cinturones instalados.",
    },
    {
      id: "normativa-4",
      enunciado: "¿Cuál es el nivel de alcohol tolerado para un conductor de servicio público?",
      opciones: [
        "Hasta dos cervezas",
        "Cero: cualquier nivel detectado genera sanción",
        "Depende del peso del conductor",
        "Solo se sanciona si hay accidente",
      ],
      correcta: 1,
      explicacion:
        "Para servicio público la tolerancia es cero: no existe un nivel permitido de alcohol o sustancias psicoactivas.",
    },
    {
      id: "normativa-5",
      enunciado: "¿Cómo se debe usar el celular mientras se conduce?",
      opciones: [
        "En la mano, brevemente",
        "No debe usarse en la mano; solo con manos libres y sin distraer la atención de la vía",
        "Solo para mensajes de texto, no para llamadas",
        "Sin restricción alguna",
      ],
      correcta: 1,
      explicacion:
        "Usarlo en la mano está prohibido. Cualquier comunicación debe hacerse con manos libres, sin distraerte de la vía.",
    },
    {
      id: "normativa-6",
      enunciado: "¿Dónde puede recoger y dejar pasajeros el transporte público?",
      opciones: [
        "En cualquier punto donde lo soliciten",
        "Únicamente en paraderos y sobre la ruta autorizada",
        "Solo en la terminal de origen y destino",
        "Donde el conductor lo considere más rápido",
      ],
      correcta: 1,
      explicacion:
        "Detenerse fuera de paradero pone en riesgo a los pasajeros y al tránsito; solo se permite en paraderos y ruta autorizada.",
    },
    {
      id: "normativa-7",
      enunciado: "¿Qué categoría de licencia se requiere para conducir un bus de servicio público?",
      opciones: [
        "A2",
        "B1",
        "C2 o C3, según el tipo de vehículo",
        "Cualquier categoría es válida",
      ],
      correcta: 2,
      explicacion:
        "Se requiere licencia categoría C2 o C3 según el tipo de vehículo, vigente y sin comparendos que la suspendan.",
    },
    {
      id: "normativa-8",
      enunciado: "¿Qué es la tarjeta de operación?",
      opciones: [
        "Un documento personal del conductor",
        "Un documento del vehículo, expedido por la empresa habilitada, que autoriza su vinculación y ruta",
        "Un comprobante de pago del SOAT",
        "Un permiso de estacionamiento",
      ],
      correcta: 1,
      explicacion:
        "La tarjeta de operación es del vehículo, no del conductor: autoriza su vinculación a la empresa y la ruta que presta.",
    },
    {
      id: "normativa-9",
      enunciado: "¿Qué significa la sigla PAS en un accidente de tránsito?",
      opciones: [
        "Proteger, Avisar y Socorrer",
        "Parar, Alejarse y Salir",
        "Pitar, Alertar y Señalizar",
        "Proteger, Anotar y Salir",
      ],
      correcta: 0,
      explicacion:
        "PAS es el protocolo del Ministerio de Transporte y la ANSV: primero proteger la escena, luego avisar a las autoridades y, por último, socorrer si tienes la formación.",
    },
    {
      id: "normativa-10",
      enunciado: "Según el protocolo PAS, ¿a qué línea avisas de un accidente?",
      opciones: [
        "Solo al 123, en todo el país",
        "Al 123 en ciudad y al #767 en carretera",
        "Solo al #767, en todo el país",
        "A ninguna: se espera a que pase una patrulla",
      ],
      correcta: 1,
      explicacion:
        "En ciudad se marca la línea de emergencias 123 y en carretera el #767. Da siempre tu ubicación exacta y cuántos heridos hay.",
    },
    {
      id: "normativa-11",
      enunciado: "¿Qué exige la normativa de transporte escolar respecto al acompañante?",
      opciones: [
        "No es necesario si el conductor tiene experiencia",
        "Basta con que sea un estudiante mayor",
        "Debe ir un adulto con formación en seguridad del vehículo, tránsito, seguridad vial y primeros auxilios",
        "Solo es obligatorio en rutas nocturnas",
      ],
      correcta: 2,
      explicacion:
        "El servicio de transporte escolar no puede prestarse sin un adulto acompañante formado en esos temas, sentado cerca de la puerta.",
    },
    {
      id: "normativa-12",
      enunciado: "¿Quiénes deben tener un Plan Estratégico de Seguridad Vial (PESV)?",
      opciones: [
        "Solo las empresas de carga",
        "Solo los conductores independientes",
        "Únicamente las entidades públicas",
        "Las entidades y empresas con más de diez vehículos, o que contraten o administren conductores",
      ],
      correcta: 3,
      explicacion:
        "Lo exige la metodología del Ministerio de Transporte (Resolución 20223040040595 de 2022) a organizaciones públicas y privadas con esa flota o que manejen personal conductor.",
    },
    {
      id: "normativa-13",
      enunciado: "Llegas a un accidente con heridos. Según el protocolo PAS, ¿qué haces primero?",
      opciones: [
        "Proteger la escena: luces de emergencia y triángulos reflectivos",
        "Mover de inmediato a los heridos al andén",
        "Tomar fotos para el seguro",
        "Llamar a tu empresa antes que a nadie",
      ],
      correcta: 0,
      explicacion:
        "Proteger es lo primero: si la escena no está señalizada, puede ocurrir un segundo choque con más víctimas, incluido tú.",
    },
    {
      id: "normativa-14",
      enunciado: "¿Cuál es el límite de velocidad en zonas escolares y residenciales, salvo señal distinta?",
      opciones: ["50 km/h", "60 km/h", "30 km/h", "20 km/h"],
      correcta: 2,
      explicacion:
        "En zonas escolares y residenciales el límite es 30 km/h, salvo que una señal indique otra cosa. En zona urbana general es 50 km/h.",
    },
    {
      id: "normativa-15",
      enunciado:
        "Abandonar a una persona herida sin auxiliarla ni avisar a las autoridades puede constituir:",
      opciones: [
        "Una falta menor sin sanción",
        "El delito de omisión de socorro",
        "Una simple recomendación",
        "Un trámite de la aseguradora",
      ],
      correcta: 1,
      explicacion:
        "No socorrer ni avisar puede constituir el delito de omisión de socorro. Por eso el protocolo PAS existe: avisar siempre es posible, aunque no sepas primeros auxilios.",
    },
  ],

  senales: [
    {
      id: "senales-1",
      enunciado: "¿Qué tipo de señal es SR-01 (PARE)?",
      opciones: ["Preventiva", "Reglamentaria", "Informativa", "Transitoria"],
      correcta: 1,
      explicacion:
        "Las señales con prefijo SR son reglamentarias: indican una obligación o prohibición de cumplimiento obligatorio.",
    },
    {
      id: "senales-2",
      enunciado: "Las señales preventivas (prefijo SP) principalmente...",
      opciones: [
        "Obligan a una acción específica",
        "Advierten sobre un peligro o condición especial de la vía más adelante",
        "Indican destinos y servicios",
        "Solo se usan en obras temporales",
      ],
      correcta: 1,
      explicacion:
        "Las señales preventivas alertan sobre curvas, cruces, zonas escolares u otros peligros próximos, para que el conductor tome precauciones.",
    },
    {
      id: "senales-3",
      enunciado: "Una señal SI (informativa) como 'Estación de servicio' sirve para...",
      opciones: [
        "Prohibir el paso de vehículos pesados",
        "Guiar al conductor hacia destinos, servicios o infraestructura cercana",
        "Advertir sobre una curva peligrosa",
        "Indicar el límite de velocidad",
      ],
      correcta: 1,
      explicacion:
        "Las señales informativas orientan al conductor sobre destinos, servicios (gasolineras, hospitales) o infraestructura vial.",
    },
    {
      id: "senales-4",
      enunciado: "¿Qué debe hacer un conductor al ver la señal CEDA EL PASO (SR-02)?",
      opciones: [
        "Detenerse completamente siempre",
        "Ceder el paso a los vehículos que circulan por la vía prioritaria",
        "Acelerar para cruzar antes",
        "Ignorarla si no hay otros vehículos a la vista",
      ],
      correcta: 1,
      explicacion:
        "A diferencia del PARE, CEDA EL PASO no exige detención total salvo que sea necesario para dar paso a la vía prioritaria.",
    },
    {
      id: "senales-5",
      enunciado: "Una señal de zona escolar (tipo SP) advierte que...",
      opciones: [
        "Está prohibido el paso de buses",
        "Hay proximidad a una zona de actividad escolar, y se debe reducir la velocidad",
        "Es una vía exclusiva para peatones",
        "Se acerca un peaje",
      ],
      correcta: 1,
      explicacion:
        "Indica proximidad a un colegio: exige mayor atención y reducción de velocidad por la presencia de menores.",
    },
    {
      id: "senales-6",
      enunciado: "¿Cuántas categorías principales de señales existen en Colombia, según el Manual de Señalización?",
      opciones: [
        "Dos: reglamentarias y preventivas",
        "Tres: reglamentarias, preventivas e informativas (más las transitorias para obras)",
        "Cinco",
        "Una sola categoría",
      ],
      correcta: 1,
      explicacion:
        "Las tres categorías permanentes son reglamentarias, preventivas e informativas; las transitorias se usan en obras o desvíos temporales.",
    },
    // --- Reconocer la señal por su imagen (los pictogramas viven en public/senales) ---
    {
      id: "senales-img-1",
      imagen: "/senales/reglamentarias/sr01_pare.png",
      enunciado: "¿Qué debes hacer al ver esta señal?",
      opciones: [
        "Reducir la velocidad y seguir si no viene nadie",
        "Detenerte por completo, sin excepción",
        "Ceder el paso solo a los peatones",
        "Tocar la bocina y continuar",
      ],
      correcta: 1,
      explicacion: "Es la señal PARE (SR-01): obliga a detener el vehículo por completo antes de continuar.",
    },
    {
      id: "senales-img-2",
      imagen: "/senales/reglamentarias/sr02_ceda_el_paso.png",
      enunciado: "¿Qué indica esta señal?",
      opciones: [
        "Prohibido adelantar",
        "Velocidad máxima",
        "Ceda el paso",
        "Zona de parqueo",
      ],
      correcta: 2,
      explicacion: "Es CEDA EL PASO (SR-02): debes dar prioridad a los vehículos que circulan por la vía a la que te incorporas.",
    },
    {
      id: "senales-img-3",
      imagen: "/senales/reglamentarias/sr26_prohibido_adelantar.png",
      enunciado: "¿Qué prohíbe esta señal?",
      opciones: [
        "Adelantar a otros vehículos",
        "Girar a la izquierda",
        "Parquear",
        "Circular a más de 30 km/h",
      ],
      correcta: 0,
      explicacion: "Es PROHIBIDO ADELANTAR (SR-26): no puedes adelantar a otros vehículos en ese tramo.",
    },
    {
      id: "senales-img-4",
      imagen: "/senales/reglamentarias/sr30_velocidad_maxima.png",
      enunciado: "Esta señal reglamentaria indica:",
      opciones: [
        "La velocidad mínima obligatoria",
        "La velocidad máxima permitida en el tramo",
        "La distancia al próximo paradero",
        "El peso máximo del vehículo",
      ],
      correcta: 1,
      explicacion: "Es VELOCIDAD MÁXIMA (SR-30): el número indica el límite en km/h que no debes superar.",
    },
    {
      id: "senales-img-5",
      imagen: "/senales/preventivas/sp47_zona_escolar.png",
      enunciado: "Al ver esta señal preventiva, ¿qué debes hacer?",
      opciones: [
        "Aumentar la velocidad para pasar rápido",
        "Reducir la velocidad y extremar la atención: puede haber niños cruzando",
        "Detenerte siempre por completo",
        "Ignorarla si es de noche",
      ],
      correcta: 1,
      explicacion: "Es ZONA ESCOLAR (SP-47): advierte la presencia frecuente de niños. Reduce la velocidad y anticipa.",
    },
    {
      id: "senales-img-6",
      imagen: "/senales/preventivas/sp23_semaforo.png",
      enunciado: "¿Qué advierte esta señal preventiva?",
      opciones: [
        "Un semáforo adelante",
        "Un paso a nivel",
        "Un cruce de peatones",
        "Una zona de derrumbes",
      ],
      correcta: 0,
      explicacion: "Es SEMÁFORO (SP-23): avisa que más adelante hay un semáforo, para que te prepares a detenerte.",
    },
    {
      id: "senales-img-7",
      imagen: "/senales/informativas/si08_paradero_buses.png",
      enunciado: "¿Qué informa esta señal?",
      opciones: [
        "Estación de servicio",
        "Zona de parqueo",
        "Aeropuerto",
        "Paradero de buses",
      ],
      correcta: 3,
      explicacion: "Es PARADERO DE BUSES (SI-08): señal informativa que indica dónde está el paradero.",
    },
    {
      id: "senales-img-8",
      imagen: "/senales/reglamentarias/sr28_prohibido_parquear.png",
      enunciado: "¿Qué prohíbe esta señal?",
      opciones: [
        "Adelantar",
        "Parquear",
        "Pitar",
        "Girar en U",
      ],
      correcta: 1,
      explicacion: "Es PROHIBIDO PARQUEAR (SR-28): no puedes dejar estacionado el vehículo en ese tramo.",
    },
  ],

  "primeros-auxilios": [
    {
      id: "pa-1",
      enunciado: "¿Cuál es el número de la Línea Nacional de Emergencias en Colombia?",
      opciones: ["112", "123", "911", "132"],
      correcta: 1,
      explicacion:
        "El 123 es la línea unificada de emergencias en Colombia: policía, bomberos, ambulancia y Defensa Civil.",
    },
    {
      id: "pa-2",
      enunciado: "Ante una quemadura, ¿qué se debe hacer primero?",
      opciones: [
        "Aplicar hielo directo sobre la piel",
        "Enfriar la zona con agua limpia a temperatura ambiente por 10-15 minutos",
        "Aplicar mantequilla o pasta dental",
        "Reventar las ampollas si aparecen",
      ],
      correcta: 1,
      explicacion:
        "El agua limpia a temperatura ambiente reduce el daño térmico. El hielo directo, la mantequilla y reventar ampollas empeoran la lesión.",
    },
    {
      id: "pa-3",
      enunciado: "Ante una hemorragia, ¿qué acción es correcta?",
      opciones: [
        "Retirar la gasa cada minuto para revisar si paró",
        "Hacer presión directa constante sobre la herida",
        "Aplicar torniquete de inmediato en cualquier caso",
        "Esperar sin actuar hasta que llegue ayuda",
      ],
      correcta: 1,
      explicacion:
        "La presión directa y constante es la primera acción. Retirar la gasa interrumpe la coagulación; el torniquete es solo para hemorragias masivas incontrolables.",
    },
    {
      id: "pa-4",
      enunciado: "En un accidente de tránsito, ¿qué se debe hacer primero al llegar al lugar?",
      opciones: [
        "Mover a los heridos a un lugar más cómodo",
        "Asegurar la escena señalizando antes de acercarte, y llamar a la línea de emergencias",
        "Darles agua a los heridos",
        "Retirar el vehículo accidentado de inmediato",
      ],
      correcta: 1,
      explicacion:
        "Asegurar la escena previene un segundo accidente. No se debe mover a los heridos salvo peligro inminente, ni darles de beber.",
    },
    {
      id: "pa-5",
      enunciado: "Durante una convulsión, ¿qué NO se debe hacer?",
      opciones: [
        "Alejar objetos con los que la persona pueda golpearse",
        "Poner algo blando bajo su cabeza",
        "Meter un objeto en su boca para que no se muerda la lengua",
        "Girarla de lado una vez termine la convulsión",
      ],
      correcta: 2,
      explicacion:
        "Nunca se debe introducir nada en la boca de una persona convulsionando: el riesgo de lesión u obstrucción es alto.",
    },
    {
      id: "pa-6",
      enunciado: "¿Cuántas compresiones por minuto se recomiendan en RCP?",
      opciones: ["Entre 20 y 40", "Entre 60 y 80", "Entre 100 y 120", "Más de 150"],
      correcta: 2,
      explicacion:
        "El ritmo recomendado de compresiones torácicas en RCP es de 100 a 120 por minuto.",
    },
    {
      id: "pa-7",
      enunciado: "¿Qué elemento del botiquín se usa para inmovilizar o hacer presión sobre una herida?",
      opciones: ["Tapabocas", "Vendas elásticas", "Linterna", "Manual de primeros auxilios"],
      correcta: 1,
      explicacion:
        "Las vendas elásticas sirven tanto para sujetar gasas como para inmovilizar o presionar sobre una hemorragia.",
    },
    {
      id: "pa-8",
      enunciado: "Hay humo saliendo del capó del bus con pasajeros a bordo. ¿Qué haces primero?",
      opciones: [
        "Abrir el capó para ver qué se quema",
        "Detener el bus en un lugar seguro, apagar el motor y evacuar a los pasajeros",
        "Echarle agua al motor",
        "Seguir hasta el próximo paradero",
      ],
      correcta: 1,
      explicacion:
        "Primero la seguridad de las personas: detener, apagar y evacuar. Abrir el capó con humo o llamas alimenta el fuego con aire.",
    },
    {
      id: "pa-9",
      enunciado: "Un pasajero está pálido, sudoroso y confundido tras un golpe. ¿Qué haces?",
      opciones: [
        "Le das agua y comida para que se recupere",
        "Lo dejas descansar solo unos minutos",
        "Llamas al 123, lo acuestas, lo cubres para que no pierda calor y vigilas su respiración",
        "Le aplicas una bolsa de agua caliente",
      ],
      correcta: 2,
      explicacion:
        "Son signos de shock: es una emergencia. Se llama al 123, se acuesta, se abriga y se vigila. No se da de comer ni de beber ni se deja solo.",
    },
    {
      id: "pa-10",
      enunciado: "¿Qué debes hacer al terminar la ruta escolar, antes de cerrar el bus?",
      opciones: [
        "Cerrar de inmediato para ahorrar tiempo",
        "Confiar en que todos los niños bajaron",
        "Pedirle a un niño que revise",
        "Recorrer el bus fila por fila para verificar que no quedó nadie dentro",
      ],
      correcta: 3,
      explicacion:
        "Un niño dormido u oculto en un bus cerrado puede sufrir un golpe de calor en muy poco tiempo. Recorrer el bus fila por fila es una revisión que salva vidas.",
    },
    {
      id: "pa-11",
      enunciado: "Una persona se atraganta y no puede toser, respirar ni hablar. ¿Qué maniobra aplicas?",
      opciones: [
        "Maniobra de Heimlich: compresiones abdominales firmes hacia arriba",
        "Darle agua para que pase el objeto",
        "Meterle los dedos a la boca",
        "Acostarla boca arriba y esperar",
      ],
      correcta: 0,
      explicacion:
        "Si la obstrucción es total se aplica la maniobra de Heimlich. Nunca se meten los dedos a ciegas ni se da agua.",
    },
    {
      id: "pa-12",
      enunciado: "Antes de acercarte a una persona herida en la vía, ¿qué compruebas primero?",
      opciones: [
        "Si tiene documentos",
        "Que la escena sea segura para ti",
        "Si es conocida",
        "Cuánto tiempo lleva ahí",
      ],
      correcta: 1,
      explicacion:
        "Si tú resultas herido no puedes ayudar a nadie. Evalúa el peligro (tráfico, fuego, cables) y protege la escena antes de acercarte.",
    },
    {
      id: "pa-13",
      enunciado: "Un estudiante tiene una crisis de asma. ¿Qué es correcto?",
      opciones: [
        "Acostarlo boca arriba",
        "Ayudarlo a sentarse, ligeramente inclinado hacia adelante, y a usar su propio inhalador",
        "Darle el inhalador de otro compañero",
        "Dejarlo solo para que se calme",
      ],
      correcta: 1,
      explicacion:
        "Sentado respira mejor. Se le ayuda a usar su propio inhalador y se llama al 123 si no mejora, le cuesta hablar o se pone azulado.",
    },
    {
      id: "pa-14",
      enunciado: "¿Cuándo llamas al 123 ante una convulsión?",
      opciones: [
        "Solo si la persona lo pide",
        "Nunca: pasan solas",
        "Si es la primera vez, dura más de 5 minutos o no recupera la conciencia",
        "Solo si ocurre de noche",
      ],
      correcta: 2,
      explicacion:
        "Una convulsión que dura más de 5 minutos, es la primera de la persona o no recupera la conciencia requiere atención médica urgente.",
    },
  ],

  "conduccion-defensiva": [
    {
      id: "cd-1",
      enunciado: "¿Cuál es la idea central de la conducción defensiva?",
      opciones: [
        "Conducir siempre al límite mínimo de velocidad",
        "Anticipar los errores de los demás y las condiciones de la vía para reaccionar a tiempo",
        "Evitar el uso de espejos retrovisores",
        "Conducir solo de día",
      ],
      correcta: 1,
      explicacion:
        "No se trata de ir más lento, sino de anticipar riesgos con atención constante a lo que hacen los demás y la vía.",
    },
    {
      id: "cd-2",
      enunciado: "¿Cada cuánto se recomienda revisar los espejos?",
      opciones: [
        "Solo antes de girar",
        "Cada 5-8 segundos",
        "Una vez cada 10 minutos",
        "No es necesario si vas en línea recta",
      ],
      correcta: 1,
      explicacion:
        "Revisar los espejos con frecuencia (cada 5-8 segundos) ayuda a detectar riesgos antes de que se conviertan en un problema.",
    },
    {
      id: "cd-3",
      enunciado: "¿Qué distancia de seguimiento se recomienda en condiciones normales?",
      opciones: ["1 segundo", "3 segundos", "10 segundos", "No importa la distancia si vas despacio"],
      correcta: 1,
      explicacion:
        "Se recomiendan al menos 3 segundos en condiciones normales, ampliándolos con mal clima o carga completa de pasajeros.",
    },
    {
      id: "cd-4",
      enunciado: "¿Por qué los puntos ciegos son más críticos en un bus que en un carro?",
      opciones: [
        "No lo son, son iguales",
        "Porque son más grandes, especialmente en los costados y detrás del vehículo",
        "Porque un bus no tiene espejos",
        "Porque solo importan en reversa",
      ],
      correcta: 1,
      explicacion:
        "El tamaño del bus genera puntos ciegos más amplios, por lo que revisar espejos con frecuencia es aún más importante.",
    },
  ],

  "mantenimiento-preventivo": [
    {
      id: "mp-1",
      enunciado: "¿Cuál es la diferencia entre mantenimiento preventivo y correctivo?",
      opciones: [
        "No hay diferencia",
        "El preventivo se hace antes de la falla; el correctivo, después de que ya ocurrió",
        "El correctivo es más barato",
        "El preventivo solo aplica a vehículos nuevos",
      ],
      correcta: 1,
      explicacion:
        "El preventivo evita fallas anticipándose según kilometraje o tiempo; el correctivo actúa una vez la falla ya se presentó, casi siempre en el peor momento.",
    },
    {
      id: "mp-2",
      enunciado: "¿Cuáles son puntos críticos a revisar en un bus?",
      opciones: [
        "Solo la pintura",
        "Frenos, llantas, niveles de aceite y refrigerante, luces y batería",
        "Solo el aire acondicionado",
        "Solo los asientos",
      ],
      correcta: 1,
      explicacion:
        "Estos componentes son los que con más frecuencia causan varadas o incidentes de seguridad si se descuidan.",
    },
    {
      id: "mp-3",
      enunciado: "¿Cuál es tu rol como conductor frente al mantenimiento?",
      opciones: [
        "Ninguno, es solo responsabilidad del taller",
        "Reportar a tiempo ruidos, vibraciones o testigos encendidos",
        "Reparar tú mismo cualquier falla mecánica",
        "Ignorar señales menores hasta la próxima revisión programada",
      ],
      correcta: 1,
      explicacion:
        "Sos quien primero detecta una anomalía; reportarla a tiempo evita que se convierta en una falla mayor o un accidente.",
    },
  ],

  "manejo-de-pasajeros": [
    {
      id: "mdp-1",
      enunciado: "¿Cuándo es seguro arrancar el bus tras una parada?",
      opciones: [
        "Apenas el último pasajero toca el andén",
        "Solo cuando las puertas están completamente cerradas y nadie está en tránsito de subir o bajar",
        "Cuando el pasajero lo indique",
        "No importa, siempre que se avise por el altavoz",
      ],
      correcta: 1,
      explicacion:
        "Arrancar con puertas abiertas o pasajeros en tránsito es una de las causas más comunes de accidentes en paradas.",
    },
    {
      id: "mdp-2",
      enunciado: "¿Cómo se debe conducir cuando hay pasajeros de pie?",
      opciones: [
        "Sin cambios, igual que siempre",
        "Con arrancadas y frenadas suaves para evitar caídas",
        "Más rápido para llegar antes",
        "Frenando bruscamente para 'avisar' que hay que sostenerse",
      ],
      correcta: 1,
      explicacion:
        "Los pasajeros de pie no tienen el mismo agarre que uno sentado; la suavidad al acelerar y frenar previene caídas.",
    },
    {
      id: "mdp-3",
      enunciado: "Ante un conflicto entre pasajeros mientras conducís, tu prioridad es...",
      opciones: [
        "Detener el bus y mediar en la discusión de inmediato",
        "Mantener la conducción segura, sin distraerte resolviendo el conflicto en movimiento",
        "Acelerar para llegar más rápido a la siguiente parada",
        "Ignorar completamente la situación",
      ],
      correcta: 1,
      explicacion:
        "La seguridad de la conducción es la prioridad; el conflicto se puede atender apropiadamente sin comprometer el manejo.",
    },
  ],

  "fatiga-y-somnolencia": [
    {
      id: "fs-1",
      enunciado: "¿Por qué la fatiga es tan peligrosa como el alcohol al conducir?",
      opciones: [
        "No lo es, es un mito",
        "Porque reduce igualmente tu capacidad de reacción y puede causar microsueños",
        "Solo afecta a conductores mayores de 60 años",
        "Solo es riesgosa de noche",
      ],
      correcta: 1,
      explicacion:
        "La fatiga reduce la reacción de forma comparable al alcohol, y puede producir microsueños de segundos sin previo aviso.",
    },
    {
      id: "fs-2",
      enunciado: "¿Cada cuánto se recomienda hacer una pausa activa en ruta?",
      opciones: [
        "Cada 30 minutos",
        "Cada 2 horas o 200 km de recorrido",
        "Solo al final del turno",
        "No son necesarias si tomás café",
      ],
      correcta: 1,
      explicacion:
        "Se recomienda una pausa de 5 a 10 minutos cada 2 horas o 200 km; la cafeína ayuda a corto plazo pero no reemplaza el descanso.",
    },
    {
      id: "fs-3",
      enunciado: "¿Cuál de estas es una señal de alerta de fatiga al volante?",
      opciones: [
        "Sentir hambre",
        "No recordar los últimos minutos de vía recorrida",
        "Ir por debajo del límite de velocidad",
        "Tener las manos frías",
      ],
      correcta: 1,
      explicacion:
        "No recordar tramos recientes de la vía, junto con párpados pesados y bostezos frecuentes, indica que ya estás en riesgo.",
    },
  ],

  // --- Temas nuevos del centro de aprendizaje (la clave es el slug del tema) ---

  "evacuacion-bus-escolar": [
    {
      id: "eb-1",
      enunciado: "Al evacuar un bus escolar, ¿quién guía a los niños?",
      opciones: [
        "Cada niño decide por su cuenta",
        "El conductor, mientras maneja",
        "El acompañante",
        "Los niños más grandes",
      ],
      correcta: 2,
      explicacion:
        "Salen primero los más cercanos a la salida y el acompañante guía a los niños, en orden y sin correr.",
    },
    {
      id: "eb-2",
      enunciado: "Terminada la evacuación, ¿dónde reúnes a todos?",
      opciones: [
        "Al lado del bus, sobre la vía",
        "Lejos del vehículo y de la vía",
        "Dentro del bus",
        "Cada uno donde prefiera",
      ],
      correcta: 1,
      explicacion:
        "Lejos del vehículo y del tráfico, para evitar un incendio, una explosión o un atropello.",
    },
    {
      id: "eb-3",
      enunciado: "Antes de dar por terminada la evacuación, ¿qué confirmas?",
      opciones: [
        "Que nadie quedó dentro: cuentas a los pasajeros",
        "Que el bus quedó cerrado con llave",
        "Que llegó la empresa",
        "Que nadie tome fotos",
      ],
      correcta: 0,
      explicacion: "Contar a los pasajeros es la única forma de asegurarte de que nadie quedó atrás.",
    },
    {
      id: "eb-4",
      enunciado: "¿Qué es una buena práctica de preparación?",
      opciones: [
        "Esperar a que ocurra para improvisar",
        "Guardar el martillo en la bodega",
        "Ensayar la evacuación de forma periódica",
        "Tapar las salidas de emergencia con equipaje",
      ],
      correcta: 2,
      explicacion:
        "Un plan ensayado evita el pánico. Además, las salidas de emergencia y el martillo deben estar libres y a mano.",
    },
  ],

  "conduccion-adversa": [
    {
      id: "ca-1",
      enunciado: "En un descenso largo de montaña, ¿qué es lo correcto?",
      opciones: [
        "Bajar en neutro para ahorrar combustible",
        "Usar cambios bajos y el freno motor",
        "Frenar a fondo durante todo el trayecto",
        "Apagar el motor",
      ],
      correcta: 1,
      explicacion:
        "El freno motor evita sobrecalentar los frenos. En neutro lo pierdes y dependes solo del pedal.",
    },
    {
      id: "ca-2",
      enunciado: "Con lluvia, ¿qué distancia de seguimiento se recomienda?",
      opciones: ["1 segundo", "3 segundos", "5 a 6 segundos", "Es la misma que con el pavimento seco"],
      correcta: 2,
      explicacion:
        "Con lluvia, niebla o pasajeros de pie se amplía de 3 a 5-6 segundos: el bus necesita más distancia para frenar.",
    },
    {
      id: "ca-3",
      enunciado: "Con niebla espesa y casi sin visibilidad, lo más prudente es:",
      opciones: [
        "Acelerar para salir pronto de la niebla",
        "Seguir muy de cerca al vehículo de adelante",
        "Detenerte en un lugar seguro y esperar a que mejore",
        "Apagar las luces para no encandilar",
      ],
      correcta: 2,
      explicacion: "Si casi no ves, detente en un lugar seguro. Con niebla se usan las luces bajas y se reduce la velocidad.",
    },
    {
      id: "ca-4",
      enunciado: "Antes de salir en un día de lluvia, ¿qué revisas?",
      opciones: [
        "Solo el radio",
        "Llantas, luces, frenos y limpiaparabrisas",
        "Solo el aire acondicionado",
        "Nada: todo se revisa en ruta",
      ],
      correcta: 1,
      explicacion: "Son los cuatro puntos que más influyen en la seguridad con pavimento mojado.",
    },
  ],

  "proteccion-de-menores": [
    {
      id: "pm-1",
      enunciado: "¿Puede prestarse el servicio de transporte escolar sin acompañante?",
      opciones: [
        "Sí, si la ruta es corta",
        "Sí, si el conductor tiene experiencia",
        "No: el servicio no puede prestarse sin acompañante",
        "Solo en la ruta de regreso",
      ],
      correcta: 2,
      explicacion: "El acompañante adulto es obligatorio: sin él no se presta el servicio.",
    },
    {
      id: "pm-2",
      enunciado: "En una ruta escolar, ¿cuántos niños pueden ocupar un mismo asiento?",
      opciones: ["Dos, si son pequeños", "Uno solo", "Tres", "Los que quepan"],
      correcta: 1,
      explicacion:
        "El número de estudiantes debe corresponder a los asientos disponibles: ningún asiento con más de un niño.",
    },
    {
      id: "pm-3",
      enunciado: "Al terminar la ruta, ¿qué haces antes de cerrar el bus?",
      opciones: [
        "Recorrerlo fila por fila para verificar que no quedó nadie",
        "Cerrarlo de inmediato",
        "Esperar a que la empresa llame",
        "Apagar las luces y salir",
      ],
      correcta: 0,
      explicacion: "Un niño dormido u oculto en un bus cerrado corre un riesgo grave. Revisar fila por fila lo evita.",
    },
    {
      id: "pm-4",
      enunciado: "¿Cuál NO es una conducta esperada de los niños a bordo?",
      opciones: [
        "Permanecer sentados",
        "Usar el cinturón",
        "Sacar los brazos por la ventana",
        "Seguir las indicaciones del acompañante",
      ],
      correcta: 2,
      explicacion: "Sacar la cabeza o los brazos por la ventana es peligroso: el acompañante debe evitarlo.",
    },
  ],

  "situaciones-dificiles": [
    {
      id: "sd-1",
      enunciado: "Un pasajero se pone agresivo. ¿Cuál es la mejor actitud?",
      opciones: [
        "Mantener un tono calmado pero firme y no responder a provocaciones",
        "Responder con el mismo tono",
        "Discutir hasta que se calme",
        "Subir el volumen de la radio",
      ],
      correcta: 0,
      explicacion:
        "La calma y la firmeza reducen la tensión. Tu prioridad sigue siendo conducir con seguridad; si hay riesgo, pide ayuda.",
    },
    {
      id: "sd-2",
      enunciado: "El bus falla en plena vía. ¿Qué haces primero?",
      opciones: [
        "Seguir hasta que llegue la grúa",
        "Encender las luces de emergencia y detenerlo en un lugar seguro",
        "Bajarte a revisar el motor sin señalizar",
        "Apagar todas las luces",
      ],
      correcta: 1,
      explicacion:
        "Luces de emergencia, lugar seguro, triángulos reflectivos y aviso a la empresa; si no es seguro permanecer, evacúa.",
    },
    {
      id: "sd-3",
      enunciado: "Hay una discusión entre pasajeros con el bus en movimiento. ¿Qué prima?",
      opciones: [
        "Resolver el conflicto de inmediato",
        "Terminar la ruta a la mayor velocidad",
        "La seguridad de la conducción",
        "Nada en particular",
      ],
      correcta: 2,
      explicacion: "Tu prioridad es conducir con seguridad, no resolver el conflicto mientras el bus está en movimiento.",
    },
    {
      id: "sd-4",
      enunciado: "¿Un horario justifica seguir manejando con una falla?",
      opciones: [
        "Sí, si vas atrasado",
        "Sí, si la falla parece pequeña",
        "Solo de noche",
        "No: ningún horario justifica manejar en condiciones inseguras",
      ],
      correcta: 3,
      explicacion: "Ninguna presión de tiempo justifica poner en riesgo a los pasajeros.",
    },
  ],

  "pesv-y-tu-rol": [
    {
      id: "pe-1",
      enunciado: "¿Qué paso del PESV corresponde a la inspección preoperacional diaria de vehículos?",
      opciones: ["Paso 16", "Paso 17", "Paso 5", "Paso 24"],
      correcta: 0,
      explicacion:
        "El Paso 16 es la «Inspección de vehículos y equipos». El Paso 17 es el mantenimiento y control de vehículos seguros.",
    },
    {
      id: "pe-2",
      enunciado: "¿A qué contribuye reportar a tiempo una falla o novedad?",
      opciones: [
        "A nada: es solo trámite",
        "Solo a la aseguradora",
        "Al plan de mantenimiento preventivo del PESV (Paso 17)",
        "Solo al taller",
      ],
      correcta: 2,
      explicacion: "Tus reportes alimentan el plan de mantenimiento y evitan que una falla pequeña se vuelva un accidente.",
    },
    {
      id: "pe-3",
      enunciado: "El PESV es una obligación de:",
      opciones: [
        "Cada conductor por separado",
        "La organización (la empresa), que cuenta contigo para ejecutarlo",
        "Solo del Ministerio de Transporte",
        "Solo de los pasajeros",
      ],
      correcta: 1,
      explicacion:
        "Lo deben diseñar e implementar las organizaciones obligadas; tu inspección diaria y tu conducta son parte de su ejecución.",
    },
  ],

  "ergonomia-y-salud": [
    {
      id: "es-1",
      enunciado: "¿Cada cuánto se recomienda una pausa en ruta?",
      opciones: [
        "Cada 2 horas o 200 km",
        "Cada 8 horas",
        "Solo al terminar el turno",
        "Nunca, mientras no sientas sueño",
      ],
      correcta: 0,
      explicacion: "Una pausa de 5 a 10 minutos cada 2 horas o 200 km: bájate, estírate y camina.",
    },
    {
      id: "es-2",
      enunciado: "Tienes dolor persistente en la espalda o el cuello. ¿Qué haces?",
      opciones: [
        "Lo normalizas: es normal en conductores",
        "Lo consultas con tu EPS o tu ARL",
        "Lo ignoras",
        "Lo tratas solo con cafeína",
      ],
      correcta: 1,
      explicacion: "El dolor persistente no se normaliza: una consulta a tiempo evita que se vuelva una lesión mayor.",
    },
    {
      id: "es-3",
      enunciado: "Una buena postura al volante implica:",
      opciones: [
        "Reclinarte casi acostado",
        "Estirar del todo las piernas",
        "Apoyar toda la espalda en el respaldo",
        "Subir el apoyacabezas por encima de tu cabeza",
      ],
      correcta: 2,
      explicacion:
        "Espalda apoyada, piernas sin estirar del todo, brazos ligeramente flexionados y apoyacabezas a la altura de la cabeza.",
    },
  ],

  "accidente-pas": [
    {
      id: "ap-1",
      enunciado: "En el protocolo PAS, ¿qué significa la «A»?",
      opciones: ["Alejar", "Avisar", "Ayudar", "Anotar"],
      correcta: 1,
      explicacion: "PAS = Proteger, Avisar y Socorrer.",
    },
    {
      id: "ap-2",
      enunciado: "Si solo hay daños materiales, antes de mover los vehículos conviene:",
      opciones: [
        "Irte del lugar",
        "Tomar fotos y videos de la posición final",
        "Discutir con el otro conductor",
        "Apagar el celular",
      ],
      correcta: 1,
      explicacion:
        "Documentar la posición final protege a todos. Después se retiran los vehículos para no interrumpir el tránsito.",
    },
    {
      id: "ap-3",
      enunciado: "Con un herido con posible lesión de cuello o espalda, ¿qué debes evitar?",
      opciones: [
        "Llamar al 123",
        "Moverlo sin necesidad",
        "Mantenerlo consciente hablándole",
        "Señalizar la escena",
      ],
      correcta: 1,
      explicacion: "No se mueve a un herido con posible lesión de columna salvo peligro inminente (fuego, tránsito).",
    },
  ],

  "eco-conduccion": [
    {
      id: "ec-1",
      enunciado: "Si vas a estar detenido más de un minuto, lo recomendable es:",
      opciones: [
        "Dejar el motor en marcha",
        "Apagar el motor",
        "Acelerar en vacío",
        "Mantener revoluciones altas",
      ],
      correcta: 1,
      explicacion: "Con el motor en marcha y el vehículo detenido se consume combustible sin avanzar.",
    },
    {
      id: "ec-2",
      enunciado: "¿Para qué se usa la primera marcha?",
      opciones: [
        "Para todo el recorrido urbano",
        "Solo para arrancar, pasando pronto a la siguiente",
        "Para subir cualquier pendiente",
        "No se usa",
      ],
      correcta: 1,
      explicacion: "La primera es de arranque: mantenerla de más eleva el consumo y el desgaste.",
    },
    {
      id: "ec-3",
      enunciado: "¿Cuál es un hábito de conducción eficiente?",
      opciones: [
        "Acelerones y frenazos",
        "Circular con las llantas desinfladas",
        "Ir siempre en cambios cortos",
        "Mantener velocidad constante y anticipar el tráfico",
      ],
      correcta: 3,
      explicacion:
        "Anticipar evita frenar de más, y una velocidad constante con llantas bien infladas reduce el consumo.",
    },
  ],

  inspeccion: [
    {
      id: "inspeccion-1",
      enunciado: "Si los frenos se sienten esponjosos durante la prueba preoperacional, ¿qué debes hacer?",
      opciones: [
        "Salir a ruta y estar pendiente",
        "Marcarlos como fuera de servicio y no sacar el bus hasta revisarlos",
        "Marcarlos como correctos si frenan, aunque sea despacio",
        "Ignorarlo si es la primera vez que pasa",
      ],
      correcta: 1,
      explicacion:
        "Los frenos son un componente crítico (semáforo rojo): cualquier señal de falla obliga a marcarlo fuera de servicio y detener la operación hasta corregirlo.",
    },
    {
      id: "inspeccion-2",
      enunciado: "¿Qué porcentaje de cumplimiento calcula la inspección diaria?",
      opciones: [
        "El promedio de los componentes marcados como correctos",
        "Un número fijo que no depende de lo marcado",
        "Solo si hay novedades reportadas",
        "El tiempo que tardó la inspección",
      ],
      correcta: 0,
      explicacion:
        "El porcentaje es la proporción de componentes correctos sobre el total revisado; se calcula y se congela en el momento de finalizar el acta.",
    },
    {
      id: "inspeccion-3",
      enunciado: "El extintor y el botiquín, ¿en qué se sustentan legalmente dentro de la app?",
      opciones: [
        "En una opinión del fabricante del bus",
        "En la Ley 769 de 2002 (Art. 30) y la metodología PESV de la Res. 40595 de 2022",
        "No tienen sustento legal, son solo buena práctica",
        "En el manual del conductor de la empresa",
      ],
      correcta: 1,
      explicacion:
        "El equipo de carretera (gato, señales, botiquín, extintor, herramientas) cita textualmente el Art. 30 del Código Nacional de Tránsito y el Paso 16/17 del PESV.",
    },
    {
      id: "inspeccion-4",
      enunciado: "Una vez finalizada (firmada) una inspección, ¿se puede editar?",
      opciones: [
        "Sí, cualquier conductor puede corregirla después",
        "No: el acta queda inmutable y solo se reporta una novedad nueva si aparece un problema",
        "Solo el mismo día en que se hizo",
        "Sí, pero solo el administrador",
      ],
      correcta: 1,
      explicacion:
        "Una inspección finalizada es un acta con valor probatorio: la base de datos la bloquea para edición o borrado, incluso para el panel de administración.",
    },
  ],
};

export function obtenerEvaluacion(clave: string): Pregunta[] {
  return evaluaciones[clave] ?? [];
}
