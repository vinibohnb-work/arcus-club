import { useState } from "react";
import StudioTab from "./StudioTab";
import { openPostInNewTab, generatePrompt } from "./generatePost";

// ── tokens idênticos ao restante do app ─────────────────────────────────────
const COLORS = {
  bg: "#080808", surface: "#111111", card: "#161616", cardHover: "#1C1C1C",
  border: "#2A2A2A", borderLight: "#222222",
  accent: "#C9A84C", accentLight: "#E2C37A", accentDim: "#C9A84C33",
  violet: "#7B6FD4", teal: "#3DBFB0", red: "#E05252",
  text: "#F2EDE4", textMuted: "#8A8070", textDim: "#4A4440",
};
const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI      = `'Jost', 'DM Sans', sans-serif`;
const FONT_BODY    = `'Cormorant Garamond', 'Garamond', Georgia, serif`;

// ── dados ────────────────────────────────────────────────────────────────────
const FORMAT_COLOR = {
  Carrossel:    COLORS.violet,
  "Estático":   COLORS.teal,
  Reels:        "#A855F7",
  Bastidor:     "#F97316",
  "Arcus Club": COLORS.red,
};
const FORMATS = ["Todos", "Carrossel", "Estático", "Reels", "Bastidor", "Arcus Club"];

