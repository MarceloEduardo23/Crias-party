'use client'

import { motion } from 'motion/react'

export function Logo({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const big = size === 'lg'
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      className="flex items-center gap-2 font-heading font-bold leading-none"
    >
      <span
        className={`text-shadow-pop text-primary ${big ? 'text-5xl sm:text-7xl' : 'text-2xl'}`}
      >
        Crias
      </span>
      <motion.span
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        className={`text-shadow-pop inline-block rounded-2xl bg-accent px-3 py-1 text-accent-foreground ${
          big ? 'text-5xl sm:text-7xl' : 'text-2xl'
        }`}
      >
        Party
      </motion.span>
    </motion.div>
  )
}
