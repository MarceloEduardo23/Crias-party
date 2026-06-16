'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PartyBackground } from '@/components/party-background'
import { SoundControls } from '@/components/sound-controls'
import { PhoneJoin } from '@/components/phone/join'
import { PhoneLobby } from '@/components/phone/lobby'
import { PhoneVinteEUm } from '@/components/phone/vinte-e-um'
import { PhoneImpostor } from '@/components/phone/impostor'
import { PhoneQuiz } from '@/components/phone/quiz'
import { PhoneRanking } from '@/components/phone/ranking'
import { useRoom } from '@/lib/use-room'

export default function PlayPage() {
  const params = useParams<{ code: string }>()
  const code = (params.code ?? '').toUpperCase()
  const { room, status } = useRoom(code)
  const [playerId, setPlayerId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(`player:${code}`)
      if (saved) setPlayerId(saved)
    } catch {}
  }, [code])

  function handleJoined(id: string) {
    try {
      sessionStorage.setItem(`player:${code}`, id)
    } catch {}
    setPlayerId(id)
  }

  const me = room?.players.find((p) => p.id === playerId) ?? null

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden px-5 py-6">
      <PartyBackground />
      <SoundControls />

      {status === 'connecting' && <Center>Conectando...</Center>}
      {status === 'not-found' && (
        <Center>
          Sala <span className="text-primary">{code}</span> não existe.
        </Center>
      )}

      {room && status === 'open' && (
        <>
          {!me ? (
            <PhoneJoin code={code} onJoined={handleJoined} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={room.currentGame}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-1 flex-col"
              >
                {room.currentGame === 'lobby' && (
                  <PhoneLobby room={room} me={me} />
                )}
                {room.currentGame === 'vinte-e-um' && (
                  <PhoneVinteEUm room={room} me={me} />
                )}
                {room.currentGame === 'impostor' && (
                  <PhoneImpostor room={room} me={me} />
                )}
                {room.currentGame === 'quiz' && (
                  <PhoneQuiz room={room} me={me} />
                )}
                {room.currentGame === 'ranking' && (
                  <PhoneRanking room={room} me={me} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </main>
  )
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="size-10 animate-spin text-muted-foreground" />
      <p className="font-heading text-2xl font-bold text-muted-foreground">
        {children}
      </p>
    </div>
  )
}
