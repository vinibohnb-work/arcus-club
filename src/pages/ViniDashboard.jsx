import { useMemo } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const T = {
  ink:    '#0E0E0E', paper: '#F5F2EC', cream: '#EDE9DF',
  gold:   '#B8933A', goldL: '#D4B06A', goldBg: '#FBF7EE',
  teal:   '#1A6B5A', tealBg: '#E8F5F0',
  indigo: '#7B6FD4', indigoBg: '#F0EEFF',
  red:    '#A03030', redBg: '#FBE8E8',
  muted:  '#888',    border: '#E5E1D8',
  border2:'rgba(14,14,14,0.10)',
}

const FUNNEL_SETS = {
  abordagens:  ['abordagem1','abordagem2','abordagem3','whatsapp','ligacao','reuniao_agendada','reuniao_realizada','proposta','fechado'],
  whatsapp:    ['whatsapp','ligacao','reuniao_agendada','reuniao_realizada','proposta','fechado'],
  ligacoes:    ['ligacao','reuniao_agendada','reuniao_realizada','proposta','fechado'],
  reunioes:    ['reuniao_realizada','proposta','fechado'],
  fechamentos: ['fechado'],
}

const RATE_TARGETS = { aw: 60, wl: 89, lr: 50, rf: 25 }
const VOL_TARGETS  = { abordagens: 15, whatsapp: 9, ligacoes: 8, reunioes: 4, fechamentos: 1 }

const META_START = new Date('2026-04-27')
const META_END   = new Date('2026-08-01')
const META_GOAL  = 14

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stageEff(lead) {
  return lead.stage === 'recusa' ? (lead.recusa_from || 'mapeado') : lead.stage
}

function pct(n, d) {
  return d > 0 ? Math.round((n / d) * 100) : null
}

function fmtBRL(n) {
  if (!n) return 'R$ 0'
  return 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 0 })
}

