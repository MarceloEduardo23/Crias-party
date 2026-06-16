'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Pencil, Trash2, X, Power, Image as ImageIcon } from 'lucide-react'

type ImpostorItem = {
  id: string
  name: string
  category: string
  emoji: string
  imageUrl: string | null
  active: boolean
}

const SECRET = 'crias-admin-2024'
const EMPTY_FORM = { name: '', category: 'Geral', emoji: '❓', imageUrl: '' }

export function ImpostorManager() {
  const [items, setItems] = useState<ImpostorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('Todas')

  const fetchItems = useCallback(async () => {
    const res = await fetch('/api/admin/impostor-items', { headers: { 'x-admin-secret': SECRET } })
    if (res.ok) {
      const data = await res.json()
      setItems(data.items)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(item: ImpostorItem) {
    setForm({ name: item.name, category: item.category, emoji: item.emoji, imageUrl: item.imageUrl ?? '' })
    setEditingId(item.id)
    setError('')
    setShowForm(true)
  }

  async function save() {
    if (!form.name.trim()) { setError('Digite o nome'); return }

    const url = editingId ? `/api/admin/impostor-items/${editingId}` : '/api/admin/impostor-items'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
      body: JSON.stringify({ ...form, imageUrl: form.imageUrl.trim() || null }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Erro ao salvar')
      return
    }
    setShowForm(false)
    await fetchItems()
  }

  async function toggleActive(item: ImpostorItem) {
    await fetch(`/api/admin/impostor-items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
      body: JSON.stringify({ active: !item.active }),
    })
    await fetchItems()
  }

  async function remove(id: string) {
    if (!confirm('Excluir este item?')) return
    await fetch(`/api/admin/impostor-items/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-secret': SECRET },
    })
    await fetchItems()
  }

  const categories = ['Todas', ...Array.from(new Set(items.map(i => i.category)))]
  const filtered = filterCategory === 'Todas' ? items : items.filter(i => i.category === filterCategory)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Itens do Impostor</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} item(s) — {items.filter(i => i.active).length} ativo(s)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl border-b-2 border-primary/40 bg-primary px-4 py-2 font-heading font-bold text-primary-foreground"
        >
          <Plus className="size-4" /> Novo item
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilterCategory(cat)}
            className={`rounded-full border px-3 py-1 font-heading text-sm ${
              filterCategory === cat ? 'border-accent bg-accent/20 text-accent' : 'border-border text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-4xl border-2 border-border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold">
                  {editingId ? 'Editar item' : 'Novo item'}
                </h3>
                <button type="button" onClick={() => setShowForm(false)}>
                  <X className="size-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs font-heading text-muted-foreground">Nome</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 mt-1"
                      placeholder="ex: Capivara"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-xs font-heading text-muted-foreground">Emoji</label>
                    <input
                      value={form.emoji}
                      onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 mt-1 text-center text-xl"
                      placeholder="🦫"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-heading text-muted-foreground">Categoria</label>
                  <input
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 mt-1"
                    placeholder="ex: Animais, Comida..."
                  />
                </div>

                <div>
                  <label className="text-xs font-heading text-muted-foreground">
                    URL da imagem (opcional — deixe vazio para modo sem foto)
                  </label>
                  <input
                    value={form.imageUrl}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 mt-1"
                    placeholder="https://..."
                  />
                  {form.imageUrl && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-border" style={{ height: 100 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.imageUrl} alt="preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>

                {error && <p className="text-primary font-heading text-sm">{error}</p>}

                <button
                  type="button"
                  onClick={save}
                  className="mt-2 rounded-2xl border-b-4 border-primary/40 bg-primary py-3 font-heading text-lg font-bold text-primary-foreground"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <p className="text-muted-foreground text-center py-10">Carregando...</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 ${item.active ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-60'}`}
            >
              {item.imageUrl ? (
                <div className="overflow-hidden rounded-xl shrink-0" style={{ width: 48, height: 48 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <ImageIcon className="size-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span>{item.emoji}</span>
                  <p className="font-heading font-bold truncate">{item.name}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate">{item.category}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => toggleActive(item)} title={item.active ? 'Desativar' : 'Ativar'} className="rounded-lg border border-border p-1.5 hover:bg-muted">
                  <Power className={`size-3.5 ${item.active ? 'text-green-400' : 'text-muted-foreground'}`} />
                </button>
                <button type="button" onClick={() => openEdit(item)} className="rounded-lg border border-border p-1.5 hover:bg-muted">
                  <Pencil className="size-3.5" />
                </button>
                <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-destructive/40 p-1.5 text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
