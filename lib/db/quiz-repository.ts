import { sql, ensureSchema } from './client'
import { getMemState, type MemQuizQuestion } from './memory-fallback'

export type QuizQuestionRow = {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_index: number
  category: string
  active: boolean
  created_at: string
}

export type QuizQuestionInput = {
  question: string
  options: [string, string, string, string]
  correctIndex: number
  category: string
}

export type QuizQuestionDomain = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  category: string
  active: boolean
}

function toDomain(row: QuizQuestionRow): QuizQuestionDomain {
  return {
    id: String(row.id),
    question: row.question,
    options: [row.option_a, row.option_b, row.option_c, row.option_d],
    correctIndex: row.correct_index,
    category: row.category,
    active: row.active,
  }
}

export async function listQuizQuestions(): Promise<QuizQuestionDomain[]> {
  if (!sql) {
    const mem = getMemState()
    return [...mem.quizQuestions].sort((a, b) => Number(b.id) - Number(a.id))
  }
  await ensureSchema()
  const rows = (await sql.query(
    'SELECT * FROM quiz_questions ORDER BY created_at DESC',
  )) as unknown as QuizQuestionRow[]
  return rows.map(toDomain)
}

export async function listActiveQuizQuestions(): Promise<QuizQuestionDomain[]> {
  if (!sql) {
    const mem = getMemState()
    return mem.quizQuestions.filter((q) => q.active)
  }
  await ensureSchema()
  const rows = (await sql.query(
    'SELECT * FROM quiz_questions WHERE active = true',
  )) as unknown as QuizQuestionRow[]
  return rows.map(toDomain)
}

export async function pickQuizQuestions(count: number = 5) {
  const all = await listActiveQuizQuestions()
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export async function createQuizQuestion(input: QuizQuestionInput): Promise<string> {
  if (!sql) {
    const mem = getMemState()
    const id = String(mem.nextQuizId++)
    mem.quizQuestions.unshift({
      id,
      question: input.question,
      options: input.options,
      correctIndex: input.correctIndex,
      category: input.category,
      active: true,
    })
    return id
  }
  await ensureSchema()
  const rows = (await sql.query(
    `INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_index, category)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [
      input.question,
      input.options[0],
      input.options[1],
      input.options[2],
      input.options[3],
      input.correctIndex,
      input.category,
    ],
  )) as unknown as { id: number }[]
  return String(rows[0].id)
}

export async function updateQuizQuestion(id: string, input: QuizQuestionInput): Promise<void> {
  if (!sql) {
    const mem = getMemState()
    const item = mem.quizQuestions.find((q) => q.id === id)
    if (item) {
      item.question = input.question
      item.options = input.options
      item.correctIndex = input.correctIndex
      item.category = input.category
    }
    return
  }
  await ensureSchema()
  await sql.query(
    `UPDATE quiz_questions
     SET question = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_index = $6, category = $7
     WHERE id = $8`,
    [
      input.question,
      input.options[0],
      input.options[1],
      input.options[2],
      input.options[3],
      input.correctIndex,
      input.category,
      Number(id),
    ],
  )
}

export async function setQuizQuestionActive(id: string, active: boolean): Promise<void> {
  if (!sql) {
    const mem = getMemState()
    const item = mem.quizQuestions.find((q) => q.id === id)
    if (item) item.active = active
    return
  }
  await ensureSchema()
  await sql.query('UPDATE quiz_questions SET active = $1 WHERE id = $2', [active, Number(id)])
}

export async function deleteQuizQuestion(id: string): Promise<void> {
  if (!sql) {
    const mem = getMemState()
    mem.quizQuestions = mem.quizQuestions.filter((q) => q.id !== id)
    return
  }
  await ensureSchema()
  await sql.query('DELETE FROM quiz_questions WHERE id = $1', [Number(id)])
}

export async function countQuizQuestions(): Promise<number> {
  if (!sql) {
    return getMemState().quizQuestions.length
  }
  await ensureSchema()
  const rows = (await sql.query('SELECT COUNT(*) as c FROM quiz_questions')) as unknown as { c: string }[]
  return Number(rows[0].c)
}
