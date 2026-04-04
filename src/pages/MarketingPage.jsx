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

const PHASE_META = {
  1: { name: "Fundação de Identidade",  period: "6 Abr – 3 Mai",  total: 12 },
  2: { name: "Aprofundamento e Prova",  period: "4 Mai – 31 Mai", total: 16 },
  3: { name: "Conversão Suave",         period: "1 Jun – 4 Jul",  total: 20 },
};

const ALL_POSTS = [
  { id:"p1",  phase:1, week:"S01", date:"06/04", format:"Carrossel",   pilar:"Liderança",                   hook:"O líder que resolve tudo é o mesmo que impede o crescimento" },
  { id:"p2",  phase:1, week:"S01", date:"08/04", format:"Estático",    pilar:"Cultura Organizacional",      hook:"Cultura não é o que está no mural — é o que você tolera quando ninguém está olhando" },
  { id:"p3",  phase:1, week:"S01", date:"10/04", format:"Reels",       pilar:"Processos e Sistemas",        hook:"Seu processo não trava o time — ele revela quem não deveria estar ali" },
  { id:"p4",  phase:1, week:"S02", date:"13/04", format:"Carrossel",   pilar:"Gestão de Times",             hook:"Você não tem problema de performance. Tem problema de covardia nas conversas" },
  { id:"p5",  phase:1, week:"S02", date:"15/04", format:"Estático",    pilar:"Mentalidade do Empreendedor", hook:"Você não está exausto pelo trabalho — está exausto pelas decisões que evita" },
  { id:"p6",  phase:1, week:"S02", date:"17/04", format:"Reels",       pilar:"Liderança",                   hook:"Feedback não é presente. É dívida que você paga ou acumula juros" },
  { id:"p7",  phase:1, week:"S03", date:"20/04", format:"Carrossel",   pilar:"Processos e Sistemas",        hook:"Reunião de alinhamento é sintoma de empresa desalinhada" },
  { id:"p8",  phase:1, week:"S03", date:"22/04", format:"Estático",    pilar:"Visão e Estratégia",          hook:"Sua estratégia não falhou na execução — falhou no dia que você não disse não" },
  { id:"p9",  phase:1, week:"S03", date:"24/04", format:"Reels",       pilar:"Cultura Organizacional",      hook:"Toda empresa tem duas culturas: a declarada e a praticada" },
  { id:"p10", phase:1, week:"S04", date:"27/04", format:"Carrossel",   pilar:"Tomada de Decisão",           hook:"A decisão que você adia todo dia está tomando decisões por você" },
  { id:"p11", phase:1, week:"S04", date:"29/04", format:"Estático",    pilar:"Comunicação Interna",         hook:"Clareza não é dom de comunicação. É uma escolha de liderança" },
  { id:"p12", phase:1, week:"S04", date:"01/05", format:"Reels",       pilar:"Gestão de Times",             hook:"Time medíocre não precisa de treinamento. Precisa de um líder que pare de protegê-lo" },
  { id:"p13", phase:2, week:"S05", date:"04/05", format:"Carrossel",   pilar:"Liderança",                   hook:"O fundador insubstituível construiu uma prisão, não uma empresa" },
  { id:"p14", phase:2, week:"S05", date:"06/05", format:"Estático",    pilar:"Processos e Sistemas",        hook:"Processo não é burocracia. É o que sobra quando você não está lá" },
  { id:"p15", phase:2, week:"S05", date:"08/05", format:"Reels",       pilar:"Cultura Organizacional",      hook:"Contratou pela competência. Demitiu pelo comportamento. O problema era a cultura" },
  { id:"p16", phase:2, week:"S05", date:"09/05", format:"Bastidor",    pilar:"Arcus Club",                  hook:"Bastidor de encontro ou insight do programa — humanize o perfil" },
  { id:"p17", phase:2, week:"S06", date:"11/05", format:"Carrossel",   pilar:"Mentalidade do Empreendedor", hook:"O empreendedor que não delega não tem empresa. Tem um emprego caro" },
  { id:"p18", phase:2, week:"S06", date:"13/05", format:"Estático",    pilar:"Gestão de Times",             hook:"A demissão que você adiou 6 meses custou mais do que a que fez em 6 dias" },
  { id:"p19", phase:2, week:"S06", date:"15/05", format:"Reels",       pilar:"Visão e Estratégia",          hook:"Crescimento sem estrutura não é expansão — é aceleração do caos" },
  { id:"p20", phase:2, week:"S06", date:"16/05", format:"Bastidor",    pilar:"Prova Social",                hook:"Resultado de membro ou insight de reunião interna do Arcus Club" },
  { id:"p21", phase:2, week:"S07", date:"18/05", format:"Carrossel",   pilar:"Comunicação Interna",         hook:"Seu time não entende a estratégia porque você nunca a traduziu em comportamentos" },
  { id:"p22", phase:2, week:"S07", date:"20/05", format:"Estático",    pilar:"Tomada de Decisão",           hook:"Velocidade de decisão é vantagem competitiva. Comitê é diluição de responsabilidade" },
  { id:"p23", phase:2, week:"S07", date:"22/05", format:"Reels",       pilar:"Liderança",                   hook:"Líder que precisa de controle tem problema de confiança — e confiança é processo seletivo" },
  { id:"p24", phase:2, week:"S07", date:"23/05", format:"Bastidor",    pilar:"Evento / Encontro",           hook:"Foto ou registro de evento, encontro ou visita relevante" },
  { id:"p25", phase:2, week:"S08", date:"25/05", format:"Carrossel",   pilar:"Cultura Organizacional",      hook:"Os valores que você lista no site não são sua cultura. Os comportamentos que você recompensa são" },
  { id:"p26", phase:2, week:"S08", date:"27/05", format:"Estático",    pilar:"Processos e Sistemas",        hook:"Toda empresa caótica tem um líder que acha que processo mata criatividade" },
  { id:"p27", phase:2, week:"S08", date:"29/05", format:"Reels",       pilar:"Mentalidade do Empreendedor", hook:"O problema não é falta de ideia. É excesso de início e escassez de conclusão" },
  { id:"p28", phase:2, week:"S08", date:"30/05", format:"Bastidor",    pilar:"Bastidor Pessoal",            hook:"Insight de leitura, conversa ou decisão relevante da semana" },
  { id:"p29", phase:3, week:"S09", date:"01/06", format:"Carrossel",   pilar:"Liderança",                   hook:"3 sinais de que sua empresa cresceu além da sua estrutura atual" },
  { id:"p30", phase:3, week:"S09", date:"03/06", format:"Estático",    pilar:"Cultura Organizacional",      hook:"A diferença entre empresa que escala e empresa que implode é uma: cultura escrita ou oral" },
  { id:"p31", phase:3, week:"S09", date:"05/06", format:"Reels",       pilar:"Processos e Sistemas",        hook:"Dono que apaga incêndio todo dia construiu a empresa errada — ou não construiu sistema nenhum" },
  { id:"p32", phase:3, week:"S09", date:"06/06", format:"Arcus Club",  pilar:"CTA Suave",                   hook:"O que acontece dentro do programa e para quem ele é — sem forçar venda" },
  { id:"p33", phase:3, week:"S10", date:"08/06", format:"Carrossel",   pilar:"Gestão de Times",             hook:"Como identificar se seu time está crescendo junto com a empresa ou ficando para trás" },
  { id:"p34", phase:3, week:"S10", date:"10/06", format:"Estático",    pilar:"Mentalidade do Empreendedor", hook:"Empreendedor que não investe em estrutura aposta que o crescimento resolve o que ele criou" },
  { id:"p35", phase:3, week:"S10", date:"12/06", format:"Reels",       pilar:"Visão e Estratégia",          hook:"Planejamento que fica na gaveta não é planejamento. É procrastinação com PowerPoint" },
  { id:"p36", phase:3, week:"S10", date:"13/06", format:"Arcus Club",  pilar:"Bastidor do Programa",        hook:"Bastidor de encontro com CTA: 'se você se identificou, vem conversar'" },
  { id:"p37", phase:3, week:"S11", date:"15/06", format:"Carrossel",   pilar:"Comunicação Interna",         hook:"Por que seu time faz o mínimo — e como mudar isso sem dar aumento" },
  { id:"p38", phase:3, week:"S11", date:"17/06", format:"Estático",    pilar:"Liderança",                   hook:"Autonomia sem estrutura não empodera. Confunde" },
  { id:"p39", phase:3, week:"S11", date:"19/06", format:"Reels",       pilar:"Cultura Organizacional",      hook:"Empresa que depende do humor do dono para funcionar não tem cultura. Tem sequestro emocional" },
  { id:"p40", phase:3, week:"S11", date:"20/06", format:"Arcus Club",  pilar:"Prova Social",                hook:"Resultado de membro com CTA suave sobre o programa" },
  { id:"p41", phase:3, week:"S12", date:"22/06", format:"Carrossel",   pilar:"Processos e Sistemas",        hook:"O checklist que seu time ignora não é problema de disciplina — é problema de design" },
  { id:"p42", phase:3, week:"S12", date:"24/06", format:"Estático",    pilar:"Tomada de Decisão",           hook:"Decisão boa tomada tarde é pior do que decisão boa tomada na hora certa" },
  { id:"p43", phase:3, week:"S12", date:"26/06", format:"Reels",       pilar:"Gestão de Times",             hook:"Time que só age quando o dono está presente não tem liderança. Tem supervisão" },
  { id:"p44", phase:3, week:"S12", date:"27/06", format:"Arcus Club",  pilar:"CTA Direto",                  hook:"O que é o programa, para quem é, como entrar — mais direto" },
  { id:"p45", phase:3, week:"S13", date:"29/06", format:"Carrossel",   pilar:"Visão e Estratégia",          hook:"Como construir uma empresa que funciona sem você — o roteiro dos 90 dias" },
  { id:"p46", phase:3, week:"S13", date:"01/07", format:"Estático",    pilar:"Mentalidade do Empreendedor", hook:"Não é falta de tempo. É falta de sistema para proteger o seu" },
  { id:"p47", phase:3, week:"S13", date:"03/07", format:"Reels",       pilar:"Liderança",                   hook:"O maior erro que empreendedores estruturados cometem quando sobem de patamar" },
  { id:"p48", phase:3, week:"S13", date:"04/07", format:"Arcus Club",  pilar:"Post de Encerramento",        hook:"Post de encerramento: o que é o Arcus Club, para quem é, como participar" },
];

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
  const [phase,        setPhase]        = useState(1);
  const [filter,       setFilter]       = useState("Todos");
  const [expanded,     setExpanded]     = useState(null);
  const [localContent, setLocalContent] = useState({});
  const [copied,       setCopied]       = useState(null);

  const phasePosts = ALL_POSTS.filter(p => p.phase === phase);
  const visible    = phasePosts.filter(p => filter === "Todos" || p.format === filter);
  const weeks      = [...new Set(visible.map(p => p.week))];
  const pubTotal   = ALL_POSTS.filter(p => published.has(p.id)).length;
  const genTotal   = ALL_POSTS.filter(p => generated.has(p.id)).length;

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
      {/* Seletor de fase */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {[1,2,3].map(ph => {
          const meta  = PHASE_META[ph];
          const posts = ALL_POSTS.filter(p => p.phase === ph);
          const done  = posts.filter(p => published.has(p.id)).length;
          const pct   = Math.round((done / meta.total) * 100);
          const active = phase === ph;
          return (
            <div key={ph} onClick={() => setPhase(ph)}
              style={s.card({ cursor: "pointer", borderTop: `2px solid ${active ? COLORS.accent : COLORS.border}`, opacity: active ? 1 : 0.6, transition: "all 0.15s" })}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Fase {ph}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{meta.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{meta.period}</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: FONT_DISPLAY, color: active ? COLORS.accent : COLORS.textMuted }}>{pct}%</div>
              </div>
              <ProgressBar value={pct} color={active ? COLORS.accent : COLORS.textMuted} />
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>{done}/{meta.total} publicados</div>
            </div>
          );
        })}
      </div>

      {/* Filtro de formato */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, letterSpacing: "0.14em", textTransform: "uppercase", marginRight: 4 }}>Formato</span>
        {FORMATS.map(fmt => <button key={fmt} style={s.pill(filter === fmt)} onClick={() => setFilter(fmt)}>{fmt}</button>)}
        <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>
          {visible.length} posts · {pubTotal} publicados · {genTotal} gerados
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
                            Cole no Claude → copie o JSON → cole abaixo
                          </span>
                        </div>

                        {/* Textarea para colar o JSON */}
                        <textarea
                          value={current}
                          onChange={e => setLocalContent(lc => ({ ...lc, [post.id]: e.target.value }))}
                          placeholder={'Cole aqui o JSON retornado pelo Claude:\n\n{\n  "slides": [...]\n}'}
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
