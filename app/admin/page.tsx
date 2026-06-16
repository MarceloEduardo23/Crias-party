'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  RefreshCw, Trash2, Play, Trophy, RotateCcw, Gamepad2,
  Users, Zap, BrainCircuit, UserSearch, Spade, Home, Shield,
  LayoutDashboard,
} from 'lucide-react'
import { QuizManager } from '@/components/admin/quiz-manager'
import { ImpostorManager } from '@/components/admin/impostor-manager'

type Tab = 'rooms' | 'quiz' | 'impostor'

type RoomInfo = {
  code: string
  players: number
  playerNames: string[]
  currentGame: string
  party: { phase: string; roundNumber: number; totalRounds: number } | null
  scores: Array<{ name: string; score: number; color: string }>
}

const SECRET = 'crias-admin-2024'

const GAME_ICONS: Record<string, React.ReactNode> = {
  lobby: <Home className="size-4" />,
  'vinte-e-um': <Spade className="size-4" />,
  impostor: <UserSearch className="size-4" />,
  quiz: <BrainCircuit className="size-4" />,
  ranking: <Trophy className="size-4" />,
}

const GAME_COLORS: Record<string, string> = {
  lobby: 'text-muted-foreground',
  'vinte-e-um': 'text-red-400',
  impostor: 'text-blue-400',
  quiz: 'text-yellow-400',
  ranking: 'text-green-400',
}

