import { freshDeck, handTotal, isBlackjack } from './deck'
import { pickWordPair } from './impostor-words'
import { pickAnimal } from './animals'
import { pickQuizQuestions } from './quiz-questions'
import type {
  GameId,
  Player,
  Room,
  VinteEUmPlayerState,
  PartyState,
} from './types'

type Store = {
  rooms: Map<string, Room>
  subscribers: Map<string, Set<(data: string) => void>>
}

const g = globalThis as unknown as { __criasParty?: Store }
const store: Store =
  g.__criasParty ??
  (g.__criasParty = { rooms: new Map(), subscribers: new Map() })

const PLAYER_COLORS = [
  'oklch(0.68 0.23 8)',
  'oklch(0.83 0.17 88)',
  'oklch(0.74 0.15 205)',
  'oklch(0.7 0.2 145)',
  'oklch(0.65 0.2 320)',
  'oklch(0.72 0.18 50)',
  'oklch(0.7 0.16 260)',
  'oklch(0.75 0.18 160)',
]

function genCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  do {
    code = ''
    for (let i = 0; i < 4; i++)
      code += chars[Math.floor(Math.random() * chars.length)]
  } while (store.rooms.has(code))
  return code
}

export function genId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function broadcast(code: string) {
  const room = store.rooms.get(code)
  if (!room) return
  room.version++
  const subs = store.subscribers.get(code)
  if (!subs) return
  const payload = JSON.stringify(room)
  for (const send of subs) send(payload)
}

export function subscribe(code: string, send: (data: string) => void) {
  let subs = store.subscribers.get(code)
  if (!subs) {
    subs = new Set()
    store.subscribers.set(code, subs)
  }
  subs.add(send)
  return () => {
    subs?.delete(send)
  }
}

export function getRoom(code: string): Room | undefined {
  return store.rooms.get(code.toUpperCase())
}

export function getAllRooms(): Room[] {
  return Array.from(store.rooms.values())
}

export function createRoom(): { room: Room; hostId: string } {
  const code = genCode()
  const hostId = genId()
  const room: Room = {
    code,
    hostId,
    players: [],
    currentGame: 'lobby',
    vinteEUm: null,
    impostor: null,
    quiz: null,
    ranking: null,
    party: null,
    version: 0,
    announcement: null,
  }
  store.rooms.set(code, room)
  return { room, hostId }
}

export function joinRoom(
  code: string,
  name: string,
): { ok: false; error: string } | { ok: true; playerId: string } {
  const room = getRoom(code)
  if (!room) return { ok: false, error: 'Sala não encontrada' }
  if (room.players.length >= 10)
    return { ok: false, error: 'A sala está cheia (máx. 10 jogadores)' }
  if (room.party && room.party.phase !== 'lobby')
    return { ok: false, error: 'A partida já começou!' }
  const clean = name.trim().slice(0, 14)
  if (!clean) return { ok: false, error: 'Escolha um nome' }
  if (
    room.players.some((p) => p.name.toLowerCase() === clean.toLowerCase())
  )
    return { ok: false, error: 'Esse nome já está em uso' }
  const playerId = genId()
  const player: Player = {
    id: playerId,
    name: clean,
    avatar: 'star',
    color: PLAYER_COLORS[room.players.length % PLAYER_COLORS.length],
    score: 0,
    connected: true,
    isHost: false,
  }
  room.players.push(player)
  broadcast(code)
  return { ok: true, playerId }
}

// =====================================================
//  PARTY MODE - 3 rounds of random games
// =====================================================
const GAME_POOL: Array<'vinte-e-um' | 'impostor' | 'quiz'> = ['vinte-e-um', 'impostor', 'quiz']

function shuffleGames(): Array<'vinte-e-um' | 'impostor' | 'quiz'> {
  const shuffled = [...GAME_POOL].sort(() => Math.random() - 0.5)
  return shuffled
}

