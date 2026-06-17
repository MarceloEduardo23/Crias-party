import { NextResponse } from 'next/server'
import { updateImpostorItem, deleteImpostorItem, setImpostorItemActive } from '@/lib/db/impostor-repository'
import { ensureSeeded } from '@/lib/db/init'

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
  await ensureSeeded()
  const { id } = await params
  const body = await req.json() as {
    name?: string
    category?: string
    emoji?: string
    imageUrl?: string | null
    active?: boolean
  }

  if (typeof body.active === 'boolean' && body.name === undefined) {
    await setImpostorItemActive(id, body.active)
    return NextResponse.json({ ok: true })
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }

  await updateImpostorItem(id, {
    name: body.name.trim(),
    category: body.category?.trim() || 'Geral',
    emoji: body.emoji?.trim() || '❓',
    imageUrl: body.imageUrl?.trim() || null,
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureSeeded()
  const { id } = await params
  await deleteImpostorItem(id)
  return NextResponse.json({ ok: true })
}
