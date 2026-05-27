export const CATEGORY_LABELS = {
  objetosCasa: 'Objetos de casa',
  comida: 'Comida',
  futbolistas: 'Futbolistas',
  famosos: 'Famosos',
  paises: 'Países',
  fitness: 'Fitness',
  marcas: 'Marcas',
  lugaresPeru: 'Lugares del Perú',
}

// Rule for impostorHint:
// Must be vague, indirect, and NEVER reference the category or obvious category traits.
// The goal is to let the impostor blend in without giving away the word.
// Bad: "País conocido por su historia y gastronomía" (repeats 'país', too close to word)
// Good: "Es un lugar que mucha gente asocia con una identidad muy marcada y reconocible."

export const impostorContent = {
  objetosCasa: [
    {
      word: 'Refrigeradora',
      hint: 'Electrodoméstico para conservar',
      // Vague: references size and presence, not function or category
      impostorHint: 'Mucha gente solo lo nota cuando algo anda mal con él.',
      hints: ['Objeto de casa', 'Se usa en cocina', 'Enfría alimentos'],
      difficulty: 'easy',
    },
    {
      word: 'Sofá',
      hint: 'Mueble de descanso',
      // Vague: references comfort and choices, not furniture or home
      impostorHint: 'Elegirlo bien puede cambiar mucho cómo se siente un espacio.',
      hints: ['Suele estar en la sala', 'Caben varias personas', 'Tiene cojines'],
      difficulty: 'easy',
    },
    {
      word: 'Licuadora',
      hint: 'Tritura alimentos',
      // Vague: references noise and occasional use, not kitchen or function
      impostorHint: 'Hace mucho alboroto en poco tiempo y luego vuelve al silencio.',
      hints: ['Tiene aspas', 'Hace ruido', 'Prepara jugos'],
      difficulty: 'medium',
    },
    {
      word: 'Lavadora',
      hint: 'Limpia ropa',
      // Vague: references cyclical rhythm, not cleaning or clothes
      impostorHint: 'Tiene un ritmo propio que algunos encuentran casi hipnótico.',
      hints: ['Usa agua y jabón', 'Tiene ciclos', 'Ropa limpia'],
      difficulty: 'easy',
    },
    {
      word: 'Microondas',
      hint: 'Calienta comida rápido',
      // Vague: references speed and convenience, not heating or kitchen
      impostorHint: 'Su popularidad creció por la promesa de hacer todo más rápido.',
      hints: ['Hace bip', 'Tiene un plato giratorio', 'Cocina rápido'],
      difficulty: 'easy',
    },
  ],
  comida: [
    {
      word: 'Pizza',
      hint: 'Comida popular horneada',
      // Vague: references group dynamics, not food or cooking
      impostorHint: 'Suele ser la elección cuando nadie se pone de acuerdo en otra cosa.',
      hints: ['Puede tener queso', 'Se corta en porciones', 'Suele pedirse delivery'],
      difficulty: 'easy',
    },
    {
      word: 'Hamburguesa',
      hint: 'Comida entre panes',
      // Vague: references trend, not food
      impostorHint: 'Su versión artesanal se ha convertido en toda una identidad cultural.',
      hints: ['Puede llevar carne', 'Viene con salsas', 'Suele acompañarse con papas'],
      difficulty: 'easy',
    },
    {
      word: 'Ceviche',
      hint: 'Plato frío con pescado',
      // Vague: references reactions of first-timers, not the food itself
      impostorHint: 'Divide opiniones entre quienes lo prueban por primera vez.',
      hints: ['Usa limón', 'Puede ser picante', 'Es muy popular en Perú'],
      difficulty: 'easy',
    },
    {
      word: 'Sushi',
      hint: 'Comida japonesa con arroz',
      // Vague: references its social rise, not origin or ingredients
      impostorHint: 'Pasó de ser algo muy de nicho a estar en casi todos lados.',
      hints: ['Lleva alga', 'Puede llevar pescado crudo', 'Viene en piezas pequeñas'],
      difficulty: 'medium',
    },
    {
      word: 'Tacos',
      hint: 'Tortilla con relleno',
      // Vague: references cultural debate, not the food
      impostorHint: 'Nadie se pone de acuerdo en cuál versión es la auténtica.',
      hints: ['Se dobla', 'Puede llevar carne', 'Tiene salsa'],
      difficulty: 'easy',
    },
  ],
  futbolistas: [
    {
      word: 'Messi',
      hint: 'Astro sudamericano',
      // Vague: references debate, not sport
      impostorHint: 'Su nombre genera conversaciones acaloradas que van mucho más allá de su trabajo.',
      hints: ['Zurdo', 'Campeón del mundo 2022', 'Número 10'],
      difficulty: 'easy',
    },
    {
      word: 'Cristiano Ronaldo',
      hint: 'Goleador europeo',
      // Vague: references cross-industry fame
      impostorHint: 'Es reconocido incluso por personas que no siguen su ámbito para nada.',
      hints: ['Usó el número 7', 'Famoso por su salto', 'Portugués'],
      difficulty: 'easy',
    },
    {
      word: 'Neymar',
      hint: 'Habilidoso brasileño',
      // Vague: references polarizing nature
      impostorHint: 'Rara vez alguien es indiferente: genera tanto admiradores como críticos.',
      hints: ['Brasileño', 'Jugó en el Barça', 'Muy técnico'],
      difficulty: 'easy',
    },
    {
      word: 'Mbappé',
      hint: 'Velocista francés',
      // Vague: references generational narrative
      impostorHint: 'Es visto como el relevo natural de quienes están dejando de brillar.',
      hints: ['Francés', 'Muy rápido', 'Campeón del mundo 2018'],
      difficulty: 'easy',
    },
  ],
  famosos: [
    {
      word: 'Shakira',
      hint: 'Estrella musical y artista colombiana',
      impostorHint: 'Su influencia va mucho más allá de una sola industria.',
      hints: ['Artista latinoamericana muy conocida', 'Baila de forma inconfundible', 'Canciones en inglés y español'],
      difficulty: 'easy',
    },
    {
      word: 'Bad Bunny',
      hint: 'Artista urbano de fama global',
      impostorHint: 'Generó conversación incluso entre gente que no consume su tipo de contenido.',
      hints: ['Caribeño', 'Género urbano y reggaetón', 'Uno de los más escuchados del mundo'],
      difficulty: 'easy',
    },
    {
      word: 'Taylor Swift',
      hint: 'Cantante y compositora estadounidense',
      impostorHint: 'Logró convertir a sus seguidores en algo más parecido a un movimiento.',
      hints: ['Estadounidense', 'Sus fans tienen nombre propio', 'Escribe todas sus canciones'],
      difficulty: 'easy',
    },
    {
      word: 'Elon Musk',
      hint: 'Empresario multimillonario y figura mediática',
      impostorHint: 'Sus declaraciones generan titular en medios que normalmente no cubrirían su sector.',
      hints: ['Multimillonario', 'Dueño de empresas tecnológicas', 'Muy activo y polémico en redes'],
      difficulty: 'medium',
    },
    {
      word: 'Beyoncé',
      hint: 'Artista y empresaria del entretenimiento estadounidense',
      impostorHint: 'Sus lanzamientos son tratados como eventos culturales antes de que salgan.',
      hints: ['Estadounidense', 'Cantante y bailarina de alto nivel', 'Fue parte de un grupo antes de ser solista'],
      difficulty: 'easy',
    },
    {
      word: 'Rihanna',
      hint: 'Cantante y empresaria internacional',
      impostorHint: 'Tiene tanto reconocimiento por lo que hace fuera de su campo original como dentro.',
      hints: ['Caribeña', 'Éxitos musicales globales', 'También tiene su propia línea de cosméticos'],
      difficulty: 'easy',
    },
    {
      word: 'Karol G',
      hint: 'Cantante urbana latinoamericana',
      impostorHint: 'Alcanzó un nivel de reconocimiento en muy poco tiempo que sorprendió a su propio entorno.',
      hints: ['Latinoamericana', 'Música urbana femenina', 'Conocida por su cabello de colores llamativos'],
      difficulty: 'easy',
    },
    {
      word: 'J Balvin',
      hint: 'Cantante urbano con proyección internacional',
      impostorHint: 'Ayudó a que cierto tipo de música fuera tomada en serio en mercados que antes la ignoraban.',
      hints: ['Latinoamericano', 'Reggaetón y pop urbano', 'Muchas colaboraciones con artistas globales'],
      difficulty: 'easy',
    },
    {
      word: 'Daddy Yankee',
      hint: 'Referente pionero de la música urbana latina',
      impostorHint: 'Está ligado a un momento concreto que cambió cómo cierto tipo de música es percibida globalmente.',
      hints: ['Caribeño', 'Considerado pionero de un género', 'Tiene una de las canciones más escuchadas de la historia'],
      difficulty: 'easy',
    },
    {
      word: 'Billie Eilish',
      hint: 'Cantante joven con estilo muy propio',
      impostorHint: 'Llegó al mainstream siendo diferente a lo que el mainstream suele premiar.',
      hints: ['Estadounidense muy joven al debutar', 'Estética oscura y alternativa', 'Su hermano produce su música'],
      difficulty: 'easy',
    },
    {
      word: 'Dua Lipa',
      hint: 'Cantante pop internacional',
      impostorHint: 'Tiene una imagen muy cuidada que se mantiene coherente sin importar el contexto.',
      hints: ['Origen europeo', 'Pop bailable internacional', 'Muy conocida por sus éxitos de los últimos años'],
      difficulty: 'easy',
    },
    {
      word: 'Harry Styles',
      hint: 'Cantante solista británico',
      impostorHint: 'Generó conversaciones sobre identidad y expresión que fueron más allá de su música.',
      hints: ['Británico', 'Fue parte de una banda muy famosa antes', 'Su estilo personal es muy comentado'],
      difficulty: 'easy',
    },
    {
      word: 'Rosalía',
      hint: 'Artista española de fusión musical',
      impostorHint: 'Tomó algo tradicional y lo presentó de forma que generó debate y reconocimiento a partes iguales.',
      hints: ['Española', 'Mezcla tradición y música urbana', 'Premios internacionales importantes'],
      difficulty: 'medium',
    },
    {
      word: 'Maluma',
      hint: 'Cantante latinoamericano de reggaetón',
      impostorHint: 'Su figura pública tiene tanto peso en la conversación como cualquier cosa específica que haya lanzado.',
      hints: ['Latinoamericano', 'Reggaetón y pop', 'Estilo muy visual y reconocible'],
      difficulty: 'easy',
    },
    {
      word: 'The Weeknd',
      hint: 'Cantante de R&B y pop oscuro',
      impostorHint: 'Tiene una estética muy definida que no necesita explicarse para ser reconocida.',
      hints: ['Canadiense de origen africano', 'R&B con estética oscura', 'Actuó en el Super Bowl'],
      difficulty: 'easy',
    },
    {
      word: 'Ozuna',
      hint: 'Cantante urbano con récords en streaming',
      impostorHint: 'Su popularidad digital lo convirtió en referencia de algo más amplio que él mismo.',
      hints: ['Caribeño', 'Reggaetón y trap latino', 'Récords en plataformas de música'],
      difficulty: 'easy',
    },
    {
      word: 'Jennifer Lopez',
      hint: 'Cantante y actriz latina de larga trayectoria',
      impostorHint: 'Su longevidad en varios ámbitos distintos se convirtió en parte de su propia narrativa pública.',
      hints: ['Latina de Nueva York', 'Cantante y actriz a la vez', 'Conocida por sus iniciales'],
      difficulty: 'easy',
    },
    {
      word: 'Anitta',
      hint: 'Cantante urbana con proyección internacional',
      impostorHint: 'Se posicionó como representante de algo que tenía poco espacio en ciertos mercados internacionales.',
      hints: ['Brasileña', 'Música urbana latinoamericana', 'Muy activa en redes sociales'],
      difficulty: 'medium',
    },
    {
      word: 'Selena Gomez',
      hint: 'Cantante y actriz multifacética',
      impostorHint: 'Su historia personal tiene tanto peso en la narrativa pública como su trayectoria profesional.',
      hints: ['Comenzó en la televisión infantil', 'Cantante y actriz reconocida', 'Tiene su propia línea de maquillaje'],
      difficulty: 'easy',
    },
    {
      word: 'Drake',
      hint: 'Rapero y cantante canadiense',
      impostorHint: 'Tiene una capacidad para mantenerse en conversación que muchos en su campo consideran difícil de replicar.',
      hints: ['Canadiense', 'Rap y R&B mezclados', 'Uno de los artistas más escuchados en plataformas digitales'],
      difficulty: 'easy',
    },
    {
      word: 'Kim Kardashian',
      hint: 'Figura mediática y empresaria',
      impostorHint: 'Construyó algo de una forma que antes no tenía nombre, y ahora muchos intentan replicarlo.',
      hints: ['Parte de una familia muy mediática', 'Empresaria con líneas propias', 'Protagonizó un reality muy visto'],
      difficulty: 'easy',
    },
    {
      word: 'Will Smith',
      hint: 'Actor y rapero de Hollywood',
      impostorHint: 'Pasó de ser una figura casi universalmente querida a protagonizar un debate muy diferente.',
      hints: ['Actor muy conocido', 'También fue rapero antes de actuar', 'Protagonizó un incidente en directo muy comentado'],
      difficulty: 'easy',
    },
    {
      word: 'Zendaya',
      hint: 'Actriz y artista joven de Hollywood',
      impostorHint: 'Logró una transición de etapas que muy pocos consiguen sin perder relevancia en el camino.',
      hints: ['Comenzó en televisión para jóvenes', 'Actriz premiada recientemente', 'Protagonista de una serie muy popular'],
      difficulty: 'easy',
    },
    {
      word: 'LeBron James',
      hint: 'Figura deportiva y cultural estadounidense',
      impostorHint: 'Trasciende lo que hace porque eligió tener voz sobre cosas mucho más allá de su campo.',
      hints: ['Deportista considerado de los mejores de su era', 'También es empresario', 'Tiene una película basada en él'],
      difficulty: 'easy',
    },
    {
      word: 'Michael Jordan',
      hint: 'Leyenda del deporte y el marketing global',
      impostorHint: 'Su influencia cultural va mucho más allá del deporte en el que destacó.',
      hints: ['Considerado el mejor de su deporte por muchos', 'Tiene una línea propia de zapatillas icónica', 'Hay un documental muy famoso sobre él'],
      difficulty: 'easy',
    },
    {
      word: 'Dwayne Johnson',
      hint: 'Actor y ex deportista espectacular',
      impostorHint: 'Hizo una transición entre dos mundos muy distintos con un éxito que pocos esperaban.',
      hints: ['Conocido por un apodo muy famoso', 'Fue profesional en un deporte de espectáculo antes de actuar', 'Uno de los actores mejor pagados de Hollywood'],
      difficulty: 'easy',
    },
    {
      word: 'Pedro Pascal',
      hint: 'Actor latinoamericano con proyección global',
      impostorHint: 'Su popularidad llegó de forma tardía pero con una intensidad que sorprendió al sector.',
      hints: ['Latinoamericano', 'Famoso por un personaje que casi siempre lleva casco', 'También en una serie de terror y drama'],
      difficulty: 'medium',
    },
    {
      word: 'MrBeast',
      hint: 'Creador de contenido digital más visto del mundo',
      impostorHint: 'Redefinió lo que significa crear contenido a una escala que hace difícil compararlo con predecesores.',
      hints: ['Youtuber estadounidense', 'Conocido por retos extremos y donaciones millonarias', 'Tiene cientos de millones de suscriptores'],
      difficulty: 'medium',
    },
    {
      word: 'Ibai Llanos',
      hint: 'Streamer y comunicador del mundo hispanohablante',
      impostorHint: 'Construyó una audiencia tan grande que organizó eventos que antes solo hacían medios tradicionales.',
      hints: ['Español', 'Streamer de entretenimiento y gaming', 'Organizó eventos de boxeo con figuras famosas'],
      difficulty: 'medium',
    },
    {
      word: 'Michael Jackson',
      hint: 'Leyenda mundial de la música y el espectáculo',
      impostorHint: 'Su legado sigue generando conversaciones que van mucho más allá de lo artístico.',
      hints: ['Apodado el Rey del Pop', 'Sus bailes son inconfundibles', 'Uno de los álbumes más vendidos de la historia'],
      difficulty: 'easy',
    },
    {
      word: 'Freddie Mercury',
      hint: 'Vocalista icónico de rock legendario',
      impostorHint: 'Su figura sigue siendo referencia de carisma escénico décadas después de su tiempo.',
      hints: ['Vocalista de una banda de rock legendaria', 'Su actuación en un festival es considerada histórica', 'Su historia fue adaptada en una película exitosa'],
      difficulty: 'medium',
    },
    {
      word: 'Scarlett Johansson',
      hint: 'Actriz de Hollywood con larga trayectoria',
      impostorHint: 'Su nombre aparece con tanta frecuencia en conversaciones de cine que se volvió referencia del sector.',
      hints: ['Actriz estadounidense', 'Tiene un personaje de superhéroe muy conocido', 'Una de las actrices más taquilleras de la historia'],
      difficulty: 'easy',
    },
    {
      word: 'Ryan Reynolds',
      hint: 'Actor canadiense y empresario carismático',
      impostorHint: 'Su imagen pública se basa tanto en su humor como en lo profesional, y la gente acepta esa mezcla sin reparos.',
      hints: ['Canadiense', 'Tiene su propia marca de gin', 'Famoso por un personaje de superhéroe cómico'],
      difficulty: 'easy',
    },
    {
      word: 'Mark Zuckerberg',
      hint: 'Fundador de una de las redes sociales más usadas del mundo',
      impostorHint: 'Su nombre está tan ligado a algo cotidiano que la gente lo nombra sin pensar en él como persona.',
      hints: ['Fundó algo desde la universidad', 'Multimillonario tecnológico', 'Hay una película famosa sobre sus inicios'],
      difficulty: 'medium',
    },
    {
      word: 'Kylie Jenner',
      hint: 'Empresaria y figura mediática joven',
      impostorHint: 'A una edad inusualmente temprana se convirtió en referencia de algo que antes no existía como categoría.',
      hints: ['Parte de una familia muy mediática', 'Tiene su propia línea de belleza exitosa', 'Hermanastra de alguien más conocido aún'],
      difficulty: 'easy',
    },
    {
      word: 'Adele',
      hint: 'Cantante británica de soul y pop',
      impostorHint: 'Sus álbumes generan expectativa como si fueran eventos antes de que salga ningún detalle.',
      hints: ['Británica', 'Voz muy poderosa y reconocida', 'Sus discos llevan números como título'],
      difficulty: 'easy',
    },
    {
      word: 'Naomi Osaka',
      hint: 'Deportista con voz pública fuerte',
      impostorHint: 'Generó conversaciones sobre bienestar y presión pública que trascendieron completamente su deporte.',
      hints: ['Deportista de raqueta', 'Origen mixto japonés-estadounidense', 'Ganó torneos de gran nivel siendo muy joven'],
      difficulty: 'medium',
    },
    {
      word: 'Lionel Messi',
      hint: 'Figura deportiva con fama cultural global',
      impostorHint: 'Su nombre genera conversaciones que van mucho más allá del contexto en que destacó.',
      hints: ['Considerado por muchos el mejor de su deporte', 'Ganó el premio más importante de su campo varias veces', 'Campeón del mundo con su selección'],
      difficulty: 'easy',
    },
  ],
  paises: [
    {
      word: 'Perú',
      hint: 'Nación andina',
      // Vague: references identity, not geography
      impostorHint: 'Es un lugar que mucha gente asocia con una identidad muy marcada y difícil de imitar.',
      hints: ['Tiene costa, sierra y selva', 'Gastronomía famosa', 'Machu Picchu'],
      difficulty: 'easy',
    },
    {
      word: 'Japón',
      hint: 'Nación asiática',
      // Vague: references contrast, not location
      impostorHint: 'Tiene una dualidad muy llamativa entre lo antiguo y lo moderno que pocas culturas manejan igual.',
      hints: ['Anime', 'Sushi', 'Tecnología'],
      difficulty: 'easy',
    },
    {
      word: 'Brasil',
      hint: 'Gran nación sudamericana',
      // Vague: references emotional associations
      impostorHint: 'Su nombre trae imágenes a la mente de forma inmediata, aunque cada quien piensa en algo distinto.',
      hints: ['Carnaval', 'Futbol', 'Amazonia'],
      difficulty: 'easy',
    },
    {
      word: 'Italia',
      hint: 'Nación europea',
      // Vague: references style/culture conversations without naming category
      impostorHint: 'Es un lugar que suele aparecer en conversaciones de estilo, sabor y arte, pero no es el único.',
      hints: ['Pizza y pasta', 'Roma', 'Arte y moda'],
      difficulty: 'easy',
    },
    {
      word: 'México',
      hint: 'Nación norteamericana',
      // Vague: references global cultural footprint
      impostorHint: 'Tiene una presencia cultural global que supera a muchos otros de mayor tamaño.',
      hints: ['Tequila', 'Mariachi', 'Pirámides mayas'],
      difficulty: 'easy',
    },
  ],
  fitness: [
    {
      word: 'Sentadilla',
      hint: 'Ejercicio de piernas',
      // Vague: references learning curve and fatigue
      impostorHint: 'Es de las primeras cosas que enseñan y de las últimas que uno quiere hacer cuando lleva rato.',
      hints: ['Trabaja piernas', 'Se baja y sube', 'Puede hacerse con peso'],
      difficulty: 'easy',
    },
    {
      word: 'Plancha',
      hint: 'Ejercicio de suelo',
      // Vague: references deceptive difficulty
      impostorHint: 'Es deceptivamente fácil de explicar y mucho más difícil de sostener de lo que parece.',
      hints: ['Se sostiene sin moverse', 'Trabaja el abdomen', 'Puede durar segundos o minutos'],
      difficulty: 'easy',
    },
    {
      word: 'Burpee',
      hint: 'Ejercicio completo intenso',
      // Vague: references dreaded reputation in group settings
      impostorHint: 'Tiene fama de ser lo que nadie quiere escuchar que viene después.',
      hints: ['Agota rápido', 'Combina varios movimientos', 'Cardio y fuerza'],
      difficulty: 'medium',
    },
  ],
  marcas: [
    {
      word: 'Nike',
      hint: 'Marca deportiva',
      // Vague: references attitude/symbol, not product category
      impostorHint: 'Su presencia va más allá de lo que vende; se ha convertido en un símbolo de actitud.',
      hints: ['Tiene un logo curvo', 'Zapatillas', 'Deporte'],
      difficulty: 'easy',
    },
    {
      word: 'Apple',
      hint: 'Marca tecnológica',
      // Vague: references loyalty, not tech
      impostorHint: 'Genera una lealtad en sus usuarios que pocas veces se ve de forma tan consistente.',
      hints: ['Logo de manzana', 'iPhone', 'Muy cara'],
      difficulty: 'easy',
    },
    {
      word: 'Coca-Cola',
      hint: 'Bebida gaseosa famosa',
      // Vague: references visual recognition, not drink or taste
      impostorHint: 'Su identidad visual es tan reconocible que puede identificarse con solo unos pocos elementos.',
      hints: ['Color rojo', 'Sabor dulce y carbónico', 'Publicidad navideña'],
      difficulty: 'easy',
    },
    {
      word: 'Netflix',
      hint: 'Plataforma de streaming',
      // Vague: references behavior change, not entertainment
      impostorHint: 'Cambió cómo mucha gente estructura su tiempo libre, para bien o para mal.',
      hints: ['Logo N rojo', 'Series y películas', 'Binge watching'],
      difficulty: 'easy',
    },
  ],
  lugaresPeru: [
    {
      word: 'Cusco',
      hint: 'Destino histórico peruano',
      // Vague: references collective imagination, not location or tourism
      impostorHint: 'Tiene una presencia en la imaginación colectiva que va más allá de quienes lo han visitado.',
      hints: ['Cerca de Machu Picchu', 'Ciudad histórica', 'Altura'],
      difficulty: 'easy',
    },
    {
      word: 'Miraflores',
      hint: 'Distrito limeño moderno',
      // Vague: references preference in context, not geography
      impostorHint: 'Es donde mucha gente preferiría estar si pudiera elegir en ese contexto.',
      hints: ['En Lima', 'Malecón', 'Restaurantes y tiendas'],
      difficulty: 'medium',
    },
    {
      word: 'Iquitos',
      hint: 'Ciudad en la Amazonía',
      // Vague: references access logistics, not location or region
      impostorHint: 'Su particularidad logística se convierte en tema de conversación antes de llegar.',
      hints: ['Selva', 'Sin carretera de acceso', 'Río Amazonas'],
      difficulty: 'medium',
    },
    {
      word: 'Arequipa',
      hint: 'Ciudad blanca del sur',
      // Vague: references local identity, not geography or architecture
      impostorHint: 'Quienes son de ahí suelen mencionarlo antes que cualquier otro detalle de sí mismos.',
      hints: ['Ciudad blanca', 'Volcán Misti', 'Rocoto relleno'],
      difficulty: 'easy',
    },
  ],
}
