import { useState } from "react";

const COLORS = {
  bg: "#080808", surface: "#111111", card: "#161616", cardHover: "#1C1C1C",
  border: "#2A2A2A", borderLight: "#222222",
  accent: "#C9A84C", accentDim: "#C9A84C33",
  violet: "#7B6FD4", teal: "#3DBFB0", red: "#E05252",
  text: "#F2EDE4", textMuted: "#8A8070", textDim: "#4A4440",
};
const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI      = `'Jost', 'DM Sans', sans-serif`;
const FONT_BODY    = `'Cormorant Garamond', 'Garamond', Georgia, serif`;

function loadLS(k, fb) { try { return JSON.parse(localStorage.getItem(k) ?? "null") ?? fb; } catch { return fb; } }
function saveLS(k, v)  { localStorage.setItem(k, JSON.stringify(v)); }

const s = {
  sectionTitle: { fontSize: 13, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textMuted, marginBottom: 16, letterSpacing: "0.14em", textTransform: "uppercase" },
  card:  (x={}) => ({ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: 20, ...x }),
  input: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 2, padding: "9px 12px", color: COLORS.text, fontSize: 14, width: "100%", outline: "none", fontFamily: FONT_UI },
  label: { fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: FONT_UI },
  btn:   (v="primary") => ({ padding: v==="sm" ? "6px 14px" : "10px 22px", borderRadius: 2, border: v==="outline" ? `1px solid ${COLORS.accent}` : "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.08em", textTransform: "uppercase", background: v==="outline"||v==="ghost" ? "transparent" : COLORS.accent, color: v==="ghost" ? COLORS.textMuted : v==="outline" ? COLORS.accent : "#0A0800", transition: "all 0.15s" }),
};

export const BRAND_DEFAULTS = {
  corPrimaria:   "#C9A84C",
  corSecundaria: "#0E0E0E",
  corTexto:      "#F0EDE6",
  corDestaque:   "#7B6FD4",
  fonteDisplay:  "Cormorant Garamond",
  fonteCorpo:    "Outfit",
  assinatura:    "Arcus Club",
  ctaPadrao:     "Quer estruturar sua empresa? Comenta ARCUS ou acessa o link na bio.",
  hashtags:      "#liderança #gestão #empreendedorismo #arcusclub #cultura",
  tomDeVoz:      "Direto, sem rodeios. Usa afirmações provocativas. Evita jargão acadêmico. Tom de autoridade, nunca arrogância.",
  carrosselSlides: "7",
  reelsDuracao:    "7–15s",
  estaticoCor:     "Fundo escuro com texto em destaque",
};

export default function StudioTab() {
  const [brand, setBrand] = useState(() => loadLS("arcus-brand", BRAND_DEFAULTS));
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setBrand(b => ({ ...b, [k]: v }));

  const save = () => {
    saveLS("arcus-brand", brand);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, k, placeholder, multiline }) => (
    <div>
      <label style={s.label}>{label}</label>
      {multiline
        ? <textarea value={brand[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
            rows={3} style={{ ...s.input, resize: "vertical", minHeight: 70, lineHeight: 1.6 }} />
        : <input value={brand[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder} style={s.input} />
      }
    </div>
  );

  return (
    <div>
      {/* Paleta ao vivo */}
      <div style={s.card({ marginBottom: 24, display: "flex", alignItems: "center", gap: 16, padding: "14px 20px" })}>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, textTransform: "uppercase", letterSpacing: "0.1em" }}>Paleta</span>
        {[brand.corPrimaria, brand.corSecundaria, brand.corDestaque, brand.corTexto].map((c, i) => (
          <div key={i} style={{ width: 28, height: 28, borderRadius: 3, background: c, border: `1px solid ${COLORS.border}` }} title={c} />
        ))}
        <span style={{ fontSize: 15, fontFamily: brand.fonteDisplay ? `'${brand.fonteDisplay}', Georgia, serif` : FONT_BODY, fontStyle: "italic", color: brand.corPrimaria, marginLeft: 4 }}>
          {brand.assinatura}
        </span>
        <span style={{ fontSize: 12, color: COLORS.textDim, fontFamily: FONT_UI }}>
          · {brand.fonteDisplay} / {brand.fonteCorpo}
        </span>
      </div>

      {/* Cores */}
      <div style={s.card({ marginBottom: 16, borderTop: `2px solid ${COLORS.accent}` })}>
        <div style={s.sectionTitle}>— Cores</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Cor Primária",   k: "corPrimaria"   },
            { label: "Cor de Fundo",   k: "corSecundaria" },
            { label: "Cor de Destaque", k: "corDestaque"  },
          ].map(({ label, k }) => (
            <div key={k}>
              <label style={s.label}>{label}</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="color" value={brand[k]} onChange={e => set(k, e.target.value)}
                  style={{ width: 36, height: 36, border: "none", borderRadius: 2, cursor: "pointer", padding: 0, background: "none" }} />
                <input value={brand[k]} onChange={e => set(k, e.target.value)}
                  style={{ ...s.input, flex: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tipografia + Assinatura */}
      <div style={s.card({ marginBottom: 16 })}>
        <div style={s.sectionTitle}>— Tipografia</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Field label="Fonte de Destaque"  k="fonteDisplay"  placeholder="Cormorant Garamond" />
          <Field label="Fonte de Corpo"     k="fonteCorpo"    placeholder="Outfit" />
          <Field label="Assinatura / Marca" k="assinatura"    placeholder="Arcus Club" />
        </div>
      </div>

      {/* Parâmetros de formato */}
      <div style={s.card({ marginBottom: 16 })}>
        <div style={s.sectionTitle}>— Parâmetros de Formato</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <Field label="Slides (Carrossel)" k="carrosselSlides" placeholder="7" />
          <Field label="Duração (Reels)"    k="reelsDuracao"    placeholder="7–15s" />
          <Field label="Estilo Estático"    k="estaticoCor"     placeholder="Fundo escuro, texto em destaque" />
        </div>
      </div>

      {/* Voz e CTA */}
      <div style={s.card({ marginBottom: 24 })}>
        <div style={s.sectionTitle}>— Voz e CTA</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
          <Field label="CTA Padrão" k="ctaPadrao"  placeholder="Quer estruturar sua empresa? Comenta ARCUS..." />
          <Field label="Hashtags"   k="hashtags"   placeholder="#liderança #gestão..." />
        </div>
        <Field label="Tom de Voz (diretrizes)" k="tomDeVoz" multiline
          placeholder="Direto, sem rodeios. Usa afirmações provocativas. Evita jargão..." />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button style={s.btn()} onClick={save}>Salvar Identidade</button>
        {saved && <span style={{ fontSize: 13, color: COLORS.teal, fontFamily: FONT_UI }}>✓ Salvo</span>}
      </div>
    </div>
  );
}
