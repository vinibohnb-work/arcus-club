import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

function fmt(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}/${m}`
}

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function buildMessage(
  todayStr: string,
  overdue: any[],
  upcoming: any[],
  overduePayments: any[],
  upcomingPayments: any[],
) {
  const lines: string[] = []
  lines.push(`📋 *Arcus Club — ${fmt(todayStr)}*`)
  lines.push('')

  const hasLeadAlerts    = overdue.length > 0 || upcoming.length > 0
  const hasPaymentAlerts = overduePayments.length > 0 || upcomingPayments.length > 0

  if (!hasLeadAlerts && !hasPaymentAlerts) {
    lines.push('✅ Nenhuma tarefa ou cobrança pendente para os próximos 7 dias.')
    return lines.join('\n')
  }

  // ── Tarefas de prospecção ──
  if (overdue.length > 0) {
    lines.push(`🔴 *Tarefas atrasadas (${overdue.length})*`)
    for (const { lead, step } of overdue) {
      lines.push(`• ${fmt(step.date)} — ${lead}: ${step.title}`)
    }
    lines.push('')
  }

  if (upcoming.length > 0) {
    lines.push(`🟡 *Tarefas — próximos 7 dias (${upcoming.length})*`)
    for (const { lead, step } of upcoming) {
      lines.push(`• ${fmt(step.date)} — ${lead}: ${step.title}`)
    }
    lines.push('')
  }

  // ── Cobranças ──
  if (overduePayments.length > 0) {
    lines.push(`🔴 *Cobranças atrasadas (${overduePayments.length})*`)
    for (const { mentee, payment } of overduePayments) {
      lines.push(`• ${fmt(payment.dueDate)} — ${mentee}: ${payment.description} (${fmtBRL(payment.amount)})`)
    }
    lines.push('')
  }

  if (upcomingPayments.length > 0) {
    lines.push(`🟡 *Cobranças — próximos 7 dias (${upcomingPayments.length})*`)
    for (const { mentee, payment } of upcomingPayments) {
      lines.push(`• ${fmt(payment.dueDate)} — ${mentee}: ${payment.description} (${fmtBRL(payment.amount)})`)
    }
  }

  return lines.join('\n')
}

Deno.serve(async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const in7 = new Date(today)
  in7.setDate(in7.getDate() + 7)
  const in7Str = in7.toISOString().slice(0, 10)

  // ── Fetch leads (próximas etapas) ──
  const { data: leads, error: leadsErr } = await supabase.from('leads').select('name, next_steps')
  if (leadsErr) return new Response('Erro leads: ' + leadsErr.message, { status: 500 })

  type Step = { title: string; date: string; done: boolean }
  const overdue:  { lead: string; step: Step }[] = []
  const upcoming: { lead: string; step: Step }[] = []

  for (const lead of leads ?? []) {
    for (const s of (lead.next_steps ?? []) as Step[]) {
      if (s.done) continue
      if (s.date < todayStr) overdue.push({ lead: lead.name, step: s })
      else if (s.date <= in7Str) upcoming.push({ lead: lead.name, step: s })
    }
  }

  overdue.sort((a, b) => a.step.date.localeCompare(b.step.date))
  upcoming.sort((a, b) => a.step.date.localeCompare(b.step.date))

  // ── Fetch mentees (cobranças) ──
  const { data: mentees, error: menteesErr } = await supabase.from('mentees').select('name, payments')
  if (menteesErr) return new Response('Erro mentees: ' + menteesErr.message, { status: 500 })

  type Payment = { id: number; description: string; amount: number; dueDate: string; paidAt: string | null }
  const overduePayments:  { mentee: string; payment: Payment }[] = []
  const upcomingPayments: { mentee: string; payment: Payment }[] = []

  for (const m of mentees ?? []) {
    for (const p of (m.payments ?? []) as Payment[]) {
      if (p.paidAt) continue // já pago
      if (p.dueDate < todayStr) overduePayments.push({ mentee: m.name, payment: p })
      else if (p.dueDate <= in7Str) upcomingPayments.push({ mentee: m.name, payment: p })
    }
  }

  overduePayments.sort((a, b) => a.payment.dueDate.localeCompare(b.payment.dueDate))
  upcomingPayments.sort((a, b) => a.payment.dueDate.localeCompare(b.payment.dueDate))

  const message = buildMessage(todayStr, overdue, upcoming, overduePayments, upcomingPayments)

  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
  const authToken  = Deno.env.get('TWILIO_AUTH_TOKEN')
  const from       = Deno.env.get('TWILIO_FROM') // ex: whatsapp:+14155238886
  const to         = Deno.env.get('TWILIO_TO')   // ex: whatsapp:+5511999999999

  if (!accountSid || !authToken || !from || !to) {
    return new Response('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM ou TWILIO_TO não configurados', { status: 500 })
  }

  const credentials = btoa(`${accountSid}:${authToken}`)
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: to, Body: message }),
    },
  )
  const resBody = await res.text()

  console.log('[twilio] status:', res.status, '| body:', resBody)

  return new Response(resBody, { status: res.ok ? 200 : 500 })
})
