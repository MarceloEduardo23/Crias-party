'use client'

import { motion } from 'motion/react'
import { Trophy, Crown } from 'lucide-react'
import type { Player, Room } from '@/lib/types'

const MEDAL = ['🥇', '🥈', '🥉']

export function PhoneRanking({ room, me }: { room: Room; me: Player }) {
  const st = room.ranking
  if (!st) return null

  const myRank = st.snapshot.findIndex(p => p.id === me.id) + 1
  const isGameOver = st.isGameOver || room.party?.phase === 'gameover'

  return (
    <div className="relative z-10 flex flex-1 flex-col gap-4">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-bold">
          {isGameOver ? '🏆 Fim de Jogo!' : '📊 Ranking'}
        </h2>
        {!isGameOver && (
          <p className="text-muted-foreground font-heading text-sm mt-1">
            Rodada {st.roundNumber} de {room.party?.totalRounds ?? 3}
          </p>
        )}
      </div>

      {/* My position highlight */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl border-2 p-4 text-center"
        style={{ borderColor: me.color, background: `${me.color}15` }}
      >
        <p className="font-heading text-lg text-muted-foreground">Sua posição</p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-heading text-5xl font-bold">
            {myRank <= 3 ? MEDAL[myRank - 1] : `${myRank}º`}
          </span>
          <div>
            <p className="font-heading text-2xl font-bold" style={{ color: me.color }}>
              {me.name}
            </p>
            <p className="font-heading text-xl text-muted-foreground">{me.score} pts</p>
          </div>
        </div>
      </motion.div>

      {/* Full ranking */}
      <div className="flex flex-col gap-2">
        {st.snapshot.map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${
              player.id === me.id
                ? 'border-accent/60 bg-accent/10'
                : 'border-border bg-card/60'
            }`}
          >
            <span className="w-8 text-center font-heading text-xl">
              {idx < 3 ? MEDAL[idx] : `${idx + 1}º`}
            </span>
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: player.color }} />
            <span className="flex-1 font-heading font-bold text-base">{player.name}</span>
            <span className="font-heading font-bold" style={{ color: player.color }}>
              {player.score} pts
            </span>
            {idx === 0 && <Crown className="size-4 text-accent" />}
          </motion.div>
        ))}
      </div>

      {!isGameOver && (
        <p className="text-center font-heading text-sm text-muted-foreground mt-auto pb-2">
          Aguardando o host para a próxima rodada...
        </p>
      )}

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl border-2 border-primary/40 bg-primary/10 p-4 text-center mt-auto"
        >
          <p className="font-heading text-xl font-bold text-primary">
            Jogo encerrado! 🎉
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Aguarde o host para jogar de novo.
          </p>
        </motion.div>
      )}
    </div>
  )
}
