import { useState, useEffect, useRef, useCallback } from "react";
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
const WHATSAPP_NUMBER = "5551996567044";
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
    title: "Trabalha 12 horas e no fim do mês o lucro não aparece",
    desc: "O faturamento cresce, o movimento aumenta, mas o dinheiro não fica. Parece que você trabalha para pagar contas.",
  },
  {
    title: "Tudo depende de você. Sem você, o negócio para.",
    desc: "Você não consegue tirar férias, delegar de verdade ou pensar no futuro. Está preso dentro da operação.",
  },
  {
    title: "Todo dia é apagar incêndio. Nunca sobra tempo para pensar.",
    desc: "A urgência do cotidiano engole a estratégia. Você sabe que precisa mudar, mas nunca encontra o momento.",
  },
  {
    title: "Decisões no feeling: aquela sensação de estar apostando.",
    desc: "Sem indicadores claros, cada decisão parece um risco. Você age por intuição e torce para dar certo.",
  },
  {
    title: "Seus concorrentes crescem e você não entende por quê.",
    desc: "Produto bom, trabalho duro, mas algo está errado. Falta o sistema que transforma esforço em resultado.",
  },
  {
    title: "Sentimento de estagnação que não passa.",
    desc: "Você se esforça, inova, tenta de tudo. Mas a sensação de que o negócio não avança de verdade insiste em ficar.",
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
    title: "Acesso direto aos mentores via WhatsApp (24/7)",
    desc: "Tire dúvidas, valide decisões e tenha apoio quando precisar, não apenas nas sessões.",
  },
  {
    icon: "◉",
    color: "#7B6FD4",
    title: "Metodologia proprietária",
    desc: "O framework \"O Lucro está na Organização\": sistema comprovado para estruturar e escalar negócios.",
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
    desc: "Sessões semanais, suporte direto via WhatsApp e ajustes em tempo real conforme o negócio evolui.",
  },
  {
    num: "04",
    title: "Escala e avanço contínuo",
    desc: "Com a base organizada, expandimos para novos mercados, produtos e níveis de faturamento.",
  },
];

const PILLARS = [
  {
    id: "cultura",
    num: "01",
    label: "Cultura",
    icon: "◉",
    color: "#7B6FD4",
    desc: "Valores, comportamentos e ambiente que sustentam o crescimento. Sem cultura clara, o caos se replica na escala.",
  },
  {
    id: "lideranca",
    num: "02",
    label: "Liderança",
    icon: "▲",
    color: COLORS.accent,
    desc: "O empresário que não lidera estrategicamente está gerenciando, não construindo. Liderança é multiplicação.",
    elevated: true,
  },
  {
    id: "processos",
    num: "03",
    label: "Processos",
    icon: "◈",
    color: COLORS.teal,
    desc: "Processos bem desenhados libertam o dono do operacional e tornam o crescimento previsível e replicável.",
  },
];

const DEMO_MILESTONES = [
  { label: "Onboarding", done: true },
  { label: "Diagnóstico", done: true },
  { label: "Plano de Ação", done: false, isNext: true },
  { label: "Execução", done: false },
  { label: "Revisão", done: false },
  { label: "Avanço Contínuo", done: false },
];

