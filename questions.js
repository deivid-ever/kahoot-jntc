'use strict';

// Banco de 100 preguntas. Formato: [enunciado, [A, B, C, D], índice correcto (0=A, 1=B, 2=C, 3=D)]

const CATEGORIES = {
  quimica: 'Química',
  fisica: 'Matemáticas y Física',
  ingenieria: 'Ingeniería Química',
  ambiente: 'Medio Ambiente',
  ciencia: 'Ciencia y Tecnología'
};

// Bloque 1: Química básica (1 a 20)
const B1 = [
  ['¿Cuál es la fórmula química del agua?', ['CO₂', 'H₂O', 'O₂', 'NaCl'], 1],
  ['¿Cuál es el símbolo químico del oxígeno?', ['Ox', 'O', 'Og', 'Om'], 1],
  ['¿Cuál de los siguientes es un elemento químico?', ['Agua', 'Sal', 'Hierro', 'Azúcar'], 2],
  ['¿Qué partícula subatómica tiene carga negativa?', ['Protón', 'Neutrón', 'Electrón', 'Núcleo'], 2],
  ['¿Cuál es el símbolo químico del oro?', ['Or', 'Au', 'Ag', 'Go'], 1],
  ['¿Qué representa el número atómico de un elemento?', ['El número de protones', 'El número de neutrones', 'La suma de protones y neutrones', 'El número de moléculas'], 0],
  ['¿Cuál de los siguientes es un cambio físico?', ['Quemar madera', 'Oxidar hierro', 'Derretir hielo', 'Cocinar un huevo'], 2],
  ['¿Cuál es la fórmula química del dióxido de carbono?', ['CO', 'CO₂', 'C₂O', 'O₂C₂'], 1],
  ['¿Qué tipo de mezcla se forma al disolver sal completamente en agua?', ['Heterogénea', 'Homogénea', 'Suspensión', 'Emulsión'], 1],
  ['¿Cuál de las siguientes sustancias es una base?', ['Ácido clorhídrico', 'Ácido sulfúrico', 'Hidróxido de sodio', 'Ácido acético'], 2],
  ['¿Qué mide principalmente el pH de una solución?', ['Su densidad', 'Su acidez o basicidad', 'Su masa', 'Su temperatura'], 1],
  ['¿Cuál de estos elementos es líquido a temperatura ambiente?', ['Hierro', 'Mercurio', 'Aluminio', 'Cobre'], 1],
  ['¿Cuál es el símbolo químico del sodio?', ['S', 'So', 'Na', 'Sd'], 2],
  ['¿Qué gas necesita principalmente el cuerpo humano para la respiración celular aeróbica?', ['Nitrógeno', 'Oxígeno', 'Hidrógeno', 'Helio'], 1],
  ['¿Cuál es el principal componente del aire seco?', ['Oxígeno', 'Dióxido de carbono', 'Nitrógeno', 'Hidrógeno'], 2],
  ['¿Cuál de las siguientes sustancias es una molécula?', ['H₂O', 'Fe', 'Cu', 'Na'], 0],
  ['¿Qué se forma generalmente cuando reaccionan un ácido y una base?', ['Una sal y agua', 'Oxígeno e hidrógeno', 'Un metal y un gas', 'Únicamente agua'], 0],
  ['¿Cuál es la unidad del Sistema Internacional para la cantidad de sustancia?', ['Kilogramo', 'Litro', 'Mol', 'Newton'], 2],
  ['¿Cuál de los siguientes materiales es un buen conductor de la electricidad?', ['Madera seca', 'Cobre', 'Plástico', 'Caucho'], 1],
  ['¿Cómo se llama el cambio de estado de líquido a gas?', ['Condensación', 'Solidificación', 'Vaporización', 'Sublimación'], 2]
];

