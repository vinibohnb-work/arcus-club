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
};

// ── mapeamento de formato → papel no arco ─────────────────────────────────────
// Cada semana é um mini-arco de autoridade:
//   Estático  (seg) → provoca uma crença           = Opinião
//   Reels     (qua) → mostra como você resolve isso = Execução
//   Carrossel (sex) → prova que funciona            = Prova
const ARC_ROLE = {
  "Estático": { label: "Opinião",  color: T.teal   },
  "Reels":    { label: "Execução", color: T.violet  },
  "Carrossel":{ label: "Prova",    color: T.indigo  },
};

const FORMAT_COLOR = {
  "Estático":  T.teal,
  "Reels":     T.violet,
  "Carrossel": T.indigo,
};

const FORMATS = ["Todos", "Estático", "Reels", "Carrossel"];

// ── Temas dos arcos semanais ──────────────────────────────────────────────────
const WEEK_THEMES = {
  W01: "Processo invisível que drena margem",
  W02: "IA como amplificador, não substituto",
  W03: "Automação: o que fazer primeiro",
  W04: "Decisão e autonomia do time",
  W05: "Processo documentado como ativo",
  W06: "Profissional liberal: escalar sem perder qualidade",
  W07: "Crescimento além da estrutura",
  W08: "IA na gestão de PMEs",
  W09: "Retrabalho e custo invisível",
  W10: "Indicadores que PMEs ignoram",
  W11: "Empresa que funciona sem você",
  W12: "Da execução para a gestão estratégica",
};

