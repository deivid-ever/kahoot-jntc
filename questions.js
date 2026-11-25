'use strict';

// Banco de 100 preguntas. Formato: [enunciado, [A, B, C, D], índice correcto (0=A, 1=B, 2=C, 3=D), categoría opcional]
// Si la fila no trae categoría, hereda la del bloque. Las 40 preguntas de las Fases 3 y 4 (Balance de Energía)
// ocupan las posiciones que listan ROUNDS.fase3 y ROUNDS.fase4, y traen su propia categoría.

const CATEGORIES = {
  quimica: 'Química',
  fisica: 'Matemáticas y Física',
  ingenieria: 'Ingeniería Química',
  ambiente: 'Medio Ambiente',
  ciencia: 'Ciencia y Tecnología',
  // Categorías propias de las Fases 3 y 4 (Olimpiadas de Balance de Energía)
  termodinamica: 'Termodinámica y Primera Ley',
  calor: 'Calor y Propiedades Térmicas',
  transferencia: 'Transferencia de Calor',
  reacciones: 'Energía y Reacciones Químicas',
  balance: 'Balance Exprés'
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
  ['En un balance de energía para sistemas abiertos, ¿por qué se utiliza la entalpía en lugar de la energía interna para las corrientes de entrada y salida?', ['Porque incluye el trabajo de flujo (PV) de las corrientes que entran y salen', 'Porque no depende de la temperatura', 'Porque la energía interna no es una propiedad del fluido', 'Porque siempre permanece constante en el sistema'], 0, 'termodinamica'],
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
  ['En un proceso adiabático:', ['No hay transferencia de calor', 'No hay trabajo realizado', 'La energía interna permanece constante', 'La entropía siempre disminuye'], 0, 'termodinamica'],
  ['¿Cuál de los siguientes es un ejemplo de energía química?', ['Energía almacenada en enlaces moleculares', 'Energía debida a la posición en un campo gravitatorio', 'Energía del movimiento de un cuerpo', 'Energía asociada a campos eléctricos'], 0, 'reacciones'],
  ['En un intercambiador de calor, la energía se transfiere principalmente por:', ['Radiación', 'Convección y conducción', 'Ionización', 'Trabajo de flujo'], 1, 'transferencia'],
  ['Un proceso isotérmico ocurre a:', ['Presión constante', 'Temperatura constante', 'Entropía constante', 'Volumen constante'], 1, 'termodinamica'],
  ['La conducción de calor depende principalmente de:', ['Diferencias de concentración', 'Gradiente de temperatura', 'Temperatura constante', 'Variaciones de presión'], 1, 'transferencia'],
  ['En un reactor químico, la energía liberada o absorbida por la reacción se denomina:', ['Energía interna', 'Calor de reacción', 'Trabajo de expansión', 'Calor específico'], 1, 'reacciones'],
  ['El calor latente es:', ['Energía asociada a un aumento de temperatura', 'Energía liberada o absorbida durante un cambio de fase', 'Energía asociada a enlaces químicos', 'Energía asociada a gradientes de presión'], 1, 'calor'],
  ['Cuando dos cuerpos se encuentran en equilibrio térmico:', ['No hay transferencia neta de calor entre ellos', 'Sus temperaturas cambian continuamente', 'El calor siempre fluye hacia el más frío', 'El cuerpo más caliente absorbe calor'], 0, 'termodinamica'],
  ['En un proceso isocórico, el calor transferido se asocia con cambios de:', ['Entalpía', 'Trabajo de expansión', 'Energía interna', 'Temperatura del entorno'], 2, 'termodinamica'],
  ['En un intercambiador de calor se enfrían 2 kg/s de aceite (Cp = 2,0 kJ/kg·°C) de 150 °C a 90 °C usando agua que entra a 25 °C y sale a 55 °C. Calcula el flujo másico de agua requerido, suponiendo que no hay pérdidas de calor al ambiente. Dato: Cp del agua = 4,18 kJ/kg·°C.', ['1,91 kg/s', '0,88 kg/s', '2,30 kg/s', '3,83 kg/s'], 0, 'transferencia'],
  ['Una turbina adiabática produce 500 kW de trabajo con un flujo másico de vapor de 1,5 kg/s. Si la entalpía específica del vapor a la entrada es 3200 kJ/kg, ¿cuál es la entalpía específica a la salida? Desprecia los cambios de energía cinética y potencial.', ['3533 kJ/kg', '333 kJ/kg', '2867 kJ/kg', '2700 kJ/kg'], 2, 'balance'],
  ['La Ley de Hess se utiliza para:', ['Calcular la variación de entropía en un ciclo', 'Determinar la energía de Gibbs estándar', 'Calcular entalpías de reacción mediante estados intermedios', 'Estimar calores específicos'], 2, 'reacciones'],
  ['El calor específico se define como:', ['Calor necesario para elevar 1 kg de sustancia 1 °C', 'Calor necesario para elevar 1 mol de sustancia 1 °C', 'Calor absorbido durante un cambio de fase', 'Calor producido por una reacción'], 0, 'calor'],
  ['Dadas las reacciones C + O₂ → CO₂ (ΔH = −393,5 kJ/mol) y CO + ½O₂ → CO₂ (ΔH = −283,0 kJ/mol), calcula la entalpía de la reacción C + ½O₂ → CO.', ['−676,5 kJ/mol', '+110,5 kJ/mol', '+676,5 kJ/mol', '−110,5 kJ/mol'], 3, 'reacciones'],
  ['Para un sistema abierto en estado estacionario, con una entrada y una salida y sin cambios de energía cinética ni potencial, el balance de energía (con Q como calor recibido por el sistema y Ws como trabajo de eje realizado por el sistema) se expresa como:', ['Q + Ws = ΔH', 'Q − Ws = ΔU', 'Q − Ws = ΔH', 'Q = ΔU'], 2, 'balance'],
  ['La convección ocurre cuando existe:', ['Transferencia de calor por radiación', 'Movimiento de un fluido', 'Vibración de átomos en un sólido', 'Condiciones adiabáticas'], 1, 'transferencia'],
  ['¿Qué significa la sigla EPP en seguridad industrial?', ['Equipo de Protección Personal', 'Evaluación de Procesos Petroquímicos', 'Energía por Presión Promedio', 'Estudio de Producción Primaria'], 0],
  ['Un fluido pasa por una válvula de estrangulamiento adiabática, sin trabajo de eje y sin cambios apreciables de energía cinética ni potencial. ¿Qué propiedad permanece constante?', ['La presión', 'La entropía específica', 'El volumen específico', 'La entalpía específica'], 3, 'termodinamica'],
  ['El calor de vaporización se refiere a:', ['Energía para calentar un líquido hasta su punto de ebullición', 'Energía liberada al congelar un líquido', 'Energía necesaria para cambiar de líquido a vapor sin cambio de temperatura', 'Energía necesaria para elevar la temperatura del vapor 1 °C'], 2, 'calor'],
  ['Un proceso isobárico es aquel que ocurre a:', ['Temperatura constante', 'Volumen constante', 'Presión constante', 'Entropía constante'], 2, 'termodinamica']
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
  ['La entalpía (H) de un sistema se define como:', ['H = U + PV', 'H = U − PV', 'H = Q − W', 'H = PV/T'], 0, 'termodinamica'],
  ['La radiación es un mecanismo de transferencia de calor que:', ['Requiere siempre un fluido en movimiento', 'Ocurre mediante ondas electromagnéticas y no necesita un medio material', 'Depende únicamente de la vibración de átomos en un sólido', 'Solo se presenta en gases'], 1, 'transferencia'],
  ['¿Cuál es el uso de un extintor?', ['Medir la presión', 'Controlar o extinguir un incendio incipiente cuando sea seguro hacerlo', 'Enfriar cualquier equipo industrial sin restricciones', 'Limpiar derrames químicos de cualquier tipo'], 1],
  ['Si ocurre un derrame de un reactivo desconocido en el laboratorio, ¿qué debes hacer?', ['Limpiarlo sin protección', 'Echarle agua inmediatamente', 'Alertar al responsable y seguir el protocolo de emergencia', 'Ignorarlo si la cantidad parece pequeña'], 2],
  ['¿Qué es la biodegradabilidad?', ['La capacidad de una sustancia para descomponerse mediante procesos biológicos', 'La capacidad de una sustancia para resistir cualquier cambio', 'La facilidad con la que un material conduce electricidad', 'La capacidad de un material para soportar presión'], 0],
  ['¿Qué significa eficiencia energética?', ['Utilizar más energía para obtener el mismo resultado', 'Obtener un resultado utilizando menos energía', 'Eliminar toda forma de energía', 'Aumentar siempre el consumo eléctrico'], 1],
  ['¿Cuál es el objetivo de la potabilización del agua?', ['Hacer que el agua sea apta para el consumo humano', 'Aumentar su concentración de contaminantes', 'Convertirla necesariamente en agua destilada', 'Eliminar todos los minerales sin excepción'], 0],
  ['¿Cuál de los siguientes materiales se comporta como mejor aislante térmico?', ['Cobre', 'Aluminio', 'Lana de vidrio', 'Acero'], 2, 'transferencia'],
  ['En una reacción exotérmica, la variación de entalpía de reacción (ΔH) es:', ['Igual a cero', 'Positiva', 'Siempre igual a la energía interna', 'Negativa'], 3, 'reacciones'],
  ['¿Qué significa que una sustancia sea tóxica?', ['Que puede causar efectos perjudiciales en un organismo bajo determinadas condiciones de exposición', 'Que siempre es inofensiva', 'Que necesariamente es inflamable', 'Que no puede entrar en contacto con otros materiales'], 0],
  ['¿Cuál es una buena práctica para reducir riesgos asociados a los residuos de laboratorio?', ['Mezclar todos los residuos en un mismo recipiente', 'Separarlos según su tipo y peligrosidad', 'Verterlos todos por el desagüe', 'Guardarlos en recipientes sin identificar'], 1],
  ['El calor estándar de formación de un compuesto es el cambio de entalpía asociado a:', ['La formación de un mol del compuesto a partir de sus elementos en su estado estándar', 'Su combustión completa con oxígeno', 'Su cambio de fase a temperatura constante', 'El aumento de 1 °C de su temperatura'], 0, 'reacciones']
];

