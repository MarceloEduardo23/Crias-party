export type GameId = 'lobby' | 'vinte-e-um' | 'impostor' | 'quiz' | 'ranking'

export type Card = {
  /** 2-10, J, Q, K, A */
  rank: string
  suit: '♠' | '♥' | '♦' | '♣'
  /** hidden cards are not revealed to other players yet */
  hidden?: boolean
}

export type Player = {
  id: string
  name: string
  avatar: string
  color: string
  score: number
  connected: boolean
  isHost: boolean
}

export type VinteEUmPlayerState = {
  hand: Card[]
  total: number
  status: 'playing' | 'stand' | 'bust' | 'blackjack'
  hasActed: boolean
}

export type VinteEUmState = {
  phase: 'dealing' | 'turns' | 'reveal'
  hands: Record<string, VinteEUmPlayerState>
  activePlayerId: string | null
  order: string[]
  roundWinners: string[]
}

export type AnimalPair = {
  emoji: string
  name: string
  imageUrl: string
}

export type ImpostorState = {
  phase: 'reveal-role' | 'clues' | 'voting' | 'result'
  category: string
  secretWord: string
  animalName: string
  animalEmoji: string
  animalImage: string
  impostorIds: string[]
  /** playerId -> word they see ('' for impostor) */
  assignments: Record<string, string>
  order: string[]
  cluesGiven: string[]
  clues: Record<string, string>
  activePlayerId: string | null
  votes: Record<string, string>
  ejectedId: string | null
  impostorsWon: boolean | null
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  category: string
}

export type QuizState = {
  phase: 'question' | 'reveal'
  questions: QuizQuestion[]
  currentQuestionIndex: number
  answers: Record<string, number> // playerId -> optionIndex
  timeLeft: number
  roundScores: Record<string, number> // scores earned this quiz session
}

export type RankingState = {
  snapshot: Array<{ id: string; name: string; color: string; score: number; rank: number }>
  isGameOver: boolean
  roundNumber: number
}

export type PartyState = {
  phase: 'lobby' | 'playing' | 'ranking' | 'gameover'
  roundNumber: number
  totalRounds: number
  gamesSequence: Array<'vinte-e-um' | 'impostor' | 'quiz'>
  currentRoundIndex: number
  scoreSnapshot: Array<{ id: string; name: string; color: string; score: number }>
}

export type Room = {
  code: string
  hostId: string
  players: Player[]
  currentGame: GameId
  vinteEUm: VinteEUmState | null
  impostor: ImpostorState | null
  quiz: QuizState | null
  ranking: RankingState | null
  party: PartyState | null
  version: number
  announcement: string | null
}
