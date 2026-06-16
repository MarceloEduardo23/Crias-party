import { NextResponse } from 'next/server'
import { listQuizQuestions, createQuizQuestion } from '@/lib/db/quiz-repository'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'crias-admin-2024'

function checkAuth(req: Request) {
  return req.headers.get('x-admin-secret') === ADMIN_SECRET
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ questions: listQuizQuestions() })
}

export async function POST(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json() as {
    question: string
    options: [string, string, string, string]
    correctIndex: number
    category: string
  }

  if (!body.question?.trim() || !Array.isArray(body.options) || body.options.length !== 4) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
  if (body.options.some(o => !o?.trim())) {
    return NextResponse.json({ error: 'Todas as 4 opções são obrigatórias' }, { status: 400 })
  }
  if (body.correctIndex < 0 || body.correctIndex > 3) {
    return NextResponse.json({ error: 'Índice da resposta correta inválido' }, { status: 400 })
  }

  const id = createQuizQuestion({
    question: body.question.trim(),
    options: body.options,
    correctIndex: body.correctIndex,
    category: body.category?.trim() || 'Geral',
  })
  return NextResponse.json({ ok: true, id })
}