// Bloque 2: Matemáticas, física y laboratorio (21 a 40)
const B2 = [
  ['¿Cuánto es el 25 % de 200?', ['25', '40', '50', '75'], 2],
  ['¿Cuál es la unidad del Sistema Internacional para la fuerza?', ['Joule', 'Newton', 'Pascal', 'Watt'], 1],
  ['¿Qué instrumento se utiliza para medir la temperatura?', ['Barómetro', 'Termómetro', 'Balanza', 'Probeta'], 1],
  ['¿Cuál es la unidad del Sistema Internacional para la presión?', ['Pascal', 'Newton', 'Joule', 'Kilogramo'], 0],
  ['Un objeto recorre 100 metros en 20 segundos. ¿Cuál es su rapidez promedio?', ['2 m/s', '5 m/s', '10 m/s', '20 m/s'], 1],
  ['¿Cuántos mililitros hay en un litro?', ['10 mL', '100 mL', '1.000 mL', '10.000 mL'], 2],
  ['¿Cuál es la unidad del Sistema Internacional para la energía?', ['Joule', 'Watt', 'Pascal', 'Newton'], 0],
  ['¿Qué instrumento se utiliza para medir la masa de una sustancia?', ['Termómetro', 'Balanza', 'Manómetro', 'Cronómetro'], 1],
  ['¿Cuánto es 3² + 4²?', ['12', '25', '49', '7'], 1],
  ['¿Cuál es la unidad del Sistema Internacional para la potencia?', ['Watt', 'Joule', 'Pascal', 'Mol'], 0],
  ['Si se disuelven 10 gramos de sal en 100 gramos de solución, ¿cuál es el porcentaje en masa de sal?', ['1 %', '5 %', '10 %', '20 %'], 2],
  ['¿Cómo se define la densidad?', ['Masa dividida entre volumen', 'Volumen dividido entre tiempo', 'Fuerza dividida entre área', 'Distancia dividida entre tiempo'], 0],
  ['¿Qué instrumento se utiliza para medir la presión de un fluido?', ['Calorímetro', 'Manómetro', 'Termómetro', 'Dinamómetro'], 1],
  ['¿A qué temperatura se congela el agua pura a presión atmosférica normal?', ['0 °C', '10 °C', '50 °C', '100 °C'], 0],
  ['¿Qué suele ocurrir con la mayoría de los materiales cuando aumenta su temperatura?', ['Siempre se congelan', 'Se expanden', 'Desaparecen', 'Pierden toda su masa'], 1],
  ['¿Qué tipo de energía está asociada al movimiento de un cuerpo?', ['Potencial química', 'Cinética', 'Nuclear', 'Eléctrica estática'], 1],
  ['¿Cuántos gramos equivalen a 2,5 kilogramos?', ['25 g', '250 g', '2.500 g', '25.000 g'], 2],
  ['Si encuentras un reactivo desconocido en el laboratorio, ¿qué debes hacer?', ['Olerlo para identificarlo', 'Mezclarlo con agua', 'Revisar su etiqueta, consultar la ficha de seguridad y avisar al responsable', 'Desecharlo por el desagüe'], 2],
  ['¿Para qué sirven las unidades de medida?', ['Para expresar cuantitativamente una magnitud', 'Para cambiar la naturaleza de una sustancia', 'Para eliminar errores experimentales', 'Para determinar únicamente la masa'], 0],
  ['¿Qué establece el principio de conservación de la energía?', ['La energía no se crea ni se destruye, solo se transforma', 'La energía siempre aumenta', 'La energía desaparece en los procesos industriales', 'La energía solo existe en los cuerpos en movimiento'], 0]
];

