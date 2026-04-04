import { useState } from "react";

const FONT_DISPLAY = `'Playfair Display', 'Georgia', serif`;
const FONT_BODY = `'Cormorant Garamond', 'Garamond', Georgia, serif`;
const FONT_UI = `'Jost', 'DM Sans', sans-serif`;
const FONT_MONO = `'DM Mono', 'Courier New', monospace`;

const C = {
  bg: "#0E0E0E",
  surface: "#141414",
  surface2: "#1C1C1C",
  border: "#2A2A2A",
  border2: "#333333",
  gold: "#C9A84C",
  goldBr: "#E2C06A",
  goldDim: "#7A6030",
  goldBg: "#1A1508",
  text: "#F0EDE6",
  text2: "#A09890",
  text3: "#5A5550",
};

const FORMAT_CFG = {
  Carrossel:    { bar: "linear-gradient(90deg,#1A4A9A,#2E6EAD)", tagBg:"#0A1525", tagColor:"#5B9BD5", tagBorder:"#1A3A5C" },
  "Estático":   { bar: "linear-gradient(90deg,#1B6B3A,#2A9E63)", tagBg:"#0A1810", tagColor:"#5BBD87", tagBorder:"#1B4030" },
  Reels:        { bar: "linear-gradient(90deg,#6B1A9A,#9B3AB5)", tagBg:"#150820", tagColor:"#B57BD5", tagBorder:"#4A1A6B" },
  Bastidor:     { bar: "linear-gradient(90deg,#8A3A0A,#C05010)", tagBg:"#1A0E05", tagColor:"#D5905B", tagBorder:"#5A2A08" },
  "Arcus Club": { bar: "linear-gradient(90deg,#8A1A1A,#C03030)", tagBg:"#1A0505", tagColor:"#D55B5B", tagBorder:"#5A1A1A" },
};

const PHASE_COLORS = {
  1: { bg:"#0A1F12", border:"#1B6B45", lt:"#2A9E63" },
  2: { bg:"#080F1A", border:"#1A4A7A", lt:"#2E6EAD" },
  3: { bg:"#150820", border:"#6B2080", lt:"#9B3AB5" },
};

const PHASE_META = {
  1: { name:"Fundação de Identidade",    period:"6 Abr – 3 Mai 2026",  freq:"3 posts/semana", total:12, posts:"12 posts", objective:'"Deixar claro quem você é e para quem você fala. Não é hora de viralizar — é hora de construir base sólida."' },
  2: { name:"Aprofundamento e Prova",    period:"4 Mai – 31 Mai 2026",  freq:"4 posts/semana", total:16, posts:"16 posts", objective:'"Dobrar o que performou na fase 1 e introduzir prova social: bastidores, resultados e encontros do Arcus Club."' },
  3: { name:"Conversão Suave",           period:"1 Jun – 4 Jul 2026",   freq:"4 posts/semana", total:20, posts:"20 posts", objective:'"Autoridade construída. Conteúdo que leva quem tem fit a perguntar sobre o Arcus Club naturalmente."' },
};

