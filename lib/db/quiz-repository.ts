import { db } from './client'

export type QuizQuestionRow = {
  id: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_index: number
  category: string
  active: number
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
    correctIndex: row.correct_index,
    category: row.category,
    active: row.active === 1,
  }
}

export function listQuizQuestions() {
  const rows = db
    .prepare('SELECT * FROM quiz_questions ORDER BY created_at DESC')
    .all() as unknown as QuizQuestionRow[]
  return rows.map(toDomain)
}

export function listActiveQuizQuestions() {
  const rows = db
    .prepare('SELECT * FROM quiz_questions WHERE active = 1')
    .all() as unknown as QuizQuestionRow[]
  return rows.map(toDomain)
}

export function pickQuizQuestions(count: number = 5) {
  const all = listActiveQuizQuestions()
  const shuffled = [...all].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function createQuizQuestion(input: QuizQuestionInput) {
  const stmt = db.prepare(`
    INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_index, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    input.question,
    input.options[0],
    input.options[1],
    input.options[2],
    input.options[3],
    input.correctIndex,
    input.category,
  )
  return String(result.lastInsertRowid)
}

export function updateQuizQuestion(id: string, input: QuizQuestionInput) {
  db.prepare(`
    UPDATE quiz_questions
    SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_index = ?, category = ?
    WHERE id = ?
  `).run(
    input.question,
    input.options[0],
    input.options[1],
    input.options[2],
    input.options[3],
    input.correctIndex,
    input.category,
    Number(id),
  )
}

export function setQuizQuestionActive(id: string, active: boolean) {
  db.prepare('UPDATE quiz_questions SET active = ? WHERE id = ?').run(active ? 1 : 0, Number(id))
}

export function deleteQuizQuestion(id: string) {
  db.prepare('DELETE FROM quiz_questions WHERE id = ?').run(Number(id))
}

export function countQuizQuestions() {
  const row = db.prepare('SELECT COUNT(*) as c FROM quiz_questions').get() as { c: number }
  return row.c
}