function mono(text, size = 10, color = T.muted, extra = {}) {
  return {
    fontFamily: "'DM Mono', monospace",
    fontSize: size,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color,
    ...extra,
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Label({ children, color = T.muted, size = 9 }) {
  return (
    <div style={mono(null, size, color, { marginBottom: 4, letterSpacing: '0.14em' })}>
      {children}
    </div>
  )
}

function BigNum({ value, color = T.ink, size = 32 }) {
  return (
    <div style={{
      fontFamily: "'Playfair Display', serif",
      fontStyle: 'italic', fontWeight: 700,
      fontSize: size, lineHeight: 1, color,
    }}>
      {value}
    </div>
  )
}

function SignalDot({ type }) {
  const cfg = {
    warn:   { bg: '#F59E0B', label: '⚠' },
    ok:     { bg: T.teal,   label: '✓' },
    action: { bg: T.indigo, label: '→' },
    dead:   { bg: '#CCC',   label: '·' },
  }[type] || { bg: '#CCC', label: '·' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
      background: cfg.bg, color: '#fff',
      fontSize: 9, fontWeight: 700, marginRight: 8,
    }}>
      {cfg.label}
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ViniDashboard({ crmLeads = [], contracts = [], scalasysClients = [] }) {

  const derived = useMemo(() => {
    const today = new Date()

    // ── Meta status ─────────────────────────────────────────────────────────
    const msPerWeek = 7 * 24 * 60 * 60 * 1000
    const notStarted = today < META_START
    const ended      = today > META_END
    const daysToStart = notStarted ? Math.ceil((META_START - today) / (1000*60*60*24)) : 0
    const weeksElapsed = notStarted ? 0 : Math.min(META_GOAL, Math.ceil((today - META_START) / msPerWeek))
    const weeksLeft   = META_GOAL - weeksElapsed

    // ── CRM ─────────────────────────────────────────────────────────────────
    const closed    = crmLeads.filter(l => l.stage === 'fechado')
    const proposals = crmLeads.filter(l => l.stage === 'proposta')
    const recusados = crmLeads.filter(l => l.stage === 'recusa')
    const active    = crmLeads.filter(l => !['mapeado','recusa','fechado'].includes(l.stage))
    const reunioesPend = crmLeads.filter(l => l.stage === 'reuniao_agendada')

    const salesDone  = closed.length
    const salesNeeded = Math.max(0, weeksElapsed - salesDone)
    const onTrack = weeksElapsed === 0 || salesDone >= weeksElapsed
    const winRate = (closed.length + recusados.length) > 0
      ? pct(closed.length, closed.length + recusados.length)
      : null

    // Overdue next steps
    const overdueCount = crmLeads.reduce((n, l) => {
      const pending = (l.next_steps || []).filter(s => !s.done && s.date && new Date(s.date) < today)
      return n + pending.length
    }, 0)

    // ── Funil acumulado ──────────────────────────────────────────────────────
    const cf = {
      abordagens:  crmLeads.filter(l => FUNNEL_SETS.abordagens.includes(stageEff(l))).length,
      whatsapp:    crmLeads.filter(l => FUNNEL_SETS.whatsapp.includes(stageEff(l))).length,
      ligacoes:    crmLeads.filter(l => FUNNEL_SETS.ligacoes.includes(stageEff(l))).length,
      reunioes:    crmLeads.filter(l => FUNNEL_SETS.reunioes.includes(stageEff(l))).length,
      fechamentos: crmLeads.filter(l => FUNNEL_SETS.fechamentos.includes(stageEff(l))).length,
    }
    const rates = {
      aw: pct(cf.whatsapp, cf.abordagens),
      wl: pct(cf.ligacoes, cf.whatsapp),
      lr: pct(cf.reunioes, cf.ligacoes),
      rf: pct(cf.fechamentos, cf.reunioes),
    }

    // ── Financeiro ──────────────────────────────────────────────────────────
    const totalReceived = contracts.reduce((s, c) => s + (Number(c.payments_received) || 0), 0)
    const mrr = contracts
      .filter(c => c.product === 'epc-manutencao' || c.product === 'arcus-advisory')
      .reduce((s, c) => s + (Number(c.next_payment_amount) || 0), 0)
    const pipelineValue = proposals.length * 24000

    // ── Funil bottleneck ────────────────────────────────────────────────────
    const rateSteps = [
      { label: 'A→W', actual: rates.aw, target: RATE_TARGETS.aw },
      { label: 'W→L', actual: rates.wl, target: RATE_TARGETS.wl },
      { label: 'L→R', actual: rates.lr, target: RATE_TARGETS.lr },
      { label: 'R→F', actual: rates.rf, target: RATE_TARGETS.rf },
    ]
    const bottleneck = rateSteps.find(r => r.actual !== null && r.actual < r.target) || null

    // ── Diagnostic signals ───────────────────────────────────────────────────
    const signals = []

    if (notStarted) {
      signals.push({ type: 'action', text: `Meta começa em ${daysToStart} dia${daysToStart !== 1 ? 's' : ''} — aqueça o pipeline esta semana` })
    } else if (!onTrack && salesNeeded > 0) {
      signals.push({ type: 'warn', text: `${salesNeeded} venda${salesNeeded > 1 ? 's' : ''} em atraso — feche antes de prospectar novo` })
    } else if (weeksElapsed > 0) {
      signals.push({ type: 'ok', text: `No ritmo — ${salesDone} venda${salesDone !== 1 ? 's' : ''} em ${weeksElapsed} semana${weeksElapsed !== 1 ? 's' : ''}` })
    }

    if (cf.abordagens === 0) {
      signals.push({ type: 'warn', text: 'Funil vazio — nenhuma abordagem registrada no CRM ainda' })
    } else if (weeksElapsed > 0 && cf.abordagens < weeksElapsed * VOL_TARGETS.abordagens) {
      const deficit = weeksElapsed * VOL_TARGETS.abordagens - cf.abordagens
      signals.push({ type: 'warn', text: `Volume baixo — ${deficit} abordagem${deficit > 1 ? 'ns' : ''} a menos que o necessário até agora` })
    }

    if (proposals.length > 0) {
      signals.push({ type: 'action', text: `${proposals.length} proposta${proposals.length > 1 ? 's' : ''} aberta${proposals.length > 1 ? 's' : ''} — follow-up é prioridade #1 agora` })
    }

    if (overdueCount > 0) {
      signals.push({ type: 'warn', text: `${overdueCount} próximo${overdueCount > 1 ? 's passos' : ' passo'} vencido${overdueCount > 1 ? 's' : ''} no CRM — execute antes de prospectar` })
    }

    if (bottleneck) {
      signals.push({ type: 'warn', text: `Gargalo em ${bottleneck.label}: ${bottleneck.actual}% de conversão (meta ${bottleneck.target}%)` })
    } else if (cf.abordagens > 0 && !bottleneck) {
      signals.push({ type: 'ok', text: 'Todas as taxas de conversão acima da meta' })
    }

    if (winRate !== null && winRate >= RATE_TARGETS.rf) {
      signals.push({ type: 'ok', text: `Win rate de ${winRate}% — acima da meta de ${RATE_TARGETS.rf}%` })
    } else if (winRate !== null) {
      signals.push({ type: 'warn', text: `Win rate em ${winRate}% — meta é ${RATE_TARGETS.rf}%. Revise objeções e decisores` })
    }

    if (mrr > 0) {
      signals.push({ type: 'ok', text: `MRR de ${fmtBRL(mrr)} estabelecido — receita recorrente ativa` })
    }

    if (reunioesPend.length > 0) {
      signals.push({ type: 'action', text: `${reunioesPend.length} reunião${reunioesPend.length > 1 ? 'ões' : ''} agendada${reunioesPend.length > 1 ? 's' : ''} — prepare o sketch para cada uma` })
    }

    return {
      today, notStarted, ended, daysToStart, weeksElapsed, weeksLeft,
      salesDone, salesNeeded, onTrack, winRate, overdueCount,
      closed, proposals, recusados, active, reunioesPend,
      cf, rates, totalReceived, mrr, pipelineValue,
      signals: signals.slice(0, 5),
      clientsTotal: scalasysClients.length,
    }
  }, [crmLeads, contracts, scalasysClients])

  const d = derived

  // ── Date header ─────────────────────────────────────────────────────────────
  const dateStr = d.today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
  const weekLabel = d.notStarted
    ? `PRÉ-META · começa em ${d.daysToStart}d`
    : d.ended ? 'META ENCERRADA'
    : `S${String(d.weeksElapsed).padStart(2,'0')} / ${META_GOAL} · ${META_GOAL - d.weeksElapsed} sem restantes`

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: T.cream, overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── HEADER BAR ──────────────────────────────────────────────── */}
      <div style={{
        height: 44, flexShrink: 0, background: T.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={mono(null, 10, 'rgba(255,255,255,0.4)', { letterSpacing: '0.2em' })}>
            DASHBOARD
          </span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)' }} />
          <span style={mono(null, 9, 'rgba(255,255,255,0.25)')}>
            {dateStr}
          </span>
        </div>
        <div style={{
          background: d.notStarted ? 'rgba(184,147,58,0.15)'
            : d.onTrack ? 'rgba(26,107,90,0.2)' : 'rgba(160,48,48,0.2)',
          border: `1px solid ${d.notStarted ? T.gold : d.onTrack ? T.teal : T.red}`,
          borderRadius: 4, padding: '3px 10px',
          ...mono(null, 9, d.notStarted ? T.goldL : d.onTrack ? '#5DCFB8' : '#E07070'),
        }}>
          {weekLabel}
        </div>
      </div>

      {/* ── MAIN GRID ───────────────────────────────────────────────── */}
      <div style={{
        flex: 1, minHeight: 0,
        display: 'grid',
        gridTemplateRows: '1fr 100px 120px',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 1, background: T.border,
      }}>

        {/* ══ CARD 1: META ABSURDA ══════════════════════════════════ */}
        <div style={{
          background: T.ink, padding: '24px 28px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden', position: 'relative',
        }}>
          {/* Glyph bg */}
          <div style={{
            position: 'absolute', right: -10, bottom: -20,
            fontFamily: "'Playfair Display', serif",
            fontSize: 140, fontStyle: 'italic', fontWeight: 700,
            color: 'rgba(255,255,255,0.03)', lineHeight: 1, userSelect: 'none',
          }}>
            {META_GOAL}
          </div>

          <div>
            <div style={mono(null, 8, 'rgba(255,255,255,0.28)', { marginBottom: 6 })}>
              META ABSURDA · 01/08/2026
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic', fontWeight: 700,
                fontSize: 72, lineHeight: 0.9,
                color: d.notStarted ? T.goldL
                     : d.onTrack   ? '#5DCFB8' : '#E07070',
              }}>
                {d.salesDone}
              </div>
              <div style={{ paddingBottom: 6 }}>
                <div style={mono(null, 9, 'rgba(255,255,255,0.3)')}>de</div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic', fontWeight: 700,
                  fontSize: 28, color: 'rgba(255,255,255,0.25)', lineHeight: 1,
                }}>
                  {META_GOAL}
                </div>
              </div>
              <div style={{ paddingBottom: 8, marginLeft: 4 }}>
                <div style={mono(null, 8, 'rgba(255,255,255,0.3)')}>vendas</div>
              </div>
            </div>
          </div>

          {/* Progress bar — weeks */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={mono(null, 8, 'rgba(255,255,255,0.25)')}>Semanas</span>
              <span style={mono(null, 8, 'rgba(255,255,255,0.25)')}>{d.weeksElapsed} / {META_GOAL}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${(d.weeksElapsed / META_GOAL) * 100}%`,
                background: d.notStarted ? T.gold : d.onTrack ? T.teal : T.red,
                transition: 'width 0.4s ease',
              }} />
            </div>
            {/* Sales pips */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {Array.from({ length: META_GOAL }).map((_, i) => (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: 3,
                  background: i < d.salesDone ? T.teal
                            : i < d.weeksElapsed ? 'rgba(160,48,48,0.5)'
                            : 'rgba(255,255,255,0.07)',
                  border: i < d.salesDone ? `1px solid ${T.teal}`
                        : i === d.weeksElapsed ? `1px solid rgba(255,255,255,0.2)`
                        : '1px solid transparent',
                }} />
              ))}
            </div>
            <div style={{ marginTop: 8, ...mono(null, 8, 'rgba(255,255,255,0.2)') }}>
              ■ fechada &nbsp; ■ semana perdida &nbsp; □ futura
            </div>
          </div>
        </div>

        {/* ══ CARD 2: PIPELINE CRM ══════════════════════════════════ */}
        <div style={{
          background: T.paper, padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <div style={mono(null, 8, T.muted, { letterSpacing: '0.18em' })}>PIPELINE CRM</div>
            <div style={{ ...mono(null, 9, T.muted), textTransform: 'none' }}>
              {crmLeads.length} lead{crmLeads.length !== 1 ? 's' : ''} total
            </div>
          </div>

          {/* Stage groups */}
          {[
            {
              label: 'Prospecção',
              color: T.indigo,
              keys: ['mapeado','abordagem1','abordagem2','abordagem3'],
            },
            {
              label: 'Qualificação',
              color: '#F59E0B',
              keys: ['whatsapp','ligacao'],
            },
            {
              label: 'Negociação',
              color: T.teal,
              keys: ['reuniao_agendada','reuniao_realizada','proposta'],
            },
            {
              label: 'Fechado',
              color: T.teal,
              keys: ['fechado'],
              gold: true,
            },
            {
              label: 'Recusa',
              color: T.red,
              keys: ['recusa'],
            },
          ].map(group => {
            const count = crmLeads.filter(l => group.keys.includes(l.stage)).length
            const pctVal = crmLeads.length > 0 ? count / crmLeads.length : 0
            return (
              <div key={group.label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 0', borderBottom: `1px solid ${T.border}`,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: group.gold ? T.gold : group.color,
                }} />
                <div style={{ flex: 1, fontSize: 12, color: T.ink }}>{group.label}</div>
                <div style={{ width: 80, height: 3, background: T.cream, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pctVal * 100}%`, background: group.gold ? T.gold : group.color, borderRadius: 2 }} />
                </div>
                <div style={{ ...mono(null, 11, count > 0 ? T.ink : '#CCC'), minWidth: 18, textAlign: 'right', fontWeight: count > 0 ? 700 : 400, textTransform: 'none' }}>
                  {count}
                </div>
              </div>
            )
          })}

          {/* Win rate */}
          <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', gap: 24 }}>
            <div>
              <Label color={T.muted}>Win rate</Label>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700,
                color: d.winRate === null ? '#CCC'
                     : d.winRate >= RATE_TARGETS.rf ? T.teal : T.red,
              }}>
                {d.winRate !== null ? `${d.winRate}%` : '—'}
              </div>
            </div>
            <div>
              <Label color={T.muted}>Reuniões agend.</Label>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: d.reunioesPend.length > 0 ? T.indigo : '#CCC' }}>
                {d.reunioesPend.length}
              </div>
            </div>
            <div>
              <Label color={T.muted}>Em proposta</Label>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: d.proposals.length > 0 ? T.gold : '#CCC' }}>
                {d.proposals.length}
              </div>
            </div>
          </div>
        </div>

        {/* ══ CARD 3: RECEITA ═══════════════════════════════════════ */}
        <div style={{
          background: T.paper, padding: '20px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
          <div style={mono(null, 8, T.muted, { letterSpacing: '0.18em', marginBottom: 16 })}>RECEITA</div>

          {[
            {
              label: 'Total recebido',
              value: fmtBRL(d.totalReceived),
              sub: 'acumulado contratos ativos',
              color: d.totalReceived > 0 ? T.ink : '#CCC',
              accent: T.gold,
            },
            {
              label: 'MRR (advisory)',
              value: fmtBRL(d.mrr),
              sub: 'recorrência mensal ativa',
              color: d.mrr > 0 ? T.teal : '#CCC',
              accent: T.teal,
            },
            {
              label: 'Pipeline (propostas)',
              value: fmtBRL(d.pipelineValue),
              sub: `${d.proposals.length} proposta${d.proposals.length !== 1 ? 's' : ''} × R$24k`,
              color: d.pipelineValue > 0 ? T.indigo : '#CCC',
              accent: T.indigo,
            },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '12px 0',
              borderBottom: i < 2 ? `1px solid ${T.border}` : 'none',
            }}>
              <div style={{ ...mono(null, 8, T.muted), marginBottom: 3 }}>{item.label}</div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic', fontWeight: 700,
                fontSize: 22, color: item.color, lineHeight: 1,
              }}>
                {item.value}
              </div>
              <div style={{ fontSize: 10, color: '#BBB', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 16, paddingTop: 8 }}>
            <div>
              <Label color={T.muted}>Scalasys ativos</Label>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 16, fontWeight: 700, color: scalasysClients.length > 0 ? T.indigo : '#CCC' }}>
                {scalasysClients.length}
              </div>
            </div>
          </div>
        </div>

        {/* ══ FUNIL ACUMULADO — spans all 3 cols ════════════════════ */}
        <div style={{
          gridColumn: '1 / -1',
          background: T.paper, padding: '0 28px',
          display: 'flex', alignItems: 'center', gap: 0, overflow: 'hidden',
          borderTop: `1px solid ${T.border}`,
        }}>
          <div style={{ ...mono(null, 8, T.muted, { letterSpacing: '0.18em' }), minWidth: 80, flexShrink: 0 }}>
            FUNIL<br />ACUMULADO
          </div>
          <div style={{ width: 1, height: 40, background: T.border, marginRight: 24 }} />

          {[
            { key: 'abordagens', label: 'Abordagens', target: VOL_TARGETS.abordagens, rate: null,        rateKey: null,  rateTarget: null },
            { key: 'whatsapp',   label: 'WhatsApp',   target: VOL_TARGETS.whatsapp,   rate: d.rates.aw,  rateKey: 'A→W', rateTarget: RATE_TARGETS.aw },
            { key: 'ligacoes',   label: 'Ligações',   target: VOL_TARGETS.ligacoes,   rate: d.rates.wl,  rateKey: 'W→L', rateTarget: RATE_TARGETS.wl },
            { key: 'reunioes',   label: 'Reuniões',   target: VOL_TARGETS.reunioes,   rate: d.rates.lr,  rateKey: 'L→R', rateTarget: RATE_TARGETS.lr },
            { key: 'fechamentos',label: 'Fechamentos',target: VOL_TARGETS.fechamentos,rate: d.rates.rf,  rateKey: 'R→F', rateTarget: RATE_TARGETS.rf },
          ].map((stage, i) => {
            const val = d.cf[stage.key] || 0
            const overTarget = val >= stage.target * Math.max(1, d.weeksElapsed)
            const valColor = val === 0 ? '#CCC' : overTarget ? T.teal : T.red
            const rateOk = stage.rate !== null && stage.rate >= stage.rateTarget

            return (
              <div key={stage.key} style={{ display: 'flex', alignItems: 'center' }}>
                {/* Rate arrow */}
                {stage.rate !== null && (
                  <div style={{ padding: '0 12px', textAlign: 'center' }}>
                    <div style={{
                      ...mono(null, 8, stage.rate === null ? '#DDD' : rateOk ? T.teal : T.red),
                      textTransform: 'none',
                    }}>
                      {stage.rate !== null ? `${stage.rate}%` : '—'}
                    </div>
                    <div style={{ fontSize: 14, color: '#CCC', lineHeight: 1 }}>→</div>
                    <div style={{ ...mono(null, 7, '#CCC'), textTransform: 'none' }}>
                      {stage.rateKey}
                    </div>
                  </div>
                )}

                {/* Stage block */}
                <div style={{ textAlign: 'center', minWidth: 80 }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontWeight: 700,
                    fontSize: 26, lineHeight: 1, color: valColor,
                  }}>
                    {val}
                  </div>
                  <div style={{ ...mono(null, 7, T.muted), marginTop: 3, textTransform: 'uppercase' }}>
                    {stage.label}
                  </div>
                  <div style={{ ...mono(null, 7, '#CCC'), textTransform: 'none', marginTop: 1 }}>
                    meta ×{stage.target}/sem
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ══ DIAGNÓSTICO CRÍTICO — spans all 3 cols ════════════════ */}
        <div style={{
          gridColumn: '1 / -1',
          background: T.ink, padding: '0 28px',
          display: 'flex', alignItems: 'center', gap: 0, overflow: 'hidden',
        }}>
          <div style={{ ...mono(null, 8, 'rgba(255,255,255,0.25)', { letterSpacing: '0.18em' }), minWidth: 80, flexShrink: 0, lineHeight: 1.6 }}>
            DIAGNÓS-<br />TICO
          </div>
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.06)', marginRight: 24, flexShrink: 0 }} />

          <div style={{ display: 'flex', flex: 1, gap: 0, overflow: 'hidden' }}>
            {d.signals.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SignalDot type="ok" />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  Sistema montado — aguardando dados do CRM
                </span>
              </div>
            ) : d.signals.map((sig, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', flex: 1, minWidth: 0,
                padding: '0 16px',
                borderRight: i < d.signals.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <SignalDot type={sig.type} />
                <span style={{
                  fontSize: 11, color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.4, overflow: 'hidden',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>
                  {sig.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
