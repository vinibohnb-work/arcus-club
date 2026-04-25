import { useState, useEffect } from 'react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEEKS = [
  { id: 'S01', period: '27/04–01/05' },
  { id: 'S02', period: '04/05–08/05' },
  { id: 'S03', period: '11/05–15/05' },
  { id: 'S04', period: '18/05–22/05', milestone: true },
  { id: 'S05', period: '25/05–29/05' },
  { id: 'S06', period: '01/06–05/06' },
  { id: 'S07', period: '08/06–12/06', milestone: true },
  { id: 'S08', period: '15/06–19/06' },
  { id: 'S09', period: '22/06–26/06' },
  { id: 'S10', period: '29/06–03/07', milestone: true },
  { id: 'S11', period: '06/07–10/07' },
  { id: 'S12', period: '13/07–17/07' },
  { id: 'S13', period: '20/07–24/07' },
  { id: 'S14', period: '27/07–01/08', milestone: true, final: true },
]

const QUESTIONS = [
  { key: 'continuar', label: 'O que continuar fazendo?' },
  { key: 'mais',      label: 'O que fazer mais? Quanto mais?' },
  { key: 'quem',      label: 'Quem conhecer ou se aproximar para dar certo?' },
  { key: 'parar',     label: 'O que parar de fazer?' },
  { key: 'marco',     label: 'Qual marco semanal de avanço?' },
]

// Conversion rate targets per stage (%)
const RATE_TARGETS = { aw: 60, wl: 89, lr: 50, rf: 25 }

// Funnel volume targets per week
const VOLUME_TARGETS = {
  abordagens: 15, whatsapp: 9, ligacoes: 8, reunioes: 4, fechamentos: 1,
}

// ─── Tokens ───────────────────────────────────────────────────────────────────