// ── Plano: 12 semanas · 36 posts · Mai–Ago ───────────────────────────────────
// Ordem dentro de cada semana: Estático (seg) → Reels (qua) → Carrossel (sex)
const ALL_POSTS = [

  // W01 — Processo invisível que drena margem
  { id:"vw01e", week:"W01", date:"18/05", format:"Estático",  pilar:"Processos",
    hook:"A maioria das PMEs perde margem em processos que nunca aparecem no DRE" },
  { id:"vw01r", week:"W01", date:"20/05", format:"Reels",     pilar:"Processos",
    hook:"Como mapear em 3 passos os processos que mais consomem margem na sua operação" },
  { id:"vw01c", week:"W01", date:"22/05", format:"Carrossel", pilar:"Processos",
    hook:"Os 5 processos invisíveis que mais drenam margem em empresas de até 30 funcionários" },

  // W02 — IA como amplificador, não substituto
  { id:"vw02e", week:"W02", date:"25/05", format:"Estático",  pilar:"Tecnologia e IA",
    hook:"IA não resolve processo ruim — só faz o processo ruim mais rápido" },
  { id:"vw02r", week:"W02", date:"27/05", format:"Reels",     pilar:"Tecnologia e IA",
    hook:"A sequência que a maioria pula antes de implementar IA: mapear, medir, simplificar" },
  { id:"vw02c", week:"W02", date:"29/05", format:"Carrossel", pilar:"Tecnologia e IA",
    hook:"3 formas que PMEs estão usando IA hoje para ganhar capacidade sem contratar" },

  // W03 — Automação: o que fazer primeiro
  { id:"vw03e", week:"W03", date:"01/06", format:"Estático",  pilar:"Tecnologia e IA",
    hook:"Automação sem critério é o novo retrabalho — só que mais caro" },
  { id:"vw03r", week:"W03", date:"03/06", format:"Reels",     pilar:"Tecnologia e IA",
    hook:"Como decidir o que automatizar primeiro: a matriz de priorização para PMEs" },
  { id:"vw03c", week:"W03", date:"05/06", format:"Carrossel", pilar:"Processos",
    hook:"Antes e depois: 3 automações simples que liberaram mais de 10h/semana em cada empresa" },

  // W04 — Decisão e autonomia do time
  { id:"vw04e", week:"W04", date:"08/06", format:"Estático",  pilar:"Liderança",
    hook:"O dono que precisa aprovar tudo não tem empresa — tem um emprego com mais responsabilidade" },
  { id:"vw04r", week:"W04", date:"10/06", format:"Reels",     pilar:"Liderança",
    hook:"Como criar autonomia de decisão no time em 4 semanas sem abrir mão do controle" },
  { id:"vw04c", week:"W04", date:"12/06", format:"Carrossel", pilar:"Liderança",
    hook:"O antes e depois de uma PME que parou de ter o dono como gargalo das decisões" },

  // W05 — Processo documentado como ativo
  { id:"vw05e", week:"W05", date:"15/06", format:"Estático",  pilar:"Processos",
    hook:"Processo que existe só na cabeça de alguém não é processo — é risco de negócio" },
  { id:"vw05r", week:"W05", date:"17/06", format:"Reels",     pilar:"Processos",
    hook:"Como documentar qualquer processo em menos de 45 minutos sem consultor" },
  { id:"vw05c", week:"W05", date:"19/06", format:"Carrossel", pilar:"Processos",
    hook:"Quanto custa para uma PME não ter processos documentados: o cálculo real" },

  // W06 — Profissional liberal: escalar sem perder qualidade
  { id:"vw06e", week:"W06", date:"22/06", format:"Estático",  pilar:"Estratégia",
    hook:"Profissional liberal que não escala a entrega está trocando tempo por dinheiro para sempre" },
  { id:"vw06r", week:"W06", date:"24/06", format:"Reels",     pilar:"Estratégia",
    hook:"O modelo de entrega que permite ao profissional liberal atender mais sem trabalhar mais horas" },
  { id:"vw06c", week:"W06", date:"26/06", format:"Carrossel", pilar:"Processos",
    hook:"As 4 decisões operacionais que separam o profissional que cresce do que apenas trabalha mais" },

  // W07 — Crescimento além da estrutura
  { id:"vw07e", week:"W07", date:"29/06", format:"Estático",  pilar:"Estratégia",
    hook:"Crescer sem estrutura não é escala — é faturamento que cria complexidade que você não consegue gerir" },
  { id:"vw07r", week:"W07", date:"01/07", format:"Reels",     pilar:"Estratégia",
    hook:"Os 3 sinais de que sua empresa já cresceu além da estrutura que a sustenta" },
  { id:"vw07c", week:"W07", date:"03/07", format:"Carrossel", pilar:"Estratégia",
    hook:"Como construir a estrutura operacional que permite escalar: o modelo em 4 camadas" },

  // W08 — IA na gestão de PMEs
  { id:"vw08e", week:"W08", date:"06/07", format:"Estático",  pilar:"Tecnologia e IA",
    hook:"PME que usa IA só para economizar tempo ainda não descobriu o principal benefício: clareza de gestão" },
  { id:"vw08r", week:"W08", date:"08/07", format:"Reels",     pilar:"Tecnologia e IA",
    hook:"5 aplicações de IA que qualquer PME pode implementar hoje sem equipe de tecnologia" },
  { id:"vw08c", week:"W08", date:"10/07", format:"Carrossel", pilar:"Tecnologia e IA",
    hook:"Antes e depois: como 3 PMEs usaram IA para melhorar a gestão operacional real" },

  // W09 — Retrabalho e custo invisível
  { id:"vw09e", week:"W09", date:"13/07", format:"Estático",  pilar:"Processos",
    hook:"Retrabalho não é problema de disciplina — é sintoma de processo com design errado" },
  { id:"vw09r", week:"W09", date:"15/07", format:"Reels",     pilar:"Processos",
    hook:"Como calcular o custo real do retrabalho na sua operação em menos de 30 minutos" },
  { id:"vw09c", week:"W09", date:"17/07", format:"Carrossel", pilar:"Processos",
    hook:"O índice de retrabalho: o que ele revela sobre a eficiência real de uma PME" },

  // W10 — Indicadores que PMEs ignoram
  { id:"vw10e", week:"W10", date:"20/07", format:"Estático",  pilar:"Estratégia",
    hook:"O empresário que só olha faturamento está pilotando às cegas — margem é o painel real" },
  { id:"vw10r", week:"W10", date:"22/07", format:"Reels",     pilar:"Estratégia",
    hook:"Os 5 indicadores que toda PME deveria acompanhar semanalmente — e quase nenhuma acompanha" },
  { id:"vw10c", week:"W10", date:"24/07", format:"Carrossel", pilar:"Estratégia",
    hook:"Como montar um painel de gestão simples que qualquer PME consegue manter vivo" },

  // W11 — Empresa que funciona sem você
  { id:"vw11e", week:"W11", date:"27/07", format:"Estático",  pilar:"Estratégia",
    hook:"Uma empresa que para quando o dono para não é um negócio — é um emprego com CNPJ" },
  { id:"vw11r", week:"W11", date:"29/07", format:"Reels",     pilar:"Estratégia",
    hook:"O roteiro dos 90 dias para construir autonomia operacional do zero" },
  { id:"vw11c", week:"W11", date:"31/07", format:"Carrossel", pilar:"Liderança",
    hook:"Os 4 sistemas que precisam estar no lugar para a empresa funcionar sem o dono" },

  // W12 — Da execução para a gestão estratégica
  { id:"vw12e", week:"W12", date:"03/08", format:"Estático",  pilar:"Estratégia",
    hook:"Gestor que ainda executa junto com o time está atrasando o crescimento — o dele e o da empresa" },
  { id:"vw12r", week:"W12", date:"05/08", format:"Reels",     pilar:"Estratégia",
    hook:"Como fazer a transição de executor para gestor estratégico sem perder o controle da operação" },
  { id:"vw12c", week:"W12", date:"07/08", format:"Carrossel", pilar:"Estratégia",
    hook:"O modelo de gestão que permite ao dono de PME trabalhar na empresa, não dentro dela" },
];

