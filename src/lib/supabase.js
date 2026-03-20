import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Mappers: DB (snake_case) ↔ React (camelCase) ────────────────────────────

export const toMentee = (row) => ({
  id: row.id,
  name: row.name || '',
  email: row.email || '',
  phone: row.phone || '',
  stage: row.stage || 'Ativo',
  goal: row.goal || '',
  joinDate: row.join_date || '',
  avatar: row.avatar || '',
  color: row.color || '#C9A84C',
  tags: row.tags || [],
  milestones: row.milestones || [false, false, false, false, false, false],
  notes: row.notes || '',
  customPlan: row.custom_plan || '',
  basePlan: row.base_plan || null,
  photoUrl: row.photo_url || '',
  lastContact: row.last_contact || '',
})

export const toMenteeDb = (m) => ({
  id: String(m.id),
  name: m.name,
  email: m.email,
  phone: m.phone,
  stage: m.stage,
  goal: m.goal,
  join_date: m.joinDate,
  avatar: m.avatar,
  color: m.color,
  tags: m.tags,
  milestones: m.milestones,
  notes: m.notes,
  custom_plan: m.customPlan,
  base_plan: m.basePlan,
  photo_url: m.photoUrl,
  last_contact: m.lastContact,
})

export const toLead = (row) => ({
  id: row.id,
  name: row.name || '',
  email: row.email || '',
  phone: row.phone || '',
  source: row.source || '',
  interest: row.interest || '',
  stage: row.stage || 'Novo Lead',
  awareness: row.awareness || 'Frio',
  avatar: row.avatar || '',
  color: row.color || '#C9A84C',
  tags: row.tags || [],
  lastContact: row.last_contact || '',
  notes: row.notes || '',
  interactions: row.interactions || [],
  nextSteps: row.next_steps || [],
})

export const toLeadDb = (l) => ({
  id: String(l.id),
  name: l.name,
  email: l.email,
  phone: l.phone,
  source: l.source,
  interest: l.interest,
  stage: l.stage || 'Novo Lead',
  awareness: l.awareness || 'Frio',
  avatar: l.avatar,
  color: l.color,
  tags: l.tags,
  last_contact: l.lastContact,
  notes: l.notes,
  interactions: l.interactions || [],
  next_steps: l.nextSteps || [],
})

export const toEvent = (row) => ({
  id: row.id,
  title: row.title || '',
  date: row.date || '',
  time: row.time || '',
  type: row.type || 'evento',
  desc: row.description || '',  // coluna "description" no banco → "desc" no React
})

export const toEventDb = (e) => ({
  id: String(e.id),
  title: e.title,
  date: e.date,
  time: e.time,
  type: e.type,
  description: e.desc || '',   // "desc" no React → coluna "description" no banco
})

export const toGoalsObj = (rows) => {
  const obj = { 30: [], 60: [], 90: [], 150: [], 360: [] }
  ;(rows || []).forEach((row) => {
    if (obj[row.period]) {
      obj[row.period].push({ id: row.id, text: row.text, done: row.done })
    }
  })
  return obj
}

export const fromGoalsObj = (goalsObj) => {
  const rows = []
  Object.entries(goalsObj).forEach(([period, items]) => {
    items.forEach((item) => {
      rows.push({ id: String(item.id), period: Number(period), text: item.text, done: item.done })
    })
  })
  return rows
}
