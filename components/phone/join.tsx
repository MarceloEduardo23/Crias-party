'use client'

import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { useSound } from '@/components/sound-provider'

export function PhoneJoin({
  code,
  onJoined,
}: {
  code: string
  onJoined: (playerId: string) => void
}) {
  const { play } = useSound()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function join() {
    if (!name.trim()) {
      setError('Escolha um nome')
      play('lose')
      return
    }
    setLoading(true)
    play('whoosh')
    try {
      const res = await fetch(`/api/room/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao entrar')
        play('lose')
        setLoading(false)
        return
      }
      play('join')
      onJoined(data.playerId as string)
    } catch {
      setError('Erro de conexão')
      setLoading(false)
    }
  }

  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <Logo />
      <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-2 font-heading text-lg font-bold tracking-widest text-secondary">
        SALA {code}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-xs flex-col gap-4"
      >
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value.slice(0, 14))
            setError(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && join()}
          placeholder="Seu nome"
          autoFocus
          className="w-full rounded-3xl border-2 border-border bg-card px-5 py-4 text-center font-heading text-2xl font-bold text-foreground outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={join}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-3xl border-b-4 border-primary/40 bg-primary px-6 py-4 font-heading text-xl font-bold text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-70"
        >
          {loading && <Loader2 className="size-5 animate-spin" />}
          Entrar na festa
        </button>
        {error && (
          <motion.p
            animate={{ x: [0, -6, 6, -4, 4, 0] }}
            className="font-semibold text-primary"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}
