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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 1.5, background: `linear-gradient(90deg, transparent, ${COLORS.accent})` }} />
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontStyle: 'italic', fontWeight: 700, color: COLORS.text }}>
                  Arcus Club
                </span>
                <div style={{ width: 28, height: 1.5, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
              </div>
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
