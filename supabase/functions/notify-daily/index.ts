import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const TO_EMAILS = ['vinibohnb@gmail.com', 'viictor.godoi@gmail.com']

function fmt(date: string) {
  const [y, m, d] = date.split('-')
  return `${d}/${m}`
}

function buildHtml(todayStr: string, overdue: any[], upcoming: any[]) {
  const overdueRows = overdue.map(({ lead, step }) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1C1C1C;color:#E05252;font-weight:600;">${fmt(step.date)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1C1C1C;color:#F2EDE4;">${lead}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1C1C1C;color:#F2EDE4;">${step.title}</td>
    </tr>`).join('')

  const upcomingRows = upcoming.map(({ lead, step }) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1C1C1C;color:#C9A84C;font-weight:600;">${fmt(step.date)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1C1C1C;color:#F2EDE4;">${lead}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1C1C1C;color:#F2EDE4;">${step.title}</td>
    </tr>`).join('')

  const overdueSection = overdue.length > 0 ? `
    <h2 style="font-size:14px;font-weight:700;color:#E05252;text-transform:uppercase;letter-spacing:0.1em;margin:28px 0 10px;">
      🔴 Atrasadas (${overdue.length})
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#161616;border-radius:4px;overflow:hidden;">
      <thead>
        <tr style="background:#111;">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8A8070;text-transform:uppercase;letter-spacing:0.1em;">Data</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8A8070;text-transform:uppercase;letter-spacing:0.1em;">Lead</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8A8070;text-transform:uppercase;letter-spacing:0.1em;">Tarefa</th>
        </tr>
      </thead>
      <tbody>${overdueRows}</tbody>
    </table>` : ''

  const upcomingSection = upcoming.length > 0 ? `
    <h2 style="font-size:14px;font-weight:700;color:#C9A84C;text-transform:uppercase;letter-spacing:0.1em;margin:28px 0 10px;">
      🟡 Próximos 7 dias (${upcoming.length})
    </h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#161616;border-radius:4px;overflow:hidden;">
      <thead>
        <tr style="background:#111;">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8A8070;text-transform:uppercase;letter-spacing:0.1em;">Data</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8A8070;text-transform:uppercase;letter-spacing:0.1em;">Lead</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8A8070;text-transform:uppercase;letter-spacing:0.1em;">Tarefa</th>
        </tr>
      </thead>
      <tbody>${upcomingRows}</tbody>
    </table>` : ''

  const emptyMsg = overdue.length === 0 && upcoming.length === 0
    ? `<p style="color:#8A8070;text-align:center;padding:32px 0;">✅ Nenhuma tarefa pendente para os próximos 7 dias.</p>`
    : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">

    <div style="text-align:center;margin-bottom:32px;">
      <p style="font-size:11px;color:#C9A84C;text-transform:uppercase;letter-spacing:0.2em;margin:0 0 6px;">Arcus Club</p>
      <h1 style="font-size:22px;color:#F2EDE4;margin:0;">Resumo do dia</h1>
      <p style="font-size:13px;color:#8A8070;margin:6px 0 0;">${fmt(todayStr)}</p>
    </div>

    ${emptyMsg}
    ${overdueSection}
    ${upcomingSection}

    <p style="text-align:center;font-size:11px;color:#4A4440;margin-top:40px;letter-spacing:0.12em;">
      O LUCRO ESTÁ NA ORGANIZAÇÃO · SISTEMA DE MENTORIA
    </p>
  </div>
</body>
</html>`
}

Deno.serve(async () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  const in7 = new Date(today)
  in7.setDate(in7.getDate() + 7)
  const in7Str = in7.toISOString().slice(0, 10)

  const { data: leads, error } = await supabase.from('leads').select('name, next_steps')
  if (error) return new Response('Erro: ' + error.message, { status: 500 })

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

  const html = buildHtml(todayStr, overdue, upcoming)
  const subject = overdue.length > 0
    ? `⚠️ ${overdue.length} tarefa(s) atrasada(s) — Arcus Club ${fmt(todayStr)}`
    : `📋 Resumo Arcus Club — ${fmt(todayStr)}`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Arcus Club <onboarding@resend.dev>',
      to: TO_EMAILS,
      subject,
      html,
    }),
  })

  const data = await res.json()
  return new Response(JSON.stringify(data), {
    status: res.ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  })
})