const T = {
  ink:      '#0E0E0E',
  paper:    '#F5F2EC',
  cream:    '#EDE9DF',
  gold:     '#B8933A',
  goldBg:   '#FBF7EE',
  muted:    '#888',
  border:   '#E5E1D8',
  teal:     '#1A6B5A',
  tealBg:   '#E8F5F0',
  red:      '#A03030',
  redBg:    '#FBE8E8',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(num, den) {
  const n = parseInt(num) || 0
  const d = parseInt(den) || 0
  return d === 0 ? null : Math.round((n / d) * 100)
}

function RateTag({ value, target }) {
  if (value === null) return (
    <span style={{ color: '#CCC', fontFamily: "'DM Mono', monospace", fontSize: 11 }}>—</span>
  )
  const ok = value >= target
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600,
      color: ok ? T.teal : T.red,
      background: ok ? T.tealBg : T.redBg,
      padding: '2px 6px', borderRadius: 3,
    }}>
      {value}%
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ViniMetas() {
  const [innerTab,     setInnerTab]     = useState('check')
  const [selectedWeek, setSelectedWeek] = useState('S01')
  const [checks,       setChecks]       = useState({})
  const [funnel,       setFunnel]       = useState({})

  useEffect(() => {
    try {
      const c = localStorage.getItem('vini-weekly-checks')
      const f = localStorage.getItem('vini-funnel-data')
      if (c) setChecks(JSON.parse(c))
      if (f) setFunnel(JSON.parse(f))
    } catch {}
  }, [])

  function saveCheck(week, field, value) {
    const next = { ...checks, [week]: { ...(checks[week] || {}), [field]: value } }
    setChecks(next)
    localStorage.setItem('vini-weekly-checks', JSON.stringify(next))
  }

  function saveFunnel(week, field, value) {
    const v = value === '' ? '' : Math.max(0, parseInt(value) || 0)
    const next = { ...funnel, [week]: { ...(funnel[week] || {}), [field]: v } }
    setFunnel(next)
    localStorage.setItem('vini-funnel-data', JSON.stringify(next))
  }

  const curWeek  = WEEKS.find(w => w.id === selectedWeek) || WEEKS[0]
  const checkData = checks[selectedWeek] || {}

  // Cumulative totals for "TOTAL" row
  const flds = ['abordagens', 'whatsapp', 'ligacoes', 'reunioes', 'fechamentos']
  const totals = Object.fromEntries(
    flds.map(f => [f, WEEKS.reduce((s, w) => s + (parseInt(funnel[w.id]?.[f]) || 0), 0)])
  )
  const totalRates = {
    aw: pct(totals.whatsapp,    totals.abordagens),
    wl: pct(totals.ligacoes,    totals.whatsapp),
    lr: pct(totals.reunioes,    totals.ligacoes),
    rf: pct(totals.fechamentos, totals.reunioes),
  }

  const filledWeeks = WEEKS.filter(w =>
    QUESTIONS.some(q => (checks[w.id]?.[q.key] || '').trim())
  ).length

  // ── Shared styles ────────────────────────────────────────────────────────────

  const innerTabBtn = (key, label) => (
    <button key={key} onClick={() => setInnerTab(key)} style={{
      padding: '9px 22px', border: 'none', background: 'none', cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
      fontWeight: innerTab === key ? 600 : 400,
      color: innerTab === key ? T.ink : T.muted,
      borderBottom: innerTab === key ? `2px solid ${T.ink}` : '2px solid transparent',
      marginBottom: -1,
    }}>{label}</button>
  )

  const numInput = (week, field) => {
    const d = funnel[week] || {}
    const val = d[field]
    const overTarget = parseInt(val) >= VOLUME_TARGETS[field]
    return (
      <td style={{ padding: '5px 4px', textAlign: 'center' }}>
        <input
          type="number" min="0"
          value={val ?? ''}
          onChange={e => saveFunnel(week, field, e.target.value)}
          style={{
            width: 48, textAlign: 'center', border: `1px solid ${T.border}`,
            borderRadius: 4, padding: '4px 2px',
            fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.ink,
            background: val !== '' && val !== undefined ? (overTarget ? '#F0FAF6' : '#FEF5F5') : '#fff',
            outline: 'none',
          }}
        />
      </td>
    )
  }

  const rateCell = (v, target) => (
    <td style={{ textAlign: 'center', padding: '5px 4px' }}>
      <RateTag value={v} target={target} />
    </td>
  )

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* ── Inner tab bar ── */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 28 }}>
        {innerTabBtn('check', 'Check Semanal')}
        {innerTabBtn('funil', 'Funil de Conversão')}
      </div>

      {/* ════════════════════════════════════════════
          CHECK SEMANAL
      ════════════════════════════════════════════ */}
      {innerTab === 'check' && (
        <>
          {/* Week pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
            {WEEKS.map(w => {
              const active  = w.id === selectedWeek
              const filled  = QUESTIONS.some(q => (checks[w.id]?.[q.key] || '').trim())
              return (
                <button key={w.id} onClick={() => setSelectedWeek(w.id)} style={{
                  position: 'relative', padding: '6px 13px', borderRadius: 6, cursor: 'pointer',
                  fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: active ? 600 : 400,
                  border: w.final     ? `2px solid ${T.gold}`
                        : w.milestone ? `1px solid ${T.gold}`
                        :               `1px solid ${T.border}`,
                  background: active  ? T.ink
                            : filled  ? '#F0FAF6'
                            : w.milestone ? T.goldBg
                            : '#fff',
                  color: active ? '#fff' : w.milestone ? T.gold : T.ink,
                  transition: 'all 0.12s',
                }}>
                  {w.id}
                  {filled && !active && (
                    <span style={{
                      position: 'absolute', top: -3, right: -3,
                      width: 7, height: 7, borderRadius: '50%',
                      background: T.teal, border: '1.5px solid #fff',
                    }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected week header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 26, color: T.ink }}>
              {curWeek.id}
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.muted }}>
              {curWeek.period}
            </span>
            {curWeek.milestone && (
              <span style={{
                background: T.goldBg, border: `1px solid ${T.gold}`, color: T.gold,
                fontSize: 9, padding: '2px 8px', borderRadius: 4,
                fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em',
              }}>
                MARCO ★
              </span>
            )}
          </div>

          {/* 5 questions — 2-col grid, last spans full width */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {QUESTIONS.map((q, i) => (
              <div key={q.key} style={{
                background: '#fff', border: `1px solid ${T.border}`, borderRadius: 8,
                padding: '18px 18px 14px',
                gridColumn: i === 4 ? '1 / -1' : undefined,
                borderTop: i === 4 ? `2px solid ${T.gold}` : undefined,
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.16em',
                  textTransform: 'uppercase', marginBottom: 8,
                  color: i === 4 ? T.gold : T.muted,
                }}>
                  {q.label}
                </div>
                <textarea
                  key={`${selectedWeek}-${q.key}`}
                  defaultValue={checkData[q.key] || ''}
                  onBlur={e => saveCheck(selectedWeek, q.key, e.target.value)}
                  placeholder="..."
                  style={{
                    width: '100%', minHeight: i === 4 ? 68 : 96,
                    border: `1px solid ${T.border}`, borderRadius: 6,
                    padding: '9px 11px', fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, color: T.ink, background: '#FAFAF8',
                    resize: 'vertical', boxSizing: 'border-box',
                    lineHeight: 1.65, outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.muted }}>
              Progresso:
            </span>
            {WEEKS.map(w => {
              const filled = QUESTIONS.some(q => (checks[w.id]?.[q.key] || '').trim())
              return (
                <div key={w.id} title={w.id} style={{
                  width: 22, height: 22, borderRadius: 4, fontSize: 9,
                  background: filled ? T.ink : T.border,
                  color: filled ? '#fff' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {filled ? '✓' : ''}
                </div>
              )
            })}
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.muted }}>
              {filledWeeks} / 14 semanas
            </span>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════
          FUNIL DE CONVERSÃO
      ════════════════════════════════════════════ */}
      {innerTab === 'funil' && (
        <>
          {/* Target reference bar */}
          <div style={{
            background: T.ink, borderRadius: 8, padding: '14px 24px',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
              marginRight: 20, lineHeight: 1.5, minWidth: 56,
            }}>
              META<br/>/ SEM
            </div>

            {[
              { label: 'Abordagens', n: 15, conv: null       },
              { label: 'WhatsApp',   n: 9,  conv: '→ 60%'   },
              { label: 'Ligações',   n: 8,  conv: '→ 89%'   },
              { label: 'Reuniões',   n: 4,  conv: '→ 50%'   },
              { label: 'Fechamentos',n: 1,  conv: '→ 25%'   },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                {s.conv && (
                  <div style={{ padding: '0 8px', textAlign: 'center' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.gold }}>{s.conv}</div>
                  </div>
                )}
                <div style={{ textAlign: 'center', padding: '0 18px', borderLeft: i > 0 && !s.conv ? '1px solid #1E1E1E' : 'none' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700, fontSize: 22, color: '#fff' }}>
                    {s.n}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: 'rgba(255,255,255,0.38)', marginTop: 1, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversion table */}
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 700 }}>
              <thead>
                <tr style={{ background: T.paper, borderBottom: `1px solid ${T.border}` }}>
                  {[
                    { h: 'SEM',    rate: false },
                    { h: 'Abord.', rate: false },
                    { h: 'A→W',    rate: true  },
                    { h: 'WA',     rate: false },
                    { h: 'W→L',    rate: true  },
                    { h: 'Lig.',   rate: false },
                    { h: 'L→R',    rate: true  },
                    { h: 'Reun.',  rate: false },
                    { h: 'R→F',    rate: true  },
                    { h: 'Fech.',  rate: false },
                  ].map((col, i) => (
                    <th key={i} style={{
                      padding: '9px 8px',
                      paddingLeft: i === 0 ? 16 : 8,
                      textAlign: i === 0 ? 'left' : 'center',
                      fontFamily: "'DM Mono', monospace", fontSize: 9,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: col.rate ? T.gold : T.muted,
                      fontWeight: col.rate ? 600 : 400,
                    }}>{col.h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WEEKS.map((w, idx) => {
                  const d  = funnel[w.id] || {}
                  const rAW = pct(d.whatsapp,    d.abordagens)
                  const rWL = pct(d.ligacoes,    d.whatsapp)
                  const rLR = pct(d.reunioes,    d.ligacoes)
                  const rRF = pct(d.fechamentos, d.reunioes)
                  const bg  = w.milestone ? T.goldBg : idx % 2 === 0 ? '#fff' : '#FAFAF8'

                  return (
                    <tr key={w.id} style={{
                      background: bg, borderBottom: `1px solid ${T.border}`,
                      borderLeft: w.milestone ? `3px solid ${T.gold}` : '3px solid transparent',
                    }}>
                      <td style={{
                        padding: '7px 16px', whiteSpace: 'nowrap',
                        fontFamily: "'DM Mono', monospace", fontSize: 12,
                        fontWeight: w.milestone ? 700 : 400,
                        color: w.milestone ? T.gold : T.ink,
                      }}>
                        {w.id}{w.milestone ? ' ★' : ''}
                      </td>
                      {numInput(w.id, 'abordagens')}
                      {rateCell(rAW, RATE_TARGETS.aw)}
                      {numInput(w.id, 'whatsapp')}
                      {rateCell(rWL, RATE_TARGETS.wl)}
                      {numInput(w.id, 'ligacoes')}
                      {rateCell(rLR, RATE_TARGETS.lr)}
                      {numInput(w.id, 'reunioes')}
                      {rateCell(rRF, RATE_TARGETS.rf)}
                      {numInput(w.id, 'fechamentos')}
                    </tr>
                  )
                })}

                {/* Totals row */}
                <tr style={{ background: T.ink, borderTop: `2px solid ${T.border}` }}>
                  <td style={{ padding: '10px 16px', fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                    TOTAL
                  </td>
                  {[
                    { type: 'val',  key: 'abordagens' },
                    { type: 'rate', v: totalRates.aw,  t: RATE_TARGETS.aw  },
                    { type: 'val',  key: 'whatsapp'   },
                    { type: 'rate', v: totalRates.wl,  t: RATE_TARGETS.wl  },
                    { type: 'val',  key: 'ligacoes'   },
                    { type: 'rate', v: totalRates.lr,  t: RATE_TARGETS.lr  },
                    { type: 'val',  key: 'reunioes'   },
                    { type: 'rate', v: totalRates.rf,  t: RATE_TARGETS.rf  },
                    { type: 'val',  key: 'fechamentos' },
                  ].map((col, i) =>
                    col.type === 'val' ? (
                      <td key={i} style={{
                        textAlign: 'center', padding: '10px 4px',
                        fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700,
                        color: col.key === 'fechamentos' ? T.gold : '#fff',
                      }}>
                        {totals[col.key] || '—'}
                      </td>
                    ) : (
                      <td key={i} style={{ textAlign: 'center', padding: '10px 4px' }}>
                        <RateTag value={col.v} target={col.t} />
                      </td>
                    )
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div style={{ marginTop: 10, display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.teal }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: T.tealBg, border: `1px solid ${T.teal}`, display: 'inline-block' }} />
              Acima da meta
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.red }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: T.redBg, border: `1px solid ${T.red}`, display: 'inline-block' }} />
              Abaixo da meta
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.muted }}>
              · Células de input ficam coloridas quando preenchidas
            </span>
          </div>
        </>
      )}

    </div>
  )
}
