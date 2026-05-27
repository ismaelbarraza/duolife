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
      hint: 'Estrella musical latina',
      // Vague: references multi-industry impact
      impostorHint: 'Su influencia va mucho más allá de una sola industria.',
      hints: ['Cantante colombiana', 'Baila muy bien', 'Tiene hits internacionales'],
      difficulty: 'easy',
    },
    {
      word: 'Bad Bunny',
      hint: 'Artista urbano',
      // Vague: references reaching beyond the usual audience
      impostorHint: 'Generó conversación incluso entre gente que no consume su tipo de contenido.',
      hints: ['Puertorriqueño', 'Música urbana', 'Muy popular en streaming'],
      difficulty: 'easy',
    },
    {
      word: 'Taylor Swift',
      hint: 'Cantante estadounidense',
      // Vague: references community/movement aspect
      impostorHint: 'Logró convertir a sus seguidores en algo más parecido a un movimiento.',
      hints: ['Country y pop', 'Sus fans se llaman Swifties', 'Escribe sus propias canciones'],
      difficulty: 'easy',
    },
    {
      word: 'Elon Musk',
      hint: 'Empresario tecnológico',
      // Vague: references media presence, not tech or business
      impostorHint: 'Sus declaraciones generan titular en medios que normalmente no cubrirían su sector.',
      hints: ['SpaceX y Tesla', 'Millonario', 'Polémico en redes'],
      difficulty: 'medium',
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
