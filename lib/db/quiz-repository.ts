import { db, ensureSchema } from './client'

export type QuizQuestionRow = {
  id: number | bigint
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_index: number | bigint
  category: string
  active: number | bigint
  created_at: string
}

export type QuizQuestionInput = {
  question: string
  options: [string, string, string, string]
  correctIndex: number
  category: string
}

function toDomain(row: QuizQuestionRow) {
  return {
    id: String(row.id),
    question: row.question,
    options: [row.option_a, row.option_b, row.option_c, row.option_d],
    correctIndex: Number(row.correct_index),
    category: row.category,
    active: Number(row.active) === 1,
  }
}

export async function listQuizQuestions() {
  await ensureSchema()
  const res = await db.execute('SELECT * FROM quiz_questions ORDER BY created_at DESC')
  return (res.rows as unknown as QuizQuestionRow[]).map(toDomain)
}

export async function listActiveQuizQuestions() {
  await ensureSchema()
  const res = await db.execute('SELECT * FROM quiz_questions WHERE active = 1')
  return (res.rows as unknown as QuizQuestionRow[]).map(toDomain)
}

export async function pickQuizQuestions(count: number = 5) {
  const all = await listActiveQuizQuestions()
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export async function createQuizQuestion(input: QuizQuestionInput) {
  await ensureSchema()
  const res = await db.execute({
    sql: `INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_index, category)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.question,
      input.options[0],
      input.options[1],
      input.options[2],
      input.options[3],
      input.correctIndex,
      input.category,
    ],
  })
  return String(res.lastInsertRowid)
}

export async function updateQuizQuestion(id: string, input: QuizQuestionInput) {
  await ensureSchema()
  await db.execute({
    sql: `UPDATE quiz_questions
          SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_index = ?, category = ?
          WHERE id = ?`,
    args: [
      input.question,
      input.options[0],
      input.options[1],
      input.options[2],
      input.options[3],
      input.correctIndex,
      input.category,
      Number(id),
    ],
  })
}

export async function setQuizQuestionActive(id: string, active: boolean) {
  await ensureSchema()
  await db.execute({
    sql: 'UPDATE quiz_questions SET active = ? WHERE id = ?',
    args: [active ? 1 : 0, Number(id)],
  })
}

export async function deleteQuizQuestion(id: string) {
  await ensureSchema()
  await db.execute({ sql: 'DELETE FROM quiz_questions WHERE id = ?', args: [Number(id)] })
}

export async function countQuizQuestions() {
  await ensureSchema()
  const res = await db.execute('SELECT COUNT(*) as c FROM quiz_questions')
  return Number((res.rows[0] as unknown as { c: number | bigint }).c)
}
