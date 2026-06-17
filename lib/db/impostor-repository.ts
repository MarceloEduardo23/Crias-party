import { db, ensureSchema } from './client'

export type ImpostorItemRow = {
  id: number | bigint
  name: string
  category: string
  emoji: string
  image_url: string | null
  active: number | bigint
  created_at: string
}

export type ImpostorItemInput = {
  name: string
  category: string
  emoji: string
  imageUrl: string | null
}

function toDomain(row: ImpostorItemRow) {
  return {
    id: String(row.id),
    name: row.name,
    category: row.category,
    emoji: row.emoji,
    imageUrl: row.image_url,
    active: Number(row.active) === 1,
  }
}

export async function listImpostorItems() {
  await ensureSchema()
  const res = await db.execute('SELECT * FROM impostor_items ORDER BY created_at DESC')
  return (res.rows as unknown as ImpostorItemRow[]).map(toDomain)
}

export async function listActiveImpostorItems() {
  await ensureSchema()
  const res = await db.execute('SELECT * FROM impostor_items WHERE active = 1')
  return (res.rows as unknown as ImpostorItemRow[]).map(toDomain)
}

export async function pickImpostorItem() {
  const all = await listActiveImpostorItems()
  if (all.length === 0) {
    // fallback de segurança caso o banco esteja vazio
    return { id: '0', name: 'Pizza', category: 'Comida', emoji: '🍕', imageUrl: null, active: true }
  }
  return all[Math.floor(Math.random() * all.length)]
}

export async function createImpostorItem(input: ImpostorItemInput) {
  await ensureSchema()
  const res = await db.execute({
    sql: `INSERT INTO impostor_items (name, category, emoji, image_url) VALUES (?, ?, ?, ?)`,
    args: [input.name, input.category, input.emoji, input.imageUrl],
  })
  return String(res.lastInsertRowid)
}

export async function updateImpostorItem(id: string, input: ImpostorItemInput) {
  await ensureSchema()
  await db.execute({
    sql: `UPDATE impostor_items SET name = ?, category = ?, emoji = ?, image_url = ? WHERE id = ?`,
    args: [input.name, input.category, input.emoji, input.imageUrl, Number(id)],
  })
}

export async function setImpostorItemActive(id: string, active: boolean) {
  await ensureSchema()
  await db.execute({
    sql: 'UPDATE impostor_items SET active = ? WHERE id = ?',
    args: [active ? 1 : 0, Number(id)],
  })
}

export async function deleteImpostorItem(id: string) {
  await ensureSchema()
  await db.execute({ sql: 'DELETE FROM impostor_items WHERE id = ?', args: [Number(id)] })
}

export async function countImpostorItems() {
  await ensureSchema()
  const res = await db.execute('SELECT COUNT(*) as c FROM impostor_items')
  return Number((res.rows[0] as unknown as { c: number | bigint }).c)
}
