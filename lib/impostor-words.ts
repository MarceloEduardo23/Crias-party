export type WordPair = {
  category: string
  word: string
}

export const WORD_PAIRS: WordPair[] = [
  { category: 'Comida', word: 'Pizza' },
  { category: 'Comida', word: 'Hambúrguer' },
  { category: 'Comida', word: 'Sushi' },
  { category: 'Comida', word: 'Brigadeiro' },
  { category: 'Comida', word: 'Feijoada' },
  { category: 'Comida', word: 'Churrasco' },
  { category: 'Comida', word: 'Açaí' },
  { category: 'Comida', word: 'Pastel' },
  { category: 'Lugares', word: 'Praia' },
  { category: 'Lugares', word: 'Aeroporto' },
  { category: 'Lugares', word: 'Hospital' },
  { category: 'Lugares', word: 'Escola' },
  { category: 'Lugares', word: 'Academia' },
  { category: 'Lugares', word: 'Shopping' },
  { category: 'Lugares', word: 'Cinema' },
  { category: 'Animais', word: 'Elefante' },
  { category: 'Animais', word: 'Pinguim' },
  { category: 'Animais', word: 'Capivara' },
  { category: 'Animais', word: 'Golfinho' },
  { category: 'Animais', word: 'Tubarão' },
  { category: 'Animais', word: 'Preguiça' },
  { category: 'Objetos', word: 'Guarda-chuva' },
  { category: 'Objetos', word: 'Geladeira' },
  { category: 'Objetos', word: 'Violão' },
  { category: 'Objetos', word: 'Controle remoto' },
  { category: 'Objetos', word: 'Escova de dentes' },
  { category: 'Profissões', word: 'Bombeiro' },
  { category: 'Profissões', word: 'Dentista' },
  { category: 'Profissões', word: 'Astronauta' },
  { category: 'Profissões', word: 'Chef de cozinha' },
  { category: 'Profissões', word: 'DJ' },
  { category: 'Esportes', word: 'Futebol' },
  { category: 'Esportes', word: 'Vôlei de praia' },
  { category: 'Esportes', word: 'Surfe' },
  { category: 'Esportes', word: 'Boxe' },
  { category: 'Filmes', word: 'Titanic' },
  { category: 'Filmes', word: 'Toy Story' },
  { category: 'Filmes', word: 'Velozes e Furiosos' },
  { category: 'Festas', word: 'Carnaval' },
  { category: 'Festas', word: 'Festa Junina' },
  { category: 'Festas', word: 'Réveillon' },
  { category: 'Festas', word: 'Aniversário' },
]

export function pickWordPair(): WordPair {
  return WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)]
}
