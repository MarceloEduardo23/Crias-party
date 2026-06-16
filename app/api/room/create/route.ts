import { NextResponse } from 'next/server'
import { createRoom } from '@/lib/room-store'

export const dynamic = 'force-dynamic'

export async function POST() {
  const { room, hostId } = createRoom()
  return NextResponse.json({ code: room.code, hostId })
}