const DEMO_PLAN = [
  "Onboarding: Definição de objetivos e diagnóstico inicial",
  "Plano de ação personalizado (30/60/90 dias)",
  "Sessões semanais em grupo (1h cada)",
  "Suporte direto com os mentores 24/7",
  "Acesso à biblioteca de materiais exclusivos",
  "Relatório mensal de progresso",
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

function SectionDivider() {
  return (
    <div style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${COLORS.accent}33, transparent)`,
    }} />
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

function PainSection() {
  return (
    <section style={{
      padding: "100px 48px",
      background: COLORS.bg,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle red glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 60% 50% at 50% 100%, ${COLORS.red}07 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <SectionLabel>A realidade de quem não tem suporte</SectionLabel>

        <h2 style={{
          fontFamily: FONT_DISPLAY,
          fontSize: "clamp(30px, 4vw, 50px)",
          fontWeight: 700,
          fontStyle: "italic",
          color: COLORS.text,
          lineHeight: 1.1,
          marginBottom: 16,
          maxWidth: 640,
        }}>
          Você se identifica com<br />
          <span style={{ color: COLORS.red }}>alguma dessas situações?</span>
        </h2>
        <p style={{
          fontFamily: FONT_UI,
          fontSize: 15,
          color: COLORS.textMuted,
          lineHeight: 1.7,
          marginBottom: 64,
          maxWidth: 520,
        }}>
          Se sim, você não está sozinho. O problema raramente é esforço.<br />
          É falta de sistema, clareza e alguém do lado certo.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          background: COLORS.border,
          borderRadius: 6,
          overflow: "hidden",
        }}>
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              style={{
                background: COLORS.card,
                padding: "32px 36px",
                position: "relative",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1A1212"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.card; }}
            >
              {/* Red accent left border */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: 3,
                background: `linear-gradient(180deg, ${COLORS.red}66, transparent)`,
              }} />
              <div style={{
                fontFamily: FONT_UI,
                fontSize: 15,
                fontWeight: 700,
                color: COLORS.text,
                marginBottom: 10,
                lineHeight: 1.4,
              }}>{p.title}</div>
              <div style={{
                fontFamily: FONT_UI,
                fontSize: 13,
                color: COLORS.textMuted,
                lineHeight: 1.7,
              }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* Bridge to solution */}
        <div style={{
          marginTop: 52,
          padding: "28px 36px",
          border: `1px solid ${COLORS.accent}33`,
          borderRadius: 6,
          background: `${COLORS.accent}06`,
        }}>
          <p style={{
            fontFamily: FONT_DISPLAY,
            fontSize: "clamp(16px, 2vw, 20px)",
            fontStyle: "italic",
            color: COLORS.text,
            lineHeight: 1.5,
            margin: 0,
          }}>
            "O problema não é o mercado, não é a equipe, não é a economia.<br />
            É que ninguém te ensinou como <em style={{ color: COLORS.accent }}>organizar o lucro que já existe.</em>"
          </p>
        </div>
      </div>
    </section>
  );
}

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
      <img src="/arcus_logo.png" alt="Arcus Club" style={{ height: 46, width: "auto", objectFit: "contain" }} />

      {/* Nav links — ocultos no mobile */}
      <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {["Sobre", "Metodologia", "Benefícios", "Plataforma", "Como funciona"].map((item) => (
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
      </div>

      {/* Botão Área do Mentorado — sempre visível */}
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
      overflow: "hidden",
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


      {/* Foto — lado direito com mask fade */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "56%",
        zIndex: 2,
        pointerEvents: "none",
        maskImage: "linear-gradient(to right, transparent 0%, black 42%, black 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 42%, black 75%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)",
        WebkitMaskComposite: "source-in",
      }}>
        <img
          src="/vini-e-victor.jpeg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", opacity: 0.55 }}
        />
        {/* Brilho dourado sutil — amarra à identidade */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 70% 60% at 60% 35%, ${COLORS.accent}14 0%, transparent 65%)`,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 620 }}>
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

        {/* Credenciais */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 40 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.teal}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span style={{ fontFamily: FONT_UI, fontSize: 12, color: COLORS.textMuted }}>
            Acesso direto aos mentores via <strong style={{ color: COLORS.teal, fontWeight: 600 }}>WhatsApp (24/7)</strong>
          </span>
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