const ALL_POSTS = [
  // ── Fase 1 ──────────────────────────────────────────────────────────────────
  { id:"p1",  phase:1, week:1,  weekLabel:"Semana 01", weekPeriod:"6 – 10 de Abril",       format:"Carrossel",   date:"Seg · 06/04", pilar:"Liderança",                   hook:'"O líder que resolve tudo é o mesmo que impede o crescimento"',                                                      weekNum:"S01" },
  { id:"p2",  phase:1, week:1,  weekLabel:"Semana 01", weekPeriod:"6 – 10 de Abril",       format:"Estático",    date:"Qua · 08/04", pilar:"Cultura Organizacional",      hook:'"Cultura não é o que está no mural — é o que você tolera quando ninguém está olhando"',                          weekNum:"S01" },
  { id:"p3",  phase:1, week:1,  weekLabel:"Semana 01", weekPeriod:"6 – 10 de Abril",       format:"Reels",       date:"Sex · 10/04", pilar:"Processos e Sistemas",        hook:'"Seu processo não trava o time — ele revela quem não deveria estar ali"',                                         weekNum:"S01" },
  { id:"p4",  phase:1, week:2,  weekLabel:"Semana 02", weekPeriod:"13 – 17 de Abril",      format:"Carrossel",   date:"Seg · 13/04", pilar:"Gestão de Times",             hook:'"Você não tem problema de performance. Tem problema de covardia nas conversas"',                               weekNum:"S02" },
  { id:"p5",  phase:1, week:2,  weekLabel:"Semana 02", weekPeriod:"13 – 17 de Abril",      format:"Estático",    date:"Qua · 15/04", pilar:"Mentalidade do Empreendedor", hook:'"Você não está exausto pelo trabalho — está exausto pelas decisões que evita"',                                weekNum:"S02" },
  { id:"p6",  phase:1, week:2,  weekLabel:"Semana 02", weekPeriod:"13 – 17 de Abril",      format:"Reels",       date:"Sex · 17/04", pilar:"Liderança",                   hook:'"Feedback não é presente. É dívida que você paga ou acumula juros"',                                            weekNum:"S02" },
  { id:"p7",  phase:1, week:3,  weekLabel:"Semana 03", weekPeriod:"20 – 24 de Abril",      format:"Carrossel",   date:"Seg · 20/04", pilar:"Processos e Sistemas",        hook:'"Reunião de alinhamento é sintoma de empresa desalinhada"',                                                      weekNum:"S03" },
  { id:"p8",  phase:1, week:3,  weekLabel:"Semana 03", weekPeriod:"20 – 24 de Abril",      format:"Estático",    date:"Qua · 22/04", pilar:"Visão e Estratégia",          hook:'"Sua estratégia não falhou na execução — falhou no dia que você não disse não"',                              weekNum:"S03" },
  { id:"p9",  phase:1, week:3,  weekLabel:"Semana 03", weekPeriod:"20 – 24 de Abril",      format:"Reels",       date:"Sex · 24/04", pilar:"Cultura Organizacional",      hook:'"Toda empresa tem duas culturas: a declarada e a praticada"',                                                   weekNum:"S03" },
  { id:"p10", phase:1, week:4,  weekLabel:"Semana 04", weekPeriod:"27 Abr – 1 de Maio",    format:"Carrossel",   date:"Seg · 27/04", pilar:"Tomada de Decisão",           hook:'"A decisão que você adia todo dia está tomando decisões por você"',                                            weekNum:"S04" },
  { id:"p11", phase:1, week:4,  weekLabel:"Semana 04", weekPeriod:"27 Abr – 1 de Maio",    format:"Estático",    date:"Qua · 29/04", pilar:"Comunicação Interna",         hook:'"Clareza não é dom de comunicação. É uma escolha de liderança"',                                              weekNum:"S04" },
  { id:"p12", phase:1, week:4,  weekLabel:"Semana 04", weekPeriod:"27 Abr – 1 de Maio",    format:"Reels",       date:"Sex · 01/05", pilar:"Gestão de Times",             hook:'"Time medíocre não precisa de treinamento. Precisa de um líder que pare de protegê-lo"',                    weekNum:"S04" },
  // ── Fase 2 ──────────────────────────────────────────────────────────────────
  { id:"p13", phase:2, week:5,  weekLabel:"Semana 05", weekPeriod:"4 – 9 de Maio",         format:"Carrossel",   date:"Seg · 04/05", pilar:"Liderança",                   hook:'"O fundador insubstituível construiu uma prisão, não uma empresa"',                                            weekNum:"S05" },
  { id:"p14", phase:2, week:5,  weekLabel:"Semana 05", weekPeriod:"4 – 9 de Maio",         format:"Estático",    date:"Qua · 06/05", pilar:"Processos e Sistemas",        hook:'"Processo não é burocracia. É o que sobra quando você não está lá"',                                          weekNum:"S05" },
  { id:"p15", phase:2, week:5,  weekLabel:"Semana 05", weekPeriod:"4 – 9 de Maio",         format:"Reels",       date:"Sex · 08/05", pilar:"Cultura Organizacional",      hook:'"Contratou pela competência. Demitiu pelo comportamento. O problema era a cultura"',                        weekNum:"S05" },
  { id:"p16", phase:2, week:5,  weekLabel:"Semana 05", weekPeriod:"4 – 9 de Maio",         format:"Bastidor",    date:"Sáb · 09/05", pilar:"Arcus Club",                  hook:'"Bastidor de encontro ou insight de bastidor do programa — humanize o perfil"',                           weekNum:"S05" },
  { id:"p17", phase:2, week:6,  weekLabel:"Semana 06", weekPeriod:"11 – 16 de Maio",       format:"Carrossel",   date:"Seg · 11/05", pilar:"Mentalidade do Empreendedor", hook:'"O empreendedor que não delega não tem empresa. Tem um emprego caro"',                                      weekNum:"S06" },
  { id:"p18", phase:2, week:6,  weekLabel:"Semana 06", weekPeriod:"11 – 16 de Maio",       format:"Estático",    date:"Qua · 13/05", pilar:"Gestão de Times",             hook:'"A demissão que você adiou 6 meses custou mais do que a que fez em 6 dias"',                              weekNum:"S06" },
  { id:"p19", phase:2, week:6,  weekLabel:"Semana 06", weekPeriod:"11 – 16 de Maio",       format:"Reels",       date:"Sex · 15/05", pilar:"Visão e Estratégia",          hook:'"Crescimento sem estrutura não é expansão — é aceleração do caos"',                                        weekNum:"S06" },
  { id:"p20", phase:2, week:6,  weekLabel:"Semana 06", weekPeriod:"11 – 16 de Maio",       format:"Bastidor",    date:"Sáb · 16/05", pilar:"Prova Social",                hook:'"Resultado de membro ou insight de reunião interna do Arcus Club"',                                         weekNum:"S06" },
  { id:"p21", phase:2, week:7,  weekLabel:"Semana 07", weekPeriod:"18 – 23 de Maio",       format:"Carrossel",   date:"Seg · 18/05", pilar:"Comunicação Interna",         hook:'"Seu time não entende a estratégia porque você nunca a traduziu em comportamentos"',                     weekNum:"S07" },
  { id:"p22", phase:2, week:7,  weekLabel:"Semana 07", weekPeriod:"18 – 23 de Maio",       format:"Estático",    date:"Qua · 20/05", pilar:"Tomada de Decisão",           hook:'"Velocidade de decisão é vantagem competitiva. Comitê é diluição de responsabilidade"',                  weekNum:"S07" },
  { id:"p23", phase:2, week:7,  weekLabel:"Semana 07", weekPeriod:"18 – 23 de Maio",       format:"Reels",       date:"Sex · 22/05", pilar:"Liderança",                   hook:'"Líder que precisa de controle tem problema de confiança — e confiança é processo seletivo"',          weekNum:"S07" },
  { id:"p24", phase:2, week:7,  weekLabel:"Semana 07", weekPeriod:"18 – 23 de Maio",       format:"Bastidor",    date:"Sáb · 23/05", pilar:"Evento / Encontro",           hook:'"Foto ou registro de evento, encontro ou visita relevante"',                                               weekNum:"S07" },
  { id:"p25", phase:2, week:8,  weekLabel:"Semana 08", weekPeriod:"25 – 30 de Maio",       format:"Carrossel",   date:"Seg · 25/05", pilar:"Cultura Organizacional",      hook:'"Os valores que você lista no site não são sua cultura. Os comportamentos que você recompensa são"',   weekNum:"S08" },
  { id:"p26", phase:2, week:8,  weekLabel:"Semana 08", weekPeriod:"25 – 30 de Maio",       format:"Estático",    date:"Qua · 27/05", pilar:"Processos e Sistemas",        hook:'"Toda empresa caótica tem um líder que acha que processo mata criatividade"',                            weekNum:"S08" },
  { id:"p27", phase:2, week:8,  weekLabel:"Semana 08", weekPeriod:"25 – 30 de Maio",       format:"Reels",       date:"Sex · 29/05", pilar:"Mentalidade do Empreendedor", hook:'"O problema não é falta de ideia. É excesso de início e escassez de conclusão"',                        weekNum:"S08" },
  { id:"p28", phase:2, week:8,  weekLabel:"Semana 08", weekPeriod:"25 – 30 de Maio",       format:"Bastidor",    date:"Sáb · 30/05", pilar:"Bastidor Pessoal",            hook:'"Insight de leitura, conversa ou decisão relevante da semana"',                                           weekNum:"S08" },
  // ── Fase 3 ──────────────────────────────────────────────────────────────────
  { id:"p29", phase:3, week:9,  weekLabel:"Semana 09", weekPeriod:"1 – 6 de Junho",        format:"Carrossel",   date:"Seg · 01/06", pilar:"Liderança",                   hook:'"3 sinais de que sua empresa cresceu além da sua estrutura atual"',                                         weekNum:"S09" },
  { id:"p30", phase:3, week:9,  weekLabel:"Semana 09", weekPeriod:"1 – 6 de Junho",        format:"Estático",    date:"Qua · 03/06", pilar:"Cultura Organizacional",      hook:'"A diferença entre empresa que escala e empresa que implode é uma: cultura escrita ou oral"',          weekNum:"S09" },
  { id:"p31", phase:3, week:9,  weekLabel:"Semana 09", weekPeriod:"1 – 6 de Junho",        format:"Reels",       date:"Sex · 05/06", pilar:"Processos e Sistemas",        hook:'"Dono que apaga incêndio todo dia construiu a empresa errada — ou não construiu sistema nenhum"',    weekNum:"S09" },
  { id:"p32", phase:3, week:9,  weekLabel:"Semana 09", weekPeriod:"1 – 6 de Junho",        format:"Arcus Club",  date:"Sáb · 06/06", pilar:"Arcus Club — CTA Suave",     hook:'"O que acontece dentro do programa e para quem ele é — sem forçar venda"',                           weekNum:"S09" },
  { id:"p33", phase:3, week:10, weekLabel:"Semana 10", weekPeriod:"8 – 13 de Junho",       format:"Carrossel",   date:"Seg · 08/06", pilar:"Gestão de Times",             hook:'"Como identificar se seu time está crescendo junto com a empresa ou ficando para trás"',             weekNum:"S10" },
  { id:"p34", phase:3, week:10, weekLabel:"Semana 10", weekPeriod:"8 – 13 de Junho",       format:"Estático",    date:"Qua · 10/06", pilar:"Mentalidade do Empreendedor", hook:'"Empreendedor que não investe em estrutura aposta que o crescimento resolve o que ele criou"',       weekNum:"S10" },
  { id:"p35", phase:3, week:10, weekLabel:"Semana 10", weekPeriod:"8 – 13 de Junho",       format:"Reels",       date:"Sex · 12/06", pilar:"Visão e Estratégia",          hook:'"Planejamento que fica na gaveta não é planejamento. É procrastinação com PowerPoint"',             weekNum:"S10" },
  { id:"p36", phase:3, week:10, weekLabel:"Semana 10", weekPeriod:"8 – 13 de Junho",       format:"Arcus Club",  date:"Sáb · 13/06", pilar:"Arcus Club — Bastidor",      hook:"\"Bastidor de encontro com CTA: 'se você se identificou, vem conversar'\"",                          weekNum:"S10" },
  { id:"p37", phase:3, week:11, weekLabel:"Semana 11", weekPeriod:"15 – 20 de Junho",      format:"Carrossel",   date:"Seg · 15/06", pilar:"Comunicação Interna",         hook:'"Por que seu time faz o mínimo — e como mudar isso sem dar aumento"',                               weekNum:"S11" },
  { id:"p38", phase:3, week:11, weekLabel:"Semana 11", weekPeriod:"15 – 20 de Junho",      format:"Estático",    date:"Qua · 17/06", pilar:"Liderança",                   hook:'"Autonomia sem estrutura não empodera. Confunde"',                                                       weekNum:"S11" },
  { id:"p39", phase:3, week:11, weekLabel:"Semana 11", weekPeriod:"15 – 20 de Junho",      format:"Reels",       date:"Sex · 19/06", pilar:"Cultura Organizacional",      hook:'"Empresa que depende do humor do dono para funcionar não tem cultura. Tem sequestro emocional"',    weekNum:"S11" },
  { id:"p40", phase:3, week:11, weekLabel:"Semana 11", weekPeriod:"15 – 20 de Junho",      format:"Arcus Club",  date:"Sáb · 20/06", pilar:"Arcus Club — Prova Social",  hook:'"Resultado de membro com CTA suave sobre o programa"',                                                  weekNum:"S11" },
  { id:"p41", phase:3, week:12, weekLabel:"Semana 12", weekPeriod:"22 – 27 de Junho",      format:"Carrossel",   date:"Seg · 22/06", pilar:"Processos e Sistemas",        hook:'"O checklist que seu time ignora não é problema de disciplina — é problema de design"',            weekNum:"S12" },
  { id:"p42", phase:3, week:12, weekLabel:"Semana 12", weekPeriod:"22 – 27 de Junho",      format:"Estático",    date:"Qua · 24/06", pilar:"Tomada de Decisão",           hook:'"Decisão boa tomada tarde é pior do que decisão boa tomada na hora certa"',                        weekNum:"S12" },
  { id:"p43", phase:3, week:12, weekLabel:"Semana 12", weekPeriod:"22 – 27 de Junho",      format:"Reels",       date:"Sex · 26/06", pilar:"Gestão de Times",             hook:'"Time que só age quando o dono está presente não tem liderança. Tem supervisão"',                  weekNum:"S12" },
  { id:"p44", phase:3, week:12, weekLabel:"Semana 12", weekPeriod:"22 – 27 de Junho",      format:"Arcus Club",  date:"Sáb · 27/06", pilar:"Arcus Club — CTA Direto",    hook:'"O que é o programa, para quem é, como entrar — mais direto"',                                      weekNum:"S12" },
  { id:"p45", phase:3, week:13, weekLabel:"Semana 13", weekPeriod:"29 Jun – 4 de Julho",   format:"Carrossel",   date:"Seg · 29/06", pilar:"Visão e Estratégia",          hook:'"Como construir uma empresa que funciona sem você — o roteiro dos 90 dias"',                       weekNum:"S13" },
  { id:"p46", phase:3, week:13, weekLabel:"Semana 13", weekPeriod:"29 Jun – 4 de Julho",   format:"Estático",    date:"Qua · 01/07", pilar:"Mentalidade do Empreendedor", hook:'"Não é falta de tempo. É falta de sistema para proteger o seu"',                                     weekNum:"S13" },
  { id:"p47", phase:3, week:13, weekLabel:"Semana 13", weekPeriod:"29 Jun – 4 de Julho",   format:"Reels",       date:"Sex · 03/07", pilar:"Liderança",                   hook:'"O maior erro que empreendedores estruturados cometem quando sobem de patamar"',                    weekNum:"S13" },
  { id:"p48", phase:3, week:13, weekLabel:"Semana 13", weekPeriod:"29 Jun – 4 de Julho",   format:"Arcus Club",  date:"Sáb · 04/07", pilar:"Arcus Club — Post Direto",   hook:'"Post de encerramento: o que é o Arcus Club, para quem é, como participar"',                    weekNum:"S13" },
];

