'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { PartyBackground } from '@/components/party-background'
import { SoundControls } from '@/components/sound-controls'
import { useSound } from '@/components/sound-provider'
import { Gamepad2, Loader2, Tv } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const { play } = useSound()
  const [mode, setMode] = useState<'home' | 'join'>('home')
  const [code, setCode] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createRoom() {
    play('whoosh')
    setCreating(true)
    try {
      const res = await fetch('/api/room/create', { method: 'POST' })
      const data = (await res.json()) as { code: string; hostId: string }
      try {
        sessionStorage.setItem(`host:${data.code}`, data.hostId)
      } catch {}
      router.push(`/host/${data.code}`)
    } catch {
      setCreating(false)
      setError('Não foi possível criar a sala. Tente de novo.')
    }
  }

  function goJoin() {
    const clean = code.trim().toUpperCase()
    if (clean.length < 4) {
      setError('Digite o código de 4 letras da sala.')
      play('lose')
      return
    }
    play('whoosh')
    router.push(`/play/${clean}`)
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-12">
      <PartyBackground />
      <SoundControls />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-balance text-lg text-muted-foreground"
          >
            O jogo de festa mais caótico da turma. Reúna a galera, conecte os
            celulares e deixe a zoeira começar.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex w-full flex-col gap-4"
            >
              <button
                type="button"
                onClick={createRoom}
                disabled={creating}
                className="group flex items-center justify-center gap-3 rounded-3xl border-b-4 border-primary/40 bg-primary px-6 py-5 font-heading text-xl font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-70"
              >
                {creating ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <Tv className="size-6 transition-transform group-hover:rotate-6" />
                )}
                {creating ? 'Criando sala...' : 'Criar sala (TV / Telão)'}
              </button>

              <button
                type="button"
                onClick={() => {
                  play('click')
                  setMode('join')
                  setError(null)
                }}
                className="group flex items-center justify-center gap-3 rounded-3xl border-b-4 border-secondary/40 bg-secondary px-6 py-5 font-heading text-xl font-bold text-secondary-foreground shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
              >
                <Gamepad2 className="size-6 transition-transform group-hover:-rotate-6" />
                Entrar com código
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="join"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex w-full flex-col gap-4"
            >
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().slice(0, 4))
                  setError(null)
                }}
                onKeyDown={(e) => e.key === 'Enter' && goJoin()}
                placeholder="CÓDIGO"
                autoFocus
                inputMode="text"
                autoCapitalize="characters"
                className="w-full rounded-3xl border-2 border-border bg-card py-5 text-center font-heading text-4xl font-bold uppercase tracking-[0.3em] text-foreground outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={goJoin}
                className="rounded-3xl border-b-4 border-accent/40 bg-accent px-6 py-5 font-heading text-xl font-bold text-accent-foreground shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
              >
                Bora jogar!
              </button>
              <button
                type="button"
                onClick={() => {
                  play('click')
                  setMode('home')
                  setError(null)
                }}
                className="text-sm font-semibold text-muted-foreground underline-offset-4 hover:underline"
              >
                Voltar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
            className="font-semibold text-primary"
          >
            {error}
          </motion.p>
        )}

        <p className="text-xs text-muted-foreground">
          Dica: abra em uma TV ou notebook para o telão e use os celulares como
          controles.
        </p>
      </div>
    </main>
  )
}
