'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Spade, UserSearch, Users, Zap, BrainCircuit, Trophy } from 'lucide-react'
import { Logo } from '@/components/logo'
import { PlayerBadge } from '@/components/player-badge'
import { useSound } from '@/components/sound-provider'
import { sendAction } from '@/lib/use-room'
import type { Room } from '@/lib/types'

export function TvLobby({ room }: { room: Room }) {
  const { play } = useSound()
  const canStart = room.players.length >= 2
  const joinUrl =
    typeof window !== 'undefined' ? `${window.location.host}` : ''

  function startParty() {
    if (!canStart) { play('lose'); return }
    play('whoosh')
    void sendAction(room.code, { type: 'start-party' })
  }

  function pick(game: 'vinte-e-um' | 'impostor' | 'quiz') {
    if (!canStart) { play('lose'); return }
    play('whoosh')
    void sendAction(room.code, { type: 'set-game', game })
  }

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <Logo size="sm" />
        <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-2 font-semibold text-muted-foreground">
          <Users className="size-5" />
          {room.players.length}/10
        </div>
      </header>

      <div className="grid flex-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Join panel */}
        <div className="flex flex-col items-center justify-center gap-6 rounded-4xl border-2 border-border bg-card/60 p-8 text-center">
          <p className="font-heading text-xl font-semibold text-muted-foreground">
            Entre pelo celular em
          </p>
          <p className="font-heading text-2xl font-bold text-secondary">
            {joinUrl || 'este site'}
          </p>
          <p className="font-heading text-lg text-muted-foreground">com o código</p>
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="rounded-3xl border-b-8 border-primary/40 bg-primary px-8 py-6"
          >
            <span className="font-heading text-6xl font-bold tracking-[0.2em] text-primary-foreground sm:text-7xl">
              {room.code}
            </span>
          </motion.div>

          {/* Players list */}
          <div className="w-full">
            {room.players.length === 0 ? (
              <p className="text-muted-foreground">Esperando a galera entrar...</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-2">
                <AnimatePresence>
                  {room.players.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-full border-2 px-4 py-1 font-heading text-lg font-bold"
                      style={{ borderColor: p.color, color: p.color }}
                    >
                      {p.name}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Game pick */}
        <div className="flex flex-col gap-5">
          {!canStart && (
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-heading text-xl font-bold text-accent text-center"
            >
              Precisa de pelo menos 2 jogadores para começar! 👾
            </motion.p>
          )}

          {/* Party Mode - big button */}
          <motion.button
            type="button"
            whileHover={canStart ? { scale: 1.03, rotate: -0.5 } : undefined}
            whileTap={canStart ? { scale: 0.97 } : undefined}
            onClick={startParty}
            disabled={!canStart}
            className={`flex flex-col items-start gap-3 rounded-4xl border-b-8 border-primary/30 bg-primary/20 p-7 text-left transition-opacity ${!canStart ? 'cursor-not-allowed opacity-50' : 'hover:bg-primary/30'}`}
          >
            <div className="flex items-center gap-3">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Zap className="size-7" />
              </span>
              <div>
                <div className="font-heading text-3xl font-bold text-primary">
                  🎉 Modo Festa
                </div>
                <div className="font-heading text-sm text-muted-foreground">RECOMENDADO</div>
              </div>
            </div>
            <p className="text-base text-muted-foreground">
              3 rodadas de jogos aleatórios com ranking ao final. A experiência completa!
            </p>
          </motion.button>

          <div className="grid gap-4 sm:grid-cols-3">
            <GameCard
              title="Vinte e Um"
              desc="Chegue mais perto de 21 sem estourar."
              icon={<Spade className="size-6" />}
              accent="oklch(0.68 0.26 12)"
              disabled={!canStart}
              onClick={() => pick('vinte-e-um')}
            />
            <GameCard
              title="Impostor"
              desc="Descubra quem não conhece o animal secreto."
              icon={<UserSearch className="size-6" />}
              accent="oklch(0.72 0.18 210)"
              disabled={!canStart}
              onClick={() => pick('impostor')}
            />
            <GameCard
              title="Quiz"
              desc="Responda rápido e ganhe pontos."
              icon={<BrainCircuit className="size-6" />}
              accent="oklch(0.85 0.19 90)"
              disabled={!canStart}
              onClick={() => pick('quiz')}
            />
          </div>

          {room.players.length > 0 && (
            <div className="rounded-3xl border-2 border-border bg-card/60 p-5">
              <div className="mb-3 flex items-center gap-2 font-heading text-lg font-bold">
                <Trophy className="size-5 text-accent" /> Placar atual
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <AnimatePresence>
                  {room.players.map((p) => (
                    <PlayerBadge
                      key={p.id}
                      player={p}
                      subtitle={`${p.score} ${p.score === 1 ? 'ponto' : 'pontos'}`}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GameCard({
  title, desc, icon, accent, disabled, onClick,
}: {
  title: string; desc: string; icon: React.ReactNode; accent: string; disabled: boolean; onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.05, rotate: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      className={`flex flex-col items-start gap-2 rounded-3xl border-2 border-border bg-card p-5 text-left transition-opacity ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span
        className="flex size-12 items-center justify-center rounded-2xl text-background"
        style={{ background: accent }}
      >
        {icon}
      </span>
      <span className="font-heading text-xl font-bold">{title}</span>
      <span className="text-xs text-muted-foreground">{desc}</span>
    </motion.button>
  )
}
