'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rot: number
  vr: number
}

const COLORS = ['#ff3d7f', '#ffd23f', '#3fd6ff', '#5dff8f', '#ff8a3d', '#c45dff']

export function Confetti({
  fire,
  count = 140,
}: {
  /** change this value (e.g. a counter) to trigger a new burst */
  fire: number
  count?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particles = useRef<Particle[]>([])
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  useEffect(() => {
    if (fire === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    for (let i = 0; i < count; i++) {
      particles.current.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 6,
        vy: 2 + Math.random() * 5,
        size: 6 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
      })
    }

    const tick = () => {
      const cw = canvas.width
      const ch = canvas.height
      ctx.clearRect(0, 0, cw, ch)
      particles.current = particles.current.filter((p) => p.y < ch + 40)
      for (const p of particles.current) {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.12
        p.rot += p.vr
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      }
      if (particles.current.length > 0) {
        raf.current = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, cw, ch)
        raf.current = null
      }
    }
    if (raf.current == null) raf.current = requestAnimationFrame(tick)

    return () => {
      if (raf.current != null) {
        cancelAnimationFrame(raf.current)
        raf.current = null
      }
    }
  }, [fire, count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  )
}
