import { useState } from "react";
import { openPostInNewTab, generatePrompt } from "./generateViniPost";

// ── design tokens — espelham ViniciusPage.css ────────────────────────────────
const T = {
  ink:         "#0E0E0E",
  paper:       "#F5F2EC",
  cream:       "#EDE9DF",
  gold:        "#B8933A",
  goldLight:   "#D4B06A",
  goldPale:    "#F0E4C4",
  teal:        "#1A6B5A",
  indigo:      "#3D3D8F",
  muted:       "#6B6659",
  border:      "rgba(14,14,14,0.10)",
  borderStrong:"rgba(14,14,14,0.18)",
  violet:      "#5B52B0",
  purple:      "#7C3AB0",
  orange:      "#B05A1A",
  red:         "#A03030",
};

const FORMAT_COLOR = {
  Carrossel:      T.indigo,
  "Estático":     T.teal,
  Reels:          T.violet,
  Bastidor:       T.orange,
  Posicionamento: T.red,
};

const FORMATS = ["Todos", "Carrossel", "Estático", "Reels", "Bastidor", "Posicionamento"];

// ── Plano: 10 semanas · Jul–Set ───────────────────────────────────────────────
const ALL_POSTS = [
  { id:"vw01c", week:"W01", date:"06/07", format:"Carrossel",      pilar:"Processos",       hook:"O processo que mais sangra margem raramente aparece no DRE" },
  { id:"vw01r", week:"W01", date:"10/07", format:"Reels",          pilar:"Tecnologia e IA", hook:"A maioria usa IA para fazer mais rápido o que não deveria fazer do jeito que fazia" },
  { id:"vw02c", week:"W02", date:"13/07", format:"Carrossel",      pilar:"Estratégia",      hook:"Crescer o faturamento sem revisar o modelo de negócio é trabalhar mais pelo mesmo resultado" },
  { id:"vw02r", week:"W02", date:"17/07", format:"Reels",          pilar:"Liderança",       hook:"O time que espera o dono decidir tudo aprendeu que esperar é mais seguro do que errar" },
  { id:"vw03c", week:"W03", date:"20/07", format:"Carrossel",      pilar:"Tecnologia e IA", hook:"Antes de automatizar qualquer coisa: esse processo funciona bem sem automação?" },
  { id:"vw03r", week:"W03", date:"24/07", format:"Reels",          pilar:"Processos",       hook:"Retrabalho não é problema de disciplina — quase sempre é processo mal desenhado" },
  { id:"vw04c", week:"W04", date:"27/07", format:"Carrossel",      pilar:"Processos",       hook:"Como calcular quanto custa para sua empresa não ter os processos documentados" },
  { id:"vw04r", week:"W04", date:"31/07", format:"Reels",          pilar:"Estratégia",      hook:"Três sinais de que sua empresa cresceu além da estrutura que a sustenta" },
  { id:"vw05c", week:"W05", date:"03/08", format:"Carrossel",      pilar:"Estratégia",      hook:"Como aumentar a margem sem aumentar o faturamento: as três alavancas que a maioria ignora" },
  { id:"vw05r", week:"W05", date:"07/08", format:"Reels",          pilar:"Cultura",         hook:"Toda empresa tem duas culturas: a do mural e a do que o líder tolera na segunda-feira" },
  { id:"vw06c", week:"W06", date:"10/08", format:"Carrossel",      pilar:"Processos",       hook:"Por que os processos mais críticos são exatamente os que o time improvisa todo dia" },
  { id:"vw06r", week:"W06", date:"14/08", format:"Reels",          pilar:"Tecnologia e IA", hook:"IA implementada em processo errado só aumenta a velocidade do erro" },
  { id:"vw07c", week:"W07", date:"17/08", format:"Carrossel",      pilar:"Tecnologia e IA", hook:"Como identificar quais processos têm maior potencial de automação real" },
  { id:"vw07r", week:"W07", date:"21/08", format:"Reels",          pilar:"Processos",       hook:"O gargalo que você trata como problema de pessoa quase sempre é problema de processo" },
  { id:"vw08c", week:"W08", date:"24/08", format:"Carrossel",      pilar:"Estratégia",      hook:"Como construir um modelo onde a margem cresce junto com o volume — e não comprime" },
  { id:"vw08r", week:"W08", date:"28/08", format:"Reels",          pilar:"Liderança",       hook:"Feedback dado tarde cobra juros. Quanto mais você espera, mais caro fica para o time" },
  { id:"vw09c", week:"W09", date:"31/08", format:"Carrossel",      pilar:"Processos",       hook:"Como ganhar capacidade operacional sem contratar: o que priorizar quando o time está no limite" },
  { id:"vw09r", week:"W09", date:"04/09", format:"Reels",          pilar:"Tecnologia e IA", hook:"Três casos onde IA reduziu custo operacional real: o que funcionou e por quê" },
  { id:"vw10c", week:"W10", date:"07/09", format:"Carrossel",      pilar:"Estratégia",      hook:"Como construir uma empresa que funciona sem você: o roteiro dos 90 dias" },
  { id:"vw10r", week:"W10", date:"11/09", format:"Reels",          pilar:"Cultura",         hook:"Quando o clima do dia depende do humor de quem lidera, o time aprende a esperar antes de agir" },
];

