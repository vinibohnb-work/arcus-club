import { useState } from "react";

// ── mesmos tokens das outras abas ────────────────────────────────────────────
const COLORS = {
  bg: "#080808", surface: "#111111", card: "#161616", cardHover: "#1C1C1C",
  border: "#2A2A2A", borderLight: "#222222",
  accent: "#C9A84C", accentLight: "#E2C37A", accentDim: "#C9A84C33",
  violet: "#7B6FD4", teal: "#3DBFB0", red: "#E05252",
  text: "#F2EDE4", textMuted: "#8A8070", textDim: "#4A4440",
};
const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_UI     = `'Jost', 'DM Sans', sans-serif`;
const FONT_BODY   = `'Cormorant Garamond', 'Garamond', Georgia, serif`;

const FORMAT_COLOR = {
  Carrossel:    COLORS.violet,
  "Estático":   COLORS.teal,
  Reels:        "#A855F7",
  Bastidor:     "#F97316",
  "Arcus Club": COLORS.red,
};

const PHASE_META = {
  1: { name: "Fundação de Identidade",  period: "6 Abr – 3 Mai",  total: 12 },
  2: { name: "Aprofundamento e Prova",  period: "4 Mai – 31 Mai", total: 16 },
  3: { name: "Conversão Suave",         period: "1 Jun – 4 Jul",  total: 20 },
};

const ALL_POSTS = [
  // Fase 1
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
  // Fase 2
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
  // Fase 3
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

const FORMATS = ["Todos", "Carrossel", "Estático", "Reels", "Bastidor", "Arcus Club"];

// ── estilos inline alinhados ao padrão do app ────────────────────────────────
const s = {
  pageTitle: { fontSize: 34, fontFamily: FONT_DISPLAY, fontWeight: 700, fontStyle: "italic", color: COLORS.text, letterSpacing: "-0.01em", marginBottom: 6, lineHeight: 1.1 },
  pageSubtitle: { fontSize: 15, color: COLORS.textMuted, fontFamily: FONT_UI, letterSpacing: "0.04em" },
  sectionTitle: { fontSize: 13, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textMuted, marginBottom: 16, letterSpacing: "0.14em", textTransform: "uppercase" },
  card: (extra = {}) => ({ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 4, padding: 20, ...extra }),
  pill: (active, color = COLORS.accent) => ({ padding: "6px 16px", borderRadius: 2, fontSize: 12, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: active ? `${color}18` : "transparent", color: active ? color : COLORS.textMuted, border: `1px solid ${active ? color + "55" : COLORS.border}`, transition: "all 0.15s" }),
  badge: (color) => ({ display: "inline-block", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 500, fontFamily: FONT_UI, letterSpacing: "0.08em", background: `${color}18`, color, border: `1px solid ${color}33`, textTransform: "uppercase" }),
};

function Progress({ value, color = COLORS.accent }) {
  return (
    <div style={{ height: 2, borderRadius: 1, background: COLORS.borderLight || "#222", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 1, transition: "width 0.4s ease" }} />
    </div>
  );
}

export default function MarketingPage() {
  const [phase, setPhase] = useState(1);
  const [filter, setFilter] = useState("Todos");
  const [published, setPublished] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("arcus-published") || "[]")); }
    catch { return new Set(); }
  });

  const toggle = (id) => {
    setPublished(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("arcus-published", JSON.stringify([...next]));
      return next;
    });
  };

  const phasePosts = ALL_POSTS.filter(p => p.phase === phase);
  const visible = phasePosts.filter(p => filter === "Todos" || p.format === filter);
  const pubCount = ALL_POSTS.filter(p => published.has(p.id)).length;

  // Agrupa posts visíveis por semana
  const weeks = [...new Set(visible.map(p => p.week))];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={s.pageTitle}>Calendário Editorial</div>
        <div style={s.pageSubtitle}>Estratégia de conteúdo · Instagram · 90 dias · 3 fases</div>
      </div>

      {/* Stat cards das fases */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
        {[1, 2, 3].map(ph => {
          const meta = PHASE_META[ph];
          const posts = ALL_POSTS.filter(p => p.phase === ph);
          const done = posts.filter(p => published.has(p.id)).length;
          const pct = Math.round((done / meta.total) * 100);
          const active = phase === ph;
          return (
            <div key={ph} onClick={() => setPhase(ph)} style={{ ...s.card({ cursor: "pointer", borderTop: `2px solid ${active ? COLORS.accent : COLORS.border}`, opacity: active ? 1 : 0.6, transition: "all 0.15s" }) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 4 }}>Fase {ph}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.text }}>{meta.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{meta.period}</div>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: FONT_DISPLAY, color: active ? COLORS.accent : COLORS.textMuted }}>{pct}%</div>
              </div>
              <Progress value={pct} color={active ? COLORS.accent : COLORS.textMuted} />
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>{done}/{meta.total} publicados</div>
            </div>
          );
        })}
      </div>

      {/* Filtro de formato */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, letterSpacing: "0.14em", textTransform: "uppercase", marginRight: 4 }}>Formato</span>
        {FORMATS.map(fmt => (
          <button key={fmt} style={s.pill(filter === fmt)} onClick={() => setFilter(fmt)}>{fmt}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_UI }}>
          {visible.length} posts · {pubCount} publicados no total
        </span>
      </div>

      {/* Posts agrupados por semana */}
      {weeks.map(wk => {
        const wkPosts = visible.filter(p => p.week === wk);
        return (
          <div key={wk} style={{ marginBottom: 32 }}>
            <div style={s.sectionTitle}>— {wk}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: 12 }}>
              {wkPosts.map(post => {
                const isPub = published.has(post.id);
                const color = FORMAT_COLOR[post.format] || COLORS.accent;
                return (
                  <div key={post.id} onClick={() => toggle(post.id)}
                    style={{ ...s.card({ cursor: "pointer", borderLeft: `2px solid ${isPub ? COLORS.accent : color}`, opacity: isPub ? 0.65 : 1, transition: "all 0.15s", padding: "16px 20px" }) }}>
                    {/* Topo: data + badge formato */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT_UI, letterSpacing: "0.06em" }}>{post.date}</span>
                      <span style={s.badge(color)}>{post.format}</span>
                    </div>
                    {/* Pilar */}
                    <div style={{ fontSize: 10, fontWeight: 600, fontFamily: FONT_UI, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>{post.pilar}</div>
                    {/* Hook */}
                    <div style={{ fontFamily: FONT_BODY, fontSize: 15, fontStyle: "italic", color: COLORS.text, lineHeight: 1.5, marginBottom: 14 }}>"{post.hook}"</div>
                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: isPub ? COLORS.accent : COLORS.textDim, transition: "background 0.15s" }} />
                      <span style={{ fontSize: 11, fontFamily: FONT_UI, color: isPub ? COLORS.accent : COLORS.textMuted, letterSpacing: "0.06em" }}>
                        {isPub ? "Publicado" : "Pendente"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {visible.length === 0 && (
        <div style={{ ...s.card({ textAlign: "center", padding: 48 }) }}>
          <div style={{ fontSize: 14, color: COLORS.textMuted, fontFamily: FONT_UI }}>Nenhum post para o filtro selecionado</div>
        </div>
      )}
    </div>
  );
}
