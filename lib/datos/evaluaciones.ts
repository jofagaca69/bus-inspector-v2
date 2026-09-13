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
};

export function obtenerEvaluacion(clave: string): Pregunta[] {
  return evaluaciones[clave] ?? [];
}
