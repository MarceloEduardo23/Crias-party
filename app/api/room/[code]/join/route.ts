import { NextResponse } from 'next/server'
import { joinRoom } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const { name } = (await req.json()) as { name?: string }
  const result = joinRoom(code.toUpperCase(), name ?? '')
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json({ playerId: result.playerId })
}
