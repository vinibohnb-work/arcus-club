import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ─── Design tokens (mesma identidade visual) ──────────────────────────────────
const COLORS = {
  bg: "#080808",
  surface: "#111111",
  card: "#161616",
  border: "#2A2A2A",
  borderLight: "#1C1C1C",
  accent: "#C9A84C",
  accentLight: "#E2C37A",
  accentDim: "#C9A84C18",
  teal: "#3DBFB0",
  red: "#E05252",
  text: "#F2EDE4",
  textMuted: "#8A8070",
  textDim: "#4A4440",
};
const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI = `'Jost', 'DM Sans', sans-serif`;

// ─── Configurações ────────────────────────────────────────────────────────────
// Substitua pelo número real com DDI (ex: 5511999999999)
const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MSG = encodeURIComponent(
  "Olá! Tenho interesse em fazer parte do Arcus Club. Gostaria de saber mais sobre a mentoria."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

// ─── Dados de conteúdo ────────────────────────────────────────────────────────
const STATS = [
  { value: "120+", label: "Empresários mentorados" },
  { value: "R$12M+", label: "Gerados pelos membros" },
  { value: "94%", label: "Taxa de satisfação" },
  { value: "3 anos", label: "De metodologia validada" },
];

const PROBLEMS = [
  {
    icon: "◌",
    title: "Trabalha muito e lucra pouco",
    desc: "O faturamento cresce, mas o dinheiro some. Você sente que trabalha para pagar contas.",
  },
  {
    icon: "◌",
    title: "Falta clareza e direção",
    desc: "Tem energia, tem vontade — mas não sabe qual próximo passo vai realmente mover o negócio.",
  },
  {
    icon: "◌",
    title: "Decisões tomadas no improviso",
    desc: "Sem dados, sem processo. Cada decisão é uma aposta. E o risco cansa.",
  },
  {
    icon: "◌",
    title: "Isolamento do topo",
    desc: "Quem você consulta quando o problema é com o negócio? Sócios têm interesse, amigos não entendem.",
  },
];

const BENEFITS = [
  {
    icon: "▲",
    color: COLORS.accent,
    title: "Clareza estratégica",
    desc: "Diagnóstico preciso do seu negócio e um plano de ação estruturado para os próximos 90 dias.",
  },
  {
    icon: "◈",
    color: COLORS.teal,
    title: "Acompanhamento contínuo",
    desc: "Sessões 1:1 semanais e suporte direto. Você nunca toma uma decisão importante sozinho.",
  },
  {
    icon: "◉",
    color: "#7B6FD4",
    title: "Metodologia proprietária",
    desc: "O framework \"O Lucro está na Organização\" — sistema comprovado para estruturar e escalar negócios.",
  },
  {
    icon: "◎",
    color: COLORS.accent,
    title: "Comunidade de alto nível",
    desc: "Acesso ao grupo exclusivo com outros empresários sérios. Networking que realmente converte.",
  },
  {
    icon: "⬡",
    color: COLORS.teal,
    title: "Biblioteca de recursos",
    desc: "Templates, planilhas, checklists e gravações de sessões. Tudo organizado e acessível.",
  },
  {
    icon: "◆",
    color: "#7B6FD4",
    title: "Resultados mensuráveis",
    desc: "Relatórios mensais de progresso. Você sabe exatamente onde estava e onde chegou.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Conversa de diagnóstico",
    desc: "Começamos entendendo seu negócio a fundo: modelo, gargalos, metas e potencial real de crescimento.",
  },
  {
    num: "02",
    title: "Plano de ação personalizado",
    desc: "Elaboramos um roadmap claro: o que fazer nos próximos 30, 60 e 90 dias para gerar resultado.",
  },
  {
    num: "03",
    title: "Execução com acompanhamento",
    desc: "Sessões semanais, suporte direto e ajustes em tempo real conforme o negócio evolui.",
  },
  {
    num: "04",
    title: "Escala e avanço contínuo",
    desc: "Com a base organizada, expandimos para novos mercados, produtos e níveis de faturamento.",
  },
];

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function CTAButton({ text = "Quero fazer parte", size = "md", style: extraStyle = {} }) {
  const isLg = size === "lg";
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: isLg ? "16px 36px" : "12px 28px",
        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
        color: "#080808",
        fontFamily: FONT_UI,
        fontSize: isLg ? 15 : 13,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
        borderRadius: 2,
        boxShadow: `0 0 32px ${COLORS.accent}44`,
        transition: "all 0.25s",
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 48px ${COLORS.accent}77`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 32px ${COLORS.accent}44`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      {text}
    </a>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 20,
    }}>
      <div style={{ width: 28, height: 1.5, background: COLORS.accent }} />
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        fontFamily: FONT_UI,
        color: COLORS.accent,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
      }}>{children}</span>
    </div>
  );
}

