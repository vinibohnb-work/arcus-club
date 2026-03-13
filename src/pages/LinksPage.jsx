// ─── LinksPage — Arcus Club ───────────────────────────────────────────────────
// Personalize os dados abaixo em PEOPLE (nome, bio, avatar, cor e links)

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

// ─── ✏️ EDITE AQUI os dados de cada sócio ─────────────────────────────────────
const PEOPLE = [
  {
    name: "Vinícius Bohngratz",       // ← nome
    role: "Co-fundador · Arcus Club", // ← cargo / descrição
    initials: "VB",                   // ← iniciais para o avatar
    color: "#C9A84C",                 // ← cor do avatar (gold)
    links: [
      {
        label: "Instagram",
        url: "https://instagram.com/SEU_USUARIO",   // ← cole sua URL
        icon: "instagram",
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/SEU_USUARIO", // ← cole sua URL
        icon: "linkedin",
      },
      {
        label: "WhatsApp",
        url: "https://wa.me/55119XXXXXXXX",         // ← cole sua URL
        icon: "whatsapp",
      },
      {
        label: "YouTube",
        url: "https://youtube.com/@SEU_CANAL",      // ← cole sua URL
        icon: "youtube",
      },
    ],
  },
  {
    name: "Nome do Sócio",            // ← nome do sócio
    role: "Co-fundador · Arcus Club", // ← cargo / descrição
    initials: "NS",                   // ← iniciais para o avatar
    color: "#3DBFB0",                 // ← cor do avatar (teal)
    links: [
      {
        label: "Instagram",
        url: "https://instagram.com/SEU_USUARIO",
        icon: "instagram",
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/SEU_USUARIO",
        icon: "linkedin",
      },
      {
        label: "WhatsApp",
        url: "https://wa.me/55119XXXXXXXX",
        icon: "whatsapp",
      },
      {
        label: "YouTube",
        url: "https://youtube.com/@SEU_CANAL",
        icon: "youtube",
      },
    ],
  },
];
// ──────────────────────────────────────────────────────────────────────────────

const ICONS = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
};

function LinkButton({ link, color }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        padding: "14px 20px",
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 4,
        color: COLORS.textMuted,
        textDecoration: "none",
        fontFamily: FONT_UI,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.04em",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.color = COLORS.text;
        e.currentTarget.style.background = `${color}0D`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.border;
        e.currentTarget.style.color = COLORS.textMuted;
        e.currentTarget.style.background = COLORS.surface;
      }}
    >
      <span style={{ color, flexShrink: 0 }}>{ICONS[link.icon]}</span>
      {link.label}
      <span style={{ marginLeft: "auto", fontSize: 16, opacity: 0.4 }}>→</span>
    </a>
  );
}

function PersonCard({ person }) {
  return (
    <div style={{
      background: COLORS.card,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      padding: "40px 32px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 32,
      flex: 1,
      minWidth: 280,
      maxWidth: 400,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow superior */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${person.color}, transparent)`,
      }} />

      {/* Avatar */}
      <div style={{ position: "relative" }}>
        <div style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: `${person.color}22`,
          border: `2px solid ${person.color}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_DISPLAY,
          fontSize: 28,
          fontWeight: 700,
          fontStyle: "italic",
          color: person.color,
          boxShadow: `0 0 32px ${person.color}33`,
        }}>
          {person.initials}
        </div>
      </div>

      {/* Nome e cargo */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 22,
          fontWeight: 700,
          fontStyle: "italic",
          color: COLORS.text,
          marginBottom: 6,
        }}>
          {person.name}
        </div>
        <div style={{
          fontFamily: FONT_UI,
          fontSize: 12,
          color: COLORS.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
        }}>
          {person.role}
        </div>
      </div>

      {/* Links */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
      }}>
        {person.links.map((link) => (
          <LinkButton key={link.label} link={link} color={person.color} />
        ))}
      </div>
    </div>
  );
}

export default function LinksPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      backgroundImage: `
        radial-gradient(ellipse 60% 40% at 20% 10%, ${COLORS.accent}08 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 80% 80%, #3DBFB008 0%, transparent 60%)
      `,
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
      <div style={{ textAlign: "center", marginBottom: 56 }}>
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
          fontWeight: 400,
        }}>
          Mentoria para Empresários
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        justifyContent: "center",
        width: "100%",
        maxWidth: 860,
      }}>
        {PEOPLE.map((person) => (
          <PersonCard key={person.name} person={person} />
        ))}
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