export function startParty(code: string) {
  const room = getRoom(code)
  if (!room) return
  const gamesSequence = shuffleGames()
  room.party = {
    phase: 'playing',
    roundNumber: 1,
    totalRounds: 3,
    gamesSequence,
    currentRoundIndex: 0,
    scoreSnapshot: room.players.map(p => ({ id: p.id, name: p.name, color: p.color, score: p.score })),
  }
  for (const p of room.players) p.score = 0
  const firstGame = gamesSequence[0]
  setGame(code, firstGame, false)
}

export function setGame(code: string, game: GameId, broadcastNow = true) {
  const room = getRoom(code)
  if (!room) return
  room.currentGame = game
  room.announcement = null
  if (game === 'vinte-e-um') startVinteEUm(room)
  else if (game === 'impostor') startImpostor(room)
  else if (game === 'quiz') startQuiz(room)
  else if (game === 'ranking') startRanking(room)
  else {
    room.vinteEUm = null
    room.impostor = null
    room.quiz = null
    room.ranking = null
  }
  if (broadcastNow) broadcast(code)
}

export function advanceParty(code: string) {
  const room = getRoom(code)
  if (!room || !room.party) return
  const p = room.party
  const nextIndex = p.currentRoundIndex + 1
  if (nextIndex >= p.totalRounds) {
    // Party over - show final ranking
    p.phase = 'gameover'
    p.roundNumber = p.totalRounds
    setGame(code, 'ranking', false)
    if (room.ranking) room.ranking.isGameOver = true
    broadcast(code)
  } else {
    p.currentRoundIndex = nextIndex
    p.roundNumber = nextIndex + 1
    const nextGame = p.gamesSequence[nextIndex]
    setGame(code, 'ranking', false)
    broadcast(code)
  }
}

export function advanceFromRanking(code: string) {
  const room = getRoom(code)
  if (!room || !room.party) return
  const p = room.party
  if (p.phase === 'gameover') return
  const nextIndex = p.currentRoundIndex
  const nextGame = p.gamesSequence[nextIndex]
  setGame(code, nextGame, true)
}

// =====================================================
//  VINTE E UM (Blackjack PvP)
// =====================================================
export function startVinteEUm(room: Room) {
  const deck = freshDeck()
  const order = room.players.map((p) => p.id)
  const hands: Record<string, VinteEUmPlayerState> = {}
  for (const id of order) {
    const c1 = deck.pop()!
    const c2 = deck.pop()!
    const hand = [c1, c2]
    const total = handTotal(hand)
    const bj = isBlackjack(hand)
    hands[id] = {
      hand,
      total,
      status: bj ? 'blackjack' : 'playing',
      hasActed: false,
    }
  }
  room.vinteEUm = {
    phase: 'dealing',
    hands,
    order,
    activePlayerId: order[0] ?? null,
    roundWinners: [],
  }
  ;(room.vinteEUm as unknown as { deck: typeof deck }).deck = deck
}

function getDeck(room: Room) {
  return (room.vinteEUm as unknown as { deck: ReturnType<typeof freshDeck> })
    .deck
}

export function vinteEUmBeginTurns(code: string) {
  const room = getRoom(code)
  if (!room?.vinteEUm) return
  room.vinteEUm.phase = 'turns'
  advanceActive(room)
  broadcast(code)
}

function advanceActive(room: Room) {
  const st = room.vinteEUm!
  const idx = st.activePlayerId ? st.order.indexOf(st.activePlayerId) : -1
  for (let i = idx + 1; i <= st.order.length; i++) {
    const id = st.order[i]
    if (!id) break
    if (st.hands[id].status === 'playing') {
      st.activePlayerId = id
      return
    }
  }
  finishVinteEUm(room)
}