// ── Plano ativo: 1 Carrossel + 1 Reels por semana, 11 semanas ───────────────
// 75% Processos / Estratégia / Tecnologia e IA  |  25% Liderança / Cultura
const ALL_POSTS = [
  // ── Publicados (S01–S02) ──────────────────────────────────────────────────
  { id:"p1",  week:"PUB", date:"06/04", format:"Carrossel", pilar:"Liderança",        hook:"O líder que resolve tudo é o mesmo que impede o crescimento" },
  { id:"p2",  week:"PUB", date:"08/04", format:"Estático",  pilar:"Cultura",          hook:"Cultura não é o que está no mural — é o que você tolera quando ninguém está olhando" },
  { id:"p3",  week:"PUB", date:"10/04", format:"Reels",     pilar:"Processos",        hook:"Seu processo não trava o time — ele revela quem não deveria estar ali" },
  { id:"p4",  week:"PUB", date:"13/04", format:"Estático",  pilar:"Processos",        hook:"O gargalo que você trata como problema de pessoa quase sempre é problema de processo" },
  { id:"p5",  week:"PUB", date:"15/04", format:"Reels",     pilar:"Tecnologia e IA",  hook:"A empresa que usa IA para executar o processo errado fica mais eficiente no caminho errado" },
  { id:"p6",  week:"PUB", date:"17/04", format:"Carrossel", pilar:"Estratégia",       hook:"Crescer o faturamento sem crescer a margem é trabalhar mais para ganhar o mesmo" },
  // ── Plano ativo — W01 a W11 ───────────────────────────────────────────────
  { id:"w01c", week:"W01", date:"20/04", format:"Carrossel", pilar:"Processos",       hook:"Quanto custa para a sua empresa não ter o processo documentado: um cálculo que a maioria ignora" },
  { id:"w01r", week:"W01", date:"24/04", format:"Reels",     pilar:"Tecnologia e IA", hook:"IA implementada sem estratégia de negócio clara é custo com aparência de inovação" },
  { id:"w02c", week:"W02", date:"27/04", format:"Carrossel", pilar:"Estratégia",      hook:"3 alavancas para aumentar a margem sem aumentar o faturamento" },
  { id:"w02r", week:"W02", date:"01/05", format:"Reels",     pilar:"Liderança",       hook:"Feedback dado tarde cobra juros. Quanto mais você espera, mais caro fica para todo mundo" },
  { id:"w03c", week:"W03", date:"04/05", format:"Carrossel", pilar:"Tecnologia e IA", hook:"Como usar IA para aumentar a capacidade do time sem aumentar o headcount" },
  { id:"w03r", week:"W03", date:"08/05", format:"Reels",     pilar:"Processos",       hook:"O custo que aparece na planilha raramente é o maior. O custo invisível fica nos retrabalhos que ninguém contabiliza" },
  { id:"w04c", week:"W04", date:"11/05", format:"Carrossel", pilar:"Processos",       hook:"Como encontrar os processos que estão consumindo margem sem aparecer no DRE" },
  { id:"w04r", week:"W04", date:"15/05", format:"Reels",     pilar:"Tecnologia e IA", hook:"Antes de implementar qualquer ferramenta de IA, a pergunta certa: o processo que ela vai executar funciona bem sem ela?" },
  { id:"w05c", week:"W05", date:"18/05", format:"Carrossel", pilar:"Estratégia",      hook:"Como construir um modelo de negócios onde a margem cresce junto com o volume" },
  { id:"w05r", week:"W05", date:"22/05", format:"Reels",     pilar:"Cultura",         hook:"Toda empresa tem duas culturas: a declarada e a praticada" },
  { id:"w06c", week:"W06", date:"25/05", format:"Carrossel", pilar:"Processos",       hook:"Os processos que mais consomem margem raramente são os mais visíveis. Como identificar os que realmente importam" },
  { id:"w06r", week:"W06", date:"29/05", format:"Reels",     pilar:"Tecnologia e IA", hook:"Antes de automatizar, a sequência que a maioria pula: mapear, medir, simplificar. Só então automatizar" },
  { id:"w07c", week:"W07", date:"01/06", format:"Carrossel", pilar:"Tecnologia e IA", hook:"Como mapear quais processos da sua empresa têm maior potencial de automação com IA" },
  { id:"w07r", week:"W07", date:"05/06", format:"Reels",     pilar:"Estratégia",      hook:"3 sinais de que sua empresa cresceu além da estrutura que a sustenta" },
  { id:"w08c", week:"W08", date:"08/06", format:"Carrossel", pilar:"Processos",       hook:"Como aumentar a capacidade operacional sem contratar: o que priorizar quando o time já está no limite" },
  { id:"w08r", week:"W08", date:"12/06", format:"Reels",     pilar:"Liderança",       hook:"Time que só se move quando o dono está presente aprendeu que esperar é mais seguro do que errar" },
  { id:"w09c", week:"W09", date:"15/06", format:"Carrossel", pilar:"Tecnologia e IA", hook:"3 casos onde IA reduziu custo operacional real: o que funcionou e por que funcionou em cada um" },
  { id:"w09r", week:"W09", date:"19/06", format:"Reels",     pilar:"Processos",       hook:"Checklist que o time ignora quase sempre tem um problema antes da disciplina: o design está errado" },
  { id:"w10c", week:"W10", date:"22/06", format:"Carrossel", pilar:"Estratégia",      hook:"Crescimento sem revisão do modelo de negócios vira aumento de faturamento com compressão de margem" },
  { id:"w10r", week:"W10", date:"26/06", format:"Reels",     pilar:"Liderança",       hook:"O dia que você perceber que está resolvendo as mesmas questões de dois anos atrás é um bom dia para repensar como delega" },
  { id:"w11c", week:"W11", date:"29/06", format:"Carrossel", pilar:"Estratégia",      hook:"Como construir uma empresa que funciona sem você: o roteiro dos 90 dias" },
  { id:"w11r", week:"W11", date:"03/07", format:"Reels",     pilar:"Cultura",         hook:"Quando o clima do dia depende do humor de quem lidera, o time aprende a esperar antes de agir" },
];

const PLAN_POSTS  = ALL_POSTS.filter(p => p.week.startsWith("W")); // 22 posts ativos
const PLAN_TOTAL  = PLAN_POSTS.length;

const KB_TYPES  = ["Insight", "Referência", "Hook", "Briefing"];
const KB_COLORS = { Insight: COLORS.teal, Referência: COLORS.violet, Hook: COLORS.accent, Briefing: "#F97316" };

// ── helpers ──────────────────────────────────────────────────────────────────
function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}
function saveLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function engRate(m) {
  if (!m || !m.reach || m.reach === 0) return null;
  return ((+m.likes + +m.comments + +m.shares + +m.saves) / m.reach) * 100;
}

function formatAvg(fmt, published, metrics) {
  const posts = ALL_POSTS.filter(p => p.format === fmt && published.has(p.id));
  const withData = posts.filter(p => metrics[p.id]?.reach > 0);
  const avgReach = withData.length
    ? Math.round(withData.reduce((a, p) => a + +metrics[p.id].reach, 0) / withData.length)
    : null;
  const avgEng = withData.length
    ? (withData.reduce((a, p) => a + engRate(metrics[p.id]), 0) / withData.length).toFixed(2)
    : null;
  return { pubCount: posts.length, withData: withData.length, avgReach, avgEng };
}

