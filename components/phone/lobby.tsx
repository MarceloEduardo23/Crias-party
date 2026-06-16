'use client'

import { motion } from 'motion/react'
import { PartyPopper } from 'lucide-react'
import { Logo } from '@/components/logo'
import type { Player, Room } from '@/lib/types'

export function PhoneLobby({ room, me }: { room: Room; me: Player }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <Logo size="sm" />

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="flex size-24 items-center justify-center rounded-full text-background"
        style={{ background: me.color }}
      >
        <span className="font-heading text-3xl font-bold">
          {me.name.slice(0, 2).toUpperCase()}
        </span>
      </motion.div>

      <div>
        <p className="font-heading text-3xl font-bold">{me.name}</p>
        <p className="text-muted-foreground">Você está na sala!</p>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-5 py-3 text-muted-foreground">
        <PartyPopper className="size-5 text-accent" />
        <span className="font-semibold">
          Olhe para o telão. O host vai escolher o jogo.
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        {room.players.length}{' '}
        {room.players.length === 1 ? 'jogador' : 'jogadores'} na sala
      </p>
    </div>
  )
}