function BenefitsSection() {
  return (
    <section id="beneficios" style={{
      padding: "120px 48px",
      background: COLORS.bg,
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
            Uma mentoria completa, não só sessões. Você entra com um problema e sai com um sistema.
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

function MethodologySection() {
  return (
    <section id="metodologia" style={{
      padding: "120px 48px",
      background: COLORS.bg,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background arch glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${COLORS.accent}06 0%, transparent 65%)`,
      }} />

      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 80, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* ── Texto esquerdo ── */}
          <div style={{ flex: "1 1 360px", maxWidth: 440 }}>
            <SectionLabel>A metodologia</SectionLabel>
            <h2 style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              fontStyle: "italic",
              color: COLORS.text,
              lineHeight: 1.1,
              marginBottom: 32,
            }}>
              Arcus: a estrutura<br />
              <span style={{ color: COLORS.accent }}>que se sustenta.</span>
            </h2>

            {/* Story */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ fontFamily: FONT_UI, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.8 }}>
                Em arquitetura, um arco é a única estrutura que se sustenta pela{" "}
                <em style={{ color: COLORS.text, fontStyle: "normal", fontWeight: 500 }}>tensão entre suas partes</em>.
                Retire uma pedra e o arco cai. Adicione mais peso ao topo e ele fica mais forte.
              </p>
              <p style={{ fontFamily: FONT_UI, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.8 }}>
                A metodologia Arcus funciona da mesma forma. Cultura, liderança e processos não são pilares independentes
                Eles se sustentam mutuamente. Quando os três estão no lugar certo, o negócio não só resiste: ele cresce.
              </p>

              {/* Insight destacado */}
              <div style={{
                marginTop: 8,
                padding: "20px 24px",
                borderLeft: `2px solid ${COLORS.accent}`,
                background: `${COLORS.accent}08`,
                borderRadius: "0 4px 4px 0",
              }}>
                <p style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 17,
                  fontStyle: "italic",
                  color: COLORS.text,
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  "O lucro que você deixa na mesa não some: ele está escondido na desorganização."
                </p>
              </div>
            </div>
          </div>

          {/* ── Pilares visuais ── */}
          <div className="methodology-pillars" style={{ flex: "1 1 360px" }}>
            {/* Arch SVG decorativa */}
            <div style={{ position: "relative", paddingTop: 40 }}>
              <svg
                viewBox="0 0 420 80"
                style={{
                  position: "absolute",
                  top: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: "90%",
                  opacity: 0.18,
                  pointerEvents: "none",
                }}
              >
                <path
                  d="M 10 75 L 10 40 Q 10 5 210 5 Q 410 5 410 40 L 410 75"
                  fill="none"
                  stroke={COLORS.accent}
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              </svg>

              {/* Cards dos três pilares */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                {PILLARS.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      flex: 1,
                      background: COLORS.card,
                      border: `1px solid ${p.elevated ? p.color + "66" : COLORS.border}`,
                      borderRadius: 6,
                      padding: "28px 20px",
                      position: "relative",
                      overflow: "hidden",
                      transform: p.elevated ? "translateY(-24px)" : "none",
                      boxShadow: p.elevated ? `0 0 40px ${p.color}22, 0 8px 32px rgba(0,0,0,0.4)` : "none",
                      transition: "transform 0.25s, box-shadow 0.25s",
                    }}
                  >
                    {/* Top accent bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, ${p.color}, transparent)`,
                    }} />

                    {/* Number */}
                    <div style={{
                      fontSize: 10,
                      fontFamily: FONT_UI,
                      color: p.color,
                      letterSpacing: "0.16em",
                      fontWeight: 600,
                      marginBottom: 14,
                      opacity: 0.7,
                    }}>{p.num}</div>

                    {/* Icon + Label */}
                    <div style={{
                      fontSize: 22,
                      color: p.color,
                      marginBottom: 10,
                      fontFamily: FONT_UI,
                    }}>{p.icon}</div>
                    <div style={{
                      fontFamily: FONT_UI,
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.text,
                      marginBottom: 12,
                    }}>{p.label}</div>
                    <div style={{
                      fontFamily: FONT_UI,
                      fontSize: 12,
                      color: COLORS.textMuted,
                      lineHeight: 1.7,
                    }}>{p.desc}</div>

                    {/* Keystone indicator */}
                    {p.elevated && (
                      <div style={{
                        position: "absolute",
                        bottom: 12, right: 14,
                        fontSize: 9,
                        color: p.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        opacity: 0.6,
                        fontFamily: FONT_UI,
                      }}>pedra angular</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Base line */}
              <div style={{
                height: 1,
                background: `linear-gradient(90deg, transparent, ${COLORS.accent}44, transparent)`,
                marginTop: 8,
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Mini demo tabs ────────────────────────────────────────────────────────────
const DEMO_TABS = [
  { id: "milestones", label: "Minha Jornada",      icon: "🎯" },
  { id: "plan",       label: "Plano Base",          icon: "📋" },
  { id: "custom",     label: "Plano Pessoal",       icon: "✍️" },
  { id: "resources",  label: "Recursos",            icon: "📚" },
];

function DemoContent({ tab }) {
  const accent = "#C9A84C";
  const color  = "#A78BFA";

  if (tab === "milestones") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Hero card */}
      <div style={{
        background: `linear-gradient(135deg, ${color}16, ${color}06)`,
        border: `1px solid ${color}33`,
        borderRadius: 6, padding: "16px 18px", marginBottom: 16, position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />
        <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>Central do Mentorado</div>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_DISPLAY, fontStyle: "italic", marginBottom: 4, color: COLORS.text }}>
          Olá, Marcos!
        </div>
        <div style={{ fontSize: 12, color: COLORS.textMuted }}>
          Sua meta: <strong style={{ color }}>Aumentar margem de lucro em 30%</strong>
        </div>
        <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: COLORS.border }}>
          <div style={{ height: "100%", width: "33%", background: color, borderRadius: 2, transition: "width 0.6s" }} />
        </div>
        <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>33% da jornada concluída</div>
      </div>

      {/* Timeline */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {DEMO_MILESTONES.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 4,
                background: m.done ? color : m.isNext ? `${color}22` : COLORS.surface,
                border: `2px solid ${m.done ? color : m.isNext ? color : COLORS.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: m.done ? "#fff" : m.isNext ? color : COLORS.textDim,
                boxShadow: m.done ? `0 0 10px ${color}55` : "none",
              }}>
                {m.done ? "✓" : i + 1}
              </div>
              {i < DEMO_MILESTONES.length - 1 && (
                <div style={{ width: 2, height: 22, background: m.done ? color : COLORS.border }} />
              )}
            </div>
            <div style={{ paddingTop: 4, paddingBottom: i < DEMO_MILESTONES.length - 1 ? 22 : 0 }}>
              <div style={{ fontSize: 12, fontWeight: m.done || m.isNext ? 600 : 400, color: m.done || m.isNext ? COLORS.text : COLORS.textMuted }}>
                {m.label}
              </div>
              <div style={{ fontSize: 10, color: m.done ? color : m.isNext ? COLORS.textMuted : COLORS.textDim }}>
                {m.done ? "Concluído ✓" : m.isNext ? "Em andamento…" : "Próximo passo"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (tab === "plan") return (
    <div>
      <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
        O núcleo da sua jornada: mentoria aberta e contínua, no seu ritmo.
      </div>
      {DEMO_PLAN.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, flexShrink: 0, color: accent, fontWeight: 700,
          }}>{i + 1}</div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: COLORS.text }}>{item}</div>
        </div>
      ))}
    </div>
  );

  if (tab === "custom") return (
    <div style={{
      fontSize: 12.5, color: COLORS.text, lineHeight: 1.9,
      background: COLORS.surface, borderRadius: 6, padding: "16px 18px",
      border: `1px solid ${accent}33`, whiteSpace: "pre-wrap",
    }}>
      {`1. Mapear todos os centros de custo e identificar vazamentos até 30/04\n2. Implementar DRE gerencial simples (planilha modelo)\n3. Definir meta de margem líquida por linha de produto\n4. Estruturar rotina de reuniões de resultado (semanal, 30min)\n5. Delegar 3 tarefas operacionais recorrentes para equipe\n6. Revisão e ajuste do plano em 60 dias`}
    </div>
  );

  return (
    <div style={{ textAlign: "center", padding: "32px 0", color: COLORS.textMuted }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>📂</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>Biblioteca de materiais</div>
      <div style={{ fontSize: 12, lineHeight: 1.6 }}>Templates, planilhas e gravações de sessões,<br />disponíveis exclusivamente para mentorados.</div>
    </div>
  );
}

function PhoneMockup({ activeTab, setActiveTab }) {
  const accentColor = "#A78BFA";
  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
      {/* Phone shell */}
      <div style={{
        width: 280,
        borderRadius: 36,
        border: `2px solid ${COLORS.border}`,
        background: COLORS.surface,
        overflow: "hidden",
        boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${COLORS.border}`,
        position: "relative",
      }}>
        {/* Notch bar */}
        <div style={{
          background: COLORS.card,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ width: 60, height: 8, borderRadius: 4, background: COLORS.bg }} />
        </div>

        {/* App header */}
        <div style={{
          height: 44,
          background: `${COLORS.surface}EE`,
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}>
          <img src="/arcus_logo.png" alt="Arcus Club" style={{ height: 26, width: "auto", objectFit: "contain", mixBlendMode: "screen" }} />
          {/* Hamburger icon */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 4 }}>
            <div style={{ width: 16, height: 1.5, background: COLORS.textMuted, borderRadius: 1 }} />
            <div style={{ width: 16, height: 1.5, background: COLORS.textMuted, borderRadius: 1 }} />
            <div style={{ width: 10, height: 1.5, background: COLORS.textMuted, borderRadius: 1 }} />
          </div>
        </div>

        {/* Content area */}
        <div style={{
          height: 400,
          overflowY: "auto",
          padding: "16px 14px",
          background: COLORS.bg,
        }}>
          <DemoContent tab={activeTab} />
        </div>

        {/* Bottom nav */}
        <div style={{
          borderTop: `1px solid ${COLORS.border}`,
          background: COLORS.card,
          display: "flex",
        }}>
          {DEMO_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "10px 4px 12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  borderTop: `2px solid ${isActive ? accentColor : "transparent"}`,
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                <span style={{
                  fontSize: 9,
                  fontFamily: FONT_UI,
                  color: isActive ? accentColor : COLORS.textDim,
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.04em",
                }}>{tab.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Home indicator */}
        <div style={{ background: COLORS.card, padding: "8px 0", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 80, height: 4, borderRadius: 2, background: COLORS.border }} />
        </div>
      </div>
    </div>
  );
}

function PlatformPreviewSection() {
  const [activeTab, setActiveTab] = useState("milestones");
  const accentColor = "#A78BFA";

  return (
    <section id="plataforma" style={{
      padding: "120px 48px",
      background: COLORS.bg,
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", gap: 48, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 64 }}>
          <div style={{ flex: "1 1 360px" }}>
            <SectionLabel>Plataforma exclusiva</SectionLabel>
            <h2 style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              fontStyle: "italic",
              color: COLORS.text,
              lineHeight: 1.1,
              marginBottom: 20,
            }}>
              Sua central de<br />
              <span style={{ color: COLORS.accent }}>desenvolvimento.</span>
            </h2>
          </div>
          <p style={{
            flex: "1 1 300px",
            fontFamily: FONT_UI,
            fontSize: 15,
            color: COLORS.textMuted,
            lineHeight: 1.8,
            maxWidth: 400,
          }}>
            Cada mentorado tem acesso à sua própria central: plano personalizado, marcos da jornada,
            materiais do mentor e acompanhamento em tempo real. Tudo num só lugar.
          </p>
        </div>

        {/* Phone mockup — mobile only */}
        <div className="platform-phone">
          <PhoneMockup activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Browser frame — desktop only */}
        <div className="platform-browser" style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${COLORS.border}`,
        }}>
          {/* Browser chrome */}
          <div style={{
            background: COLORS.card,
            borderBottom: `1px solid ${COLORS.border}`,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#E05252", "#C9A84C", "#3DBFB0"].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
              ))}
            </div>
            <div style={{
              flex: 1, maxWidth: 280,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 4,
              padding: "3px 10px",
              fontSize: 11,
              color: COLORS.textDim,
              fontFamily: FONT_UI,
              letterSpacing: "0.04em",
            }}>
              arcusclub.com.br/mentorado/demo
            </div>
            <div style={{
              fontSize: 9,
              color: COLORS.accent,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontFamily: FONT_UI,
              background: `${COLORS.accent}14`,
              padding: "3px 8px",
              borderRadius: 2,
              border: `1px solid ${COLORS.accent}33`,
            }}>Área restrita</div>
          </div>

          {/* App header */}
          <div style={{
            height: 44,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            borderBottom: `1px solid ${COLORS.border}`,
            background: `${COLORS.surface}EE`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 18, height: 1.5, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13, fontStyle: "italic", fontWeight: 700, color: COLORS.text }}>
                Arcus Club
              </span>
            </div>
          </div>

          {/* App body */}
          <div style={{ display: "flex", minHeight: 440 }}>

            {/* Left panel */}
            <div style={{
              width: 200,
              flexShrink: 0,
              borderRight: `1px solid ${COLORS.border}`,
              padding: "28px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
              background: `${COLORS.bg}88`,
            }}>
              {/* Avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `${accentColor}22`,
                  border: `2px solid ${accentColor}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 700, color: accentColor, fontFamily: FONT_UI,
                  boxShadow: `0 0 20px ${accentColor}33`,
                }}>MC</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, textAlign: "center", fontFamily: FONT_UI }}>
                    Marcos Costa
                  </div>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, textAlign: "center", marginTop: 2, fontFamily: FONT_UI }}>
                    2/6 marcos · 33%
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ width: "100%", height: 3, borderRadius: 2, background: COLORS.border }}>
                  <div style={{ height: "100%", width: "33%", background: accentColor, borderRadius: 2 }} />
                </div>
              </div>

              {/* Nav menu */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                {DEMO_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 12px", borderRadius: 6,
                        background: isActive ? `${accentColor}18` : "transparent",
                        border: `1px solid ${isActive ? accentColor + "55" : "transparent"}`,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontSize: 14 }}>{tab.icon}</span>
                      <span style={{
                        fontSize: 11.5,
                        fontFamily: FONT_UI,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? accentColor : COLORS.textMuted,
                        whiteSpace: "nowrap",
                      }}>{tab.label}</span>
                      {isActive && <span style={{ marginLeft: "auto", fontSize: 9, color: accentColor }}>◂</span>}
                    </button>
                  );
                })}
              </div>

              {/* Meta */}
              <div style={{ marginTop: "auto", paddingTop: 16, borderTop: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 10, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4, fontFamily: FONT_UI }}>Meta</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted, lineHeight: 1.5, fontFamily: FONT_UI }}>
                  Aumentar margem de lucro em 30%
                </div>
                <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 6, fontFamily: FONT_UI }}>
                  Membro desde jan/2026
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div style={{
              flex: 1,
              padding: "28px 32px",
              overflowY: "auto",
              maxHeight: 440,
            }}>
              <DemoContent tab={activeTab} />
            </div>
          </div>

          {/* Demo overlay badge */}
          <div style={{
            borderTop: `1px solid ${COLORS.border}`,
            padding: "8px 20px",
            textAlign: "center",
            background: COLORS.card,
            fontSize: 10,
            color: COLORS.textDim,
            fontFamily: FONT_UI,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            ◈ Demonstração interativa · dados fictícios para fins de apresentação
          </div>
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
          Clique abaixo para iniciar uma conversa no WhatsApp. Sem compromisso: vamos entender seu momento e ver se faz sentido trabalharmos juntos.
        </p>

        <CTAButton text="Falar com o mentor agora" size="lg" />

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      background: COLORS.bg,
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
        <img src="/arcus_logo.png" alt="Arcus Club" style={{ height: 34, width: "auto", objectFit: "contain", opacity: 0.6 }} />

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

        .platform-phone { display: none; }
        .platform-browser { display: block; }

        @media (max-width: 768px) {
          nav { padding: 0 24px !important; }
          .nav-links { display: none !important; }
          nav { padding: 0 20px !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
          .methodology-pillars { transform: scale(0.82); transform-origin: top left; }
          .platform-browser { display: none !important; }
          .platform-phone { display: block !important; }
        }
      `}</style>

      <Navbar scrolled={scrolled} />
      <HeroSection />
      <SectionDivider />
      <PainSection />
      <SectionDivider />
      <MethodologySection />
      <SectionDivider />
      <BenefitsSection />
      <SectionDivider />
      <PlatformPreviewSection />
      <SectionDivider />
      <ProcessSection />
      <FinalCTA />
      <Footer />

      {/* ── Botão flutuante WhatsApp ── */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        title="Falar no WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 400,
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "#25D366",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45), 0 2px 10px rgba(0,0,0,0.5)",
          transition: "transform 0.2s, box-shadow 0.2s",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,0.65), 0 4px 14px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.45), 0 2px 10px rgba(0,0,0,0.5)";
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
