// ─── PropostaPage — Arcus Club ────────────────────────────────────────────────
// Abra /proposta no navegador e use Ctrl+P → Salvar como PDF

const COLORS = {
  bg: '#080808',
  surface: '#111111',
  card: '#161616',
  border: '#2A2A2A',
  accent: '#C9A84C',
  accentLight: '#E2C37A',
  text: '#F2EDE4',
  textMuted: '#8A8070',
  textDim: '#4A4440',
}

const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`
const FONT_UI = `'Jost', 'DM Sans', sans-serif`

const DELIVERABLES = [
  {
    icon: '◈',
    title: 'Encontros Semanais',
    desc: 'Sessões em grupo de 1 hora por encontro para acompanhamento contínuo da evolução de cada empresário.',
  },
  {
    icon: '◈',
    title: 'Encontros Presenciais',
    desc: '3 encontros presenciais em grupo ao longo do ano para imersão, conexão e alinhamento estratégico.',
  },
  {
    icon: '◈',
    title: 'Aulas Mensais',
    desc: 'Aulas em grupo de 2 horas mensais com conteúdo técnico e prático voltado ao crescimento do negócio.',
  },
  {
    icon: '◈',
    title: 'Acesso Direto aos Mentores',
    desc: 'Disponibilidade e acesso aos mentores 24/7 para dúvidas, decisões e suporte em momentos críticos.',
  },
  {
    icon: '◈',
    title: 'Plataforma de Desenvolvimento',
    desc: 'Acesso exclusivo à plataforma Arcus Club com materiais, ferramentas e acompanhamento de progresso.',
  },
  {
    icon: '◈',
    title: 'Plano de Desenvolvimento Individual',
    desc: 'Construção de um plano personalizado, alinhado com suas metas e expectativas pessoais e profissionais.',
  },
  {
    icon: '◈',
    title: 'Networking & Conexões',
    desc: 'Acesso a uma rede qualificada de empresários e parceiros estratégicos do ecossistema Arcus Club.',
  },
]

export default function PropostaPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      fontFamily: FONT_UI,
      color: COLORS.text,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
          }
          .proposta-root {
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 0 !important;
            background: #080808 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .proposta-sheet {
            width: 210mm !important;
            min-height: 297mm !important;
            page-break-inside: avoid !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="proposta-root" style={{ width: '100%', maxWidth: 794 }}>
        <div className="proposta-sheet" style={{
          width: '100%',
          minHeight: '100vh',
          background: COLORS.bg,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* ── Gradientes decorativos ── */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: `
              radial-gradient(ellipse 70% 40% at 10% 0%, ${COLORS.accent}12 0%, transparent 55%),
              radial-gradient(ellipse 50% 50% at 90% 100%, ${COLORS.accent}08 0%, transparent 55%)
            `,
          }} />

          {/* ── Linha topo ── */}
          <div style={{
            height: 3,
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.accent} 30%, ${COLORS.accentLight} 50%, ${COLORS.accent} 70%, transparent 100%)`,
          }} />

          {/* ── Conteúdo ── */}
          <div style={{ padding: '44px 56px 40px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
              <img src="/arcus_logo.png" alt="Arcus Club" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: 10, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 400 }}>
                O lucro está na organização
              </span>
            </div>

            {/* Título */}
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 34,
                fontWeight: 700,
                fontStyle: 'italic',
                color: COLORS.text,
                lineHeight: 1.18,
                marginBottom: 12,
                whiteSpace: 'nowrap',
              }}>
                Sua jornada no{' '}
                <span style={{ color: COLORS.accent }}>Arcus Club</span>
              </div>
              <div style={{
                width: 48, height: 1.5,
                background: `linear-gradient(90deg, ${COLORS.accent}, transparent)`,
                marginTop: 4,
              }} />
            </div>

            {/* Subtítulo */}
            <div style={{
              fontSize: 13.5,
              color: COLORS.textMuted,
              lineHeight: 1.65,
              maxWidth: 560,
              marginBottom: 36,
            }}>
              Um programa de mentoria estruturado para empresários que querem crescer com método,
              clareza e suporte especializado — do planejamento à execução.
            </div>

            {/* ── Grid de entregas ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px 20px',
              flex: 1,
            }}>
              {DELIVERABLES.map((item, i) => (
                <div key={i} style={{
                  background: COLORS.card,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 4,
                  padding: '16px 18px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Accent bar esquerda */}
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: 2,
                    background: `linear-gradient(180deg, ${COLORS.accent}CC, ${COLORS.accent}33)`,
                  }} />
                  <div style={{
                    fontSize: 10,
                    color: COLORS.accent,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: 5,
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: 11.5,
                    color: COLORS.textMuted,
                    lineHeight: 1.6,
                  }}>
                    {item.desc}
                  </div>
                </div>
              ))}

              {/* Card vazio para balancear o grid (7 itens = 4+3, última linha tem espaço) */}
              {DELIVERABLES.length % 2 !== 0 && (
                <div style={{
                  background: 'transparent',
                  border: `1px dashed ${COLORS.border}44`,
                  borderRadius: 4,
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 22, color: COLORS.accent, marginBottom: 6, opacity: 0.5 }}>◈</div>
                    <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                      E muito mais
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Rodapé ── */}
            <div style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                arcusclub.com.br
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.accent}66)` }} />
                <div style={{ fontSize: 10, color: COLORS.accent, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                  Confidencial
                </div>
                <div style={{ width: 20, height: 1, background: `linear-gradient(90deg, ${COLORS.accent}66, transparent)` }} />
              </div>
            </div>
          </div>

          {/* ── Linha base ── */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${COLORS.accent}55 30%, ${COLORS.accent}88 50%, ${COLORS.accent}55 70%, transparent 100%)`,
          }} />
        </div>

        {/* ══════════════ SEGUNDA FOLHA — PLATAFORMA ══════════════ */}
        <div className="proposta-sheet" style={{
          width: '100%',
          minHeight: '100vh',
          background: COLORS.bg,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          pageBreakBefore: 'always',
          breakBefore: 'page',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `radial-gradient(ellipse 60% 35% at 80% 0%, ${COLORS.accent}0A 0%, transparent 55%)` }} />
          <div style={{ height: 3, background: `linear-gradient(90deg, transparent 0%, ${COLORS.accent} 30%, ${COLORS.accentLight} 50%, ${COLORS.accent} 70%, transparent 100%)` }} />

          <div style={{ padding: '44px 56px 40px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
              <img src="/arcus_logo.png" alt="Arcus Club" style={{ height: 32, width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: 10, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.22em', fontWeight: 400 }}>O lucro está na organização</span>
            </div>

            {/* Título da seção */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 700, fontStyle: 'italic', color: COLORS.text, lineHeight: 1.2, marginBottom: 10 }}>
                Sua <span style={{ color: COLORS.accent }}>plataforma</span> exclusiva
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65, maxWidth: 520 }}>
                Cada mentorado tem acesso a um portal individual com seu plano de desenvolvimento, histórico de sessões, recursos e acompanhamento de progresso em tempo real.
              </div>
            </div>

            {/* ── Mockup da plataforma ── */}
            <div style={{
              flex: 1,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              overflow: 'hidden',
              background: COLORS.bg,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 0 60px ${COLORS.accent}08`,
            }}>

              {/* Barra do browser */}
              <div style={{ height: 34, background: '#050505', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6, flexShrink: 0 }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#E05252' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#C9A84C' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#3DBFB0' }} />
                <div style={{ flex: 1, margin: '0 12px', height: 18, background: COLORS.surface, borderRadius: 3, border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                  <span style={{ fontSize: 9, color: COLORS.textDim, letterSpacing: '0.04em' }}>arcusclub.com.br/mentee/seu-nome</span>
                </div>
              </div>

              {/* App header */}
              <div style={{ height: 44, background: `${COLORS.surface}EE`, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', padding: '0 28px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 18, height: 1.5, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontStyle: 'italic', fontWeight: 700, color: COLORS.text }}>Arcus Club</span>
                </div>
              </div>

              {/* App body */}
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* ── Painel esquerdo ── */}
                <div style={{ width: 220, flexShrink: 0, padding: '28px 24px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, borderRight: `1px solid ${COLORS.border}` }}>

                  {/* Rótulo */}
                  <div style={{ fontSize: 7.5, color: COLORS.accent, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8, alignSelf: 'flex-start' }}>Central do Mentorado</div>

                  {/* Nome */}
                  <div style={{ alignSelf: 'flex-start', marginBottom: 18 }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, fontStyle: 'italic', color: COLORS.text, lineHeight: 1.1 }}>
                      Seu <span style={{ color: '#4A4440' }}>Nome</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                      <div style={{ height: 1.5, width: 22, background: `${COLORS.accent}66`, borderRadius: 1 }} />
                      <span style={{ fontSize: 8, color: COLORS.textMuted }}>3/6 marcos · 50%</span>
                    </div>
                  </div>

                  {/* Área do menu circular — versão estilizada */}
                  <div style={{ position: 'relative', width: 172, height: 172, flexShrink: 0 }}>

                    {/* Arco tracejado */}
                    <svg viewBox="0 0 172 172" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
                      <circle cx="86" cy="86" r="72" fill="none" stroke={`${COLORS.accent}33`} strokeWidth="1" strokeDasharray="4 4" />
                      {/* Anel de progresso */}
                      <circle cx="86" cy="86" r="46" fill="none" stroke={COLORS.border} strokeWidth="2" />
                      <circle cx="86" cy="86" r="46" fill="none" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round"
                        strokeDasharray={`${(50 / 100) * (2 * Math.PI * 46)} ${2 * Math.PI * 46}`}
                        transform="rotate(-90 86 86)" />
                      <text x="86" y="152" textAnchor="middle" fill={COLORS.accent} fontSize="7" fontFamily="Jost, sans-serif" fontWeight="600">50%</text>
                      {/* Linhas conectoras */}
                      {[[-58, 30], [-28, 65], [28, 65], [58, 30]].map(([dx, dy], i) => (
                        <line key={i} x1={86 + dx * 0.58} y1={86 - dy * 0.58} x2={86 + dx} y2={86 - dy}
                          stroke={COLORS.textDim} strokeWidth="0.6" opacity="0.5" />
                      ))}
                      {/* Pontos no arco */}
                      {[[-58, 30], [-28, 65], [28, 65], [58, 30]].map(([dx, dy], i) => (
                        <circle key={i} cx={86 + dx} cy={86 - dy} r="2.5" fill={i === 0 ? COLORS.accent : COLORS.border} />
                      ))}
                    </svg>

                    {/* Avatar */}
                    <div style={{
                      position: 'absolute', left: 86 - 38, top: 86 - 38,
                      width: 76, height: 76, borderRadius: '50%',
                      background: `${COLORS.accent}18`, border: `1.5px solid ${COLORS.accent}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 20px ${COLORS.accent}22`,
                    }}>
                      <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, fontStyle: 'italic', color: COLORS.accent }}>SN</span>
                    </div>

                    {/* Balloons */}
                    {[
                      { label: '🎯 Minha Jornada', dx: -58, dy: 30, active: true },
                      { label: '📋 Plano Base',    dx: -28, dy: 65, active: false },
                      { label: '✍️ Personalizado', dx:  28, dy: 65, active: false },
                      { label: '📚 Recursos',      dx:  58, dy: 30, active: false },
                    ].map((b, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        left: 86 + b.dx - (b.dx < 0 ? 70 : 0),
                        top: 86 - b.dy - 11,
                        background: b.active ? `${COLORS.accent}22` : `${COLORS.card}EE`,
                        border: `1px solid ${b.active ? COLORS.accent : COLORS.border}`,
                        borderRadius: 100,
                        padding: '5px 10px',
                        fontSize: 7.5,
                        fontWeight: b.active ? 700 : 400,
                        color: b.active ? COLORS.accent : COLORS.textMuted,
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.02em',
                      }}>
                        {b.label}
                      </div>
                    ))}
                  </div>

                  {/* Meta */}
                  <div style={{ alignSelf: 'flex-start', marginTop: 14 }}>
                    <div style={{ fontSize: 7.5, color: COLORS.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Meta</div>
                    <div style={{ fontSize: 10, color: COLORS.text, fontWeight: 500, lineHeight: 1.5 }}>Escalar o faturamento</div>
                    <div style={{ fontSize: 8, color: COLORS.textDim, marginTop: 4 }}>Membro desde janeiro de 2025</div>
                  </div>
                </div>

                {/* ── Painel direito ── */}
                <div style={{ flex: 1, padding: '24px 28px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* Card boas-vindas */}
                  <div style={{ background: `${COLORS.accent}0E`, border: `1px solid ${COLORS.accent}33`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
                    <div style={{ fontSize: 8, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>Central do Mentorado</div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, fontStyle: 'italic', marginBottom: 4 }}>Olá, <span style={{ color: COLORS.accent }}>Você</span>!</div>
                    <div style={{ fontSize: 9.5, color: COLORS.textMuted, marginBottom: 10 }}>Sua meta: <strong style={{ color: COLORS.accent }}>Escalar o faturamento</strong></div>
                    <div style={{ height: 5, borderRadius: 3, background: COLORS.border, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '50%', background: COLORS.accent, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 8, color: COLORS.textMuted, marginTop: 4 }}>50% da jornada concluída</div>
                  </div>

                  {/* Timeline de marcos */}
                  <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: '14px 16px', flex: 1 }}>
                    <div style={{ fontSize: 8, fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>— Sua Jornada de Mentoria</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {[
                        { label: 'Onboarding',     done: true },
                        { label: 'Diagnóstico',    done: true },
                        { label: 'Plano de Ação',  done: true },
                        { label: 'Execução',        done: false, next: true },
                        { label: 'Revisão',         done: false },
                        { label: 'Avanço Contínuo', done: false },
                      ].map((m, i, arr) => (
                        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                            <div style={{
                              width: 24, height: 24, borderRadius: 3,
                              background: m.done ? COLORS.accent : m.next ? `${COLORS.accent}22` : COLORS.surface,
                              border: `1.5px solid ${m.done ? COLORS.accent : m.next ? COLORS.accent : COLORS.border}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 9, fontWeight: 700,
                              color: m.done ? '#fff' : m.next ? COLORS.accent : COLORS.textDim,
                              boxShadow: m.done ? `0 0 10px ${COLORS.accent}44` : 'none',
                            }}>
                              {m.done ? '✓' : i + 1}
                            </div>
                            {i < arr.length - 1 && <div style={{ width: 1.5, height: 20, background: m.done ? COLORS.accent : COLORS.border }} />}
                          </div>
                          <div style={{ paddingTop: 4, paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                            <div style={{ fontSize: 10, fontWeight: m.done ? 600 : m.next ? 500 : 400, color: m.done || m.next ? COLORS.text : COLORS.textMuted }}>{m.label}</div>
                            {m.done && <div style={{ fontSize: 8, color: COLORS.accent }}>Concluído ✓</div>}
                            {m.next && <div style={{ fontSize: 8, color: COLORS.textMuted }}>Em andamento…</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Rodapé ── */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, color: COLORS.textDim, letterSpacing: '0.1em', textTransform: 'uppercase' }}>arcusclub.com.br</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 20, height: 1, background: `linear-gradient(90deg, transparent, ${COLORS.accent}66)` }} />
                <div style={{ fontSize: 10, color: COLORS.accent, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Confidencial</div>
                <div style={{ width: 20, height: 1, background: `linear-gradient(90deg, ${COLORS.accent}66, transparent)` }} />
              </div>
            </div>
          </div>

          <div style={{ height: 2, background: `linear-gradient(90deg, transparent 0%, ${COLORS.accent}55 30%, ${COLORS.accent}88 50%, ${COLORS.accent}55 70%, transparent 100%)` }} />
        </div>
      </div>

      {/* ── Botão de impressão (não aparece no PDF) ── */}
      <button
        className="no-print"
        onClick={() => window.print()}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          padding: '13px 28px',
          background: COLORS.accent,
          border: 'none',
          borderRadius: 2,
          color: '#0A0800',
          fontSize: 13,
          fontWeight: 600,
          fontFamily: FONT_UI,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: `0 4px 24px ${COLORS.accent}44`,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.background = COLORS.accentLight }}
        onMouseLeave={e => { e.target.style.background = COLORS.accent }}
      >
        Salvar como PDF
      </button>
    </div>
  )
}
