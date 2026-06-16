import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import fs from 'node:fs'

// SQLite nativo do Node (v22.5+) — sem dependências externas, sem binários
// pra compilar. O arquivo do banco fica em ./data/crias-party.db (criado
// automaticamente na primeira execução).

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'crias-party.db')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

type GlobalWithDb = typeof globalThis & { __criasDb?: DatabaseSync }
const g = globalThis as GlobalWithDb

function createConnection(): DatabaseSync {
  const db = new DatabaseSync(DB_PATH)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA foreign_keys = ON;')
  return db
}

export const db: DatabaseSync = g.__criasDb ?? (g.__criasDb = createConnection())

export function initSchema() {
  db.exec(`
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
    );

    CREATE TABLE IF NOT EXISTS impostor_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Geral',
      emoji TEXT NOT NULL DEFAULT '❓',
      image_url TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_quiz_active ON quiz_questions(active);
    CREATE INDEX IF NOT EXISTS idx_impostor_active ON impostor_items(active);
  `)
}

initSchema()
