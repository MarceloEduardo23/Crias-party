import { NextResponse } from 'next/server'
import { listImpostorItems, createImpostorItem } from '@/lib/db/impostor-repository'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'crias-admin-2024'

function checkAuth(req: Request) {
  return req.headers.get('x-admin-secret') === ADMIN_SECRET
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ items: listImpostorItems() })
}

export async function POST(req: Request) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json() as {
    name: string
    category: string
    emoji: string
    imageUrl: string | null
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }

  const id = createImpostorItem({
    name: body.name.trim(),
    category: body.category?.trim() || 'Geral',
    emoji: body.emoji?.trim() || '❓',
    imageUrl: body.imageUrl?.trim() || null,
  })
  return NextResponse.json({ ok: true, id })
}
