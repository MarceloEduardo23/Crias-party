'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, Pencil, Trash2, X, Check, Power } from 'lucide-react'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  category: string
  active: boolean
}

const SECRET = 'crias-admin-2024'
const EMPTY_FORM = { question: '', options: ['', '', '', ''], correctIndex: 0, category: 'Geral' }

export function QuizManager() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const fetchQuestions = useCallback(async () => {
    const res = await fetch('/api/admin/quiz-questions', { headers: { 'x-admin-secret': SECRET } })
    if (res.ok) {
      const data = await res.json()
      setQuestions(data.questions)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setError('')
    setShowForm(true)
  }

  function openEdit(q: QuizQuestion) {
    setForm({ question: q.question, options: [...q.options], correctIndex: q.correctIndex, category: q.category })
    setEditingId(q.id)
    setError('')
    setShowForm(true)
  }

  async function save() {
    if (!form.question.trim()) { setError('Digite a pergunta'); return }
    if (form.options.some(o => !o.trim())) { setError('Preencha as 4 opções'); return }

    const url = editingId ? `/api/admin/quiz-questions/${editingId}` : '/api/admin/quiz-questions'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Erro ao salvar')
      return
    }
    setShowForm(false)
    await fetchQuestions()
  }

  async function toggleActive(q: QuizQuestion) {
    await fetch(`/api/admin/quiz-questions/${q.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
      body: JSON.stringify({ active: !q.active }),
    })
    await fetchQuestions()
  }

  async function remove(id: string) {
    if (!confirm('Excluir esta pergunta?')) return
    await fetch(`/api/admin/quiz-questions/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-secret': SECRET },
    })
    await fetchQuestions()
  }

  const categories = Array.from(new Set(questions.map(q => q.category)))

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Perguntas do Quiz</h2>
          <p className="text-sm text-muted-foreground">
            {questions.length} pergunta(s) — {questions.filter(q => q.active).length} ativa(s)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl border-b-2 border-primary/40 bg-primary px-4 py-2 font-heading font-bold text-primary-foreground"
        >
          <Plus className="size-4" /> Nova pergunta
        </button>
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
              className="w-full max-w-lg rounded-4xl border-2 border-border bg-card p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold">
                  {editingId ? 'Editar pergunta' : 'Nova pergunta'}
                </h3>
                <button type="button" onClick={() => setShowForm(false)}>
                  <X className="size-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-heading text-muted-foreground">Categoria</label>
                  <input
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 mt-1"
                    placeholder="ex: Brasil, Ciência..."
                  />
                </div>

                <div>
                  <label className="text-xs font-heading text-muted-foreground">Pergunta</label>
                  <textarea
                    value={form.question}
                    onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 mt-1 resize-none"
                    rows={2}
                    placeholder="Digite a pergunta..."
                  />
                </div>

                <div>
                  <label className="text-xs font-heading text-muted-foreground">
                    Opções (marque a correta)
                  </label>
                  <div className="flex flex-col gap-2 mt-1">
                    {form.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, correctIndex: i }))}
                          className={`flex size-9 shrink-0 items-center justify-center rounded-lg border-2 font-heading font-bold ${
                            form.correctIndex === i
                              ? 'border-green-500 bg-green-500/20 text-green-400'
                              : 'border-border text-muted-foreground'
                          }`}
                        >
                          {form.correctIndex === i ? <Check className="size-4" /> : ['A', 'B', 'C', 'D'][i]}
                        </button>
                        <input
                          value={opt}
                          onChange={e => setForm(f => ({
                            ...f,
                            options: f.options.map((o, idx) => idx === i ? e.target.value : o),
                          }))}
                          className="flex-1 rounded-xl border border-border bg-background px-3 py-2"
                          placeholder={`Opção ${['A', 'B', 'C', 'D'][i]}`}
                        />
                      </div>
                    ))}
                  </div>
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
        <div className="flex flex-col gap-2">
          {questions.map(q => (
            <div
              key={q.id}
              className={`flex items-start gap-3 rounded-2xl border-2 p-4 ${q.active ? 'border-border bg-card' : 'border-border/50 bg-card/40 opacity-60'}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full border border-border px-2 py-0.5 font-heading text-xs text-accent">
                    {q.category}
                  </span>
                  {!q.active && (
                    <span className="rounded-full bg-muted px-2 py-0.5 font-heading text-xs text-muted-foreground">
                      Inativa
                    </span>
                  )}
                </div>
                <p className="font-heading font-bold">{q.question}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {q.options.map((o, i) => (
                    <span
                      key={i}
                      className={`rounded-md px-2 py-0.5 text-xs ${i === q.correctIndex ? 'bg-green-500/20 text-green-300' : 'bg-muted text-muted-foreground'}`}
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => toggleActive(q)} title={q.active ? 'Desativar' : 'Ativar'} className="rounded-lg border border-border p-2 hover:bg-muted">
                  <Power className={`size-4 ${q.active ? 'text-green-400' : 'text-muted-foreground'}`} />
                </button>
                <button type="button" onClick={() => openEdit(q)} className="rounded-lg border border-border p-2 hover:bg-muted">
                  <Pencil className="size-4" />
                </button>
                <button type="button" onClick={() => remove(q.id)} className="rounded-lg border border-destructive/40 p-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