export default function AdminPage() {
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('rooms')

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rooms', {
        headers: { 'x-admin-secret': SECRET },
      })
      if (!res.ok) return
      const data = await res.json()
      setRooms(data.rooms)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    fetchRooms()
    const interval = setInterval(fetchRooms, 3000)
    return () => clearInterval(interval)
  }, [authed, fetchRooms])

  async function doAction(code: string, action: string, game?: string) {
    const key = `${code}-${action}`
    setActionLoading(key)
    try {
      await fetch('/api/admin/room-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
        body: JSON.stringify({ code, action, game }),
      })
      await fetchRooms()
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteRoom(code: string) {
    if (!confirm(`Deletar sala ${code}?`)) return
    await fetch('/api/admin/rooms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
      body: JSON.stringify({ code }),
    })
    await fetchRooms()
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-8 text-center"
        >
          <Shield className="mx-auto size-12 text-primary mb-4" />
          <h1 className="font-heading text-3xl font-bold mb-6">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (password === SECRET) setAuthed(true)
                else setError('Senha incorreta')
              }
            }}
            placeholder="Senha..."
            className="w-full rounded-2xl border-2 border-border bg-muted py-3 px-4 font-heading text-lg text-center outline-none focus:border-primary mb-4"
          />
          {error && <p className="text-primary font-heading mb-3">{error}</p>}
          <button
            type="button"
            onClick={() => {
              if (password === SECRET) setAuthed(true)
              else setError('Senha incorreta')
            }}
            className="w-full rounded-3xl border-b-4 border-primary/40 bg-primary py-3 font-heading text-xl font-bold text-primary-foreground"
          >
            Entrar
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground">
              🎮 Admin — Crias Party
            </h1>
            <p className="text-muted-foreground mt-1">{rooms.length} sala(s) ativa(s)</p>
          </div>
          {tab === 'rooms' && (
            <button
              type="button"
              onClick={fetchRooms}
              className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 py-2 font-heading font-bold hover:bg-muted"
            >
              <RefreshCw className="size-4" /> Atualizar
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b-2 border-border pb-0">
          <TabButton active={tab === 'rooms'} onClick={() => setTab('rooms')} icon={<LayoutDashboard className="size-4" />}>
            Salas
          </TabButton>
          <TabButton active={tab === 'quiz'} onClick={() => setTab('quiz')} icon={<BrainCircuit className="size-4" />}>
            Quiz
          </TabButton>
          <TabButton active={tab === 'impostor'} onClick={() => setTab('impostor')} icon={<UserSearch className="size-4" />}>
            Impostor
          </TabButton>
        </div>

        {tab === 'quiz' && <QuizManager />}
        {tab === 'impostor' && <ImpostorManager />}

        {tab === 'rooms' && (
        <>
        {loading ? (
          <div className="text-center text-muted-foreground font-heading text-xl py-20">
            Carregando...
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center text-muted-foreground font-heading text-xl py-20 rounded-4xl border-2 border-dashed border-border">
            Nenhuma sala ativa no momento
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {rooms.map(room => (
                <motion.div
                  key={room.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-4xl border-2 border-border bg-card p-6 flex flex-col gap-4"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-heading text-4xl font-bold tracking-wider text-primary">
                        {room.code}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="size-4 text-muted-foreground" />
                        <span className="font-heading text-sm text-muted-foreground">
                          {room.players} jogador(es)
                        </span>
                        <span className={`flex items-center gap-1 font-heading text-sm font-bold ${GAME_COLORS[room.currentGame] ?? 'text-foreground'}`}>
                          {GAME_ICONS[room.currentGame]}
                          {room.currentGame}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteRoom(room.code)}
                      className="rounded-xl border border-destructive/40 bg-destructive/10 p-2 text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Players */}
                  {room.playerNames.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {room.playerNames.map((name, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-border bg-muted px-2 py-0.5 font-heading text-xs"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Scores */}
                  {room.scores.length > 0 && (
                    <div className="rounded-2xl border border-border bg-background/40 p-3">
                      <p className="font-heading text-xs text-muted-foreground mb-2">Placar</p>
                      <div className="flex flex-col gap-1">
                        {room.scores
                          .sort((a, b) => b.score - a.score)
                          .slice(0, 5)
                          .map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="size-2 rounded-full" style={{ background: s.color }} />
                              <span className="flex-1 font-heading text-xs">{s.name}</span>
                              <span className="font-heading text-xs font-bold" style={{ color: s.color }}>{s.score}pts</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Party state */}
                  {room.party && (
                    <div className="rounded-2xl border border-border bg-muted/40 px-3 py-2 flex items-center justify-between">
                      <span className="font-heading text-xs text-muted-foreground">Modo Festa</span>
                      <span className="font-heading text-xs font-bold text-accent">
                        Rodada {room.party.roundNumber}/{room.party.totalRounds} — {room.party.phase}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      type="button"
                      onClick={() => doAction(room.code, 'start-party')}
                      disabled={actionLoading !== null}
                      className="flex items-center justify-center gap-1 rounded-2xl border-b-2 border-primary/30 bg-primary/20 px-3 py-2 font-heading text-xs font-bold text-primary hover:bg-primary/30 disabled:opacity-50"
                    >
                      <Zap className="size-3" /> Iniciar Festa
                    </button>
                    <button
                      type="button"
                      onClick={() => doAction(room.code, 'go-lobby')}
                      disabled={actionLoading !== null}
                      className="flex items-center justify-center gap-1 rounded-2xl border border-border bg-card px-3 py-2 font-heading text-xs font-bold text-muted-foreground hover:bg-muted disabled:opacity-50"
                    >
                      <Home className="size-3" /> Lobby
                    </button>
                    <button
                      type="button"
                      onClick={() => doAction(room.code, 'set-game', 'quiz')}
                      disabled={actionLoading !== null}
                      className="flex items-center justify-center gap-1 rounded-2xl border border-border bg-card px-3 py-2 font-heading text-xs font-bold text-yellow-400 hover:bg-muted disabled:opacity-50"
                    >
                      <BrainCircuit className="size-3" /> Quiz
                    </button>
                    <button
                      type="button"
                      onClick={() => doAction(room.code, 'reset-scores')}
                      disabled={actionLoading !== null}
                      className="flex items-center justify-center gap-1 rounded-2xl border border-border bg-card px-3 py-2 font-heading text-xs font-bold text-muted-foreground hover:bg-muted disabled:opacity-50"
                    >
                      <RotateCcw className="size-3" /> Zerar
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Salas', value: rooms.length },
            { label: 'Jogadores', value: rooms.reduce((a, r) => a + r.players, 0) },
            { label: 'Em jogo', value: rooms.filter(r => r.currentGame !== 'lobby').length },
          ].map(stat => (
            <div key={stat.label} className="rounded-3xl border-2 border-border bg-card p-5">
              <div className="font-heading text-4xl font-bold text-primary">{stat.value}</div>
              <div className="font-heading text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        </>
        )}
      </div>
    </div>
  )
}

function TabButton({
  active, onClick, icon, children,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-4 py-3 font-heading font-bold transition-colors ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}
