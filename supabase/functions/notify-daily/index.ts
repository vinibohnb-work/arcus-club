import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const WA_PHONE  = Deno.env.get('WA_PHONE')!     // ex: 5551996567044
const WA_APIKEY = Deno.env.get('WA_APIKEY')!    // chave do CallMeBot

function fmt(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}/${m}`
}

Deno.serve(async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const in7 = new Date(today)
  in7.setDate(in7.getDate() + 7)
  const in7Str = in7.toISOString().slice(0, 10)

  // Busca todos os leads com nextSteps
  const { data: leads, error } = await supabase.from('leads').select('name, next_steps')
  if (error) return new Response('Erro ao buscar leads: ' + error.message, { status: 500 })

  type Step = { title: string; date: string; done: boolean }
  const overdue:  { lead: string; step: Step }[] = []
  const upcoming: { lead: string; step: Step }[] = []

  for (const lead of leads ?? []) {
    const steps: Step[] = lead.next_steps ?? []
    for (const s of steps) {
      if (s.done) continue
      if (s.date < todayStr) {
        overdue.push({ lead: lead.name, step: s })
      } else if (s.date >= todayStr && s.date <= in7Str) {
        upcoming.push({ lead: lead.name, step: s })
      }
    }
  }

  // Ordena por data
  overdue.sort((a, b) => a.step.date.localeCompare(b.step.date))
  upcoming.sort((a, b) => a.step.date.localeCompare(b.step.date))

  // Monta mensagem
  const lines: string[] = []
  lines.push(`📋 *Resumo Arcus Club — ${fmt(todayStr)}*`)
  lines.push('')

  if (overdue.length === 0 && upcoming.length === 0) {
    lines.push('✅ Nenhuma tarefa pendente ou prevista para os próximos 7 dias.')
  }

  if (overdue.length > 0) {
    lines.push(`🔴 *Atrasadas (${overdue.length})*`)
    for (const { lead, step } of overdue) {
      lines.push(`• ${fmt(step.date)} — ${lead}: ${step.title}`)
    }
    lines.push('')
  }

  if (upcoming.length > 0) {
    lines.push(`🟡 *Próximos 7 dias (${upcoming.length})*`)
    for (const { lead, step } of upcoming) {
      lines.push(`• ${fmt(step.date)} — ${lead}: ${step.title}`)
    }
  }

  const message = lines.join('\n')
  const url = `https://api.callmebot.com/whatsapp.php?phone=${WA_PHONE}&text=${encodeURIComponent(message)}&apikey=${WA_APIKEY}`

  const res = await fetch(url)
  const body = await res.text()

  return new Response(JSON.stringify({ ok: res.ok, body }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