// Bloque 3: Ingeniería química y procesos industriales (41 a 60)
const B3 = [
  ['¿Cuál es uno de los principales objetivos de la Ingeniería Química?', ['Estudiar exclusivamente organismos vivos', 'Diseñar y optimizar procesos de transformación de materiales', 'Construir únicamente edificios', 'Analizar solamente circuitos eléctricos'], 1],
  ['¿Qué es una materia prima?', ['Un producto terminado', 'Un material utilizado para fabricar un producto', 'Un residuo sin utilidad', 'Un equipo de medición'], 1],
  ['¿Qué es una operación unitaria?', ['Una etapa de un proceso industrial basada principalmente en un fenómeno físico', 'Una reacción química exclusivamente', 'Una herramienta de laboratorio', 'Una unidad de temperatura'], 0],
  ['¿Qué equipo permite transferir calor entre dos fluidos?', ['Intercambiador de calor', 'Compresor', 'Filtro', 'Molino'], 0],
  ['¿Cuál es la función principal de una bomba?', ['Disminuir la temperatura de un sólido', 'Impulsar líquidos y proporcionarles energía mecánica', 'Medir la concentración de una solución', 'Separar gases por tamaño molecular'], 1],
  ['¿Cuál es la función de una válvula en un proceso industrial?', ['Controlar o interrumpir el flujo de un fluido', 'Medir la masa de una sustancia', 'Aumentar siempre la temperatura', 'Separar sólidos por filtración'], 0],
  ['¿Qué operación permite separar sólidos insolubles de un líquido mediante un medio poroso?', ['Destilación', 'Filtración', 'Evaporación', 'Absorción'], 1],
  ['¿Qué operación se utiliza comúnmente para separar líquidos miscibles con diferentes volatilidades?', ['Trituración', 'Filtración', 'Destilación', 'Tamizado'], 2],
  ['¿Qué función cumple un catalizador?', ['Modifica la velocidad de una reacción sin consumirse globalmente', 'Siempre aumenta la cantidad de producto en el equilibrio', 'Se convierte necesariamente en el producto principal', 'Elimina la necesidad de reactivos'], 0],
  ['¿Qué caracteriza a un proceso continuo?', ['Solo funciona una vez', 'La alimentación y la salida ocurren continuamente durante la operación', 'No utiliza materias primas', 'No necesita control'], 1],
  ['¿Qué representa un balance de materia?', ['El cálculo exclusivo de temperaturas', 'La contabilidad de entradas, salidas y acumulación de materia', 'La medición de la presión atmosférica', 'El cálculo de la velocidad de reacción únicamente'], 1],
  ['En un sistema no reactivo en estado estacionario, sin acumulación, ¿qué relación existe entre la entrada y la salida total de masa?', ['La masa de entrada es igual a la masa de salida', 'La masa de entrada siempre es mayor', 'La masa de salida siempre es mayor', 'No existe relación entre ambas'], 0],
  ['¿Qué equipo se utiliza para reducir el tamaño de partículas sólidas?', ['Molino', 'Condensador', 'Bomba', 'Compresor'], 0],
  ['¿Cuál es la función principal de un evaporador?', ['Aumentar el tamaño de las partículas', 'Concentrar una solución mediante la vaporización de parte del solvente', 'Medir el caudal de un líquido', 'Disminuir la presión de un sólido'], 1],
  ['¿Qué representa el caudal volumétrico?', ['La masa por unidad de volumen', 'El volumen de fluido que pasa por una sección por unidad de tiempo', 'La fuerza por unidad de área', 'La energía por unidad de masa'], 1],
  ['¿Qué equipo se utiliza para aumentar la presión de un gas?', ['Compresor', 'Filtro', 'Tanque de almacenamiento sin compresión', 'Tamiz'], 0],
  ['¿Qué significa la sigla EPP en seguridad industrial?', ['Equipo de Protección Personal', 'Evaluación de Procesos Petroquímicos', 'Energía por Presión Promedio', 'Estudio de Producción Primaria'], 0],
  ['¿Qué información presenta principalmente un diagrama de flujo de proceso (PFD)?', ['La decoración de una planta industrial', 'Los equipos principales y las corrientes del proceso', 'Únicamente las instalaciones eléctricas', 'Solo la ubicación de las oficinas'], 1],
  ['¿Qué instrumento permite medir la temperatura en un proceso industrial?', ['Sensor de temperatura', 'Válvula de retención', 'Bomba centrífuga', 'Filtro prensa'], 0],
  ['¿Cuál es el objetivo del tratamiento de aguas residuales?', ['Aumentar su contaminación', 'Reducir los contaminantes para permitir su descarga o reutilización según los requisitos aplicables', 'Convertir toda el agua en vapor', 'Añadir siempre más sólidos al agua'], 1]
];

