'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PartyBackground } from '@/components/party-background'
import { SoundControls } from '@/components/sound-controls'
import { TvLobby } from '@/components/tv/lobby'
import { TvVinteEUm } from '@/components/tv/vinte-e-um'
import { TvImpostor } from '@/components/tv/impostor'
import { TvQuiz } from '@/components/tv/quiz'
import { TvRanking } from '@/components/tv/ranking'
import { useRoom } from '@/lib/use-room'

export default function HostPage() {
  const params = useParams<{ code: string }>()
  const code = (params.code ?? '').toUpperCase()
  const { room, status } = useRoom(code)

  return (
    <main className="relative min-h-screen overflow-hidden">
      <PartyBackground />
      <SoundControls />

      {status === 'connecting' && <CenterMessage>Conectando...</CenterMessage>}
      {status === 'not-found' && (
        <CenterMessage>
          Sala <span className="text-primary">{code}</span> não encontrada.
        </CenterMessage>
      )}

      {room && (
        <AnimatePresence mode="wait">
          <motion.div
            key={room.currentGame}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {room.currentGame === 'lobby' && <TvLobby room={room} />}
            {room.currentGame === 'vinte-e-um' && <TvVinteEUm room={room} />}
            {room.currentGame === 'impostor' && <TvImpostor room={room} />}
            {room.currentGame === 'quiz' && <TvQuiz room={room} />}
            {room.currentGame === 'ranking' && <TvRanking room={room} />}
          </motion.div>
        </AnimatePresence>
      )}
    </main>
  )
}

function CenterMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Loader2 className="size-10 animate-spin text-muted-foreground" />
      <p className="font-heading text-2xl font-bold text-muted-foreground">
        {children}
      </p>
    </div>
  )
}
