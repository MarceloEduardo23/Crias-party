'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BrainCircuit, Clock, CheckCircle2, XCircle, SkipForward } from 'lucide-react'
import { Confetti } from '@/components/confetti'
import { TvTopbar } from '@/components/tv/tv-topbar'
import { sendAction } from '@/lib/use-room'
import { useSound } from '@/components/sound-provider'
import type { Room } from '@/lib/types'

const OPTION_COLORS = [
  { bg: 'bg-red-500/20 border-red-500/50', active: 'bg-red-500', text: 'text-red-300', label: 'A' },
  { bg: 'bg-blue-500/20 border-blue-500/50', active: 'bg-blue-500', text: 'text-blue-300', label: 'B' },
  { bg: 'bg-yellow-500/20 border-yellow-500/50', active: 'bg-yellow-500', text: 'text-yellow-300', label: 'C' },
  { bg: 'bg-green-500/20 border-green-500/50', active: 'bg-green-500', text: 'text-green-300', label: 'D' },
]

export function TvQuiz({ room }: { room: Room }) {
  const st = room.quiz
  const { play } = useSound()
  const [fire, setFire] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const prevPhase = useRef<string | null>(null)
  const prevQ = useRef<number>(-1)

  useEffect(() => {
    if (!st) return
    if (prevQ.current !== st.currentQuestionIndex || prevPhase.current !== st.phase) {
      if (st.phase === 'question') {
        setTimeLeft(20)
        play('whoosh')
        // Start countdown
        timerRef.current && clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!)
              void sendAction(room.code, { type: 'quiz-timeout' })
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else if (st.phase === 'reveal') {
        timerRef.current && clearInterval(timerRef.current)
        play('reveal')
        setFire(f => f + 1)
      }
      prevPhase.current = st.phase
      prevQ.current = st.currentQuestionIndex
    }
    return () => { timerRef.current && clearInterval(timerRef.current) }
  }, [st, play, room.code])

  if (!st) return null
  const q = st.questions[st.currentQuestionIndex]
  const answeredCount = Object.keys(st.answers).length
  const totalPlayers = room.players.length

  const progressPct = Math.round((answeredCount / totalPlayers) * 100)

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
      {fire > 0 && st.phase === 'reveal' && <Confetti fire={fire} />}
      <TvTopbar code={room.code} title="Quiz" />

      <div className="flex items-center justify-between">
        <span className="font-heading text-lg text-muted-foreground">
          Pergunta {st.currentQuestionIndex + 1} de {st.questions.length}
        </span>
        <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-2">
          <span className="font-heading text-lg font-bold text-muted-foreground">
            Categoria: <span className="text-accent">{q.category}</span>
          </span>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={st.currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col gap-6"
        >
          <div className="rounded-4xl border-2 border-border bg-card/60 p-8 text-center">
            <p className="font-heading text-3xl font-bold sm:text-4xl">{q.question}</p>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-4">
            {q.options.map((opt, i) => {
              const color = OPTION_COLORS[i]
              const isCorrect = st.phase === 'reveal' && i === q.correctIndex
              const isWrong = st.phase === 'reveal' && i !== q.correctIndex

              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex items-center gap-4 rounded-3xl border-2 p-5 transition-all ${
                    isCorrect
                      ? 'border-green-500 bg-green-500/20 scale-105'
                      : isWrong
                      ? 'border-border bg-card/30 opacity-50'
                      : color.bg
                  }`}
                >
                  <span
                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl font-heading text-2xl font-bold text-background ${
                      isCorrect ? 'bg-green-500' : color.active
                    }`}
                  >
                    {color.label}
                  </span>
                  <span className="font-heading text-xl font-bold">{opt}</span>
                  {isCorrect && (
                    <CheckCircle2 className="absolute right-4 size-8 text-green-400" />
                  )}
                  {isWrong && st.phase === 'reveal' && (
                    <XCircle className="absolute right-4 size-8 text-muted-foreground/50" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom bar: timer + answer progress */}
      <div className="flex items-center gap-4">
        {st.phase === 'question' && (
          <>
            <div className={`flex items-center gap-2 rounded-2xl border-2 px-5 py-3 font-heading text-2xl font-bold ${timeLeft <= 5 ? 'border-primary bg-primary/20 text-primary animate-pulse' : 'border-border bg-card'}`}>
              <Clock className="size-6" />
              {timeLeft}s
            </div>
            <div className="flex-1">
              <div className="mb-1 flex justify-between font-heading text-sm text-muted-foreground">
                <span>{answeredCount}/{totalPlayers} responderam</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-secondary"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: 'spring', bounce: 0.2 }}
                />
              </div>
            </div>
          </>
        )}

        {st.phase === 'reveal' && (
          <div className="flex flex-1 items-center justify-between gap-4">
            <div className="font-heading text-xl text-muted-foreground">
              Resposta correta revelada! 🎯
            </div>

            {/* Who got it right */}
            <div className="flex flex-wrap gap-2">
              {room.players.map(p => {
                const answered = st.answers[p.id]
                const correct = answered === q.correctIndex
                return (
                  <div
                    key={p.id}
                    className={`rounded-full px-3 py-1 font-heading font-bold text-sm ${correct ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-muted text-muted-foreground line-through'}`}
                    style={correct ? { borderColor: p.color, color: p.color } : {}}
                  >
                    {p.name} {correct ? '+2' : ''}
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => { play('whoosh'); void sendAction(room.code, { type: 'quiz-next' }) }}
              className="flex items-center gap-2 rounded-3xl border-b-4 border-secondary/40 bg-secondary px-6 py-3 font-heading text-lg font-bold text-secondary-foreground"
            >
              <SkipForward className="size-5" />
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
