'use client'

import { Music, Volume2, VolumeX } from 'lucide-react'
import { useSound } from './sound-provider'

export function SoundControls() {
  const { muted, toggleMuted, musicOn, toggleMusic } = useSound()
  return (
    <div className="fixed right-4 top-4 z-40 flex gap-2">
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={musicOn ? 'Desligar música' : 'Ligar música'}
        aria-pressed={musicOn}
        className={`flex size-11 items-center justify-center rounded-full border-2 border-border backdrop-blur transition-transform hover:scale-110 active:scale-95 ${
          musicOn
            ? 'bg-accent text-accent-foreground'
            : 'bg-card/70 text-muted-foreground'
        }`}
      >
        <Music className="size-5" />
      </button>
      <button
        type="button"
        onClick={toggleMuted}
        aria-label={muted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
        aria-pressed={!muted}
        className="flex size-11 items-center justify-center rounded-full border-2 border-border bg-card/70 text-foreground backdrop-blur transition-transform hover:scale-110 active:scale-95"
      >
        {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
      </button>
    </div>
  )
}