// Bloque 5: Ciencia, tecnología e Ingeniería Química avanzada (81 a 100)
const B5 = [
  ['¿Cuántos elementos químicos se reconocen actualmente en la tabla periódica?', ['92', '100', '118', '150'], 2],
  ['¿Cuál es el elemento más abundante del universo?', ['Oxígeno', 'Hidrógeno', 'Carbono', 'Hierro'], 1],
  ['¿Cuál es la fórmula química del metano?', ['CH₄', 'C₂H₆', 'CO₂', 'H₂O'], 0],
  ['¿Cuál es el componente principal del gas natural?', ['Metano', 'Oxígeno', 'Nitrógeno líquido', 'Dióxido de carbono exclusivamente'], 0],
  ['La Ley Cero de la Termodinámica establece que:', ['La energía no se crea ni se destruye', 'La entropía de un cristal perfecto a 0 K es cero', 'Si dos sistemas están en equilibrio térmico con un tercero, también lo están entre sí', 'Todo proceso espontáneo aumenta la entropía'], 2, 'termodinamica'],
  ['Una potencia de 1 kJ/s equivale a:', ['1 kW', '1 MW', '1 W', '1 kWh'], 0, 'calor'],
  ['Mientras el hielo se funde a 0 °C y 1 atm, la temperatura de la mezcla hielo-agua:', ['Aumenta de forma continua', 'Disminuye gradualmente', 'Se vuelve menor que 0 °C', 'Permanece constante aunque el sistema absorba calor'], 3, 'calor'],
  ['La energía interna de un sistema depende principalmente de:', ['La posición del sistema en un campo gravitatorio', 'La estructura molecular y las interacciones internas', 'El movimiento del sistema respecto a un observador', 'La presión atmosférica externa'], 1, 'termodinamica'],
  ['Se alimenta vapor sobrecalentado a 10 bar y 370 °C a una turbina con un flujo másico de 2000 kg/h. La turbina opera adiabáticamente y el flujo de salida es vapor saturado a 1 bar. Calcula el trabajo que se obtiene de la turbina en kJ/s, sin considerar cambios de energía cinética y potencial. Datos: H del vapor sobrecalentado a 10 bar = 3201 kJ/kg; H del vapor saturado a 1 bar = 2675 kJ/kg.', ['395 BTU/h', '395 kJ/s', '295 BTU/h', '292 kJ/s'], 3, 'balance'],
  ['La Primera Ley de la Termodinámica establece que:', ['La entropía del universo siempre aumenta', 'La energía no se crea ni se destruye', 'Toda reacción exotérmica es espontánea', 'La energía se transforma sin pérdidas'], 1, 'termodinamica'],
  ['1000 kmol/h de una mezcla líquida de 70 % mol de acetona y 30 % mol de benceno se calientan de 10 °C a 50 °C en un intercambiador de calor de carcasa y tubos que usa vapor como medio calefactor. El vapor entra a la carcasa como vapor saturado a 16 bar con 90 % de calidad y sale como agua líquida saturada a 16 bar. Calcula la tasa de flujo másico del vapor de entrada requerida. Datos: Cp líquido de la acetona = 132,3 J/mol·°C; Cp líquido del benceno = 138,2 J/mol·°C; λ a 16 bar = 1933 kJ/kg.', ['3084 kg/h', '5004 lb/h', '3085,45 lb/h', '3082,3 kg/h'], 3, 'balance'],
  ['El calor específico a volumen constante (Cv) se define como:', ['La energía requerida para elevar la temperatura a presión constante', 'La energía requerida para elevar la temperatura a volumen constante', 'El calor liberado en una reacción química', 'El calor asociado a un cambio de fase'], 1, 'calor'],
  ['¿Qué instrumento permite observar células y microorganismos que no se distinguen a simple vista?', ['Telescopio', 'Microscopio', 'Barómetro', 'Calibrador'], 1],
  ['El calor sensible se refiere a:', ['Energía absorbida sin cambio de temperatura', 'Energía absorbida o liberada en un cambio de fase', 'Cambio de temperatura sin cambio de fase', 'Energía química en reacciones endotérmicas'], 2, 'calor'],
  ['En un proceso adiabático se cumple que:', ['El calor transferido es cero', 'La presión permanece constante', 'La temperatura permanece constante', 'La entalpía no cambia'], 0, 'termodinamica'],
  ['Se calientan 500 kg/h de agua líquida de 20 °C a 80 °C. Calcula el calor requerido en kW. Dato: Cp del agua líquida = 4,18 kJ/kg·°C.', ['46,4 kW', '11,6 kW', '34,8 kW', '125,4 kW'], 2, 'calor'],
  ['Se calientan 2 kg de agua líquida de 20 °C a 100 °C y luego se vaporizan por completo a 1 atm. Calcula el calor total requerido. Datos: Cp del agua líquida = 4,18 kJ/kg·°C; calor latente de vaporización = 2257 kJ/kg.', ['5350 kJ', '4514 kJ', '668,8 kJ', '5183 kJ'], 3, 'calor'],
  ['Una reacción exotérmica con ΔH = −80 kJ/mol se lleva a cabo en un reactor isotérmico donde reaccionan 50 mol/s. ¿Cuánto calor debe retirarse del reactor para mantener la temperatura constante?', ['4000 kW', '1,6 kW', '130 kW', '400 kW'], 0, 'reacciones'],
  ['Se mezclan 3 kg/s de agua a 80 °C con 2 kg/s de agua a 20 °C en un mezclador adiabático. Considerando Cp constante, ¿cuál es la temperatura de la mezcla?', ['50 °C', '56 °C', '44 °C', '60 °C'], 1, 'balance'],
  ['100 kg/h de vapor saturado a 1 bar se mezclan con vapor sobrecalentado disponible a 400 °C y 1 bar para producir vapor sobrecalentado a 300 °C y 1 bar. Calcula la cantidad de vapor sobrecalentado producido a 300 °C y la tasa de flujo másico requerida del vapor a 400 °C. Datos: H del vapor saturado a 1 bar = 2675,4 kJ/kg; H del vapor sobrecalentado a 300 °C = 3074 kJ/kg; H del vapor sobrecalentado a 400 °C = 3278 kJ/kg.', ['Producido a 300 °C: 295 kg/h; vapor a 400 °C: 195 kg/h', 'Producido a 300 °C: 195 kg/h; vapor a 400 °C: 95 kg/h', 'Producido a 300 °C: 175 kg/h; vapor a 400 °C: 45 kg/h', 'Producido a 300 °C: 195 lb/h; vapor a 400 °C: 95 kg/h'], 0, 'balance']
];

const QUESTIONS = [];
[['quimica', B1], ['fisica', B2], ['ingenieria', B3], ['ambiente', B4], ['ciencia', B5]].forEach(([c, block]) => {
  block.forEach(r => QUESTIONS.push({ c: r[3] || c, q: r[0], o: r[1], a: r[2] }));
});

if (QUESTIONS.length !== 100 || QUESTIONS.some(x => x.o.length !== 4 || x.a < 0 || x.a > 3)) {
  throw new Error('Banco de preguntas inválido: se esperaban 100 preguntas con 4 opciones cada una');
}
if (QUESTIONS.some(x => !CATEGORIES[x.c])) {
  throw new Error('Banco de preguntas inválido: hay preguntas con una categoría inexistente');
}

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
  // Fases 3 y 4: preguntas de Balance de Energía (docx "Ejercicios Olimpiadas de Balance de Energía" + preguntas afines)
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
