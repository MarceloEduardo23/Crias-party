import { sql, ensureSchema } from './client'
import { getMemState } from './memory-fallback'

export type ImpostorItemRow = {
  id: number
  name: string
  category: string
  emoji: string
  image_url: string | null
  active: boolean
  created_at: string
}

export type ImpostorItemInput = {
  name: string
  category: string
  emoji: string
  imageUrl: string | null
}

export type ImpostorItemDomain = {
  id: string
  name: string
  category: string
  emoji: string
  imageUrl: string | null
  active: boolean
}

function toDomain(row: ImpostorItemRow): ImpostorItemDomain {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    emoji: row.emoji,
    imageUrl: row.image_url,
    active: row.active,
  }
}

export async function listImpostorItems(): Promise<ImpostorItemDomain[]> {
  if (!sql) {
    const mem = getMemState()
    return [...mem.impostorItems].sort((a, b) => Number(b.id) - Number(a.id))
  }
  await ensureSchema()
  const rows = (await sql.query(
    'SELECT * FROM impostor_items ORDER BY created_at DESC',
  )) as unknown as ImpostorItemRow[]
  return rows.map(toDomain)
}

export async function listActiveImpostorItems(): Promise<ImpostorItemDomain[]> {
  if (!sql) {
    const mem = getMemState()
    return mem.impostorItems.filter((i) => i.active)
  }
  await ensureSchema()
  const rows = (await sql.query(
    'SELECT * FROM impostor_items WHERE active = true',
  )) as unknown as ImpostorItemRow[]
  return rows.map(toDomain)
}

export async function pickImpostorItem(): Promise<ImpostorItemDomain> {
  const all = await listActiveImpostorItems()
  if (all.length === 0) {
    // fallback de segurança caso o banco esteja vazio
    return { id: '0', name: 'Pizza', category: 'Comida', emoji: '🍕', imageUrl: null, active: true }
  }
  return all[Math.floor(Math.random() * all.length)]
}

export async function createImpostorItem(input: ImpostorItemInput): Promise<string> {
  if (!sql) {
    const mem = getMemState()
    const id = String(mem.nextImpostorId++)
    mem.impostorItems.unshift({
      id,
      name: input.name,
      category: input.category,
      emoji: input.emoji,
      imageUrl: input.imageUrl,
      active: true,
    })
    return id
  }
  await ensureSchema()
  const rows = (await sql.query(
    'INSERT INTO impostor_items (name, category, emoji, image_url) VALUES ($1, $2, $3, $4) RETURNING id',
    [input.name, input.category, input.emoji, input.imageUrl],
  )) as unknown as { id: number }[]
  return String(rows[0].id)
}

export async function updateImpostorItem(id: string, input: ImpostorItemInput): Promise<void> {
  if (!sql) {
    const mem = getMemState()
    const item = mem.impostorItems.find((i) => i.id === id)
    if (item) {
      item.name = input.name
      item.category = input.category
      item.emoji = input.emoji
      item.imageUrl = input.imageUrl
    }
    return
  }
  await ensureSchema()
  await sql.query(
    'UPDATE impostor_items SET name = $1, category = $2, emoji = $3, image_url = $4 WHERE id = $5',
    [input.name, input.category, input.emoji, input.imageUrl, Number(id)],
  )
}

export async function setImpostorItemActive(id: string, active: boolean): Promise<void> {
  if (!sql) {
    const mem = getMemState()
    const item = mem.impostorItems.find((i) => i.id === id)
    if (item) item.active = active
    return
  }
  await ensureSchema()
  await sql.query('UPDATE impostor_items SET active = $1 WHERE id = $2', [active, Number(id)])
}

export async function deleteImpostorItem(id: string): Promise<void> {
  if (!sql) {
    const mem = getMemState()
    mem.impostorItems = mem.impostorItems.filter((i) => i.id !== id)
    return
  }
  await ensureSchema()
  await sql.query('DELETE FROM impostor_items WHERE id = $1', [Number(id)])
}

export async function countImpostorItems(): Promise<number> {
  if (!sql) {
    return getMemState().impostorItems.length
  }
  await ensureSchema()
  const rows = (await sql.query('SELECT COUNT(*) as c FROM impostor_items')) as unknown as { c: string }[]
  return Number(rows[0].c)
}