// ─── Seções ───────────────────────────────────────────────────────────────────

function Navbar({ scrolled }) {
  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 300,
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 48px",
      background: scrolled ? `${COLORS.surface}F0` : "transparent",
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : "1px solid transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      transition: "all 0.35s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 24, height: 2, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
        <span style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 18,
          fontStyle: "italic",
          fontWeight: 700,
          color: COLORS.text,
        }}>Arcus Club</span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {["Sobre", "Benefícios", "Como funciona"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/ /g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
            style={{
              color: COLORS.textMuted,
              fontFamily: FONT_UI,
              fontSize: 13,
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.target.style.color = COLORS.text; }}
            onMouseLeave={(e) => { e.target.style.color = COLORS.textMuted; }}
          >{item}</a>
        ))}
        <Link
          to="/login"
          style={{
            padding: "10px 20px",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 2,
            color: COLORS.textMuted,
            fontFamily: FONT_UI,
            fontSize: 12,
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.06em",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.textMuted;
            e.currentTarget.style.color = COLORS.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.color = COLORS.textMuted;
          }}
        >
          Área do Mentorado
        </Link>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      padding: "120px 80px 80px",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Background radial glows */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 50% at 30% 30%, ${COLORS.accent}0D 0%, transparent 70%),
          radial-gradient(ellipse 40% 40% at 20% 80%, ${COLORS.teal}08 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 80% 10%, #7B6FD408 0%, transparent 60%)
        `,
      }} />


      <div style={{ position: "relative", zIndex: 10, maxWidth: 720 }}>
        {/* Pre-headline */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px",
          border: `1px solid ${COLORS.accent}44`,
          borderRadius: 100,
          marginBottom: 36,
          background: `${COLORS.accent}0A`,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }} />
          <span style={{
            fontFamily: FONT_UI,
            fontSize: 11,
            color: COLORS.accent,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}>Mentoria exclusiva para empresários</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(44px, 7vw, 80px)",
          fontWeight: 700,
          fontStyle: "italic",
          lineHeight: 1.05,
          color: COLORS.text,
          marginBottom: 12,
          letterSpacing: "-0.02em",
        }}>
          O lucro está na
        </h1>
        <h1 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(44px, 7vw, 80px)",
          fontWeight: 700,
          fontStyle: "italic",
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
          marginBottom: 32,
          color: "transparent",
        }}>
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
            paddingBottom: 6,
          }}>organização.</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: FONT_UI,
          fontSize: "clamp(16px, 2vw, 20px)",
          color: COLORS.textMuted,
          lineHeight: 1.7,
          maxWidth: 580,
          marginBottom: 48,
        }}>
          Mentoria estratégica para empresários que querem parar de trabalhar <em style={{ color: COLORS.text, fontStyle: "normal" }}>no</em> negócio e começar a trabalhar <em style={{ color: COLORS.text, fontStyle: "normal" }}>pelo</em> negócio.
        </p>

        {/* CTA group */}
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <CTAButton text="Quero fazer parte" size="lg" />
          <a
            href="#como-funciona"
            style={{
              padding: "16px 28px",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 2,
              color: COLORS.textMuted,
              fontFamily: FONT_UI,
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.06em",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = COLORS.textMuted;
              e.currentTarget.style.color = COLORS.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = COLORS.border;
              e.currentTarget.style.color = COLORS.textMuted;
            }}
          >
            Ver como funciona →
          </a>
        </div>

      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section style={{
      borderTop: `1px solid ${COLORS.border}`,
      borderBottom: `1px solid ${COLORS.border}`,
      background: COLORS.surface,
      height: 24,
    }} />
  );
}

function ProblemsSection() {
  return (
    <section id="sobre" style={{ padding: "120px 48px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel>Você se identifica?</SectionLabel>
        <h2 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 700,
          fontStyle: "italic",
          color: COLORS.text,
          lineHeight: 1.1,
          marginBottom: 16,
          maxWidth: 600,
        }}>
          Crescer ficou difícil.<br />
          <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>Mas não é falta de esforço.</span>
        </h2>
        <p style={{
          fontFamily: FONT_UI,
          fontSize: 16,
          color: COLORS.textMuted,
          lineHeight: 1.7,
          maxWidth: 520,
          marginBottom: 72,
        }}>
          A maioria dos empresários trabalha mais do que deveria e lucra menos do que poderia. O problema quase nunca é produto ou vendas — é estrutura.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
        }}>
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              style={{
                padding: "36px 40px",
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: i === 0 ? "6px 0 0 0" : i === 1 ? "0 6px 0 0" : i === 2 ? "0 0 0 6px" : "0 0 6px 0",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: 2,
                background: `linear-gradient(90deg, ${COLORS.red}66, transparent)`,
              }} />
              <div style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 28,
                color: `${COLORS.red}44`,
                marginBottom: 16,
                fontStyle: "italic",
              }}>{p.icon}</div>
              <div style={{
                fontFamily: FONT_UI,
                fontSize: 17,
                fontWeight: 600,
                color: COLORS.text,
                marginBottom: 10,
              }}>{p.title}</div>
              <div style={{
                fontFamily: FONT_UI,
                fontSize: 14,
                color: COLORS.textMuted,
                lineHeight: 1.7,
              }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section id="beneficios" style={{
      padding: "120px 48px",
      background: COLORS.surface,
      borderTop: `1px solid ${COLORS.border}`,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel>O que você recebe</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 24 }}>
          <h2 style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700,
            fontStyle: "italic",
            color: COLORS.text,
            lineHeight: 1.1,
            maxWidth: 480,
          }}>
            Tudo que você precisa<br />
            <span style={{ color: COLORS.accent }}>para estruturar e escalar.</span>
          </h2>
          <p style={{
            fontFamily: FONT_UI,
            fontSize: 15,
            color: COLORS.textMuted,
            lineHeight: 1.7,
            maxWidth: 340,
          }}>
            Uma mentoria completa — não só sessões. Você entra com um problema e sai com um sistema.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 6,
          overflow: "hidden",
        }}>
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              style={{
                padding: "40px 36px",
                background: COLORS.card,
                borderRight: i % 3 !== 2 ? `1px solid ${COLORS.border}` : "none",
                borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none",
                position: "relative",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1A1A"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.card; }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 6,
                background: `${b.color}18`,
                border: `1px solid ${b.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: b.color,
                marginBottom: 20,
                fontFamily: FONT_UI,
              }}>{b.icon}</div>
              <div style={{
                fontFamily: FONT_UI,
                fontSize: 16,
                fontWeight: 600,
                color: COLORS.text,
                marginBottom: 10,
              }}>{b.title}</div>
              <div style={{
                fontFamily: FONT_UI,
                fontSize: 13,
                color: COLORS.textMuted,
                lineHeight: 1.7,
              }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section id="como-funciona" style={{ padding: "120px 48px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel>Como funciona</SectionLabel>
        <h2 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 700,
          fontStyle: "italic",
          color: COLORS.text,
          lineHeight: 1.1,
          marginBottom: 72,
          maxWidth: 560,
        }}>
          Da conversa inicial<br />à escala do negócio.
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 0,
                alignItems: "stretch",
                borderBottom: i < STEPS.length - 1 ? `1px solid ${COLORS.border}` : "none",
              }}
            >
              {/* Number column */}
              <div style={{
                width: 120,
                flexShrink: 0,
                padding: "40px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: `1px solid ${COLORS.border}`,
                position: "relative",
              }}>
                <span style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 42,
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: COLORS.borderLight,
                  lineHeight: 1,
                  userSelect: "none",
                }}>{step.num}</span>
                {/* Active dot */}
                <div style={{
                  position: "absolute",
                  right: -5,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLORS.accent,
                  boxShadow: `0 0 12px ${COLORS.accent}88`,
                }} />
              </div>

              {/* Content column */}
              <div style={{ flex: 1, padding: "40px 48px" }}>
                <div style={{
                  fontFamily: FONT_UI,
                  fontSize: 19,
                  fontWeight: 600,
                  color: COLORS.text,
                  marginBottom: 10,
                }}>{step.title}</div>
                <div style={{
                  fontFamily: FONT_UI,
                  fontSize: 14,
                  color: COLORS.textMuted,
                  lineHeight: 1.8,
                  maxWidth: 560,
                }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section style={{
      padding: "120px 48px",
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${COLORS.accent}08 0%, transparent 70%)`,
      }} />

      {/* Horizontal lines */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${COLORS.accent}33, transparent)`,
      }} />
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 680, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px",
          border: `1px solid ${COLORS.accent}44`,
          borderRadius: 100,
          marginBottom: 36,
          background: `${COLORS.accent}0A`,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }} />
          <span style={{
            fontFamily: FONT_UI,
            fontSize: 11,
            color: COLORS.accent,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}>Vagas abertas agora</span>
        </div>

        <h2 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(36px, 5vw, 64px)",
          fontWeight: 700,
          fontStyle: "italic",
          color: COLORS.text,
          lineHeight: 1.05,
          marginBottom: 24,
          letterSpacing: "-0.02em",
        }}>
          Pronto para estruturar<br />e escalar seu negócio?
        </h2>

        <p style={{
          fontFamily: FONT_UI,
          fontSize: 16,
          color: COLORS.textMuted,
          lineHeight: 1.7,
          marginBottom: 48,
          maxWidth: 480,
          margin: "0 auto 48px",
        }}>
          Clique abaixo para iniciar uma conversa no WhatsApp. Sem compromisso — vamos entender seu momento e ver se faz sentido trabalharmos juntos.
        </p>

        <CTAButton text="Falar com o mentor agora" size="lg" />

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: COLORS.surface,
      borderTop: `1px solid ${COLORS.border}`,
      padding: "40px 48px",
    }}>
      <div style={{
        maxWidth: 960,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 20, height: 1.5, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 16,
            fontStyle: "italic",
            fontWeight: 700,
            color: COLORS.textMuted,
          }}>Arcus Club</span>
        </div>

        <div style={{
          fontFamily: FONT_UI,
          fontSize: 11,
          color: COLORS.textDim,
          letterSpacing: "0.1em",
          textAlign: "center",
        }}>
          O LUCRO ESTÁ NA ORGANIZAÇÃO · TODOS OS DIREITOS RESERVADOS
        </div>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: FONT_UI,
            fontSize: 12,
            color: COLORS.textMuted,
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => { e.target.style.color = COLORS.accent; }}
          onMouseLeave={(e) => { e.target.style.color = COLORS.textMuted; }}
        >
          Contato via WhatsApp →
        </a>
      </div>
    </footer>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: FONT_UI,
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9A84C55; }

        @media (max-width: 768px) {
          nav { padding: 0 24px !important; }
          nav > div:last-child > a { display: none !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <Navbar scrolled={scrolled} />
      <HeroSection />
      <StatsBar />
      <ProblemsSection />
      <BenefitsSection />
      <ProcessSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