const PLAN_TOTAL = ALL_POSTS.length;

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ── helpers de estilo inline ──────────────────────────────────────────────────
const mono = { fontFamily: "'DM Mono', monospace" };
const serif = { fontFamily: "'Playfair Display', serif" };
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" };

const eyebrow = {
  ...mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
  color: T.gold, marginBottom: 6,
};
const badge = (color = T.indigo) => ({
  ...mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
  padding: "3px 9px", borderRadius: 20,
  background: color + "18", color, border: `0.5px solid ${color}44`,
  display: "inline-block",
});
const pill = (active) => ({
  ...mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
  padding: "4px 13px", borderRadius: 20, cursor: "pointer",
  background: active ? T.gold : "transparent",
  color: active ? "#fff" : T.muted,
  border: `0.5px solid ${active ? T.gold : T.borderStrong}`,
  transition: "all 0.15s",
});
const card = (extra = {}) => ({
  background: "#fff", border: `0.5px solid ${T.border}`,
  borderRadius: 10, ...extra,
});

// ── componente principal ──────────────────────────────────────────────────────
export default function ViniMarketing() {
  const [filter,       setFilter]       = useState("Todos");
  const [expanded,     setExpanded]     = useState(null);
  const [localContent, setLocalContent] = useState({});
  const [copied,       setCopied]       = useState(null);

  const [published,   setPublished]   = useState(() => new Set(loadLS("vini-published", [])));
  const [generated,   setGenerated]   = useState(() => new Set(loadLS("vini-generated", [])));
  const [postContent, setPostContent] = useState(() => loadLS("vini-post-content", {}));

  const togglePublished = (id) => {
    setPublished(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      saveLS("vini-published", [...next]);
      return next;
    });
  };

  const onGenerate = (post, rawContent = null) => {
    openPostInNewTab(post, rawContent);
    setGenerated(prev => {
      if (prev.has(post.id)) return prev;
      const next = new Set(prev);
      next.add(post.id);
      saveLS("vini-generated", [...next]);
      return next;
    });
  };

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
      saveLS("vini-post-content", updated);
    }
    onGenerate(post, raw.trim() || null);
  };

  const planDone = ALL_POSTS.filter(p => published.has(p.id)).length;
  const planPct  = Math.round((planDone / PLAN_TOTAL) * 100);
  const visible  = ALL_POSTS.filter(p => filter === "Todos" || p.format === filter);
  const weeks    = [...new Set(visible.map(p => p.week))];

  return (
    <div style={{ ...sans, color: T.ink }}>

      {/* ── Barra de progresso ────────────────────────────────────────── */}
      <div style={{ ...card({ padding: "1.5rem 2rem", marginBottom: "2rem", borderLeft: `3px solid ${T.gold}` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={eyebrow}>Plano Ativo</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: T.ink, marginBottom: 3 }}>
              10 semanas · 1 Carrossel + 1 Reels por semana
            </div>
            <div style={{ fontSize: 12, color: T.muted }}>
              6 Jul – 11 Set · 75% Processos/Estratégia/IA · 25% Liderança/Cultura
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ ...serif, fontSize: 40, fontWeight: 700, color: T.gold, lineHeight: 1 }}>{planPct}%</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>{planDone}/{PLAN_TOTAL} publicados</div>
          </div>
        </div>
        {/* barra */}
        <div style={{ height: 2, borderRadius: 1, background: T.border, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(planPct, 100)}%`, background: T.gold, borderRadius: 1, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* ── Filtro de formato ─────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginBottom: "1.75rem" }}>
        <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.muted, marginRight: 6 }}>Formato</span>
        {FORMATS.map(fmt => (
          <button key={fmt} style={pill(filter === fmt)} onClick={() => setFilter(fmt)}>{fmt}</button>
        ))}
        <span style={{ marginLeft: "auto", ...mono, fontSize: 10, color: T.muted }}>
          {visible.length} posts · {visible.filter(p => published.has(p.id)).length} publicados · {visible.filter(p => generated.has(p.id)).length} gerados
        </span>
      </div>

      {/* ── Grade de posts ────────────────────────────────────────────── */}
      {weeks.map(wk => {
        const wkPosts = visible.filter(p => p.week === wk);
        return (
          <div key={wk} style={{ marginBottom: "2rem" }}>
            {/* Cabeçalho da semana */}
            <div style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: T.muted, marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: `0.5px solid ${T.border}` }}>
              — {wk}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 12 }}>
              {wkPosts.map(post => {
                const isPub  = published.has(post.id);
                const isGen  = generated.has(post.id);
                const isExp  = expanded === post.id;
                const color  = FORMAT_COLOR[post.format] || T.gold;
                const saved  = postContent[post.id] || "";
                const current     = localContent[post.id] ?? saved;
                const hasContent  = current.trim().length > 0;

                return (
                  <div key={post.id} style={card({
                    borderLeft: `3px solid ${isPub ? T.gold : color}`,
                    transition: "box-shadow 0.15s",
                    overflow: "hidden",
                  })}>

                    {/* Área clicável */}
                    <div onClick={() => setExpanded(isExp ? null : post.id)}
                      style={{ padding: "1.1rem 1.25rem", cursor: "pointer" }}>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ ...mono, fontSize: 10, color: T.muted }}>{post.date}</span>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={badge(color)}>{post.format}</span>
                          <button
                            onClick={e => { e.stopPropagation(); togglePublished(post.id); }}
                            style={{
                              ...mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
                              padding: "3px 9px", borderRadius: 20, cursor: "pointer",
                              background: isPub ? T.gold + "18" : "transparent",
                              color: isPub ? T.gold : T.muted,
                              border: `0.5px solid ${isPub ? T.gold + "66" : T.border}`,
                              transition: "all 0.15s",
                            }}>
                            {isPub ? "✓ Pub" : "Publicar"}
                          </button>
                        </div>
                      </div>

                      <div style={{ ...mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.gold, marginBottom: 6 }}>
                        {post.pilar}
                      </div>

                      <div style={{ ...serif, fontSize: 14, fontStyle: "italic", color: T.ink, lineHeight: 1.55, marginBottom: 10 }}>
                        "{post.hook}"
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: `0.5px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: isGen ? T.teal : T.border, border: `1px solid ${isGen ? T.teal : T.borderStrong}` }} />
                          <span style={{ ...mono, fontSize: 9, letterSpacing: "0.08em", color: isGen ? T.teal : T.muted }}>
                            {isGen ? "Gerado" : "Não gerado"}
                          </span>
                          {hasContent && !isGen && (
                            <span style={{ ...mono, fontSize: 9, color: T.gold, marginLeft: 4 }}>· rascunho salvo</span>
                          )}
                        </div>
                        <span style={{ fontSize: 10, color: T.muted }}>{isExp ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Painel expandido */}
                    {isExp && (
                      <div onClick={e => e.stopPropagation()}
                        style={{ borderTop: `0.5px solid ${T.border}`, background: T.cream, padding: "1rem 1.25rem" }}>

                        {/* Copiar prompt */}
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                          <button
                            onClick={() => handleCopyPrompt(post)}
                            style={{
                              ...mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                              padding: "6px 16px", borderRadius: 20, cursor: "pointer",
                              background: copied === post.id ? T.gold : "transparent",
                              color: copied === post.id ? "#fff" : T.gold,
                              border: `0.5px solid ${T.gold}`,
                              transition: "all 0.15s",
                            }}>
                            {copied === post.id ? "✓ Copiado!" : "Copiar Prompt"}
                          </button>
                          <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.4 }}>
                            Cole no Claude → copie o HTML → cole abaixo
                          </span>
                        </div>

                        {/* Textarea HTML */}
                        <textarea
                          value={current}
                          onChange={e => setLocalContent(lc => ({ ...lc, [post.id]: e.target.value }))}
                          placeholder={"Cole aqui o HTML retornado pelo Claude:\n\n<!DOCTYPE html>\n<html lang=\"pt-BR\">\n..."}
                          rows={5}
                          style={{
                            ...mono, fontSize: 11, resize: "vertical", lineHeight: 1.55,
                            width: "100%", padding: "10px 12px", marginBottom: 10,
                            background: "#fff", border: `0.5px solid ${T.borderStrong}`,
                            borderRadius: 6, color: T.ink, outline: "none",
                          }}
                        />

                        {/* Gerar */}
                        <button
                          onClick={() => handleGenerate(post)}
                          style={{
                            ...mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                            padding: "7px 18px", borderRadius: 20, cursor: "pointer",
                            background: T.ink, color: T.paper, border: "none",
                            transition: "opacity 0.15s",
                          }}>
                          {isGen ? "Re-gerar Post HTML" : "Gerar Post HTML"}
                        </button>
                        {!hasContent && (
                          <span style={{ ...mono, fontSize: 10, color: T.muted, marginLeft: 10 }}>
                            sem conteúdo — gera template base
                          </span>
                        )}
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
        <div style={card({ padding: "2.5rem", textAlign: "center" })}>
          <div style={{ fontSize: 13, color: T.muted }}>Nenhum post para o filtro selecionado.</div>
        </div>
      )}
    </div>
  );
}
