import { NextResponse } from 'next/server'
import {
  getRoom,
  impostorBeginClues,
  impostorNextRound,
  impostorSubmitClue,
  impostorVote,
  resetScores,
  setGame,
  startParty,
  vinteEUmBeginTurns,
  vinteEUmHit,
  vinteEUmNextRound,
  vinteEUmStand,
  quizAnswer,
  quizNextQuestion,
  quizRevealTimeout,
  advanceFromRanking,
} from '@/lib/room-store'
import type { GameId } from '@/lib/types'

export const dynamic = 'force-dynamic'

type Body = {
  type: string
  playerId?: string
  game?: GameId
  clue?: string
  votedForId?: string
  optionIndex?: number
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params
  const upper = code.toUpperCase()
  const room = getRoom(upper)
  if (!room) {
    return NextResponse.json({ error: 'Sala não encontrada' }, { status: 404 })
  }

  const body = (await req.json()) as Body

  switch (body.type) {
    case 'set-game':
      if (body.game) setGame(upper, body.game)
      break
    case 'start-party':
      startParty(upper)
      break
    case 'reset-scores':
      resetScores(upper)
      break
    case 'advance-from-ranking':
      advanceFromRanking(upper)
      break
    // vinte e um
    case 'v21-begin-turns':
      vinteEUmBeginTurns(upper)
      break
    case 'v21-hit':
      if (body.playerId) vinteEUmHit(upper, body.playerId)
      break
    case 'v21-stand':
      if (body.playerId) vinteEUmStand(upper, body.playerId)
      break
    case 'v21-next-round':
      vinteEUmNextRound(upper)
      break
    // impostor
    case 'imp-begin-clues':
      impostorBeginClues(upper)
      break
    case 'imp-clue':
      if (body.playerId) impostorSubmitClue(upper, body.playerId, body.clue ?? '')
      break
    case 'imp-vote':
      if (body.playerId && body.votedForId)
        impostorVote(upper, body.playerId, body.votedForId)
      break
    case 'imp-next-round':
      impostorNextRound(upper)
      break
    // quiz
    case 'quiz-answer':
      if (body.playerId && body.optionIndex !== undefined)
        quizAnswer(upper, body.playerId, body.optionIndex)
      break
    case 'quiz-timeout':
      quizRevealTimeout(upper)
      break
    case 'quiz-next':
      quizNextQuestion(upper)
      break
    default:
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
