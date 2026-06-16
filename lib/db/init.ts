import { seedDatabase } from './seed'

type GlobalWithFlag = typeof globalThis & { __criasDbSeeded?: boolean }
const g = globalThis as GlobalWithFlag

if (!g.__criasDbSeeded) {
  seedDatabase()
  g.__criasDbSeeded = true
}
