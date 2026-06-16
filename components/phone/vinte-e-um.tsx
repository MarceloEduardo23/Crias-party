'use client'

import { motion } from 'motion/react'
import { Hand, Plus } from 'lucide-react'
import { PlayingCard } from '@/components/playing-card'
import { useSound } from '@/components/sound-provider'
import { sendAction } from '@/lib/use-room'
import type { Player, Room } from '@/lib/types'

export function PhoneVinteEUm({ room, me }: { room: Room; me: Player }) {
  const st = room.vinteEUm
  const { play } = useSound()
  if (!st) return null

  const myHand = st.hands[me.id]
  const isMyTurn = st.activePlayerId === me.id && st.phase === 'turns'

  if (!myHand) {
    return (
      <Center>
        <p className="font-heading text-2xl font-bold">Você entrou tarde!</p>
        <p className="text-muted-foreground">
          Aguarde a próxima rodada começar.
        </p>
      </Center>
    )
  }

  function hit() {
    play('deal')
    void sendAction(room.code, { type: 'v21-hit', playerId: me.id })
  }
  function stand() {
    play('click')
    void sendAction(room.code, { type: 'v21-stand', playerId: me.id })
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-6 py-4 text-center">
      <div className="flex flex-col items-center gap-1">
        <p className="font-heading text-lg font-bold" style={{ color: me.color }}>
          {me.name}
        </p>
        <p className="text-sm text-muted-foreground">Sua mão</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2">
          {myHand.hand.map((c, i) => (
            <PlayingCard key={`${c.rank}${c.suit}${i}`} card={c} index={i} />
          ))}
        </div>
        <motion.div
          key={myHand.total}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          className={`rounded-2xl px-6 py-2 font-heading text-3xl font-bold ${
            myHand.total > 21
              ? 'bg-destructive text-white'
              : myHand.total === 21
                ? 'bg-accent text-accent-foreground'
                : 'bg-card text-foreground'
          }`}
        >
          {myHand.total}
        </motion.div>
      </div>

      <div className="w-full max-w-xs">
        {st.phase === 'dealing' && (
          <StatusText>Aguardando o host começar a rodada...</StatusText>
        )}
        {st.phase === 'turns' && !isMyTurn && myHand.status === 'playing' && (
          <StatusText>Espere sua vez. Olhe o telão!</StatusText>
        )}
        {st.phase === 'turns' && myHand.status === 'bust' && (
          <StatusText>Você estourou! Boa sorte na próxima.</StatusText>
        )}
        {st.phase === 'turns' &&
          (myHand.status === 'stand' || myHand.status === 'blackjack') && (
            <StatusText>
              {myHand.status === 'blackjack'
                ? 'Vinte e Um! Sentou e relaxou.'
                : 'Você parou. Aguardando os outros...'}
            </StatusText>
          )}
        {st.phase === 'reveal' && (
          <StatusText>
            {st.roundWinners.includes(me.id)
              ? 'Você venceu a rodada! Olhe o telão.'
              : 'Rodada encerrada. Veja o resultado no telão.'}
          </StatusText>
        )}

        {isMyTurn && myHand.status === 'playing' && (
          <div className="flex flex-col gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={hit}
              className="flex items-center justify-center gap-2 rounded-3xl border-b-4 border-primary/40 bg-primary px-6 py-5 font-heading text-2xl font-bold text-primary-foreground"
            >
              <Plus className="size-7" /> Pedir carta
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={stand}
              className="flex items-center justify-center gap-2 rounded-3xl border-b-4 border-secondary/40 bg-secondary px-6 py-5 font-heading text-2xl font-bold text-secondary-foreground"
            >
              <Hand className="size-7" /> Parar
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusText({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border-2 border-border bg-card px-4 py-4 font-semibold text-muted-foreground"
    >
      {children}
    </motion.p>
  )
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      {children}
    </div>
  )
}