// Bloque 4: Medio ambiente y seguridad (61 a 80)
const B4 = [
  ['¿Qué gas absorben las plantas durante la fotosíntesis?', ['Helio', 'Dióxido de carbono', 'Hidrógeno', 'Metano exclusivamente'], 1],
  ['¿Cuál de las siguientes es una fuente de energía renovable?', ['Carbón mineral', 'Petróleo', 'Energía solar', 'Gas natural'], 2],
  ['¿Qué es la corrosión?', ['El deterioro de un material por su interacción con el entorno', 'La separación de líquidos por destilación', 'La transformación de líquido en gas', 'El aumento de masa de una sustancia por calentamiento'], 0],
  ['¿Qué debes hacer al manipular una sustancia corrosiva?', ['Utilizar los EPP adecuados y consultar su ficha de seguridad', 'Manipularla sin protección', 'Mezclarla con cualquier sustancia', 'Guardarla en un recipiente sin etiqueta'], 0],
  ['¿Qué significa reciclar?', ['Desechar todos los materiales', 'Procesar materiales usados para aprovecharlos nuevamente', 'Quemar todos los residuos', 'Mezclar residuos peligrosos con residuos comunes'], 1],
  ['¿Qué significa que una sustancia sea inflamable?', ['Que puede encenderse y arder bajo determinadas condiciones', 'Que nunca reacciona', 'Que siempre está en estado gaseoso', 'Que no puede liberar energía'], 0],
  ['¿Qué representa la huella de carbono?', ['La cantidad de agua consumida por una persona', 'Las emisiones de gases de efecto invernadero asociadas a una actividad, producto o entidad', 'La masa de carbono de un equipo', 'La cantidad de oxígeno presente en el aire'], 1],
  ['¿Cuál de los siguientes es un gas de efecto invernadero?', ['Dióxido de carbono', 'Argón', 'Neón', 'Helio'], 0],
  ['¿Qué ocurre en una reacción exotérmica?', ['Se absorbe calor del entorno', 'Se libera calor al entorno', 'No existe intercambio de energía', 'La materia deja de conservarse'], 1],
  ['¿Qué ocurre en un proceso endotérmico?', ['El sistema absorbe calor', 'El sistema siempre libera calor', 'La temperatura siempre permanece constante', 'No existe transferencia de energía'], 0],
  ['¿Cuál es el uso de un extintor?', ['Medir la presión', 'Controlar o extinguir un incendio incipiente cuando sea seguro hacerlo', 'Enfriar cualquier equipo industrial sin restricciones', 'Limpiar derrames químicos de cualquier tipo'], 1],
  ['Si ocurre un derrame de un reactivo desconocido en el laboratorio, ¿qué debes hacer?', ['Limpiarlo sin protección', 'Echarle agua inmediatamente', 'Alertar al responsable y seguir el protocolo de emergencia', 'Ignorarlo si la cantidad parece pequeña'], 2],
  ['¿Qué es la biodegradabilidad?', ['La capacidad de una sustancia para descomponerse mediante procesos biológicos', 'La capacidad de una sustancia para resistir cualquier cambio', 'La facilidad con la que un material conduce electricidad', 'La capacidad de un material para soportar presión'], 0],
  ['¿Qué significa eficiencia energética?', ['Utilizar más energía para obtener el mismo resultado', 'Obtener un resultado utilizando menos energía', 'Eliminar toda forma de energía', 'Aumentar siempre el consumo eléctrico'], 1],
  ['¿Cuál es el objetivo de la potabilización del agua?', ['Hacer que el agua sea apta para el consumo humano', 'Aumentar su concentración de contaminantes', 'Convertirla necesariamente en agua destilada', 'Eliminar todos los minerales sin excepción'], 0],
  ['¿Qué organismos desempeñan un papel importante en muchos procesos biológicos de tratamiento de aguas residuales?', ['Bacterias', 'Rocas', 'Metales', 'Plásticos'], 0],
  ['¿Qué propone la economía circular?', ['Aumentar la generación de residuos', 'Reducir residuos y mantener materiales y productos en uso durante más tiempo', 'Desechar todos los productos después de utilizarlos una vez', 'Sustituir todos los materiales por combustibles fósiles'], 1],
  ['¿Qué significa que una sustancia sea tóxica?', ['Que puede causar efectos perjudiciales en un organismo bajo determinadas condiciones de exposición', 'Que siempre es inofensiva', 'Que necesariamente es inflamable', 'Que no puede entrar en contacto con otros materiales'], 0],
  ['¿Cuál es una buena práctica para reducir riesgos asociados a los residuos de laboratorio?', ['Mezclar todos los residuos en un mismo recipiente', 'Separarlos según su tipo y peligrosidad', 'Verterlos todos por el desagüe', 'Guardarlos en recipientes sin identificar'], 1],
  ['¿Qué significa desarrollo sostenible?', ['Satisfacer las necesidades actuales sin comprometer la capacidad de las futuras generaciones', 'Utilizar todos los recursos disponibles sin restricciones', 'Priorizar exclusivamente el crecimiento industrial', 'Evitar toda actividad económica'], 0]
];

