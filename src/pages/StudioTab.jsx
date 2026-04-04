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

// ── tokens de estilo ─────────────────────────────────────────────────────────
const s = {
  sectionTitle: { fontSize: 13, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textMuted, marginBottom: 16, letterSpacing: "0.14em", textTransform: "uppercase" },
  card:  (x={}) => ({ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: 20, ...x }),
  pill:  (a, c=COLORS.accent) => ({ padding: "6px 16px", borderRadius: 2, fontSize: 12, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: a ? `${c}18` : "transparent", color: a ? c : COLORS.textMuted, border: `1px solid ${a ? c+"55" : COLORS.border}`, transition: "all 0.15s" }),
  badge: (c) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.08em", background: `${c}18`, color: c, border: `1px solid ${c}33`, textTransform: "uppercase" }),
  input: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 2, padding: "9px 12px", color: COLORS.text, fontSize: 14, width: "100%", outline: "none", fontFamily: FONT_UI },
  label: { fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: FONT_UI },
  btn:   (v="primary") => ({ padding: v==="sm" ? "6px 14px" : "10px 22px", borderRadius: 2, border: v==="outline" ? `1px solid ${COLORS.accent}` : "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.08em", textTransform: "uppercase", background: v==="outline"||v==="ghost" ? "transparent" : COLORS.accent, color: v==="ghost" ? COLORS.textMuted : v==="outline" ? COLORS.accent : "#0A0800", transition: "all 0.15s" }),
};

const BRAND_DEFAULTS = {
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

const PILARES = [
  "Liderança", "Cultura Organizacional", "Processos e Sistemas",
  "Gestão de Times", "Mentalidade do Empreendedor", "Visão e Estratégia",
  "Tomada de Decisão", "Comunicação Interna", "Arcus Club",
];

const FORMAT_COLOR = {
  Carrossel:    COLORS.violet,
  "Estático":   COLORS.teal,
  Reels:        "#A855F7",
  Bastidor:     "#F97316",
  "Arcus Club": COLORS.red,
};

const BLANK_FORM = {
  format:  "Carrossel",
  pilar:   "Liderança",
  hook:    "",
  slides:  ["", "", "", "", "", ""],   // carrossel
  roteiro: "",                          // reels
  descricao: "",                        // estático / bastidor / arcus
  cta:     "",
  caption: "",
  hashtags: "",
  notasVisuais: "",
};

// ── painel de identidade da marca ────────────────────────────────────────────
function PainelIdentidade({ brand, setBrand, onClose }) {
  const [local, setLocal] = useState(brand);
  const set = (k, v) => setLocal(b => ({ ...b, [k]: v }));
  const save = () => { setBrand(local); saveLS("arcus-brand", local); onClose(); };

  const Field = ({ label, k, placeholder, multiline }) => (
    <div>
      <label style={s.label}>{label}</label>
      {multiline
        ? <textarea value={local[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
            rows={3} style={{ ...s.input, resize: "vertical", minHeight: 70, lineHeight: 1.6 }} />
        : <input value={local[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder} style={s.input} />
      }
    </div>
  );

  return (
    <div style={s.card({ marginBottom: 32, borderTop: `2px solid ${COLORS.accent}` })}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={s.sectionTitle}>— Identidade da Marca</div>
        <button style={s.btn("ghost")} onClick={onClose}>✕ Fechar</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Cores */}
        <div>
          <label style={s.label}>Cor Primária</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={local.corPrimaria} onChange={e => set("corPrimaria", e.target.value)}
              style={{ width: 36, height: 36, border: "none", borderRadius: 2, cursor: "pointer", padding: 0, background: "none" }} />
            <input value={local.corPrimaria} onChange={e => set("corPrimaria", e.target.value)}
              style={{ ...s.input, width: "auto", flex: 1 }} />
          </div>
        </div>
        <div>
          <label style={s.label}>Cor de Fundo</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={local.corSecundaria} onChange={e => set("corSecundaria", e.target.value)}
              style={{ width: 36, height: 36, border: "none", borderRadius: 2, cursor: "pointer", padding: 0 }} />
            <input value={local.corSecundaria} onChange={e => set("corSecundaria", e.target.value)}
              style={{ ...s.input, flex: 1 }} />
          </div>
        </div>
        <div>
          <label style={s.label}>Cor de Destaque</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={local.corDestaque} onChange={e => set("corDestaque", e.target.value)}
              style={{ width: 36, height: 36, border: "none", borderRadius: 2, cursor: "pointer", padding: 0 }} />
            <input value={local.corDestaque} onChange={e => set("corDestaque", e.target.value)}
              style={{ ...s.input, flex: 1 }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <Field label="Fonte de Destaque"    k="fonteDisplay"    placeholder="Cormorant Garamond" />
        <Field label="Fonte de Corpo"       k="fonteCorpo"      placeholder="Outfit" />
        <Field label="Assinatura / Marca"   k="assinatura"      placeholder="Arcus Club" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Slides (Carrossel)" k="carrosselSlides"  placeholder="7" />
          <Field label="Duração (Reels)"    k="reelsDuracao"     placeholder="7–15s" />
        </div>
        <Field label="Estilo Estático"      k="estaticoCor"     placeholder="Fundo escuro, texto em destaque" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <Field label="CTA Padrão"   k="ctaPadrao"  placeholder="Quer estruturar sua empresa? Comenta ARCUS..." />
        <Field label="Hashtags"     k="hashtags"   placeholder="#liderança #gestão..." />
      </div>

      <div style={{ marginBottom: 20 }}>
        <Field label="Tom de Voz (diretrizes)" k="tomDeVoz" multiline
          placeholder="Direto, sem rodeios. Usa afirmações provocativas. Evita jargão..." />
      </div>

      {/* Preview da paleta */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, textTransform: "uppercase", letterSpacing: "0.1em" }}>Paleta</span>
        {[local.corPrimaria, local.corSecundaria, local.corDestaque, local.corTexto].map((c, i) => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: 3, background: c, border: `1px solid ${COLORS.border}` }} title={c} />
        ))}
        <span style={{ fontSize: 13, fontFamily: local.fonteDisplay || FONT_BODY, fontStyle: "italic", color: local.corPrimaria, marginLeft: 8 }}>
          {local.assinatura || "Arcus Club"}
        </span>
      </div>

      <button style={s.btn()} onClick={save}>Salvar Identidade</button>
    </div>
  );
}

