// ─── LinksPage — Arcus Club ───────────────────────────────────────────────────

const COLORS = {
  bg: "#080808",
  surface: "#111111",
  card: "#161616",
  border: "#2A2A2A",
  accent: "#C9A84C",
  accentLight: "#E2C37A",
  text: "#F2EDE4",
  textMuted: "#8A8070",
  textDim: "#4A4440",
};

const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI = `'Jost', 'DM Sans', sans-serif`;

// ─── ✏️ EDITE AQUI as mini-bios dos sócios ────────────────────────────────────
const FOUNDERS = [
  {
    name: "Vinícius Bohn",
    bio: "Empresário e mentor, ajuda donos de negócio a organizarem suas empresas para crescer com menos caos e mais resultado.",
    color: "#C9A84C",
  },
  {
    name: "Victor Godoi",
    bio: "Mini-bio do Victor aqui. Descreva sua trajetória e especialidade em uma ou duas frases.",  // ← edite aqui
    color: "#C9A84C",
  },
];

// ─── ✏️ EDITE AQUI os três links compartilhados ───────────────────────────────
const SHARED_LINKS = [
  {
    label: "Comunidade no WhatsApp",
    description: "Entre para a nossa comunidade gratuita",
    url: "https://chat.whatsapp.com/LINK_AQUI",  // ← cole o link da comunidade
    icon: "whatsapp",
  },
  {
    label: "Onboarding Podcast",
    description: "Assista no YouTube",
    url: "https://youtube.com/@CANAL_AQUI",       // ← cole o link do canal/vídeo
    icon: "youtube",
  },
  {
    label: "Arcus Club",
    description: "Conheça nossa mentoria em arcusclub.com.br",
    url: "https://arcusclub.com.br",
    icon: "globe",
  },
];
// ──────────────────────────────────────────────────────────────────────────────

const ICONS = {
  whatsapp: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  youtube: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  globe: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
    </svg>
  ),
};

function FounderCard({ founder }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 220,
      maxWidth: 340,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      padding: "32px 24px",
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Linha topo dourada */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${founder.color}, transparent)`,
      }} />

      {/* Nome */}
      <div style={{
        fontFamily: FONT_DISPLAY,
        fontSize: 20,
        fontWeight: 700,
        fontStyle: "italic",
        color: COLORS.text,
        textAlign: "center",
      }}>
        {founder.name}
      </div>

      {/* Bio */}
      <p style={{
        fontFamily: FONT_UI,
        fontSize: 13,
        color: COLORS.textMuted,
        lineHeight: 1.7,
        textAlign: "center",
        margin: 0,
      }}>
        {founder.bio}
      </p>
    </div>
  );
}

function SharedLinkButton({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        padding: "18px 24px",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        color: COLORS.textMuted,
        textDecoration: "none",
        fontFamily: FONT_UI,
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.accent;
        e.currentTarget.style.color = COLORS.text;
        e.currentTarget.style.background = `${COLORS.accent}0D`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.color = COLORS.textMuted;
        e.currentTarget.style.background = COLORS.surface;
      }}
    >
      <span style={{ color: COLORS.accent, flexShrink: 0 }}>{ICONS[link.icon]}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 15,
          fontWeight: 600,
          color: "inherit",
          letterSpacing: "0.02em",
          marginBottom: 2,
        }}>
          {link.label}
        </div>
        <div style={{
          fontSize: 12,
          color: COLORS.textDim,
          letterSpacing: "0.03em",
        }}>
          {link.description}
        </div>
      </div>
      <span style={{ fontSize: 18, opacity: 0.35, flexShrink: 0 }}>→</span>
    </a>
  );
}

export default function LinksPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      backgroundImage: `radial-gradient(ellipse 70% 40% at 50% 0%, ${COLORS.accent}08 0%, transparent 60%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "60px 24px 80px",
      fontFamily: FONT_UI,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Jost:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          marginBottom: 8,
        }}>
          <div style={{ width: 32, height: 1.5, background: `linear-gradient(90deg, transparent, ${COLORS.accent})` }} />
          <span style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 26,
            fontStyle: "italic",
            fontWeight: 700,
            color: COLORS.text,
          }}>Arcus Club</span>
          <div style={{ width: 32, height: 1.5, background: `linear-gradient(90deg, ${COLORS.accent}, transparent)` }} />
        </div>
        <div style={{
          fontSize: 11,
          color: COLORS.accent,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          fontFamily: FONT_UI,
        }}>
          Mentoria para Empresários
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 720 }}>
        {/* Mini-bios paralelas */}
        <div style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 40,
        }}>
          {FOUNDERS.map((f) => (
            <FounderCard key={f.name} founder={f} />
          ))}
        </div>

        {/* Divisor */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 32,
        }}>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          <span style={{
            fontFamily: FONT_UI,
            fontSize: 11,
            color: COLORS.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}>Acesse</span>
          <div style={{ flex: 1, height: 1, background: COLORS.border }} />
        </div>

        {/* Links compartilhados */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SHARED_LINKS.map((link) => (
            <SharedLinkButton key={link.label} link={link} />
          ))}
        </div>
      </div>

      {/* Rodapé */}
      <div style={{
        marginTop: 64,
        fontFamily: FONT_UI,
        fontSize: 11,
        color: COLORS.textDim,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>
        arcusclub.com.br
      </div>
    </div>
  );
}