// Bloque 5: Ciencia, tecnología e Ingeniería Química avanzada (81 a 100)
const B5 = [
  ['¿Cuántos elementos químicos se reconocen actualmente en la tabla periódica?', ['92', '100', '118', '150'], 2],
  ['¿Cuál es el elemento más abundante del universo?', ['Oxígeno', 'Hidrógeno', 'Carbono', 'Hierro'], 1],
  ['¿Cuál es la fórmula química del metano?', ['CH₄', 'C₂H₆', 'CO₂', 'H₂O'], 0],
  ['¿Cuál es el componente principal del gas natural?', ['Metano', 'Oxígeno', 'Nitrógeno líquido', 'Dióxido de carbono exclusivamente'], 0],
  ['¿Qué industria transforma el petróleo crudo en combustibles y otras fracciones comerciales?', ['Industria de refinación del petróleo', 'Industria textil exclusivamente', 'Industria farmacéutica exclusivamente', 'Industria papelera'], 0],
  ['¿Qué es un polímero?', ['Una sustancia formada por unidades moleculares repetidas', 'Un elemento químico que siempre es metálico', 'Un tipo de bomba industrial', 'Una unidad de presión'], 0],
  ['¿Cuál de los siguientes es un polímero de uso común?', ['Polietileno', 'Oxígeno', 'Hierro puro', 'Cloruro de sodio'], 0],
  ['¿Qué estudia la estequiometría?', ['Las relaciones cuantitativas entre reactivos y productos de una reacción química', 'La forma de los equipos industriales exclusivamente', 'La velocidad de los fluidos sin considerar su composición', 'La resistencia eléctrica de los metales'], 0],
  ['En la reacción balanceada 2H₂ + O₂ → 2H₂O, ¿cuántos moles de agua se producen al reaccionar 2 moles de hidrógeno con suficiente oxígeno?', ['1 mol', '2 moles', '3 moles', '4 moles'], 1],
  ['¿Qué significa balancear una ecuación química?', ['Igualar las masas de los reactivos y las temperaturas de los productos', 'Asegurar que haya el mismo número de átomos de cada elemento en ambos lados', 'Hacer que todos los coeficientes sean iguales a uno', 'Eliminar los reactivos sobrantes de la ecuación'], 1],
  ['¿Qué ley describe la relación inversa entre presión y volumen de un gas ideal a temperatura constante?', ['Ley de Boyle', 'Ley de Charles', 'Ley de Avogadro', 'Ley de conservación de la masa'], 0],
  ['Si el volumen de un gas ideal disminuye y la temperatura permanece constante, ¿qué ocurre con su presión?', ['Disminuye necesariamente', 'Aumenta', 'Permanece siempre en cero', 'El gas deja de ejercer presión'], 1],
  ['¿Qué instrumento permite observar células y microorganismos que no se distinguen a simple vista?', ['Telescopio', 'Microscopio', 'Barómetro', 'Calibrador'], 1],
  ['¿Cuál es uno de los objetivos principales de la investigación científica?', ['Confirmar todas las ideas sin cuestionarlas', 'Generar conocimiento mediante observación, análisis y evidencia', 'Evitar la experimentación', 'Reemplazar las mediciones por opiniones'], 1],
  ['¿Qué significa optimizar un proceso industrial?', ['Mejorar su desempeño según objetivos y restricciones, como costo, calidad, seguridad o consumo energético', 'Aumentar siempre la cantidad de materias primas utilizadas', 'Eliminar todos los instrumentos de control', 'Operar sin medir los resultados'], 0],
  ['¿Qué es la automatización industrial?', ['El uso de sistemas de control para operar procesos con menor intervención manual', 'La eliminación de todos los equipos eléctricos', 'La fabricación exclusivamente manual de productos', 'El almacenamiento de materias primas sin control'], 0],
  ['¿Qué es la inteligencia artificial?', ['Un campo de la informática que desarrolla sistemas capaces de realizar tareas asociadas con capacidades inteligentes', 'Un tipo de combustible fósil', 'Una operación unitaria de separación', 'Un método exclusivo para medir temperatura'], 0],
  ['¿Cómo puede contribuir la Ingeniería Química a la industria alimentaria?', ['Diseñando y mejorando procesos de transformación, conservación y procesamiento de alimentos', 'Eliminando la necesidad de controlar la calidad', 'Sustituyendo todos los alimentos por productos químicos peligrosos', 'Evitando cualquier proceso de conservación'], 0],
  ['¿Qué magnitud representa la unidad kg/s?', ['Caudal volumétrico', 'Caudal másico', 'Presión', 'Densidad'], 1],
  ['Una planta industrial presenta un consumo energético elevado y genera muchos residuos. ¿Cuál sería una de las mejores primeras acciones de un ingeniero químico?', ['Aumentar la producción sin revisar el proceso', 'Ignorar las pérdidas de energía', 'Analizar el proceso para identificar oportunidades de reducir el consumo y los residuos', 'Eliminar los controles de operación'], 2]
];

