// Fallback simples em memória, usado apenas quando DATABASE_URL não está
// configurada (ex: desenvolvimento local sem Neon). Não persiste entre
// reinícios do processo — é só para não quebrar o app antes de configurar
// o banco de verdade.

import { QUIZ_QUESTIONS } from '../quiz-questions'
import { ANIMALS } from '../animals'
import { WORD_PAIRS } from '../impostor-words'

export type MemQuizQuestion = {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: number
  category: string
  active: boolean
}

export type MemImpostorItem = {
  id: string
  name: string
  category: string
  emoji: string
  imageUrl: string | null
  active: boolean
}

type MemState = {
  quizQuestions: MemQuizQuestion[]
  impostorItems: MemImpostorItem[]
  nextQuizId: number
  nextImpostorId: number
}

type GlobalWithMem = typeof globalThis & { __criasMemDb?: MemState }
const g = globalThis as GlobalWithMem

function seedInitial(): MemState {
  const quizQuestions: MemQuizQuestion[] = QUIZ_QUESTIONS.map((q, i) => ({
    id: String(i + 1),
    question: q.question,
    options: q.options as [string, string, string, string],
    correctIndex: q.correctIndex,
    category: q.category,
    active: true,
  }))

  let idCounter = 1
  const impostorItems: MemImpostorItem[] = [
    ...ANIMALS.map((a) => ({
      id: String(idCounter++),
      name: a.name,
      category: 'Animais',
      emoji: a.emoji,
      imageUrl: a.imageUrl,
      active: true,
    })),
    ...WORD_PAIRS.map((p) => ({
      id: String(idCounter++),
      name: p.word,
      category: p.category,
      emoji: p.emoji,
      imageUrl: p.imageUrl,
      active: true,
    })),
  ]

  return {
    quizQuestions,
    impostorItems,
    nextQuizId: quizQuestions.length + 1,
    nextImpostorId: impostorItems.length + 1,
  }
}

export function getMemState(): MemState {
  if (!g.__criasMemDb) g.__criasMemDb = seedInitial()
  return g.__criasMemDb
}
