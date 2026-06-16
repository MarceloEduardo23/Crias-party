import { db } from './client'

export type ImpostorItemRow = {
  id: number
  name: string
  category: string
  emoji: string
  image_url: string | null
  active: number
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
    active: row.active === 1,
  }
}

export function listImpostorItems() {
  const rows = db
    .prepare('SELECT * FROM impostor_items ORDER BY created_at DESC')
    .all() as unknown as ImpostorItemRow[]
  return rows.map(toDomain)
}

export function listActiveImpostorItems() {
  const rows = db
    .prepare('SELECT * FROM impostor_items WHERE active = 1')
    .all() as unknown as ImpostorItemRow[]
  return rows.map(toDomain)
}

export function pickImpostorItem() {
  const all = listActiveImpostorItems()
  if (all.length === 0) {
    // fallback de segurança caso o banco esteja vazio
    return { id: '0', name: 'Pizza', category: 'Comida', emoji: '🍕', imageUrl: null, active: true }
  }
  return all[Math.floor(Math.random() * all.length)]
}

export function createImpostorItem(input: ImpostorItemInput) {
  const stmt = db.prepare(`
    INSERT INTO impostor_items (name, category, emoji, image_url)
    VALUES (?, ?, ?, ?)
  `)
  const result = stmt.run(input.name, input.category, input.emoji, input.imageUrl)
  return String(result.lastInsertRowid)
}

export function updateImpostorItem(id: string, input: ImpostorItemInput) {
  db.prepare(`
    UPDATE impostor_items
    SET name = ?, category = ?, emoji = ?, image_url = ?
    WHERE id = ?
  `).run(input.name, input.category, input.emoji, input.imageUrl, Number(id))
}

export function setImpostorItemActive(id: string, active: boolean) {
  db.prepare('UPDATE impostor_items SET active = ? WHERE id = ?').run(active ? 1 : 0, Number(id))
}

export function deleteImpostorItem(id: string) {
  db.prepare('DELETE FROM impostor_items WHERE id = ?').run(Number(id))
}

export function countImpostorItems() {
  const row = db.prepare('SELECT COUNT(*) as c FROM impostor_items').get() as { c: number }
  return row.c
}
