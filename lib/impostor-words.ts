export type WordPair = {
  category: string
  word: string
  emoji: string
  imageUrl: string | null // null = sem imagem, só texto (categoria abstrata)
}

export const WORD_PAIRS: WordPair[] = [
  // ---- Comida ----
  { category: 'Comida', word: 'Pizza', emoji: '🍕', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na-margherita-sep2005_sml.jpg/640px-Eq_it-na-margherita-sep2005_sml.jpg' },
  { category: 'Comida', word: 'Hambúrguer', emoji: '🍔', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/RedDot_Burger.jpg/640px-RedDot_Burger.jpg' },
  { category: 'Comida', word: 'Sushi', emoji: '🍣', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Sushi_platter.jpg/640px-Sushi_platter.jpg' },
  { category: 'Comida', word: 'Brigadeiro', emoji: '🍫', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Brigadeiros_%28cropped%29.jpg/480px-Brigadeiros_%28cropped%29.jpg' },
  { category: 'Comida', word: 'Churrasco', emoji: '🍖', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Churrasco_no_espeto.jpg/640px-Churrasco_no_espeto.jpg' },
  { category: 'Comida', word: 'Açaí', emoji: '🫐', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A%C3%A7a%C3%AD_na_tigela.jpg/480px-A%C3%A7a%C3%AD_na_tigela.jpg' },
  { category: 'Comida', word: 'Pastel', emoji: '🥟', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Pastel_de_feira.JPG/480px-Pastel_de_feira.JPG' },

  // ---- Lugares ----
  { category: 'Lugares', word: 'Praia', emoji: '🏖️', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Copacabana_Beach_Wonders_of_the_World.jpg/640px-Copacabana_Beach_Wonders_of_the_World.jpg' },
  { category: 'Lugares', word: 'Aeroporto', emoji: '✈️', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Sao_Paulo-Guarulhos_International_Airport.jpg/640px-Sao_Paulo-Guarulhos_International_Airport.jpg' },
  { category: 'Lugares', word: 'Hospital', emoji: '🏥', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Hospital_Corridor.jpg/640px-Hospital_Corridor.jpg' },
  { category: 'Lugares', word: 'Shopping', emoji: '🛍️', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Shopping_mall_interior.jpg/640px-Shopping_mall_interior.jpg' },
  { category: 'Lugares', word: 'Cinema', emoji: '🎬', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Movie_theater_iowa.jpg/640px-Movie_theater_iowa.jpg' },
  { category: 'Lugares', word: 'Academia', emoji: '🏋️', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Fitness_Centre.jpg/640px-Fitness_Centre.jpg' },

  // ---- Objetos ----
  { category: 'Objetos', word: 'Guarda-chuva', emoji: '☂️', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Red_umbrella.jpg/480px-Red_umbrella.jpg' },
  { category: 'Objetos', word: 'Geladeira', emoji: '🧊', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Modern_kitchen_refrigerator.jpg/480px-Modern_kitchen_refrigerator.jpg' },
  { category: 'Objetos', word: 'Violão', emoji: '🎸', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/GuitareClassiqueGaucher.jpg/480px-GuitareClassiqueGaucher.jpg' },
  { category: 'Objetos', word: 'Controle remoto', emoji: '🎮', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/TV_remote_control.jpg/480px-TV_remote_control.jpg' },
  { category: 'Objetos', word: 'Bicicleta', emoji: '🚲', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Bicycle_in_Vienna.jpg/480px-Bicycle_in_Vienna.jpg' },

  // ---- Profissões ----
  { category: 'Profissões', word: 'Bombeiro', emoji: '🧑‍🚒', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/FirefighterUSAF.jpg/480px-FirefighterUSAF.jpg' },
  { category: 'Profissões', word: 'Dentista', emoji: '🦷', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Dental_examination.jpg/480px-Dental_examination.jpg' },
  { category: 'Profissões', word: 'Astronauta', emoji: '🧑‍🚀', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Astronaut-EVA.jpg/480px-Astronaut-EVA.jpg' },
  { category: 'Profissões', word: 'Chef de cozinha', emoji: '👨‍🍳', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Chef_at_work.jpg/480px-Chef_at_work.jpg' },

  // ---- Esportes ----
  { category: 'Esportes', word: 'Futebol', emoji: '⚽', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Football_match.jpg/640px-Football_match.jpg' },
  { category: 'Esportes', word: 'Surfe', emoji: '🏄', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Surfing_in_Hawaii.jpg/640px-Surfing_in_Hawaii.jpg' },
  { category: 'Esportes', word: 'Vôlei de praia', emoji: '🏐', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Beach_volleyball_match.jpg/640px-Beach_volleyball_match.jpg' },
  { category: 'Esportes', word: 'Boxe', emoji: '🥊', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Boxing_match.jpg/640px-Boxing_match.jpg' },

  // ---- Festas / Brasil ----
  { category: 'Festas', word: 'Carnaval', emoji: '🎭', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Carnaval_Rio.jpg/640px-Carnaval_Rio.jpg' },
  { category: 'Festas', word: 'Festa Junina', emoji: '🌽', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Festa_Junina_decoration.jpg/480px-Festa_Junina_decoration.jpg' },
  { category: 'Festas', word: 'Réveillon', emoji: '🎆', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Fireworks_New_Year.jpg/640px-Fireworks_New_Year.jpg' },

  // ---- Categorias sem imagem (texto puro, modo clássico) ----
  { category: 'Filmes', word: 'Titanic', emoji: '🎬', imageUrl: null },
  { category: 'Filmes', word: 'Toy Story', emoji: '🎬', imageUrl: null },
  { category: 'Filmes', word: 'Velozes e Furiosos', emoji: '🎬', imageUrl: null },
  { category: 'Abstrato', word: 'Saudade', emoji: '💭', imageUrl: null },
  { category: 'Abstrato', word: 'Ciúmes', emoji: '💭', imageUrl: null },
  { category: 'Abstrato', word: 'Preguiça', emoji: '💭', imageUrl: null },
]

export function pickWordPair(): WordPair {
  return WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)]
}
