import { NextResponse } from 'next/server'
import { updateQuizQuestion, deleteQuizQuestion, setQuizQuestionActive } from '@/lib/db/quiz-repository'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'crias-admin-2024'

function checkAuth(req: Request) {
  return req.headers.get('x-admin-secret') === ADMIN_SECRET
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json() as {
    question?: string
    options?: [string, string, string, string]
    correctIndex?: number
    category?: string
    active?: boolean
  }

  if (typeof body.active === 'boolean' && body.question === undefined) {
    setQuizQuestionActive(id, body.active)
    return NextResponse.json({ ok: true })
  }

  if (!body.question?.trim() || !body.options || body.options.length !== 4) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  updateQuizQuestion(id, {
    question: body.question.trim(),
    options: body.options,
    correctIndex: body.correctIndex ?? 0,
    category: body.category?.trim() || 'Geral',
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  deleteQuizQuestion(id)
  return NextResponse.json({ ok: true })
}
