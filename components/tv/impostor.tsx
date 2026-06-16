'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Eye, Play, RotateCcw, Vote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Confetti } from '@/components/confetti'
import { useSound } from '@/components/sound-provider'
import { TvTopbar } from '@/components/tv/tv-topbar'
import { sendAction } from '@/lib/use-room'
import type { Room } from '@/lib/types'

export function TvImpostor({ room }: { room: Room }) {
  const st = room.impostor
  const { play } = useSound()
  const [fire, setFire] = useState(0)
  const prevPhase = useRef<string | null>(null)

  useEffect(() => {
    if (!st) return
    if (prevPhase.current !== st.phase) {
      if (st.phase === 'result') {
        play('reveal')
        setFire((f) => f + 1)
      } else if (st.phase === 'clues') {
        play('whoosh')
      }
      prevPhase.current = st.phase
    }
  }, [st, play])

  if (!st) return null
  const active = room.players.find((p) => p.id === st.activePlayerId) ?? null

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
      {fire > 0 && <Confetti fire={fire} />}
      <TvTopbar code={room.code} title="Impostor" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <AnimatePresence mode="wait">
          {/* reveal role */}
          {st.phase === 'reveal-role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Animal image - shown to everyone; the trick is the impostor doesn't know the NAME */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.4 }}
                className="relative overflow-hidden rounded-4xl border-4 border-secondary/60 shadow-2xl"
                style={{ width: 280, height: 200 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={st.animalImage}
                  alt="Animal secreto"
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                  <span className="font-heading text-5xl">{st.animalEmoji}</span>
                </div>
              </motion.div>

              <h2 className="text-balance font-heading text-3xl font-bold sm:text-5xl">
                Todos veem esta imagem!
              </h2>
              <p className="max-w-xl text-pretty text-lg text-muted-foreground">
                O <span className="font-bold text-primary">impostor</span> não sabe o nome do animal.
                Dê dicas sem revelar o nome — e tente descobrir quem não sabe! 🕵️
              </p>
              <p className="font-heading text-xl font-bold text-muted-foreground">
                Veja seu papel no celular ↓
              </p>
              <ControlButton
                onClick={() => {
                  play('whoosh')
                  void sendAction(room.code, { type: 'imp-begin-clues' })
                }}
                icon={<Play className="size-6" />}
              >
                Todos viram? Começar dicas
              </ControlButton>
            </motion.div>
          )}

          {/* clues */}
          {st.phase === 'clues' && (
            <motion.div
              key="clues"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full flex-col items-center gap-6"
            >
              <div className="flex items-center gap-6">
                {/* Smaller animal image during clues */}
                <motion.div
                  className="overflow-hidden rounded-3xl border-2 border-secondary/40"
                  style={{ width: 110, height: 80 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={st.animalImage}
                    alt=""
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </motion.div>
                <div className="text-left">
                  <p className="font-heading text-lg text-muted-foreground">
                    Animal: <span className="font-bold text-accent">{st.animalEmoji} ???</span>
                  </p>
                  <p className="text-sm text-muted-foreground">O impostor não sabe o nome!</p>
                </div>
              </div>

              {active && (
                <motion.h2
                  key={active.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-balance font-heading text-3xl font-bold sm:text-5xl"
                >
                  Vez de{' '}
                  <span style={{ color: active.color }}>{active.name}</span> dar
                  uma dica
                </motion.h2>
              )}
              <CluesGrid room={room} />
            </motion.div>
          )}

          {/* voting */}
          {st.phase === 'voting' && (
            <motion.div
              key="vote"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex w-full flex-col items-center gap-6"
            >
              <Vote className="size-16 text-primary" />
              <h2 className="font-heading text-3xl font-bold sm:text-5xl">
                Quem é o impostor?
              </h2>
              <p className="text-lg text-muted-foreground">
                Votem no celular! {Object.keys(st.votes).length}/{st.order.length} já votaram.
              </p>
              <CluesGrid room={room} />
            </motion.div>
          )}

          {/* result */}
          {st.phase === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5"
            >
              <h2 className="font-heading text-4xl font-bold sm:text-6xl">
                {st.impostorsWon ? '😈 O impostor venceu!' : '🎉 Impostor desmascarado!'}
              </h2>
              <p className="text-xl text-muted-foreground">
                {st.ejectedId
                  ? `A galera expulsou ${nameOf(room, st.ejectedId)}.`
                  : 'A votação empatou, ninguém foi expulso!'}
              </p>

              {/* Reveal the animal */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.4, delay: 0.3 }}
                className="flex items-center gap-6 rounded-4xl border-2 border-secondary/40 bg-card p-6"
              >
                <div className="overflow-hidden rounded-3xl" style={{ width: 120, height: 90 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.animalImage} alt={st.animalName} className="h-full w-full object-cover" crossOrigin="anonymous" />
                </div>
                <div className="text-left">
                  <p className="text-muted-foreground">O animal era</p>
                  <p className="font-heading text-4xl font-bold text-accent">
                    {st.animalEmoji} {st.animalName}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {st.impostorIds.length === 1 ? 'O impostor era' : 'Os impostores eram'}{' '}
                    <span className="font-bold text-primary">
                      {st.impostorIds.map((id) => nameOf(room, id)).join(', ')}
                    </span>
                  </p>
                </div>
              </motion.div>

              <ControlButton
                onClick={() => {
                  play('deal')
                  void sendAction(room.code, { type: 'imp-next-round' })
                }}
                icon={<RotateCcw className="size-6" />}
              >
                {room.party ? 'Próxima rodada' : 'Nova rodada'}
              </ControlButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CluesGrid({ room }: { room: Room }) {
  const st = room.impostor!
  return (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {st.order.map((id) => {
        const player = room.players.find((p) => p.id === id)
        if (!player) return null
        const clue = st.clues[id]
        const isActive = st.activePlayerId === id
        return (
          <motion.div
            layout
            key={id}
            animate={isActive ? { scale: 1.05 } : { scale: 1 }}
            className={`flex flex-col gap-1 rounded-2xl border-2 p-3 text-left ${
              isActive ? 'border-accent bg-accent/10' : 'border-border bg-card/70'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex size-7 items-center justify-center rounded-full font-heading text-xs font-bold text-background"
                style={{ background: player.color }}
              >
                {player.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="font-heading font-bold">{player.name}</span>
            </div>
            <p className="font-heading text-xl font-bold text-secondary">
              {clue ? `"${clue}"` : isActive ? 'digitando...' : '—'}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

function ControlButton({
  children, onClick, icon,
}: { children: React.ReactNode; onClick: () => void; icon: React.ReactNode }) {
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