export function vinteEUmHit(code: string, playerId: string) {
  const room = getRoom(code)
  const st = room?.vinteEUm
  if (!room || !st || st.activePlayerId !== playerId) return
  const hand = st.hands[playerId]
  hand.hand.push(getDeck(room).pop()!)
  hand.total = handTotal(hand.hand)
  hand.hasActed = true
  if (hand.total > 21) {
    hand.status = 'bust'
    advanceActive(room)
  } else if (hand.total === 21) {
    hand.status = 'stand'
    advanceActive(room)
  }
  broadcast(code)
}

export function vinteEUmStand(code: string, playerId: string) {
  const room = getRoom(code)
  const st = room?.vinteEUm
  if (!room || !st || st.activePlayerId !== playerId) return
  st.hands[playerId].status = 'stand'
  st.hands[playerId].hasActed = true
  advanceActive(room)
  broadcast(code)
}

function finishVinteEUm(room: Room) {
  const st = room.vinteEUm!
  st.phase = 'reveal'
  st.activePlayerId = null
  let best = -1
  for (const id of st.order) {
    const h = st.hands[id]
    if (h.status === 'bust') continue
    if (h.total > best) best = h.total
  }
  const winners = st.order.filter(
    (id) => st.hands[id].status !== 'bust' && st.hands[id].total === best,
  )
  st.roundWinners = best === -1 ? [] : winners
  for (const id of winners) {
    const p = room.players.find((pl) => pl.id === id)
    if (p) p.score += 3
  }
}

export function vinteEUmNextRound(code: string) {
  const room = getRoom(code)
  if (!room) return
  if (room.party) {
    advanceParty(code)
  } else {
    startVinteEUm(room)
    broadcast(code)
  }
}

// =====================================================
//  IMPOSTOR (with animal images)
// =====================================================
export function startImpostor(room: Room) {
  const animal = pickAnimal()
  const ids = room.players.map((p) => p.id)
  const impostorCount = ids.length >= 6 ? 2 : 1
  const shuffled = [...ids].sort(() => Math.random() - 0.5)
  const impostorIds = shuffled.slice(0, impostorCount)
  const assignments: Record<string, string> = {}
  for (const id of ids) {
    assignments[id] = impostorIds.includes(id) ? '' : animal.name
  }
  const order = [...ids].sort(() => Math.random() - 0.5)
  room.impostor = {
    phase: 'reveal-role',
    category: 'Animal',
    secretWord: animal.name,
    animalName: animal.name,
    animalEmoji: animal.emoji,
    animalImage: animal.imageUrl,
    impostorIds,
    assignments,
    order,
    cluesGiven: [],
    clues: {},
    activePlayerId: order[0] ?? null,
    votes: {},
    ejectedId: null,
    impostorsWon: null,
  }
}

export function impostorBeginClues(code: string) {
  const room = getRoom(code)
  if (!room?.impostor) return
  room.impostor.phase = 'clues'
  room.impostor.activePlayerId = room.impostor.order[0] ?? null
  broadcast(code)
}

export function impostorSubmitClue(
  code: string,
  playerId: string,
  clue: string,
) {
  const room = getRoom(code)
  const st = room?.impostor
  if (!room || !st || st.activePlayerId !== playerId) return
  st.clues[playerId] = clue.trim().slice(0, 18) || '...'
  st.cluesGiven.push(playerId)
  const idx = st.order.indexOf(playerId)
  const next = st.order[idx + 1]
  if (next) {
    st.activePlayerId = next
  } else {
    st.activePlayerId = null
    st.phase = 'voting'
  }
  broadcast(code)
}

export function impostorVote(code: string, voterId: string, votedForId: string) {
  const room = getRoom(code)
  const st = room?.impostor
  if (!room || !st || st.phase !== 'voting') return
  st.votes[voterId] = votedForId
  if (Object.keys(st.votes).length >= st.order.length) {
    resolveImpostor(room)
  }
  broadcast(code)
}

