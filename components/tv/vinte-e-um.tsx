'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Crown, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Confetti } from '@/components/confetti'
import { PlayingCard } from '@/components/playing-card'
import { useSound } from '@/components/sound-provider'
import { TvTopbar } from '@/components/tv/tv-topbar'
import { sendAction } from '@/lib/use-room'
import type { Player, Room, VinteEUmPlayerState } from '@/lib/types'

export function TvVinteEUm({ room }: { room: Room }) {
  const st = room.vinteEUm
  const { play } = useSound()
  const [fire, setFire] = useState(0)
  const prevPhase = useRef<string | null>(null)

  useEffect(() => {
    if (!st) return
    if (prevPhase.current !== st.phase) {
      if (st.phase === 'reveal') {
        if (st.roundWinners.length > 0) {
          play('win')
          setFire((f) => f + 1)
        } else {
          play('lose')
        }
      }
      prevPhase.current = st.phase
    }
  }, [st, play])

  if (!st) return null

  const active = room.players.find((p) => p.id === st.activePlayerId) ?? null

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
      {fire > 0 && <Confetti fire={fire} />}
      <TvTopbar code={room.code} title="Vinte e Um" />

      {/* status banner */}
      <div className="relative z-10 flex flex-col items-center gap-1 text-center">
        <AnimatePresence mode="wait">
          {st.phase === 'dealing' && (
            <Banner key="deal">Cartas na mesa! Pronto para começar?</Banner>
          )}
          {st.phase === 'turns' && active && (
            <Banner key={active.id}>
              Vez de <span style={{ color: active.color }}>{active.name}</span> —
              olhe seu celular!
            </Banner>
          )}
          {st.phase === 'reveal' && (
            <Banner key="rev">
              {st.roundWinners.length === 0
                ? 'Todo mundo estourou! Sem vencedor.'
                : st.roundWinners.length === 1
                  ? `${nameOf(room, st.roundWinners[0])} venceu a rodada!`
                  : 'Empate no topo!'}
            </Banner>
          )}
        </AnimatePresence>
      </div>

      {/* table */}
      <div className="relative z-10 grid flex-1 content-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {st.order.map((id) => {
          const player = room.players.find((p) => p.id === id)
          if (!player) return null
          const hand = st.hands[id]
          const isActive = st.activePlayerId === id
          const isWinner =
            st.phase === 'reveal' && st.roundWinners.includes(id)
          return (
            <PlayerTable
              key={id}
              player={player}
              hand={hand}
              isActive={isActive}
              isWinner={isWinner}
              showResult={st.phase === 'reveal'}
            />
          )
        })}
      </div>

      {/* controls */}
      <div className="relative z-10 flex justify-center gap-4">
        {st.phase === 'dealing' && (
          <ControlButton
            onClick={() => {
              play('whoosh')
              void sendAction(room.code, { type: 'v21-begin-turns' })
            }}
            icon={<Play className="size-6" />}
          >
            Começar rodada
          </ControlButton>
        )}
        {st.phase === 'reveal' && (
          <ControlButton
            onClick={() => {
              play('deal')
              void sendAction(room.code, { type: 'v21-next-round' })
            }}
            icon={<RotateCcw className="size-6" />}
          >
            Próxima rodada
          </ControlButton>
        )}
      </div>
    </div>
  )
}

function PlayerTable({
  player,
  hand,
  isActive,
  isWinner,
  showResult,
}: {
  player: Player
  hand: VinteEUmPlayerState
  isActive: boolean
  isWinner: boolean
  showResult: boolean
}) {
  const h = hand
  return (
    <motion.div
      layout
      animate={
        isActive
          ? { scale: 1.03, boxShadow: '0 0 0 3px var(--accent)' }
          : { scale: 1 }
      }
      className={`flex flex-col gap-3 rounded-3xl border-2 p-4 ${
        isWinner ? 'border-accent bg-accent/10' : 'border-border bg-card/70'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="flex size-9 items-center justify-center rounded-full font-heading text-sm font-bold text-background"
            style={{ background: player.color }}
          >
            {player.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="font-heading font-bold">{player.name}</span>
          {isWinner && <Crown className="size-5 text-accent" />}
        </div>
        <span className="font-heading text-2xl font-bold">{h.total}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {h.hand.map((c, i) => (
          <PlayingCard key={`${c.rank}${c.suit}${i}`} card={c} index={i} size="sm" />
        ))}
      </div>
      {showResult && (
        <StatusPill status={h.status} />
      )}
    </motion.div>
  )
}

function StatusPill({
  status,
}: {
  status: 'playing' | 'stand' | 'bust' | 'blackjack'
}) {
  const map = {
    playing: { label: 'Jogando', cls: 'bg-muted text-muted-foreground' },
    stand: { label: 'Parou', cls: 'bg-secondary text-secondary-foreground' },
    bust: { label: 'Estourou!', cls: 'bg-destructive text-white' },
    blackjack: { label: 'Vinte e Um!', cls: 'bg-accent text-accent-foreground' },
  }[status]
  return (
    <span
      className={`self-start rounded-full px-3 py-1 text-sm font-bold ${map.cls}`}
    >
      {map.label}
    </span>
  )
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.9 }}
      className="text-balance font-heading text-2xl font-bold sm:text-4xl"
    >
      {children}
    </motion.h2>
  )
}

function ControlButton({
  children,
  onClick,
  icon,
}: {
  children: React.ReactNode
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 rounded-3xl border-b-4 border-primary/40 bg-primary px-8 py-4 font-heading text-xl font-bold text-primary-foreground shadow-lg"
    >
      {icon}
      {children}
    </motion.button>
  )
}

function nameOf(room: Room, id: string) {
  return room.players.find((p) => p.id === id)?.name ?? '???'
}
