'use client'

import { Home } from 'lucide-react'
import { Logo } from '@/components/logo'
import { useSound } from '@/components/sound-provider'
import { sendAction } from '@/lib/use-room'

export function TvTopbar({
  code,
  title,
}: {
  code: string
  title: string
}) {
  const { play } = useSound()
  return (
    <header className="relative z-10 flex items-center justify-between gap-4">
      <Logo size="sm" />
      <h1 className="font-heading text-xl font-bold text-muted-foreground sm:text-2xl">
        {title}
      </h1>
      <button
        type="button"
        onClick={() => {
          play('click')
          void sendAction(code, { type: 'set-game', game: 'lobby' })
        }}
        className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-2 font-semibold transition-transform hover:scale-105 active:scale-95"
      >
        <Home className="size-5" />
        <span className="hidden sm:inline">Lobby</span>
      </button>
    </header>
  )
}
