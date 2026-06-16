import { NextResponse } from 'next/server'
import { getAllRooms, deleteRoom } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'crias-admin-2024'

function checkAuth(req: Request) {
  const auth = req.headers.get('x-admin-secret')
  return auth === ADMIN_SECRET
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rooms = getAllRooms().map(r => ({
    code: r.code,
    players: r.players.length,
    playerNames: r.players.map(p => p.name),
    currentGame: r.currentGame,
    party: r.party,
    scores: r.players.map(p => ({ name: p.name, score: p.score, color: p.color })),
  }))
  return NextResponse.json({ rooms })
}

export async function DELETE(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { code } = await req.json() as { code: string }
  deleteRoom(code)
  return NextResponse.json({ ok: true })
}
