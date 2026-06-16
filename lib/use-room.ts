'use client'

import { useEffect, useRef, useState } from 'react'
import type { Room } from './types'

type RoomStatus = 'connecting' | 'open' | 'not-found'

export function useRoom(code: string | null) {
  const [room, setRoom] = useState<Room | null>(null)
  const [status, setStatus] = useState<RoomStatus>('connecting')
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!code) return
    const es = new EventSource(`/api/room/${code}/events`)
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.notFound) {
          setStatus('not-found')
          setRoom(null)
          return
        }
        setStatus('open')
        setRoom(data as Room)
      } catch {
        // ignore malformed
      }
    }

    es.onerror = () => {
      // EventSource auto-reconnects; keep last known state
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [code])

  return { room, status }
}

export async function sendAction(
  code: string,
  body: Record<string, unknown>,
): Promise<void> {
  await fetch(`/api/room/${code}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
