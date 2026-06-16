'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Eye, Send } from 'lucide-react'
import { useState } from 'react'
import { useSound } from '@/components/sound-provider'
import { sendAction } from '@/lib/use-room'
import type { Player, Room } from '@/lib/types'

export function PhoneImpostor({ room, me }: { room: Room; me: Player }) {
  const st = room.impostor
  const { play } = useSound()
  const [revealed, setRevealed] = useState(false)
  const [clue, setClue] = useState('')
  const [voted, setVoted] = useState<string | null>(null)

  if (!st) return null

  const amImpostor = st.impostorIds.includes(me.id)
  const myWord = st.assignments[me.id]
  const inGame = me.id in st.assignments

  if (!inGame) {
    return (
      <Center>
        <p className="font-heading text-2xl font-bold">Você entrou tarde!</p>
        <p className="text-muted-foreground">Aguarde a próxima rodada.</p>
      </Center>
    )
  }

  // ----- reveal role -----
  if (st.phase === 'reveal-role') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        {/* Animal image shown to everyone */}
        <div className="overflow-hidden rounded-3xl border-2 border-border" style={{ width: '100%', maxWidth: 240, height: 160 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={st.animalImage}
            alt="Animal secreto"
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <p className="font-heading text-base text-muted-foreground">
          Essa é a imagem do animal misterioso {st.animalEmoji}
        </p>

        <button
          type="button"
          onClick={() => {
            play(revealed ? 'click' : 'reveal')
            setRevealed((r) => !r)
          }}
          className="w-full max-w-xs"
          aria-label="Toque para ver seu papel"
        >
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-secondary bg-card/60 p-8"
              >
                <Eye className="size-10 text-secondary" />
                <span className="font-heading text-xl font-bold">Toque para ver seu papel</span>
                <span className="text-sm text-muted-foreground">(esconda dos outros!)</span>
              </motion.div>
            ) : (
              <motion.div
                key="shown"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`flex flex-col items-center justify-center gap-3 rounded-3xl border-2 p-6 ${
                  amImpostor
                    ? 'border-primary bg-primary/15'
                    : 'border-accent bg-accent/10'
                }`}
              >
                {amImpostor ? (
                  <>
                    <span className="font-heading text-5xl">😈</span>
                    <span className="font-heading text-sm font-bold uppercase tracking-widest text-primary">
                      Você é o
                    </span>
                    <span className="font-heading text-4xl font-bold text-primary">
                      IMPOSTOR
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Você não sabe o nome do animal! Finja que sabe e não seja descoberto.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="font-heading text-5xl">{st.animalEmoji}</span>
                    <span className="font-heading text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      O animal é
                    </span>
                    <span className="font-heading text-4xl font-bold text-accent">
                      {myWord}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dê dicas sem revelar o nome diretamente!
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    )
  }

  // ----- clues -----
  if (st.phase === 'clues') {
    const isMyTurn = st.activePlayerId === me.id
    const myClue = st.clues[me.id]

    return (
      <div className="flex flex-1 flex-col gap-5">
        {/* Small animal image */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-3">
          <div className="overflow-hidden rounded-xl" style={{ width: 56, height: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={st.animalImage} alt="" className="h-full w-full object-cover" crossOrigin="anonymous" />
          </div>
          <div>
            <p className="font-heading text-xs text-muted-foreground">Animal</p>
            <p className="font-heading font-bold text-base">
              {amImpostor ? <span className="text-primary">??? (você não sabe!) 😈</span> : <span className="text-accent">{st.animalEmoji} {myWord}</span>}
            </p>
          </div>
        </div>

        {isMyTurn && !myClue ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-1 flex-col gap-4"
          >
            <p className="font-heading text-center text-2xl font-bold text-accent">
              Sua vez! Dê uma dica:
            </p>
            <input
              value={clue}
              onChange={(e) => setClue(e.target.value.slice(0, 18))}
              placeholder="Uma palavra..."
              autoFocus
              className="w-full rounded-2xl border-2 border-secondary bg-card py-4 text-center font-heading text-2xl font-bold outline-none focus:border-accent"
            />
            <button
              type="button"
              disabled={!clue.trim()}
              onClick={() => {
                if (!clue.trim()) return
                play('whoosh')
                void sendAction(room.code, { type: 'imp-clue', playerId: me.id, clue })
                setClue('')
              }}
              className="flex items-center justify-center gap-2 rounded-3xl border-b-4 border-secondary/40 bg-secondary py-4 font-heading text-xl font-bold text-secondary-foreground disabled:opacity-50"
            >
              <Send className="size-5" /> Enviar dica
            </button>
          </motion.div>
        ) : (
          <Center>
            {myClue ? (
              <>
                <p className="font-heading text-lg text-muted-foreground">Sua dica:</p>
                <p className="font-heading text-3xl font-bold text-secondary">"{myClue}"</p>
                <p className="text-sm text-muted-foreground">Aguardando os outros...</p>
              </>
            ) : (
              <>
                <div className="font-heading text-4xl animate-wiggle">⏳</div>
                <p className="font-heading text-xl font-bold">
                  Vez de{' '}
                  <span className="text-accent">
                    {room.players.find(p => p.id === st.activePlayerId)?.name ?? '...'}
                  </span>
                </p>
              </>
            )}
          </Center>
        )}
      </div>
    )
  }

  // ----- voting -----
  if (st.phase === 'voting') {
    const myVote = st.votes[me.id] ?? voted

    if (myVote) {
      return (
        <Center>
          <p className="font-heading text-xl font-bold text-muted-foreground">Você votou em</p>
          <p className="font-heading text-3xl font-bold text-primary">
            {room.players.find(p => p.id === myVote)?.name ?? '?'}
          </p>
          <p className="text-sm text-muted-foreground">
            {Object.keys(st.votes).length}/{st.order.length} votaram
          </p>
        </Center>
      )
    }

    return (
      <div className="flex flex-1 flex-col gap-4">
        <p className="font-heading text-center text-xl font-bold">Quem é o impostor? 🕵️</p>
        <div className="grid grid-cols-2 gap-3">
          {room.players
            .filter(p => p.id !== me.id)
            .map(player => (
              <motion.button
                key={player.id}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  play('click')
                  setVoted(player.id)
                  void sendAction(room.code, { type: 'imp-vote', playerId: me.id, votedForId: player.id })
                }}
                className="flex flex-col items-center gap-2 rounded-3xl border-2 border-border bg-card p-5 hover:border-primary"
              >
                <div
                  className="flex size-12 items-center justify-center rounded-full font-heading text-2xl font-bold text-background"
                  style={{ background: player.color }}
                >
                  {player.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-heading font-bold text-base">{player.name}</span>
              </motion.button>
            ))}
        </div>
      </div>
    )
  }

  // ----- result -----
  if (st.phase === 'result') {
    const caught = st.ejectedId !== null && st.impostorIds.includes(st.ejectedId)
    const iWasImpostor = st.impostorIds.includes(me.id)

    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className="overflow-hidden rounded-3xl border-2 border-secondary/40" style={{ width: '100%', maxWidth: 200, height: 140 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={st.animalImage} alt={st.animalName} className="h-full w-full object-cover" crossOrigin="anonymous" />
        </div>
        <p className="font-heading text-2xl font-bold">
          {st.animalEmoji} {st.animalName}
        </p>
        <div className={`rounded-3xl border-2 p-5 w-full ${
          (caught && !iWasImpostor) || (!caught && iWasImpostor)
            ? 'border-green-500/60 bg-green-500/10 text-green-300'
            : 'border-primary/60 bg-primary/10 text-primary'
        }`}>
          <p className="font-heading text-xl font-bold">
            {iWasImpostor
              ? (caught ? '😭 Te pegaram!' : '😈 Você ganhou!')
              : (caught ? '🎉 A turma ganhou!' : '😱 O impostor escapou!')}
          </p>
          <p className="text-sm mt-1 text-muted-foreground">
            {st.impostorIds.map(id => room.players.find(p => p.id === id)?.name).join(', ')} era o impostor
          </p>
        </div>
        <p className="font-heading text-2xl font-bold">
          Seus pontos: <span style={{ color: me.color }}>{me.score}</span>
        </p>
      </div>
    )
  }

  return null
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      {children}
    </div>
  )
}
