'use client'

import { motion } from 'motion/react'
import type { Player } from '@/lib/types'

export function PlayerBadge({
  player,
  subtitle,
  highlight,
}: {
  player: Player
  subtitle?: string
  highlight?: boolean
}) {
  const initials = player.name.slice(0, 2).toUpperCase()
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 ${
        highlight
          ? 'border-accent bg-accent/15'
          : 'border-border bg-card'
      }`}
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold text-background"
        style={{ background: player.color }}
      >
        {initials}
      </span>
      <div className="min-w-0 text-left">
        <p className="truncate font-heading font-bold text-foreground">
          {player.name}
        </p>
        {subtitle && (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </motion.div>
  )
}
