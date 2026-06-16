import type { QuizQuestion } from './types'

let idCounter = 0
function q(question: string, options: string[], correctIndex: number, category: string): QuizQuestion {
  return { id: `q${++idCounter}`, question, options, correctIndex, category }
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Brasil
  q('Qual é a capital do Brasil?', ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], 2, 'Brasil'),
  q('Em que ano o Brasil ganhou sua primeira Copa do Mundo?', ['1950', '1958', '1962', '1970'], 1, 'Brasil'),
  q('Qual é o maior estado do Brasil em área?', ['Pará', 'Minas Gerais', 'Mato Grosso', 'Amazonas'], 3, 'Brasil'),
  q('Qual animal está na bandeira do Brasil?', ['Jaguar', 'Onça', 'Tamanduá', 'Garça'], 1, 'Brasil'),
  q('Qual é o rio mais longo do Brasil?', ['Rio São Francisco', 'Rio Paraná', 'Rio Amazonas', 'Rio Negro'], 2, 'Brasil'),
  q('Em que ano o Brasil foi descoberto pelos portugueses?', ['1488', '1492', '1500', '1510'], 2, 'Brasil'),
  q('Qual estado brasileiro tem mais praias?', ['Santa Catarina', 'Bahia', 'Rio de Janeiro', 'Ceará'], 1, 'Brasil'),
  q('Qual é o bioma exclusivo do Brasil?', ['Pantanal', 'Cerrado', 'Caatinga', 'Mata Atlântica'], 2, 'Brasil'),

  // Pop Culture
  q('Qual vilão quer "vingança pelo universo" em Vingadores?', ['Loki', 'Ultron', 'Thanos', 'Hela'], 2, 'Pop'),
  q('Qual personagem diz "Ao infinito e além"?', ['Buzz Lightyear', 'Woody', 'Aliens', 'Rex'], 0, 'Pop'),
  q('Quantas cores tem o cubo mágico original?', ['4', '5', '6', '8'], 2, 'Pop'),
  q('Qual app de streaming tem mais assinantes no mundo?', ['Disney+', 'Apple TV+', 'Netflix', 'Prime Video'], 2, 'Pop'),
  q('Qual jogo tem o personagem Mario?', ['Sega', 'Nintendo', 'Sony', 'Atari'], 1, 'Pop'),
  q('Qual cantora é conhecida como "Rainha do Pop"?', ['Beyoncé', 'Rihanna', 'Madonna', 'Lady Gaga'], 2, 'Pop'),
  q('Qual emoji foi o mais usado em 2023?', ['😂', '❤️', '😭', '🥺'], 2, 'Pop'),
  q('Qual série tem os personagens Eleven e Dustin?', ['Dark', 'Stranger Things', 'The Boys', 'Squid Game'], 1, 'Pop'),

  // Ciência
  q('Qual é o planeta mais próximo do Sol?', ['Vênus', 'Terra', 'Mercúrio', 'Marte'], 2, 'Ciência'),
  q('Quantos ossos tem o corpo humano adulto?', ['180', '206', '220', '256'], 1, 'Ciência'),
  q('Qual é o elemento mais abundante no universo?', ['Oxigênio', 'Carbono', 'Hidrogênio', 'Hélio'], 2, 'Ciência'),
  q('Quanto tempo a luz do Sol leva para chegar à Terra?', ['1 segundo', '8 minutos', '1 hora', '1 dia'], 1, 'Ciência'),
  q('Qual animal tem maior cérebro relativo ao tamanho do corpo?', ['Elefante', 'Golfinho', 'Humano', 'Corvo'], 2, 'Ciência'),
  q('Qual é a fórmula química da água?', ['HO', 'H2O', 'H3O', 'OH'], 1, 'Ciência'),
  q('Quantos dentes tem um adulto (incluindo sisos)?', ['28', '30', '32', '34'], 2, 'Ciência'),
  q('Qual é o metal mais leve?', ['Alumínio', 'Lítio', 'Magnésio', 'Titânio'], 1, 'Ciência'),

  // Esportes
  q('Qual país ganhou mais Copas do Mundo de futebol?', ['Alemanha', 'Argentina', 'Brasil', 'Itália'], 2, 'Esportes'),
  q('Quantos jogadores tem um time de basquete em quadra?', ['4', '5', '6', '7'], 1, 'Esportes'),
  q('Qual esporte tem os termos "birdie" e "eagle"?', ['Tênis', 'Golfe', 'Cricket', 'Hóquei'], 1, 'Esportes'),
  q('Em que país nasceu o futebol?', ['Espanha', 'Brasil', 'Inglaterra', 'França'], 2, 'Esportes'),
  q('Quantas rodadas tem um boxe profissional máximo?', ['10', '12', '15', '20'], 1, 'Esportes'),
  q('Qual atleta ganhou mais ouros olímpicos na história?', ['Usain Bolt', 'Michael Phelps', 'Carl Lewis', 'Simone Biles'], 1, 'Esportes'),

  // Curiosidades
  q('Quantas patas tem uma aranha?', ['6', '8', '10', '12'], 1, 'Curiosidades'),
  q('Qual é o animal terrestre mais rápido?', ['Leão', 'Guepardo', 'Antílope', 'Cavalo'], 1, 'Curiosidades'),
  q('Quantas cores tem o arco-íris?', ['5', '6', '7', '8'], 2, 'Curiosidades'),
  q('Qual é o maior oceano do mundo?', ['Atlântico', 'Índico', 'Ártico', 'Pacífico'], 3, 'Curiosidades'),
  q('Quanto tempo dura um ano em Marte?', ['1 ano', '1,5 ano', '2 anos', '3 anos'], 2, 'Curiosidades'),
  q('Qual é o menor país do mundo?', ['Mônaco', 'Liechtenstein', 'Vaticano', 'San Marino'], 2, 'Curiosidades'),
  q('Quantos continentes tem o planeta Terra?', ['5', '6', '7', '8'], 2, 'Curiosidades'),
  q('Qual instrumento tem mais teclas?', ['Órgão', 'Piano', 'Cravo', 'Acordeão'], 0, 'Curiosidades'),
]

export function pickQuizQuestions(count: number = 5): QuizQuestion[] {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