const QUESTIONS = [];
[['quimica', B1], ['fisica', B2], ['ingenieria', B3], ['ambiente', B4], ['ciencia', B5]].forEach(([c, block]) => {
  block.forEach(r => QUESTIONS.push({ c, q: r[0], o: r[1], a: r[2] }));
});

if (QUESTIONS.length !== 100 || QUESTIONS.some(x => x.o.length !== 4 || x.a < 0 || x.a > 3)) {
  throw new Error('Banco de preguntas inválido: se esperaban 100 preguntas con 4 opciones cada una');
}

// Tema visual acorde a cada una de las 100 preguntas (en el mismo orden de B1 a B5)
const IMG_TOPICS = [
  // B1: Química (1-20)
  'Agua', 'Oxígeno', 'Hierro', 'Átomo', 'Oro',
  'Tabla_periódica_de_los_elementos', 'Hielo', 'Dióxido_de_carbono', 'Sal_común', 'Hidróxido_de_sodio',
  'PH', 'Mercurio_(elemento)', 'Sodio', 'Pulmón', 'Nitrógeno',
  'Molécula', 'Matraz_de_Erlenmeyer', 'Laboratorio_de_química', 'Cobre', 'Vapor_de_agua',
  // B2: Matemáticas y Física (21-40)
  'Calculadora', 'Isaac_Newton', 'Termómetro', 'Barómetro', 'Velocímetro',
  'Probeta_(química)', 'Rayo', 'Balanza_analítica', 'Teorema_de_Pitágoras', 'Turbina_eólica',
  'Vaso_de_precipitados', 'Densidad', 'Manómetro', 'Copo_de_nieve', 'Puente',
  'Montaña_rusa', 'Kilogramo', 'Pictograma_de_peligro', 'Regla_graduada', 'Péndulo_de_Newton',
  // B3: Ingeniería Química (41-60)
  'Planta_química', 'Petróleo', 'Columna_de_destilación', 'Intercambiador_de_calor', 'Bomba_centrífuga',
  'Válvula', 'Filtración', 'Destilación', 'Catálisis', 'Refinería_de_petróleo',
  'Diagrama_de_flujo_de_proceso', 'Tubería', 'Molino_de_bolas', 'Evaporador', 'Caudalímetro',
  'Compresor_(máquina)', 'Equipo_de_protección_individual', 'Ingeniería_química', 'Termopar', 'Estación_depuradora_de_aguas_residuales',
  // B4: Medio Ambiente y Seguridad (61-80)
  'Fotosíntesis', 'Energía_solar', 'Corrosión', 'Gafas_de_seguridad', 'Reciclaje',
  'Fuego', 'Efecto_invernadero', 'Atmósfera_terrestre', 'Combustión', 'Glaciar',
  'Extintor', 'Bioseguridad', 'Compost', 'Lámpara_led', 'Agua_potable',
  'Bacteria', 'Economía_circular', 'Toxicidad', 'Residuo_peligroso', 'Desarrollo_sostenible',
  // B5: Ciencia y Tecnología (81-100)
  'Tabla_periódica_de_los_elementos', 'Nebulosa', 'Metano', 'Gas_natural', 'Refinería',
  'Polímero', 'Polietileno', 'Reacción_química', 'Electrólisis_del_agua', 'Ecuación_química',
  'Jeringa', 'Globo_aerostático', 'Microscopio', 'Científico', 'Sala_de_control',
  'Robot_industrial', 'Inteligencia_artificial', 'Industria_alimentaria', 'Báscula', 'Panel_solar'
];

