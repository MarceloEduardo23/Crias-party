import { seedDatabase } from './seed'

type GlobalWithFlag = typeof globalThis & { __criasDbSeedPromise?: Promise<void> }
const g = globalThis as GlobalWithFlag

/**
 * Garante que o schema existe e o seed inicial rodou, no máximo uma vez por
 * processo (a promise é cacheada). Chame isso (com await) no início de toda
 * rota/função que acessa o banco.
 */
export function ensureSeeded(): Promise<void> {
  if (!g.__criasDbSeedPromise) {
    g.__criasDbSeedPromise = seedDatabase()
  }
  return g.__criasDbSeedPromise
}
