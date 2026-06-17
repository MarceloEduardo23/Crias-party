import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

// Banco de dados: Neon (Postgres serverless).
//
// Configure a variável de ambiente DATABASE_URL (veja .env.example) com a
// connection string do seu projeto Neon. Sem ela, o app ainda funciona em
// desenvolvimento usando um banco em memória (não persiste, mas evita que
// o app quebre se você ainda não configurou o Neon).

const DATABASE_URL = process.env.DATABASE_URL

export const usingNeon = Boolean(DATABASE_URL)

export const sql: NeonQueryFunction<false, false> | null = DATABASE_URL
  ? neon(DATABASE_URL)
  : null

if (!usingNeon) {
  console.warn(
    '[db] DATABASE_URL não configurada — usando banco em memória (dados não persistem). ' +
    'Configure DATABASE_URL com sua connection string do Neon para persistência real.',
  )
}

export async function initSchema() {
  if (!sql) return // banco em memória não precisa de schema

  await sql.query(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_index INTEGER NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
      category TEXT NOT NULL DEFAULT 'Geral',
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  await sql.query(`
    CREATE TABLE IF NOT EXISTS impostor_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Geral',
      emoji TEXT NOT NULL DEFAULT '❓',
      image_url TEXT,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

  await sql.query('CREATE INDEX IF NOT EXISTS idx_quiz_active ON quiz_questions(active)')
  await sql.query('CREATE INDEX IF NOT EXISTS idx_impostor_active ON impostor_items(active)')
}

let schemaReady: Promise<void> | null = null
export function ensureSchema(): Promise<void> {
  if (!schemaReady) schemaReady = initSchema()
  return schemaReady
}