// ── criador de post ──────────────────────────────────────────────────────────
function CriadorPost({ brand, posts, setPosts }) {
  const [form,       setForm]       = useState({ ...BLANK_FORM, cta: brand.ctaPadrao, hashtags: brand.hashtags });
  const [savedPost,  setSavedPost]  = useState(null);
  const [slideCount, setSlideCount] = useState(parseInt(brand.carrosselSlides) || 7);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setSlide = (i, v) => setForm(f => { const slides = [...f.slides]; slides[i] = v; return { ...f, slides }; });

  const autoCaption = () => {
    const parts = [];
    if (form.hook) parts.push(form.hook + ".");
    if (form.cta)  parts.push("\n" + form.cta);
    if (form.hashtags) parts.push("\n.\n.\n.\n" + form.hashtags);
    setF("caption", parts.join("\n"));
  };

  const savePost = () => {
    if (!form.hook.trim()) return;
    const post = { id: Date.now(), ...form, createdAt: new Date().toLocaleDateString("pt-BR"), brand: { ...brand } };
    const updated = [post, ...posts];
    setPosts(updated);
    saveLS("arcus-posts", updated);
    setSavedPost(post);
    setForm({ ...BLANK_FORM, cta: brand.ctaPadrao, hashtags: brand.hashtags });
    setSlideCount(parseInt(brand.carrosselSlides) || 7);
  };

  const deletePost = (id) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveLS("arcus-posts", updated);
    if (savedPost?.id === id) setSavedPost(null);
  };

  const color = FORMAT_COLOR[form.format] || COLORS.accent;

  return (
    <>
      {/* Formulário de criação */}
      <div style={s.card({ marginBottom: 32, borderTop: `2px solid ${color}` })}>
        <div style={{ ...s.sectionTitle, color }}>— Novo Post</div>

        {/* Formato + Pilar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={s.label}>Formato</label>
            <select value={form.format} onChange={e => { setF("format", e.target.value); }}
              style={{ ...s.input, cursor: "pointer" }}>
              {Object.keys(FORMAT_COLOR).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Pilar Temático</label>
            <select value={form.pilar} onChange={e => setF("pilar", e.target.value)}
              style={{ ...s.input, cursor: "pointer" }}>
              {PILARES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Hook */}
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Hook · Frase de Abertura</label>
          <input value={form.hook} onChange={e => setF("hook", e.target.value)}
            placeholder='Ex: "O líder que resolve tudo é o mesmo que impede o crescimento"'
            style={{ ...s.input, fontSize: 15, fontStyle: "italic", fontFamily: FONT_BODY }} />
        </div>

        {/* Campos por formato */}
        {form.format === "Carrossel" && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <label style={s.label}>Estrutura dos Slides</label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button style={s.btn("sm")} onClick={() => setSlideCount(n => Math.max(2, n - 1))}>−</button>
                <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI, minWidth: 60, textAlign: "center" }}>{slideCount} slides</span>
                <button style={s.btn("sm")} onClick={() => setSlideCount(n => Math.min(15, n + 1))}>+</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.from({ length: slideCount }).map((_, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 2, background: i === 0 ? `${color}20` : i === slideCount - 1 ? `${COLORS.accent}20` : COLORS.surface, border: `1px solid ${i === 0 ? color : i === slideCount - 1 ? COLORS.accent : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i === 0 ? color : i === slideCount - 1 ? COLORS.accent : COLORS.textMuted, flexShrink: 0, marginTop: 2, fontFamily: FONT_UI }}>
                    {i + 1}
                  </div>
                  <input
                    value={form.slides[i] || ""}
                    onChange={e => setSlide(i, e.target.value)}
                    placeholder={i === 0 ? "Slide de abertura / hook visual" : i === slideCount - 1 ? "Slide de CTA / encerramento" : `Conteúdo do slide ${i + 1}`}
                    style={{ ...s.input, fontSize: 13 }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI }}>
              Identidade: {brand.fonteDisplay} · Fundo {brand.corSecundaria} · Destaque {brand.corPrimaria}
            </div>
          </div>
        )}

        {form.format === "Reels" && (
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>Roteiro · {brand.reelsDuracao}</label>
            <textarea value={form.roteiro} onChange={e => setF("roteiro", e.target.value)}
              placeholder={"[0s] Hook visual — sem fala ou frase de impacto\n[3s] Desenvolvimento — argumento central\n[10s] Conclusão ou CTA"}
              rows={5} style={{ ...s.input, resize: "vertical", lineHeight: 1.7 }} />
          </div>
        )}

        {["Estático", "Bastidor", "Arcus Club"].includes(form.format) && (
          <div style={{ marginBottom: 16 }}>
            <label style={s.label}>
              {form.format === "Estático" ? "Conteúdo / Frase Visual" : "Descrição / Contexto"}
            </label>
            <textarea value={form.descricao} onChange={e => setF("descricao", e.target.value)}
              placeholder={
                form.format === "Estático"   ? "Texto principal do post, layout e orientação visual..." :
                form.format === "Bastidor"   ? "O que vai aparecer, contexto, o que humaniza..." :
                "O que o post comunica sobre o Arcus Club, tom do CTA..."
              }
              rows={4} style={{ ...s.input, resize: "vertical", lineHeight: 1.6 }} />
            {form.format === "Estático" && (
              <div style={{ marginTop: 6, fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI }}>
                Estilo: {brand.estaticoCor} · Fonte: {brand.fonteDisplay}
              </div>
            )}
          </div>
        )}

        {/* CTA + Caption + Hashtags */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={s.label}>CTA</label>
            <input value={form.cta} onChange={e => setF("cta", e.target.value)}
              placeholder={brand.ctaPadrao} style={s.input} />
          </div>
          <div>
            <label style={s.label}>Hashtags</label>
            <input value={form.hashtags} onChange={e => setF("hashtags", e.target.value)}
              placeholder={brand.hashtags} style={s.input} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={s.label}>Caption</label>
            <button style={{ ...s.btn("ghost"), fontSize: 11, padding: "3px 10px" }} onClick={autoCaption}>
              Gerar automaticamente
            </button>
          </div>
          <textarea value={form.caption} onChange={e => setF("caption", e.target.value)}
            placeholder="Caption completa para publicação..."
            rows={4} style={{ ...s.input, resize: "vertical", lineHeight: 1.65 }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Notas Visuais</label>
          <input value={form.notasVisuais} onChange={e => setF("notasVisuais", e.target.value)}
            placeholder="Ex: foto do escritório, mockup escuro, ícone de seta, sem rosto..."
            style={s.input} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={s.btn()} onClick={savePost}>Salvar Post</button>
          <button style={s.btn("ghost")} onClick={() => setForm({ ...BLANK_FORM, cta: brand.ctaPadrao, hashtags: brand.hashtags })}>Limpar</button>
        </div>
      </div>

      {/* Posts salvos */}
      {posts.length > 0 && (
        <>
          <div style={s.sectionTitle}>— Posts Criados · {posts.length}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {posts.map(post => {
              const c = FORMAT_COLOR[post.format] || COLORS.accent;
              const isNew = savedPost?.id === post.id;
              return (
                <div key={post.id} style={s.card({ borderLeft: `2px solid ${c}`, outline: isNew ? `1px solid ${COLORS.accent}44` : "none" })}>
                  {/* Cabeçalho */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={s.badge(c)}>{post.format}</span>
                      <span style={s.badge(COLORS.textMuted)}>{post.pilar}</span>
                      {isNew && <span style={{ ...s.badge(COLORS.teal) }}>novo</span>}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI }}>{post.createdAt}</span>
                      <button onClick={() => deletePost(post.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textDim, fontSize: 14, padding: "0 2px" }}>✕</button>
                    </div>
                  </div>

                  {/* Hook */}
                  <div style={{ fontFamily: FONT_BODY, fontSize: 17, fontStyle: "italic", color: COLORS.text, marginBottom: 14, lineHeight: 1.5 }}>
                    "{post.hook}"
                  </div>

                  {/* Conteúdo por formato */}
                  {post.format === "Carrossel" && post.slides?.some(sl => sl) && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                      {post.slides.filter((_, i) => i < parseInt(post.brand?.carrosselSlides || 7)).map((sl, i) => sl ? (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 22, height: 22, borderRadius: 2, background: COLORS.surface, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: COLORS.textDim, flexShrink: 0, fontFamily: FONT_UI }}>
                            {i + 1}
                          </div>
                          <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI, lineHeight: 1.5 }}>{sl}</span>
                        </div>
                      ) : null)}
                    </div>
                  )}

                  {post.roteiro && (
                    <div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI, lineHeight: 1.65, whiteSpace: "pre-wrap", marginBottom: 14, padding: "10px 14px", background: COLORS.surface, borderRadius: 3, borderLeft: `2px solid ${c}` }}>
                      {post.roteiro}
                    </div>
                  )}

                  {post.descricao && (
                    <div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI, lineHeight: 1.65, marginBottom: 14 }}>{post.descricao}</div>
                  )}

                  {/* Caption + Hashtags */}
                  {post.caption && (
                    <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginBottom: 8 }}>
                      <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Caption</div>
                      <div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{post.caption}</div>
                    </div>
                  )}

                  {/* Rodapé: visual + copiar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${COLORS.border}` }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {post.notasVisuais && (
                        <span style={{ fontSize: 12, color: COLORS.textDim, fontFamily: FONT_UI, fontStyle: "italic" }}>
                          ◎ {post.notasVisuais}
                        </span>
                      )}
                      <div style={{ display: "flex", gap: 6 }}>
                        {[post.brand?.corPrimaria, post.brand?.corSecundaria, post.brand?.corDestaque].filter(Boolean).map((c, i) => (
                          <div key={i} title={c} style={{ width: 14, height: 14, borderRadius: 2, background: c, border: `1px solid ${COLORS.border}` }} />
                        ))}
                      </div>
                    </div>
                    <button style={s.btn("outline")}
                      onClick={() => {
                        const txt = [
                          `[${post.format.toUpperCase()}] ${post.pilar}`,
                          `Hook: "${post.hook}"`,
                          post.roteiro ? `\nRoteiro:\n${post.roteiro}` : "",
                          post.descricao ? `\n${post.descricao}` : "",
                          post.slides?.some(s => s) ? `\nSlides:\n${post.slides.filter(Boolean).map((s, i) => `${i+1}. ${s}`).join("\n")}` : "",
                          post.caption ? `\nCaption:\n${post.caption}` : "",
                          post.notasVisuais ? `\nNotas visuais: ${post.notasVisuais}` : "",
                        ].filter(Boolean).join("\n");
                        navigator.clipboard.writeText(txt);
                      }}>
                      Copiar Ficha
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

// ── componente exportado ─────────────────────────────────────────────────────
export default function StudioTab() {
  const [brand,       setBrand]       = useState(() => loadLS("arcus-brand", BRAND_DEFAULTS));
  const [posts,       setPosts]       = useState(() => loadLS("arcus-posts", []));
  const [showBrand,   setShowBrand]   = useState(false);

  return (
    <>
      {/* Barra de identidade */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showBrand ? 20 : 28 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {[brand.corPrimaria, brand.corSecundaria, brand.corDestaque].map((c, i) => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: 2, background: c, border: `1px solid ${COLORS.border}` }} />
          ))}
          <span style={{ fontSize: 13, fontFamily: brand.fonteDisplay ? `'${brand.fonteDisplay}', Georgia, serif` : FONT_BODY, fontStyle: "italic", color: brand.corPrimaria }}>
            {brand.assinatura}
          </span>
          <span style={{ fontSize: 12, color: COLORS.textDim, fontFamily: FONT_UI }}>
            · {brand.fonteDisplay} / {brand.fonteCorpo}
          </span>
        </div>
        <button style={s.btn("outline")} onClick={() => setShowBrand(v => !v)}>
          {showBrand ? "Fechar Identidade" : "Editar Identidade"}
        </button>
      </div>

      {showBrand && <PainelIdentidade brand={brand} setBrand={setBrand} onClose={() => setShowBrand(false)} />}

      <CriadorPost brand={brand} posts={posts} setPosts={setPosts} />
    </>
  );
}
