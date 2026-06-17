import { NextResponse } from 'next/server'
import { getRoom, startParty, setGame, resetScores, advanceFromRanking } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'crias-admin-2024'

export async function POST(req: Request) {
  const auth = req.headers.get('x-admin-secret')
  if (auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { code, action, game } = await req.json() as { code: string; action: string; game?: string }
  const room = getRoom(code)
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

  switch (action) {
    case 'start-party':
      await startParty(code)
      break
    case 'reset-scores':
      resetScores(code)
      break
    case 'set-game':
      if (game) await setGame(code, game as any)
      break
    case 'advance-ranking':
      await advanceFromRanking(code)
      break
    case 'go-lobby':
      await setGame(code, 'lobby')
      break
  }
  return NextResponse.json({ ok: true })
}