const PLAN_TOTAL = ALL_POSTS.length; // 36

// ── localStorage helpers ──────────────────────────────────────────────────────
function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "null") ?? fallback; }
  catch { return fallback; }
}
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

// ── helpers de estilo inline ──────────────────────────────────────────────────
const mono  = { fontFamily: "'DM Mono', monospace" };
const serif = { fontFamily: "'Playfair Display', serif" };
const sans  = { fontFamily: "'DM Sans', system-ui, sans-serif" };

const eyebrow = {
  ...mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
  color: T.gold, marginBottom: 6,
};
const fmtBadge = (color) => ({
  ...mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
  padding: "3px 9px", borderRadius: 20,
  background: color + "18", color, border: `0.5px solid ${color}44`,
  display: "inline-block",
});
const arcBadge = (color) => ({
  ...mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
  padding: "2px 8px", borderRadius: 4,
  background: color + "12", color, border: `0.5px solid ${color}33`,
  display: "inline-block",
});
const pill = (active) => ({
  ...mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
  padding: "4px 13px", borderRadius: 20, cursor: "pointer",
  background: active ? T.ink : "transparent",
  color: active ? T.paper : T.muted,
  border: `0.5px solid ${active ? T.ink : T.borderStrong}`,
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

      {/* ── Legenda do arco ────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: "1.5rem",
                    padding: "0.75rem 1.25rem", borderRadius: 8,
                    background: T.ink, flexWrap: "wrap" }}>
        <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                       color: T.goldLight, marginRight: 4 }}>Mini-arco de autoridade</span>
        {Object.entries(ARC_ROLE).map(([fmt, { label, color }], i) => (
          <span key={fmt} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>→</span>}
            <span style={{ ...mono, fontSize: 9, letterSpacing: "0.08em",
                           padding: "3px 9px", borderRadius: 4,
                           background: color + "22", color, border: `0.5px solid ${color}55` }}>
              {fmt} = {label}
            </span>
          </span>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(245,242,236,0.4)" }}>
          Seg → Qua → Sex
        </span>
      </div>

      {/* ── Barra de progresso ─────────────────────────────────────────── */}
      <div style={{ ...card({ padding: "1.5rem 2rem", marginBottom: "1.75rem",
                              borderLeft: `3px solid ${T.gold}` }) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={eyebrow}>Plano Ativo</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: T.ink, marginBottom: 3 }}>
              12 semanas · 3 posts/semana · Estático → Reels → Carrossel
            </div>
            <div style={{ fontSize: 12, color: T.muted }}>
              18 Mai – 7 Ago · PMEs e profissionais liberais · 80% Processos/Estratégia/IA · 20% Liderança/Cultura
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ ...serif, fontSize: 40, fontWeight: 700, color: T.gold, lineHeight: 1 }}>
              {planPct}%
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
              {planDone}/{PLAN_TOTAL} publicados
            </div>
          </div>
        </div>
        <div style={{ height: 2, borderRadius: 1, background: T.border, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(planPct, 100)}%`, background: T.gold,
                        borderRadius: 1, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* ── Filtro de formato ──────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center",
                    marginBottom: "1.75rem" }}>
        <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
                       color: T.muted, marginRight: 6 }}>Formato</span>
        {FORMATS.map(fmt => (
          <button key={fmt} style={pill(filter === fmt)} onClick={() => setFilter(fmt)}>{fmt}</button>
        ))}
        <span style={{ marginLeft: "auto", ...mono, fontSize: 10, color: T.muted }}>
          {visible.length} posts · {visible.filter(p => published.has(p.id)).length} pub · {visible.filter(p => generated.has(p.id)).length} gerados
        </span>
      </div>

      {/* ── Grade de posts, agrupada por semana ────────────────────────── */}
      {weeks.map(wk => {
        const wkPosts   = visible.filter(p => p.week === wk);
        const wkTheme   = WEEK_THEMES[wk] || wk;
        const wkDone    = wkPosts.filter(p => published.has(p.id)).length;
        const allWkPubs = ALL_POSTS.filter(p => p.week === wk);
        const arcComplete = allWkPubs.every(p => published.has(p.id));

        return (
          <div key={wk} style={{ marginBottom: "2.5rem" }}>

            {/* Cabeçalho da semana */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: "0.9rem",
                          paddingBottom: "0.6rem", borderBottom: `0.5px solid ${T.border}` }}>
              <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em",
                             textTransform: "uppercase", color: T.muted, flexShrink: 0 }}>
                {wk}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{wkTheme}</span>
              {arcComplete && (
                <span style={{ marginLeft: "auto", ...mono, fontSize: 9, letterSpacing: "0.08em",
                               color: T.teal, flexShrink: 0 }}>✓ arco completo</span>
              )}
              {!arcComplete && wkDone > 0 && (
                <span style={{ marginLeft: "auto", ...mono, fontSize: 9, letterSpacing: "0.08em",
                               color: T.gold, flexShrink: 0 }}>{wkDone}/{allWkPubs.length} publicados</span>
              )}
            </div>

            {/* Cards do arco — 3 colunas quando possível */}
            <div style={{ display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                          gap: 10 }}>
              {wkPosts.map(post => {
                const isPub      = published.has(post.id);
                const isGen      = generated.has(post.id);
                const isExp      = expanded === post.id;
                const fmtColor   = FORMAT_COLOR[post.format] || T.gold;
                const arc        = ARC_ROLE[post.format];
                const saved      = postContent[post.id] || "";
                const current    = localContent[post.id] ?? saved;
                const hasContent = current.trim().length > 0;

                return (
                  <div key={post.id} style={card({
                    borderTop: `2px solid ${isPub ? T.gold : fmtColor}`,
                    overflow: "hidden",
                    transition: "box-shadow 0.15s",
                  })}>

                    {/* Cabeçalho do card — papel no arco */}
                    <div style={{ padding: "0.55rem 1rem",
                                  background: (isPub ? T.gold : fmtColor) + "0A",
                                  borderBottom: `0.5px solid ${T.border}`,
                                  display: "flex", justifyContent: "space-between",
                                  alignItems: "center" }}>
                      {arc && (
                        <span style={arcBadge(arc.color)}>{arc.label}</span>
                      )}
                      <span style={{ ...mono, fontSize: 10, color: T.muted }}>{post.date}</span>
                    </div>

                    {/* Corpo clicável */}
                    <div onClick={() => setExpanded(isExp ? null : post.id)}
                      style={{ padding: "0.9rem 1rem", cursor: "pointer" }}>

                      <div style={{ display: "flex", justifyContent: "space-between",
                                    alignItems: "center", marginBottom: 7 }}>
                        <span style={fmtBadge(fmtColor)}>{post.format}</span>
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

                      <div style={{ ...mono, fontSize: 9, letterSpacing: "0.12em",
                                    textTransform: "uppercase", color: T.gold, marginBottom: 6 }}>
                        {post.pilar}
                      </div>

                      <div style={{ ...serif, fontSize: 13.5, fontStyle: "italic",
                                    color: T.ink, lineHeight: 1.55, marginBottom: 10 }}>
                        "{post.hook}"
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between",
                                    alignItems: "center", paddingTop: 7,
                                    borderTop: `0.5px solid ${T.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%",
                                        background: isGen ? T.teal : T.border,
                                        border: `1px solid ${isGen ? T.teal : T.borderStrong}` }} />
                          <span style={{ ...mono, fontSize: 9, letterSpacing: "0.08em",
                                         color: isGen ? T.teal : T.muted }}>
                            {isGen ? "Gerado" : "Não gerado"}
                          </span>
                          {hasContent && !isGen && (
                            <span style={{ ...mono, fontSize: 9, color: T.gold, marginLeft: 4 }}>
                              · rascunho
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 10, color: T.muted }}>{isExp ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Painel expandido */}
                    {isExp && (
                      <div onClick={e => e.stopPropagation()}
                        style={{ borderTop: `0.5px solid ${T.border}`,
                                 background: T.cream, padding: "0.9rem 1rem" }}>

                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                          <button
                            onClick={() => handleCopyPrompt(post)}
                            style={{
                              ...mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                              padding: "6px 14px", borderRadius: 20, cursor: "pointer",
                              background: copied === post.id ? T.gold : "transparent",
                              color: copied === post.id ? "#fff" : T.gold,
                              border: `0.5px solid ${T.gold}`,
                              transition: "all 0.15s",
                            }}>
                            {copied === post.id ? "✓ Copiado!" : "Copiar Prompt"}
                          </button>
                          <span style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>
                            Cole no Claude → copie o HTML → cole abaixo
                          </span>
                        </div>

                        <textarea
                          value={current}
                          onChange={e => setLocalContent(lc => ({ ...lc, [post.id]: e.target.value }))}
                          placeholder={"Cole aqui o HTML retornado pelo Claude:\n\n<!DOCTYPE html>\n<html lang=\"pt-BR\">\n..."}
                          rows={4}
                          style={{
                            ...mono, fontSize: 11, resize: "vertical", lineHeight: 1.55,
                            width: "100%", padding: "9px 11px", marginBottom: 9,
                            background: "#fff", border: `0.5px solid ${T.borderStrong}`,
                            borderRadius: 6, color: T.ink, outline: "none",
                          }}
                        />

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            onClick={() => handleGenerate(post)}
                            style={{
                              ...mono, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase",
                              padding: "7px 16px", borderRadius: 20, cursor: "pointer",
                              background: T.ink, color: T.paper, border: "none",
                              transition: "opacity 0.15s",
                            }}>
                            {isGen ? "Re-gerar Post" : "Gerar Post HTML"}
                          </button>
                          {!hasContent && (
                            <span style={{ ...mono, fontSize: 9, color: T.muted }}>
                              sem conteúdo — gera template base
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
        <div style={card({ padding: "2.5rem", textAlign: "center" })}>
          <div style={{ fontSize: 13, color: T.muted }}>Nenhum post para o filtro selecionado.</div>
        </div>
      )}
    </div>
  );
}