QUESTIONS.forEach((q, i) => { q.topic = IMG_TOPICS[i] || CATEGORIES[q.c]; });

// Numeración oficial 1-100 del documento "Preguntas por ronda" (coincide con el
// orden del banco: pregunta n está en QUESTIONS[n - 1]).
QUESTIONS.forEach((q, i) => { q.num = i + 1; });
const QUESTION_BY_NUM = new Map(QUESTIONS.map(q => [q.num, q]));

// ===================== Fases / brackets del concurso =====================
// Reproduce el reglamento: Fase 1 clasificatoria por equipos (2 tandas de 8),
// Fase 2 semifinal por equipos (8), Fase 3 ronda individual (6) y Fase 4 gran
// final (5). Cada fase trae además un banco de "reserva" (del mismo documento)
// para generar tandas adicionales si se forman más equipos de los previstos,
// o para una pregunta de desempate.
const ROUNDS = {
  fase1: {
    label: 'Fase 1 · Clasificatoria por equipos',
    mode: 'equipos',
    perTanda: 8,
    tandas: [
      [1, 2, 23, 28, 34, 26, 61, 62],
      [3, 4, 5, 8, 12, 13, 19, 20]
    ],
    reserve: [7, 14, 15, 21, 35, 37, 65, 68, 93, 11, 16, 29, 36, 57, 75, 81, 82, 83, 84]
  },
  fase2: {
    label: 'Fase 2 · Semifinal por equipos',
    mode: 'equipos',
    perTanda: 8,
    tandas: [
      [6, 9, 10, 17, 18, 22, 24, 25]
    ],
    reserve: [27, 30, 32, 33, 38, 39, 40, 63, 64, 66, 67, 71, 72, 73, 74, 78, 79]
  },
  fase3: {
    label: 'Fase 3 · Ronda individual',
    mode: 'individual',
    perTanda: 6,
    tandas: [
      [41, 43, 44, 45, 47, 48]
    ],
    reserve: [42, 46, 53, 56, 59, 60, 69, 70, 76, 77, 80, 85, 86, 87]
  },
  fase4: {
    label: 'Fase 4 · Gran Final',
    mode: 'individual',
    perTanda: 5,
    tandas: [
      [52, 49, 89, 91, 100]
    ],
    reserve: [88, 90, 92, 94, 95, 96, 97, 98, 99, 50, 51, 54, 55, 58, 31]
  }
};

module.exports = { CATEGORIES, QUESTIONS, QUESTION_BY_NUM, ROUNDS };