function resolveImpostor(room: Room) {
  const st = room.impostor!
  const tally: Record<string, number> = {}
  for (const votedFor of Object.values(st.votes)) {
    tally[votedFor] = (tally[votedFor] ?? 0) + 1
  }
  let max = -1
  let ejected: string | null = null
  let tie = false
  for (const [id, count] of Object.entries(tally)) {
    if (count > max) {
      max = count
      ejected = id
      tie = false
    } else if (count === max) {
      tie = true
    }
  }
  st.ejectedId = tie ? null : ejected
  const caught = st.ejectedId !== null && st.impostorIds.includes(st.ejectedId)
  st.impostorsWon = !caught
  st.phase = 'result'
  if (caught) {
    for (const p of room.players) {
      if (!st.impostorIds.includes(p.id)) p.score += 3
    }
  } else {
    for (const id of st.impostorIds) {
      const p = room.players.find((pl) => pl.id === id)
      if (p) p.score += 5
    }
  }
}

export function impostorNextRound(code: string) {
  const room = getRoom(code)
  if (!room) return
  if (room.party) {
    advanceParty(code)
  } else {
    startImpostor(room)
    broadcast(code)
  }
}

// =====================================================
//  QUIZ
// =====================================================
export function startQuiz(room: Room) {
  const questions = pickQuizQuestions(5)
  room.quiz = {
    phase: 'question',
    questions,
    currentQuestionIndex: 0,
    answers: {},
    timeLeft: 20,
    roundScores: {},
  }
}

export function quizAnswer(code: string, playerId: string, optionIndex: number) {
  const room = getRoom(code)
  const st = room?.quiz
  if (!room || !st || st.phase !== 'question') return
  if (st.answers[playerId] !== undefined) return // already answered
  st.answers[playerId] = optionIndex
  // Check if all players answered
  const allAnswered = room.players.every(p => st.answers[p.id] !== undefined)
  if (allAnswered) {
    revealQuizAnswer(room)
  }
  broadcast(code)
}

function revealQuizAnswer(room: Room) {
  const st = room.quiz!
  const q = st.questions[st.currentQuestionIndex]
  st.phase = 'reveal'
  for (const p of room.players) {
    if (st.answers[p.id] === q.correctIndex) {
      p.score += 2
      st.roundScores[p.id] = (st.roundScores[p.id] ?? 0) + 2
    }
  }
}

export function quizRevealTimeout(code: string) {
  const room = getRoom(code)
  const st = room?.quiz
  if (!room || !st || st.phase !== 'question') return
  revealQuizAnswer(room)
  broadcast(code)
}

export function quizNextQuestion(code: string) {
  const room = getRoom(code)
  const st = room?.quiz
  if (!room || !st) return
  const nextIdx = st.currentQuestionIndex + 1
  if (nextIdx >= st.questions.length) {
    // Quiz done
    if (room.party) {
      advanceParty(code)
    } else {
      setGame(code, 'lobby')
    }
  } else {
    st.currentQuestionIndex = nextIdx
    st.phase = 'question'
    st.answers = {}
    broadcast(code)
  }
}

// =====================================================
//  RANKING
// =====================================================
export function startRanking(room: Room) {
  const sorted = [...room.players].sort((a, b) => b.score - a.score)
  const snapshot = sorted.map((p, i) => ({
    id: p.id,
    name: p.name,
    color: p.color,
    score: p.score,
    rank: i + 1,
  }))
  const roundNumber = room.party?.roundNumber ?? 1
  room.ranking = {
    snapshot,
    isGameOver: room.party?.phase === 'gameover',
    roundNumber,
  }
}

export function resetScores(code: string) {
  const room = getRoom(code)
  if (!room) return
  for (const p of room.players) p.score = 0
  broadcast(code)
}

// =====================================================
//  ADMIN
// =====================================================
export function deleteRoom(code: string) {
  store.rooms.delete(code.toUpperCase())
}
