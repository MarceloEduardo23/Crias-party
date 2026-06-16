'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

export type Sfx =
  | 'click'
  | 'pop'
  | 'deal'
  | 'win'
  | 'lose'
  | 'whoosh'
  | 'join'
  | 'reveal'
  | 'tick'

type SoundCtx = {
  play: (sfx: Sfx) => void
  muted: boolean
  toggleMuted: () => void
  musicOn: boolean
  toggleMusic: () => void
}

const Ctx = createContext<SoundCtx | null>(null)

export function useSound() {
  const ctx = useContext(Ctx)
  if (!ctx) {
    // graceful no-op fallback if used outside provider
    return {
      play: () => {},
      muted: true,
      toggleMuted: () => {},
      musicOn: false,
      toggleMusic: () => {},
    } satisfies SoundCtx
  }
  return ctx
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false)
  const [musicOn, setMusicOn] = useState(false)
  const acRef = useRef<AudioContext | null>(null)
  const musicNodes = useRef<{ stop: () => void } | null>(null)

  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!acRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      acRef.current = new AC()
    }
    if (acRef.current.state === 'suspended') void acRef.current.resume()
    return acRef.current
  }, [])

  const tone = useCallback(
    (
      freq: number,
      start: number,
      dur: number,
      type: OscillatorType,
      gain: number,
    ) => {
      const ac = acRef.current
      if (!ac) return
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ac.currentTime + start)
      g.gain.setValueAtTime(0.0001, ac.currentTime + start)
      g.gain.exponentialRampToValueAtTime(gain, ac.currentTime + start + 0.01)
      g.gain.exponentialRampToValueAtTime(
        0.0001,
        ac.currentTime + start + dur,
      )
      osc.connect(g)
      g.connect(ac.destination)
      osc.start(ac.currentTime + start)
      osc.stop(ac.currentTime + start + dur + 0.02)
    },
    [],
  )

  const play = useCallback(
    (sfx: Sfx) => {
      if (muted) return
      const ac = getCtx()
      if (!ac) return
      switch (sfx) {
        case 'click':
          tone(420, 0, 0.08, 'square', 0.12)
          break
        case 'pop':
          tone(680, 0, 0.1, 'sine', 0.18)
          tone(900, 0.04, 0.1, 'sine', 0.12)
          break
        case 'deal':
          tone(300, 0, 0.06, 'triangle', 0.14)
          break
        case 'whoosh':
          tone(200, 0, 0.18, 'sawtooth', 0.06)
          tone(500, 0.05, 0.18, 'sine', 0.05)
          break
        case 'join':
          tone(523, 0, 0.1, 'sine', 0.15)
          tone(784, 0.1, 0.14, 'sine', 0.15)
          break
        case 'tick':
          tone(880, 0, 0.04, 'square', 0.08)
          break
        case 'reveal':
          tone(392, 0, 0.12, 'triangle', 0.16)
          tone(523, 0.12, 0.12, 'triangle', 0.16)
          tone(659, 0.24, 0.2, 'triangle', 0.16)
          break
        case 'win':
          tone(523, 0, 0.14, 'square', 0.16)
          tone(659, 0.14, 0.14, 'square', 0.16)
          tone(784, 0.28, 0.14, 'square', 0.16)
          tone(1047, 0.42, 0.3, 'square', 0.18)
          break
        case 'lose':
          tone(440, 0, 0.16, 'sawtooth', 0.14)
          tone(330, 0.16, 0.16, 'sawtooth', 0.14)
          tone(220, 0.32, 0.4, 'sawtooth', 0.16)
          break
      }
    },
    [muted, getCtx, tone],
  )

  const startMusic = useCallback(() => {
    const ac = getCtx()
    if (!ac) return
    // simple cheerful looping bass + arpeggio using scheduled notes
    const master = ac.createGain()
    master.gain.value = 0.05
    master.connect(ac.destination)

    const notes = [523, 659, 784, 659, 587, 698, 880, 698]
    let step = 0
    let stopped = false
    const interval = setInterval(() => {
      if (stopped) return
      const t = ac.currentTime
      const osc = ac.createOscillator()
      const g = ac.createGain()
      osc.type = 'triangle'
      osc.frequency.value = notes[step % notes.length]
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
      osc.connect(g)
      g.connect(master)
      osc.start(t)
      osc.stop(t + 0.25)
      // bass every 4 steps
      if (step % 4 === 0) {
        const bass = ac.createOscillator()
        const bg = ac.createGain()
        bass.type = 'sine'
        bass.frequency.value = 130
        bg.gain.setValueAtTime(0.0001, t)
        bg.gain.exponentialRampToValueAtTime(0.6, t + 0.02)
        bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
        bass.connect(bg)
        bg.connect(master)
        bass.start(t)
        bass.stop(t + 0.42)
      }
      step++
    }, 260)

    musicNodes.current = {
      stop: () => {
        stopped = true
        clearInterval(interval)
        master.disconnect()
      },
    }
  }, [getCtx])

  const toggleMusic = useCallback(() => {
    setMusicOn((on) => {
      if (on) {
        musicNodes.current?.stop()
        musicNodes.current = null
        return false
      }
      startMusic()
      return true
    })
  }, [startMusic])

  const toggleMuted = useCallback(() => setMuted((m) => !m), [])

  useEffect(() => {
    return () => musicNodes.current?.stop()
  }, [])

  return (
    <Ctx.Provider value={{ play, muted, toggleMuted, musicOn, toggleMusic }}>
      {children}
    </Ctx.Provider>
  )
}
