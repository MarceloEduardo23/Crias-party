import { createClient, type Client } from '@libsql/client'
import path from 'node:path'
import fs from 'node:fs'

// Em produção (Vercel ou qualquer serverless), defina TURSO_DATABASE_URL e
// TURSO_AUTH_TOKEN nas variáveis de ambiente para usar um banco Turso
// hospedado (persistente entre deploys/instâncias).
//
// Sem essas variáveis, cai automaticamente para um arquivo SQLite local em
// ./data/crias-party.db — ótimo para desenvolvimento, mas não persiste em
// ambientes serverless com filesystem somente-leitura.

const TURSO_URL = process.env.TURSO_DATABASE_URL
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN

function resolveLocalUrl(): string {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  return `file:${path.join(dataDir, 'crias-party.db')}`
}

type GlobalWithDb = typeof globalThis & { __criasDb?: Client }
const g = globalThis as GlobalWithDb

function createConnection(): Client {
  if (TURSO_URL) {
    return createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    })
  }
  return createClient({ url: resolveLocalUrl() })
}

export const db: Client = g.__criasDb ?? (g.__criasDb = createConnection())

export const usingTurso = Boolean(TURSO_URL)

export async function initSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
      category TEXT NOT NULL DEFAULT 'Geral',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS impostor_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Geral',
      emoji TEXT NOT NULL DEFAULT '❓',
      image_url TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  await db.execute('CREATE INDEX IF NOT EXISTS idx_quiz_active ON quiz_questions(active)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_impostor_active ON impostor_items(active)')
}

let schemaReady: Promise<void> | null = null
export function ensureSchema(): Promise<void> {
  if (!schemaReady) schemaReady = initSchema()
  return schemaReady
}