// ── estilos (padrão do app) ──────────────────────────────────────────────────
const s = {
  pageTitle:    { fontSize: 34, fontFamily: FONT_DISPLAY, fontWeight: 700, fontStyle: "italic", color: COLORS.text, letterSpacing: "-0.01em", marginBottom: 6, lineHeight: 1.1 },
  pageSubtitle: { fontSize: 15, color: COLORS.textMuted, fontFamily: FONT_UI, letterSpacing: "0.04em" },
  sectionTitle: { fontSize: 13, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textMuted, marginBottom: 16, letterSpacing: "0.14em", textTransform: "uppercase" },
  card:  (x={}) => ({ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: 20, ...x }),
  pill:  (active, color=COLORS.accent) => ({ padding: "6px 16px", borderRadius: 2, fontSize: 12, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: active ? `${color}18` : "transparent", color: active ? color : COLORS.textMuted, border: `1px solid ${active ? color+"55" : COLORS.border}`, transition: "all 0.15s" }),
  badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.08em", background: `${color}18`, color, border: `1px solid ${color}33`, textTransform: "uppercase" }),
  input: { background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 2, padding: "9px 12px", color: COLORS.text, fontSize: 14, width: "100%", outline: "none", fontFamily: FONT_UI },
  label: { fontSize: 11, color: COLORS.textMuted, fontWeight: 500, marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: FONT_UI },
  btn:   (v="primary") => ({ padding: v==="sm" ? "6px 14px" : "10px 20px", borderRadius: 2, border: v==="outline" ? `1px solid ${COLORS.accent}` : "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.08em", textTransform: "uppercase", background: v==="outline"||v==="ghost" ? "transparent" : COLORS.accent, color: v==="ghost" ? COLORS.textMuted : v==="outline" ? COLORS.accent : "#0A0800", transition: "all 0.15s" }),
};

