'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { CheckCircle2, Clock } from 'lucide-react'
import { sendAction } from '@/lib/use-room'
import { useSound } from '@/components/sound-provider'
import type { Player, Room } from '@/lib/types'

const OPTION_COLORS = [
  { bg: 'bg-red-500/20 border-red-500/60 active:bg-red-500/40', selected: 'bg-red-500 border-red-600', label: 'A', text: 'text-red-300' },
  { bg: 'bg-blue-500/20 border-blue-500/60 active:bg-blue-500/40', selected: 'bg-blue-500 border-blue-600', label: 'B', text: 'text-blue-300' },
  { bg: 'bg-yellow-500/20 border-yellow-500/60 active:bg-yellow-500/40', selected: 'bg-yellow-500 border-yellow-600', label: 'C', text: 'text-yellow-300' },
  { bg: 'bg-green-500/20 border-green-500/60 active:bg-green-500/40', selected: 'bg-green-500 border-green-600', label: 'D', text: 'text-green-300' },
]

export function PhoneQuiz({ room, me }: { room: Room; me: Player }) {
  const st = room.quiz
  const { play } = useSound()
  const [localAnswer, setLocalAnswer] = useState<number | null>(null)

  if (!st) return null
  const q = st.questions[st.currentQuestionIndex]
  const myAnswer = st.answers[me.id]
  const hasAnswered = myAnswer !== undefined
  const effectiveAnswer = localAnswer ?? (hasAnswered ? myAnswer : null)

  function answer(idx: number) {
    if (hasAnswered || localAnswer !== null) return
    play('click')
    setLocalAnswer(idx)
    void sendAction(room.code, { type: 'quiz-answer', playerId: me.id, optionIndex: idx })
  }

  return (
    <div className="relative z-10 flex flex-1 flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="font-heading text-base font-bold text-muted-foreground">
          {st.currentQuestionIndex + 1}/{st.questions.length}
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-1 font-heading text-sm font-bold text-accent">
          {q.category}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={st.currentQuestionIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-3xl border-2 border-border bg-card/80 p-5 text-center">
            <p className="font-heading text-xl font-bold leading-tight">{q.question}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const color = OPTION_COLORS[i]
              const isSelected = effectiveAnswer === i
              const isRevealCorrect = st.phase === 'reveal' && i === q.correctIndex
              const isRevealWrong = st.phase === 'reveal' && i !== q.correctIndex

              return (
                <motion.button
                  key={i}
                  type="button"
                  whileTap={!hasAnswered && localAnswer === null ? { scale: 0.95 } : undefined}
                  onClick={() => answer(i)}
                  disabled={hasAnswered || localAnswer !== null}
                  className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all ${
                    isRevealCorrect
                      ? 'border-green-500 bg-green-500/20'
                      : isRevealWrong
                      ? 'border-border bg-card/30 opacity-40'
                      : isSelected
                      ? color.selected + ' text-white'
                      : color.bg + ' text-foreground'
                  }`}
                >
                  <span className={`font-heading text-lg font-bold ${isSelected && st.phase !== 'reveal' ? 'text-white' : color.text}`}>
                    {color.label}
                  </span>
                  <span className="font-heading text-sm font-bold leading-tight">{opt}</span>
                  {isRevealCorrect && (
                    <CheckCircle2 className="absolute top-2 right-2 size-5 text-green-400" />
                  )}
                </motion.button>
              )
            })}
          </div>

          {effectiveAnswer !== null && st.phase === 'question' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card/60 p-4 text-center"
            >
              <p className="font-heading text-base font-bold text-muted-foreground">
                ✅ Resposta registrada! Aguardando os outros...
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {Object.keys(st.answers).length}/{room.players.length} responderam
              </p>
            </motion.div>
          )}

          {st.phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border-2 p-4 text-center ${
                effectiveAnswer === q.correctIndex
                  ? 'border-green-500/60 bg-green-500/10 text-green-300'
                  : 'border-border bg-card/60 text-muted-foreground'
              }`}
            >
              <p className="font-heading text-xl font-bold">
                {effectiveAnswer === q.correctIndex ? '🎉 Acertou! +2 pontos' : '😬 Errou...'}
              </p>
              <p className="text-sm mt-1">
                Resposta correta: <span className="font-bold text-accent">{OPTION_COLORS[q.correctIndex].label} — {q.options[q.correctIndex]}</span>
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-auto rounded-2xl border border-border bg-card/40 p-3 flex items-center justify-between">
        <span className="font-heading text-sm text-muted-foreground">Seus pontos</span>
        <span className="font-heading text-xl font-bold" style={{ color: me.color }}>
          {me.score} pts
        </span>
      </div>
    </div>
  )
}
