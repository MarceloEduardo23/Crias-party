'use client'

import { motion } from 'motion/react'
import { Trophy, Crown, ArrowRight, Star, PartyPopper } from 'lucide-react'
import { Confetti } from '@/components/confetti'
import { TvTopbar } from '@/components/tv/tv-topbar'
import { sendAction } from '@/lib/use-room'
import { useSound } from '@/components/sound-provider'
import type { Room } from '@/lib/types'
import { useState } from 'react'

const MEDAL = ['🥇', '🥈', '🥉']

export function TvRanking({ room }: { room: Room }) {
  const st = room.ranking
  const { play } = useSound()
  const [fired] = useState(1)

  if (!st) return null

  const isGameOver = st.isGameOver || room.party?.phase === 'gameover'
  const roundNumber = st.roundNumber ?? room.party?.roundNumber ?? 1
  const totalRounds = room.party?.totalRounds ?? 3

  function handleNext() {
    play('whoosh')
    void sendAction(room.code, { type: 'advance-from-ranking' })
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-8">
      {isGameOver && <Confetti fire={fired} />}
      <TvTopbar code={room.code} title={isGameOver ? 'Fim de Jogo!' : `Ranking — Rodada ${roundNumber}`} />

      <div className="text-center">
        {isGameOver ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <h2 className="font-heading text-5xl font-bold text-accent text-shadow-pop">
              🏆 VENCEDOR 🏆
            </h2>
            {st.snapshot[0] && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-2 font-heading text-4xl font-bold"
                style={{ color: st.snapshot[0].color }}
              >
                {st.snapshot[0].name}!
              </motion.p>
            )}
          </motion.div>
        ) : (
          <h2 className="font-heading text-3xl font-bold text-muted-foreground">
            Fim da rodada {roundNumber} de {totalRounds}
          </h2>
        )}
      </div>

      {/* Podium for game over */}
      {isGameOver && st.snapshot.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-end justify-center gap-4 px-8"
        >
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2">
            <div className="font-heading text-4xl">🥈</div>
            <div className="rounded-3xl border-2 border-border bg-card/60 px-6 py-3 text-center">
              <div className="font-heading text-xl font-bold" style={{ color: st.snapshot[1].color }}>
                {st.snapshot[1].name}
              </div>
              <div className="font-heading text-2xl font-bold text-muted-foreground">
                {st.snapshot[1].score} pts
              </div>
            </div>
            <div className="h-16 w-24 rounded-t-2xl bg-muted/40" />
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="font-heading text-5xl"
            >
              🥇
            </motion.div>
            <div className="rounded-3xl border-2 bg-primary/20 px-8 py-4 text-center border-primary/50">
              <div className="font-heading text-2xl font-bold" style={{ color: st.snapshot[0].color }}>
                {st.snapshot[0].name}
              </div>
              <div className="font-heading text-3xl font-bold text-accent">
                {st.snapshot[0].score} pts
              </div>
            </div>
            <div className="h-24 w-28 rounded-t-2xl bg-primary/20" />
          </div>
          {/* 3rd */}
          {st.snapshot[2] && (
            <div className="flex flex-col items-center gap-2">
              <div className="font-heading text-4xl">🥉</div>
              <div className="rounded-3xl border-2 border-border bg-card/60 px-6 py-3 text-center">
                <div className="font-heading text-xl font-bold" style={{ color: st.snapshot[2].color }}>
                  {st.snapshot[2].name}
                </div>
                <div className="font-heading text-2xl font-bold text-muted-foreground">
                  {st.snapshot[2].score} pts
                </div>
              </div>
              <div className="h-10 w-24 rounded-t-2xl bg-muted/40" />
            </div>
          )}
        </motion.div>
      )}

      {/* Full list */}
      <div className="flex flex-col gap-3">
        {st.snapshot.map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`flex items-center gap-4 rounded-3xl border-2 p-4 ${
              idx === 0
                ? 'border-accent/60 bg-accent/10'
                : 'border-border bg-card/60'
            }`}
          >
            <span className="w-10 text-center font-heading text-3xl">
              {idx < 3 ? MEDAL[idx] : `${idx + 1}º`}
            </span>
            <div
              className="h-3 w-3 rounded-full"
              style={{ background: player.color }}
            />
            <span className="flex-1 font-heading text-2xl font-bold">{player.name}</span>
            <span
              className="font-heading text-3xl font-bold"
              style={{ color: player.color }}
            >
              {player.score} pts
            </span>
            {idx === 0 && <Crown className="size-6 text-accent" />}
          </motion.div>
        ))}
      </div>

      {/* Action button */}
      {!isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-3 rounded-3xl border-b-6 border-primary/40 bg-primary px-10 py-5 font-heading text-2xl font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Próxima rodada <ArrowRight className="size-7" />
          </button>
        </motion.div>
      )}

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center"
        >
          <button
            type="button"
            onClick={() => { play('whoosh'); void sendAction(room.code, { type: 'set-game', game: 'lobby' }) }}
            className="flex items-center gap-3 rounded-3xl border-b-6 border-secondary/40 bg-secondary px-10 py-5 font-heading text-2xl font-bold text-secondary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <PartyPopper className="size-7" /> Jogar de novo!
          </button>
        </motion.div>
      )}
    </div>
  )
}
