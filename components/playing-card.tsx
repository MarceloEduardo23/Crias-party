'use client'

import { motion } from 'motion/react'
import type { Card } from '@/lib/types'

export function PlayingCard({
  card,
  index = 0,
  size = 'md',
}: {
  card: Card
  index?: number
  size?: 'sm' | 'md'
}) {
  const red = card.suit === '♥' || card.suit === '♦'
  const dims =
    size === 'sm' ? 'h-20 w-14 text-base' : 'h-28 w-20 text-xl sm:h-32 sm:w-24'

  return (
    <motion.div
      initial={{ rotateY: 180, y: -40, opacity: 0 }}
      animate={{ rotateY: 0, y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 16,
        delay: index * 0.12,
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative flex shrink-0 flex-col justify-between rounded-xl border-2 border-black/10 bg-white p-2 font-heading font-bold shadow-lg ${dims} ${
        red ? 'text-red-600' : 'text-neutral-900'
      }`}
    >
      <span className="leading-none">{card.rank}</span>
      <span className="self-center text-3xl leading-none sm:text-4xl">
        {card.suit}
      </span>
      <span className="self-end leading-none">{card.rank}</span>
    </motion.div>
  )
}

export function CardBack({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'h-20 w-14' : 'h-28 w-20 sm:h-32 sm:w-24'
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl border-2 border-black/20 ${dims}`}
      style={{
        background:
          'repeating-linear-gradient(45deg, oklch(0.68 0.23 8), oklch(0.68 0.23 8) 8px, oklch(0.6 0.2 8) 8px, oklch(0.6 0.2 8) 16px)',
      }}
    >
      <span className="font-heading text-2xl font-bold text-white/80">?</span>
    </div>
  )
}