function getWeeks(phase) {
  const posts = ALL_POSTS.filter(p => p.phase === phase);
  const map = new Map();
  posts.forEach(p => {
    if (!map.has(p.week)) map.set(p.week, { weekLabel: p.weekLabel, weekPeriod: p.weekPeriod, posts: [] });
    map.get(p.week).posts.push(p);
  });
  return [...map.values()];
}

function phaseProgress(phase, published) {
  const posts = ALL_POSTS.filter(p => p.phase === phase);
  const pub = posts.filter(p => published.has(p.id)).length;
  const pct = PHASE_META[phase].total ? Math.round(pub / PHASE_META[phase].total * 100) : 0;
  return { pub, pct };
}

export default function MarketingPage() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [published, setPublished] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("arcus-published") || "[]")); }
    catch { return new Set(); }
  });
  const [hoveredCard, setHoveredCard] = useState(null);

  const togglePublished = (id) => {
    setPublished(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("arcus-published", JSON.stringify([...next]));
      return next;
    });
  };

  const FORMATS = ["all", "Carrossel", "Estático", "Reels", "Bastidor", "Arcus Club"];
  const FORMATS_LABEL = { all: "Todos" };

  const weeks = getWeeks(activePhase);
  const totalPublished = ALL_POSTS.filter(p => published.has(p.id)).length;

  const visiblePosts = ALL_POSTS.filter(p =>
    p.phase === activePhase && (activeFilter === "all" || p.format === activeFilter)
  );

  return (
    <div style={{ fontFamily: FONT_UI, color: C.text }}>
      {/* Page header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.2em", color: C.goldDim, textTransform: "uppercase", marginBottom: 14 }}>
          Estratégia de Conteúdo · Instagram · 2026
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontFamily: FONT_BODY, fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, lineHeight: 1.05, color: C.text, marginBottom: 12 }}>
              Calendário Editorial<br />
              <strong style={{ fontWeight: 600, color: C.gold }}>90 Dias</strong>
            </h1>
            <p style={{ fontSize: 14, fontWeight: 300, color: C.text2, lineHeight: 1.7, maxWidth: 480 }}>
              Três fases progressivas. Identidade primeiro, prova depois, conversão por último. Cada post com propósito definido antes de ser criado.
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
            {[
              { val: 48, label: "Posts Planejados" },
              { val: 3,  label: "Fases Estratégicas" },
              { val: totalPublished, label: "Publicados" },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 40, fontWeight: 600, color: C.gold, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", color: C.text3, textTransform: "uppercase", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase tabs */}
      <div style={{ display: "flex", gap: 1, background: C.border, borderRadius: 4, overflow: "hidden", marginBottom: 1 }}>
        {[1, 2, 3].map(ph => {
          const meta = PHASE_META[ph];
          const pc = PHASE_COLORS[ph];
          const { pct } = phaseProgress(ph, published);
          const active = activePhase === ph;
          return (
            <button key={ph} onClick={() => setActivePhase(ph)}
              style={{
                flex: 1, minWidth: 0, padding: "0 24px", height: 72,
                display: "flex", alignItems: "center", gap: 14,
                cursor: "pointer", border: "none",
                background: active ? C.surface2 : C.surface,
                borderBottom: `2px solid ${active ? C.gold : "transparent"}`,
                color: active ? C.text : C.text3,
                transition: "all 0.2s", textAlign: "left",
                fontFamily: FONT_UI,
              }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: 26, fontWeight: 600, lineHeight: 1, flexShrink: 0, color: pc.lt }}>
                {String(ph).padStart(2, "0")}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.03em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{meta.name}</div>
                <div style={{ fontSize: 11, color: C.text3, fontFamily: FONT_MONO }}>{meta.period.split("·")[0].trim()} · {meta.posts}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                <div style={{ width: 72, height: 3, background: C.border2, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: C.gold, borderRadius: 2, transition: "width 0.4s ease" }} />
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.text3 }}>{pct}%</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}`, marginBottom: 32, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.12em", color: C.text3, textTransform: "uppercase", marginRight: 4 }}>Formato</span>
        {FORMATS.map(fmt => {
          const active = activeFilter === fmt;
          return (
            <button key={fmt} onClick={() => setActiveFilter(fmt)}
              style={{
                padding: "5px 14px", borderRadius: 3,
                border: `1px solid ${active ? C.goldDim : C.border2}`,
                background: active ? C.goldBg : "transparent",
                color: active ? C.gold : C.text2,
                fontFamily: FONT_UI, fontSize: 12, fontWeight: 500,
                cursor: "pointer", letterSpacing: "0.04em", transition: "all 0.15s",
              }}>
              {FORMATS_LABEL[fmt] || fmt}
            </button>
          );
        })}
        <div style={{ marginLeft: "auto", fontFamily: FONT_MONO, fontSize: 11, color: C.text3, padding: "4px 10px", border: `1px solid ${C.border}`, borderRadius: 3 }}>
          {visiblePosts.length} {visiblePosts.length === 1 ? "post visível" : "posts visíveis"}
        </div>
      </div>

      {/* Phase section header */}
      {(() => {
        const meta = PHASE_META[activePhase];
        const pc = PHASE_COLORS[activePhase];
        return (
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 28, marginBottom: 36 }}>
            <div style={{ width: 72, height: 72, borderRadius: 4, background: pc.bg, border: `1px solid ${pc.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: 32, fontWeight: 600, lineHeight: 1, color: pc.lt }}>{String(activePhase).padStart(2, "0")}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3 }}>Fase</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: 28, fontWeight: 600, color: C.text }}>{meta.name}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[meta.period, meta.freq, meta.posts].map(pill => (
                  <span key={pill} style={{ padding: "3px 12px", borderRadius: 3, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT_MONO, background: pc.bg, color: pc.lt, border: `1px solid ${pc.border}` }}>
                    {pill}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 13, fontWeight: 300, color: C.text2, fontStyle: "italic", lineHeight: 1.6 }}>{meta.objective}</div>
            </div>
          </div>
        );
      })()}

      {/* Week groups */}
      {weeks.map(({ weekLabel, weekPeriod, posts }) => {
        const filtered = posts.filter(p => activeFilter === "all" || p.format === activeFilter);
        if (filtered.length === 0) return null;
        return (
          <div key={weekLabel} style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.15em", color: C.goldDim, textTransform: "uppercase" }}>{weekLabel}</span>
              <span style={{ fontFamily: FONT_BODY, fontSize: 18, fontWeight: 400, color: C.text2 }}>{weekPeriod}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {filtered.map(post => {
                const cfg = FORMAT_CFG[post.format] || FORMAT_CFG["Carrossel"];
                const isPub = published.has(post.id);
                const isHovered = hoveredCard === post.id;
                return (
                  <div key={post.id}
                    style={{
                      background: C.surface,
                      border: `1px solid ${isPub ? C.goldDim : isHovered ? C.border2 : C.border}`,
                      borderRadius: 6,
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      opacity: isPub ? 0.72 : 1,
                      transform: isHovered && !isPub ? "translateY(-2px)" : "none",
                      transition: "border-color 0.2s, transform 0.2s, opacity 0.2s",
                    }}
                    onClick={() => togglePublished(post.id)}
                    onMouseEnter={() => setHoveredCard(post.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Format color bar */}
                    <div style={{ height: 4, background: cfg.bar }} />

                    {/* Published badge */}
                    {isPub && (
                      <div style={{ position: "absolute", top: 10, right: 10, background: C.goldBg, color: C.gold, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.12em", padding: "3px 8px", borderRadius: 2, border: `1px solid ${C.goldDim}` }}>
                        PUBLICADO
                      </div>
                    )}

                    {/* Card body */}
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.text3, letterSpacing: "0.06em" }}>{post.date}</div>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 9, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 2, background: cfg.tagBg, color: cfg.tagColor, border: `1px solid ${cfg.tagBorder}` }}>
                          {post.format === "Reels" ? "Reels 7–15s" : post.format}
                        </div>
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.goldDim, marginBottom: 10 }}>{post.pilar}</div>
                      <div style={{ fontFamily: FONT_BODY, fontSize: 16, fontWeight: 400, fontStyle: "italic", color: C.text, lineHeight: 1.45 }}>{post.hook}</div>
                    </div>

                    {/* Card footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderTop: `1px solid ${C.border}`, background: C.surface2 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isPub ? C.gold : C.border2, transition: "background 0.18s" }} />
                        <span style={{ fontFamily: FONT_UI, fontSize: 11, color: isPub ? C.gold : C.text3, letterSpacing: "0.05em" }}>
                          {isPub ? "Publicado" : "Marcar como publicado"}
                        </span>
                      </div>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.text3 }}>{post.weekNum}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: C.border, borderRadius: 6, overflow: "hidden", marginTop: 40 }}>
        {[
          { val: ALL_POSTS.filter(p => published.has(p.id)).length, key: "Publicados" },
          { val: 48 - ALL_POSTS.filter(p => published.has(p.id)).length, key: "Pendentes" },
          { val: ALL_POSTS.filter(p => p.format === "Carrossel").length, key: "Carrosseis" },
          { val: ALL_POSTS.filter(p => p.format === "Reels").length, key: "Reels" },
          { val: Math.round(ALL_POSTS.filter(p => published.has(p.id)).length / 48 * 100) + "%", key: "Progresso Geral" },
        ].map(({ val, key }) => (
          <div key={key} style={{ background: C.surface, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 30, fontWeight: 600, color: C.gold }}>{val}</div>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text3 }}>{key}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