function ProgressBar({ value, color = COLORS.accent }) {
  return (
    <div style={{ height: 2, borderRadius: 1, background: COLORS.borderLight, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.min(value, 100)}%`, background: color, borderRadius: 1, transition: "width 0.4s ease" }} />
    </div>
  );
}

// ── sub-componente: aba Calendário ───────────────────────────────────────────
function TabCalendario({ published, togglePublished, generated, onGenerate, postContent, setPostContent }) {
  const [filter,       setFilter]       = useState("Todos");
  const [showPub,      setShowPub]      = useState(false);
  const [expanded,     setExpanded]     = useState(null);
  const [localContent, setLocalContent] = useState({});
  const [copied,       setCopied]       = useState(null);

  const planDone   = PLAN_POSTS.filter(p => published.has(p.id)).length;
  const planPct    = Math.round((planDone / PLAN_TOTAL) * 100);
  const visible    = (showPub ? ALL_POSTS : PLAN_POSTS)
                       .filter(p => filter === "Todos" || p.format === filter);
  const weeks      = [...new Set(visible.map(p => p.week))];

  const handleCopyPrompt = (post) => {
    const prompt = generatePrompt(post);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(post.id);
      setTimeout(() => setCopied(null), 2500);
    });
  };

  const handleGenerate = (post) => {
    const raw = localContent[post.id] ?? postContent[post.id] ?? "";
    if (raw.trim()) {
      const updated = { ...postContent, [post.id]: raw };
      setPostContent(updated);
      saveLS("arcus-post-content", updated);
    }
    onGenerate(post, raw.trim() || null);
  };

  return (
    <>
      {/* Progresso do plano */}
      <div style={s.card({ marginBottom: 28, borderTop: `2px solid ${COLORS.accent}` })}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Plano Ativo</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>11 semanas · 1 Carrossel + 1 Reels por semana</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>20 Abr – 3 Jul · 75% Processos/Estratégia/IA · 25% Liderança/Cultura</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: FONT_DISPLAY, color: COLORS.accent, lineHeight: 1 }}>{planPct}%</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{planDone}/{PLAN_TOTAL} publicados</div>
          </div>
        </div>
        <ProgressBar value={planPct} color={COLORS.accent} />
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={() => setShowPub(false)}
            style={{ fontSize: 11, fontFamily: FONT_UI, padding: "4px 12px", borderRadius: 4, border: `1px solid ${!showPub ? COLORS.accent : COLORS.border}`, background: !showPub ? COLORS.accent + "22" : "transparent", color: !showPub ? COLORS.accent : COLORS.textMuted, cursor: "pointer" }}>
            Plano ativo
          </button>
          <button onClick={() => setShowPub(true)}
            style={{ fontSize: 11, fontFamily: FONT_UI, padding: "4px 12px", borderRadius: 4, border: `1px solid ${showPub ? COLORS.accent : COLORS.border}`, background: showPub ? COLORS.accent + "22" : "transparent", color: showPub ? COLORS.accent : COLORS.textMuted, cursor: "pointer" }}>
            + histórico publicado
          </button>
        </div>
      </div>

      {/* Filtro de formato */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, letterSpacing: "0.14em", textTransform: "uppercase", marginRight: 4 }}>Formato</span>
        {FORMATS.map(fmt => <button key={fmt} style={s.pill(filter === fmt)} onClick={() => setFilter(fmt)}>{fmt}</button>)}
        <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>
          {visible.length} posts · {visible.filter(p => published.has(p.id)).length} publicados · {visible.filter(p => generated.has(p.id)).length} gerados
        </span>
      </div>

      {/* Grade de posts */}
      {weeks.map(wk => {
        const wkPosts = visible.filter(p => p.week === wk);
        return (
          <div key={wk} style={{ marginBottom: 28 }}>
            <div style={s.sectionTitle}>— {wk}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))", gap: 12 }}>
              {wkPosts.map(post => {
                const isPub    = published.has(post.id);
                const isGen    = generated.has(post.id);
                const isExp    = expanded === post.id;
                const color    = FORMAT_COLOR[post.format] || COLORS.accent;
                const saved    = postContent[post.id] || "";
                const current  = localContent[post.id] ?? saved;
                const hasContent = current.trim().length > 0;

                return (
                  <div key={post.id} style={s.card({ borderLeft: `2px solid ${isPub ? COLORS.accent : color}`, transition: "all 0.15s", padding: "14px 18px" })}>

                    {/* Área clicável para expandir */}
                    <div onClick={() => setExpanded(isExp ? null : post.id)} style={{ cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI }}>{post.date}</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={s.badge(color)}>{post.format}</span>
                          <button
                            onClick={e => { e.stopPropagation(); togglePublished(post.id); }}
                            style={{ background: isPub ? `${COLORS.accent}18` : "transparent", border: `1px solid ${isPub ? COLORS.accent+"55" : COLORS.border}`, borderRadius: 2, padding: "2px 8px", fontSize: 10, fontFamily: FONT_UI, letterSpacing: "0.06em", color: isPub ? COLORS.accent : COLORS.textMuted, cursor: "pointer", transition: "all 0.15s" }}>
                            {isPub ? "✓ Pub" : "Publicar"}
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6 }}>{post.pilar}</div>
                      <div style={{ fontFamily: FONT_BODY, fontSize: 14, fontStyle: "italic", color: COLORS.text, lineHeight: 1.5, marginBottom: 12 }}>"{post.hook}"</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${COLORS.border}`, paddingTop: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: isGen ? COLORS.violet : COLORS.textDim }} />
                          <span style={{ fontSize: 10, fontFamily: FONT_UI, color: isGen ? COLORS.violet : COLORS.textMuted }}>
                            {isGen ? "Gerado" : "Não gerado"}
                          </span>
                          {hasContent && !isGen && (
                            <span style={{ fontSize: 10, fontFamily: FONT_UI, color: COLORS.teal, marginLeft: 4 }}>· conteúdo pronto</span>
                          )}
                        </div>
                        <span style={{ fontSize: 11, color: COLORS.textDim }}>{isExp ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Painel expandido */}
                    {isExp && (
                      <div onClick={e => e.stopPropagation()} style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 14, paddingTop: 14 }}>
                        {/* Copiar prompt */}
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                          <button
                            style={{ ...s.btn("outline"), padding: "6px 14px", fontSize: 12 }}
                            onClick={() => handleCopyPrompt(post)}>
                            {copied === post.id ? "✓ Copiado!" : "Copiar Prompt"}
                          </button>
                          <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, lineHeight: 1.4 }}>
                            Cole no Claude → copie o HTML gerado → cole abaixo
                          </span>
                        </div>

                        {/* Textarea para colar o HTML */}
                        <textarea
                          value={current}
                          onChange={e => setLocalContent(lc => ({ ...lc, [post.id]: e.target.value }))}
                          placeholder={"Cole aqui o HTML retornado pelo Claude:\n\n<!DOCTYPE html>\n<html lang=\"pt-BR\">\n..."}
                          rows={5}
                          style={{ ...s.input, fontFamily: "'DM Mono', monospace", fontSize: 11, resize: "vertical", lineHeight: 1.55, marginBottom: 12 }}
                        />

                        {/* Botão gerar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <button style={s.btn()} onClick={() => handleGenerate(post)}>
                            {isGen ? "Re-gerar Post HTML" : "Gerar Post HTML"}
                          </button>
                          {!hasContent && (
                            <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI }}>
                              sem conteúdo — gera o template base
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {visible.length === 0 && (
        <div style={s.card({ textAlign: "center", padding: 40 })}>
          <div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI }}>Nenhum post para o filtro selecionado.</div>
        </div>
      )}
    </>
  );
}

// ── sub-componente: aba Desempenho ───────────────────────────────────────────
function TabDesempenho({ published, metrics, setMetrics }) {
  const [expanded, setExpanded] = useState(null);
  const [draft, setDraft]       = useState({});

  const publishedPosts = ALL_POSTS.filter(p => published.has(p.id));
  const METRIC_KEYS    = ["reach", "likes", "comments", "shares", "saves"];
  const METRIC_LABELS  = { reach: "Alcance", likes: "Curtidas", comments: "Comentários", shares: "Compartilhamentos", saves: "Salvamentos" };

  const openPost = (id) => {
    setExpanded(prev => prev === id ? null : id);
    setDraft(metrics[id] || { reach: "", likes: "", comments: "", shares: "", saves: "" });
  };

  const saveMetrics = (id) => {
    const updated = { ...metrics, [id]: draft };
    setMetrics(updated);
    saveLS("arcus-metrics", updated);
    setExpanded(null);
  };

  // Top 5 posts por engajamento
  const ranked = publishedPosts
    .map(p => ({ ...p, eng: engRate(metrics[p.id]) }))
    .filter(p => p.eng !== null)
    .sort((a, b) => b.eng - a.eng)
    .slice(0, 5);

  if (publishedPosts.length === 0) {
    return (
      <div style={s.card({ textAlign: "center", padding: 48 })}>
        <div style={{ fontSize: 14, color: COLORS.textMuted, fontFamily: FONT_UI }}>Marque posts como publicados no Calendário para registrar métricas.</div>
      </div>
    );
  }

  return (
    <>
      {/* Desempenho por formato */}
      <div style={{ marginBottom: 32 }}>
        <div style={s.sectionTitle}>— Desempenho por Formato</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,200px),1fr))", gap: 12 }}>
          {Object.keys(FORMAT_COLOR).map(fmt => {
            const { pubCount, withData, avgReach, avgEng } = formatAvg(fmt, published, metrics);
            const color = FORMAT_COLOR[fmt];
            if (pubCount === 0) return null;
            return (
              <div key={fmt} style={s.card({ borderLeft: `2px solid ${color}` })}>
                <span style={s.badge(color)}>{fmt}</span>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>Publicados</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{pubCount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>Alcance médio</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{avgReach !== null ? avgReach.toLocaleString("pt-BR") : "—"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>Eng. médio</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: avgEng !== null ? color : COLORS.textMuted }}>{avgEng !== null ? `${avgEng}%` : "—"}</span>
                  </div>
                  {withData < pubCount && (
                    <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, marginTop: 2 }}>{withData}/{pubCount} com dados</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 engajamento */}
      {ranked.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={s.sectionTitle}>— Top {ranked.length} · Maior Engajamento</div>
          <div style={s.card({ padding: 0 })}>
            {ranked.map((post, i) => {
              const color = FORMAT_COLOR[post.format] || COLORS.accent;
              const maxEng = ranked[0].eng;
              return (
                <div key={post.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < ranked.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: FONT_DISPLAY, color: i === 0 ? COLORS.accent : COLORS.textDim, width: 24, textAlign: "center", flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontStyle: "italic", fontFamily: FONT_BODY, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>"{post.hook}"</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                      <span style={s.badge(color)}>{post.format}</span>
                      <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONT_UI }}>{post.date} · {post.pilar}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.accent }}>{post.eng.toFixed(2)}%</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONT_UI }}>engajamento</div>
                  </div>
                  <div style={{ width: 3, height: 40, borderRadius: 2, background: color, opacity: 0.4 + (post.eng / maxEng) * 0.6, flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de posts publicados com input de métricas */}
      <div>
        <div style={s.sectionTitle}>— Registrar Métricas por Post</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {publishedPosts.map(post => {
            const color  = FORMAT_COLOR[post.format] || COLORS.accent;
            const isOpen = expanded === post.id;
            const m      = metrics[post.id];
            const eng    = engRate(m);
            return (
              <div key={post.id}>
                <div onClick={() => openPost(post.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", background: isOpen ? `${COLORS.accent}0D` : COLORS.card, border: `1px solid ${isOpen ? COLORS.accent + "44" : COLORS.border}`, borderLeft: `3px solid ${color}`, borderRadius: isOpen ? "4px 4px 0 0" : 4, transition: "all 0.15s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontStyle: "italic", fontFamily: FONT_BODY, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>"{post.hook}"</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 3, alignItems: "center" }}>
                      <span style={s.badge(color)}>{post.format}</span>
                      <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: FONT_UI }}>{post.date}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {eng !== null
                      ? <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>{eng.toFixed(2)}%</div>
                      : <div style={{ fontSize: 12, color: COLORS.textDim, fontFamily: FONT_UI }}>sem dados</div>
                    }
                  </div>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                </div>

                {isOpen && (
                  <div style={{ border: `1px solid ${COLORS.accent}44`, borderTop: "none", borderRadius: "0 0 4px 4px", background: COLORS.surface, padding: "16px 20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 14 }}>
                      {METRIC_KEYS.map(key => (
                        <div key={key}>
                          <label style={s.label}>{METRIC_LABELS[key]}</label>
                          <input type="number" min="0" placeholder="0"
                            value={draft[key] ?? ""}
                            onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                            style={s.input} />
                        </div>
                      ))}
                      {draft.reach > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 2 }}>
                          <label style={s.label}>Taxa de Eng.</label>
                          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent, fontFamily: FONT_DISPLAY }}>
                            {engRate(draft) !== null ? `${engRate(draft).toFixed(2)}%` : "—"}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={s.btn()} onClick={() => saveMetrics(post.id)}>Salvar</button>
                      <button style={s.btn("ghost")} onClick={() => setExpanded(null)}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── sub-componente: aba Base de Conhecimento ─────────────────────────────────
function TabBaseConhecimento({ kb, setKb }) {
  const BLANK = { type: "Insight", title: "", body: "" };
  const [form,   setForm]   = useState(BLANK);
  const [filter, setFilter] = useState("Todos");

  const addEntry = () => {
    if (!form.title.trim() && !form.body.trim()) return;
    const entry = { id: Date.now(), ...form, createdAt: new Date().toLocaleDateString("pt-BR") };
    const updated = [entry, ...kb];
    setKb(updated);
    saveLS("arcus-kb", updated);
    setForm(BLANK);
  };

  const deleteEntry = (id) => {
    const updated = kb.filter(e => e.id !== id);
    setKb(updated);
    saveLS("arcus-kb", updated);
  };

  const filtered = kb.filter(e => filter === "Todos" || e.type === filter);

  return (
    <>
      {/* Formulário */}
      <div style={{ ...s.card({ marginBottom: 28 }), borderTop: `2px solid ${COLORS.accent}` }}>
        <div style={s.sectionTitle}>— Nova Entrada</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={s.label}>Tipo</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              style={{ ...s.input, cursor: "pointer" }}>
              {KB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Título / Assunto</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Hooks sobre liderança performam 40% melhor"
              style={s.input} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Conteúdo / Observação</label>
          <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Descreva o insight, a referência, o hook ou o briefing do próximo post..."
            rows={4}
            style={{ ...s.input, resize: "vertical", minHeight: 88, lineHeight: 1.6 }} />
        </div>
        <button style={s.btn()} onClick={addEntry}>Adicionar</button>
      </div>

      {/* Filtros + lista */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <button style={s.pill(filter === "Todos")} onClick={() => setFilter("Todos")}>Todos</button>
        {KB_TYPES.map(t => <button key={t} style={s.pill(filter === t, KB_COLORS[t])} onClick={() => setFilter(t)}>{t}</button>)}
        <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>{filtered.length} {filtered.length === 1 ? "entrada" : "entradas"}</span>
      </div>

      {filtered.length === 0 && (
        <div style={s.card({ textAlign: "center", padding: 40 })}>
          <div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI }}>
            {kb.length === 0 ? "Comece adicionando um insight, referência ou briefing." : "Nenhuma entrada para este filtro."}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(entry => {
          const color = KB_COLORS[entry.type] || COLORS.accent;
          return (
            <div key={entry.id} style={s.card({ borderLeft: `2px solid ${color}` })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={s.badge(color)}>{entry.type}</span>
                  {entry.title && <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: FONT_UI }}>{entry.title}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI }}>{entry.createdAt}</span>
                  <button onClick={() => deleteEntry(entry.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textDim, fontSize: 14, padding: "0 2px", lineHeight: 1 }}>✕</button>
                </div>
              </div>
              {entry.body && (
                <div style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.65, fontFamily: FONT_UI, whiteSpace: "pre-wrap" }}>{entry.body}</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── sub-componente: aba Referências ─────────────────────────────────────────
const REF_TYPES  = ["Livro", "Artigo", "Citação", "Conceito", "Dado/Estatística"];
const REF_COLORS = {
  "Livro":           COLORS.accent,
  "Artigo":          COLORS.teal,
  "Citação":         COLORS.violet,
  "Conceito":        "#F97316",
  "Dado/Estatística":"#3B82F6",
};

function TabReferencias({ refs, setRefs }) {
  const BLANK = { type: "Livro", title: "", author: "", source: "", body: "" };
  const [form,   setForm]   = useState(BLANK);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const addRef = () => {
    if (!form.title.trim() && !form.body.trim()) return;
    const entry = { id: Date.now(), ...form, createdAt: new Date().toLocaleDateString("pt-BR") };
    const updated = [entry, ...refs];
    setRefs(updated);
    saveLS("arcus-refs", updated);
    setForm(BLANK);
  };

  const deleteRef = (id) => {
    const updated = refs.filter(r => r.id !== id);
    setRefs(updated);
    saveLS("arcus-refs", updated);
  };

  const filtered = refs.filter(r =>
    (filter === "Todos" || r.type === filter) &&
    (!search.trim() || [r.title, r.author, r.source, r.body].join(" ").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Formulário */}
      <div style={{ ...s.card({ marginBottom: 28 }), borderTop: `2px solid ${COLORS.accent}` }}>
        <div style={s.sectionTitle}>— Nova Referência</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={s.label}>Tipo</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              style={{ ...s.input, cursor: "pointer" }}>
              {REF_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Título / Frase</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder='Ex: "Quem não comunica, não lidera" ou Livro: O Gerente Minuto'
              style={s.input} />
          </div>
          <div>
            <label style={s.label}>Autor</label>
            <input value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              placeholder="Ex: Peter Drucker"
              style={s.input} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={s.label}>Fonte / Publicação</label>
            <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
              placeholder="Ex: HBR, 2019 · Cap. 3"
              style={s.input} />
          </div>
          <div>
            <label style={s.label}>Anotações / Contexto de uso</label>
            <input value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Como essa referência pode ser usada em posts — pilar, gancho, argumento..."
              style={s.input} />
          </div>
        </div>
        <button style={s.btn()} onClick={addRef}>Adicionar</button>
      </div>

      {/* Filtros + busca */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <button style={s.pill(filter === "Todos")} onClick={() => setFilter("Todos")}>Todos</button>
        {REF_TYPES.map(t => (
          <button key={t} style={s.pill(filter === t, REF_COLORS[t])} onClick={() => setFilter(t)}>{t}</button>
        ))}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..."
          style={{ ...s.input, width: 180, padding: "5px 12px", fontSize: 13, marginLeft: "auto" }}
        />
      </div>

      <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI, marginBottom: 16 }}>
        {filtered.length} {filtered.length === 1 ? "referência" : "referências"}
      </div>

      {/* Lista */}
      {filtered.length === 0 && (
        <div style={s.card({ textAlign: "center", padding: 40 })}>
          <div style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_UI }}>
            {refs.length === 0
              ? "Comece adicionando livros, artigos, citações ou conceitos que inspiram seus posts."
              : "Nenhuma referência encontrada."}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(ref => {
          const color = REF_COLORS[ref.type] || COLORS.accent;
          const isCitacao = ref.type === "Citação";
          return (
            <div key={ref.id} style={s.card({ borderLeft: `2px solid ${color}` })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isCitacao ? 12 : 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={s.badge(color)}>{ref.type}</span>
                  {ref.author && (
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>
                      {ref.author}{ref.source ? ` · ${ref.source}` : ""}
                    </span>
                  )}
                  {!ref.author && ref.source && (
                    <span style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>{ref.source}</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI }}>{ref.createdAt}</span>
                  <button onClick={() => deleteRef(ref.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textDim, fontSize: 14, padding: "0 2px" }}>✕</button>
                </div>
              </div>

              {/* Citações em destaque */}
              {isCitacao && ref.title ? (
                <div style={{ fontFamily: FONT_BODY, fontSize: 18, fontStyle: "italic", color: COLORS.text, lineHeight: 1.55, borderLeft: `3px solid ${color}`, paddingLeft: 16, marginBottom: ref.body ? 12 : 0 }}>
                  "{ref.title}"
                </div>
              ) : ref.title ? (
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, fontFamily: FONT_UI, marginBottom: ref.body ? 8 : 0 }}>{ref.title}</div>
              ) : null}

              {ref.body && (
                <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.65, fontFamily: FONT_UI, borderTop: ref.title ? `1px solid ${COLORS.border}` : "none", paddingTop: ref.title ? 10 : 0, marginTop: ref.title ? 2 : 0 }}>
                  {ref.body}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── componente principal ─────────────────────────────────────────────────────
export default function MarketingPage() {
  const [tab, setTab] = useState("calendario");

  const [published,   setPublished]   = useState(() => new Set(loadLS("arcus-published", [])));
  const [generated,   setGenerated]   = useState(() => new Set(loadLS("arcus-generated", [])));
  const [metrics,     setMetrics]     = useState(() => loadLS("arcus-metrics", {}));
  const [kb,          setKb]          = useState(() => loadLS("arcus-kb", []));
  const [refs,        setRefs]        = useState(() => loadLS("arcus-refs", []));
  const [postContent, setPostContent] = useState(() => loadLS("arcus-post-content", {}));

  const togglePublished = (id) => {
    setPublished(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveLS("arcus-published", [...next]);
      return next;
    });
  };

  const onGenerate = (post, rawContent = null) => {
    openPostInNewTab(post, rawContent);
    setGenerated(prev => {
      if (prev.has(post.id)) return prev;
      const next = new Set(prev);
      next.add(post.id);
      saveLS("arcus-generated", [...next]);
      return next;
    });
  };

  const TABS = [
    { id: "calendario",        label: "Calendário" },
    { id: "desempenho",        label: "Desempenho" },
    { id: "base-conhecimento", label: "Base de Conhecimento" },
    { id: "referencias",       label: "Referências" },
    { id: "studio",            label: "Studio" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={s.pageTitle}>Marketing</div>
        <div style={s.pageSubtitle}>Calendário editorial · Métricas · Base de conhecimento · Referências</div>
      </div>

      {/* Tabs internas */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 16 }}>
        {TABS.map(t => (
          <button key={t.id} style={s.pill(tab === t.id)} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === "calendario"        && <TabCalendario       published={published} togglePublished={togglePublished} generated={generated} onGenerate={onGenerate} postContent={postContent} setPostContent={setPostContent} />}
      {tab === "desempenho"        && <TabDesempenho       published={published} metrics={metrics} setMetrics={setMetrics} />}
      {tab === "base-conhecimento" && <TabBaseConhecimento kb={kb} setKb={setKb} />}
      {tab === "referencias"       && <TabReferencias      refs={refs} setRefs={setRefs} />}
      {tab === "studio"            && <StudioTab />}
    </div>
  );
}
