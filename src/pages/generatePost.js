// ── Gerador de HTML para posts do calendário editorial ──────────────────────

const BRAND_FALLBACK = {
  corPrimaria: "#C9A84C", corSecundaria: "#0E0E0E", corTexto: "#F0EDE6",
  corDestaque: "#7B6FD4", fonteDisplay: "Cormorant Garamond", fonteCorpo: "Outfit",
  assinatura: "Arcus Club",
  ctaPadrao: "Quer estruturar sua empresa? Comenta ARCUS ou acessa o link na bio.",
  hashtags: "#liderança #gestão #empreendedorismo #arcusclub #cultura",
  carrosselSlides: "7", reelsDuracao: "7–15s",
  tomDeVoz: "Direto, sem rodeios. Usa afirmações provocativas. Evita jargão acadêmico. Tom de autoridade, nunca arrogância.",
  estaticoCor: "Fundo escuro com texto em destaque",
};

function readBrand() {
  try { return { ...BRAND_FALLBACK, ...(JSON.parse(localStorage.getItem("arcus-brand")) || {}) }; }
  catch { return { ...BRAND_FALLBACK }; }
}

function parseContent(raw) {
  if (!raw?.trim()) return null;
  try {
    const match = raw.trim().match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  } catch { return null; }
}

// ── gerador de prompt ────────────────────────────────────────────────────────
export function generatePrompt(post) {
  const b = readBrand();
  const n = Math.max(2, Math.min(15, parseInt(b.carrosselSlides) || 7));

  const SLIDE_LABELS = [
    "ABERTURA", "CONTEXTO", "DIAGNÓSTICO", "RAIZ", "SOLUÇÃO", "AÇÃO", "CTA",
    "EXTRA 1", "EXTRA 2", "EXTRA 3", "EXTRA 4", "EXTRA 5", "EXTRA 6", "CTA FINAL",
  ];

  const base =
`Você é um redator especialista em conteúdo para Instagram B2B de alta conversão.
Crie o conteúdo completo para o post abaixo. Respeite rigorosamente a identidade da marca e siga exatamente o formato de resposta solicitado.

━━━ IDENTIDADE DA MARCA ━━━
Marca: ${b.assinatura}
Proposta: Mentoria estratégica para empresários que querem estruturar e escalar negócios
Tom de voz: ${b.tomDeVoz}

━━━ IDENTIDADE VISUAL (determina como o texto deve ser escrito) ━━━
Fonte de destaque (títulos): ${b.fonteDisplay} — serifada, elegante, sempre em itálico nos cards
Fonte de corpo: ${b.fonteCorpo} — clean, sem serifa, leitura objetiva
Cor primária: ${b.corPrimaria} — dourado, usada em destaques, assinaturas e CTAs
Cor de fundo dos posts: ${b.corSecundaria} — preto profundo, base de todos os layouts
Cor de destaque: ${b.corDestaque} — violeta, elementos secundários e marcadores visuais
Cor de texto principal: ${b.corTexto} — off-white quente, leitura sobre fundo escuro

Regras visuais que restringem o texto:
• Títulos dos slides: máx 8 palavras — o espaço disponível no card é limitado
• Corpo dos slides: máx 3 linhas por bloco — excesso quebra a estética premium
• Sem emojis em nenhum slide ou card
• Linguagem afirmativa, provoca reflexão imediata — nunca motivacional ou genérica
• Evitar: "é importante", "é fundamental", "no mundo atual", "cada vez mais", "de fato"
• Estética: premium, austero, minimal — o texto deve respirar no layout escuro

━━━ DADOS DO POST ━━━
Formato: ${post.format}
Pilar temático: ${post.pilar}
Hook definido (frase de abertura já estabelecida): "${post.hook}"
Data de publicação: ${post.date} — ${post.week}
CTA padrão da marca: ${b.ctaPadrao}
Hashtags: ${b.hashtags}
`;

  let specific = "";

  // ── CARROSSEL ──────────────────────────────────────────────────────────────
  if (post.format === "Carrossel") {
    const instructions = [
      `ABERTURA — o hook já está definido como título. Crie apenas um subtítulo de apoio (máx 10 palavras) que intensifique sem explicar. Não comece com "Quando" ou "Se".`,
      `CONTEXTO — por que esse padrão existe? Título impactivo (máx 8 palavras) + corpo 2-3 linhas situando o leitor no problema sem julgamento.`,
      `DIAGNÓSTICO — como identificar isso no próprio negócio? Título + afirmação ou pergunta que provoca reconhecimento imediato.`,
      `RAIZ — a causa não óbvia por trás do comportamento. O insight que muda a leitura do problema. Título + corpo revelador.`,
      `SOLUÇÃO — o que empresas e líderes que acertam fazem diferente. Prático, específico, nunca genérico. Título + corpo acionável.`,
      `AÇÃO — um único passo que o leitor pode dar hoje. Concreto, imediato, sem rodeios. Título + instrução clara.`,
      `CTA — versão contextualizada do CTA padrão adaptada ao argumento deste post. Termine com a assinatura "${b.assinatura}".`,
      `EXTRA 1 — aprofundamento com dado, exemplo ou caso real que reforça o argumento.`,
      `EXTRA 2 — contraposição: o que acontece quando o leitor não aplica a solução.`,
      `EXTRA 3 — reflexão final que leva o leitor a se identificar e comentar.`,
      `EXTRA 4 — conteúdo complementar.`,
      `EXTRA 5 — conteúdo complementar.`,
      `CTA FINAL — encerramento forte com CTA.`,
    ];

    const slideJsonTemplate = Array.from({ length: n }, (_, i) => {
      const label = SLIDE_LABELS[Math.min(i, SLIDE_LABELS.length - 1)];
      const hookEscaped = post.hook.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      if (i === 0) return `    { "label": "${label}", "titulo": "${hookEscaped}", "apoio": "[subtítulo de intensificação — máx 10 palavras]" }`;
      if (i === n - 1) return `    { "label": "CTA", "corpo": "[CTA contextualizado ao argumento do post]", "assinatura": "${b.assinatura}" }`;
      return `    { "label": "${label}", "titulo": "[título impactivo — máx 8 palavras]", "corpo": "[2–3 linhas sem emojis]" }`;
    }).join(",\n");

    specific =
`
━━━ ESTRUTURA DOS ${n} SLIDES ━━━
${Array.from({ length: n }, (_, i) => `Slide ${i + 1} — ${instructions[Math.min(i, instructions.length - 1)]}`).join("\n")}

━━━ FORMATO DE RESPOSTA ━━━
Retorne SOMENTE o JSON abaixo. Sem texto antes ou depois. Sem blocos markdown. Sem comentários.
Preencha cada campo substituindo os colchetes pelo conteúdo real gerado.

{
  "slides": [
${slideJsonTemplate}
  ],
  "caption": "[caption completa: comece com o hook entre aspas → 2-3 frases de desenvolvimento → quebra → CTA padrão → '.\\n.\\n.' → hashtags]",
  "hashtags": "${b.hashtags}"
}`;
  }

  // ── REELS ──────────────────────────────────────────────────────────────────
  else if (post.format === "Reels") {
    specific =
`
━━━ ROTEIRO (${b.reelsDuracao}) ━━━
Estrutura em 3 momentos — o vídeo deve funcionar sem áudio (texto na tela):

MOMENTO 1 — HOOK VISUAL [0s–2s]
Frase de impacto para tela. Sem contexto, sem setup. Pode ser o hook literal ou versão mais visual. Máx 8 palavras, sem ponto final.

MOMENTO 2 — DESENVOLVIMENTO [porção central]
Argumento central. 2-3 frases. Não explica — provoca reflexão. Use ' / ' para indicar cortes entre frases. Ritmo rápido.

MOMENTO 3 — CONCLUSÃO / CTA [porção final]
Virada ou pergunta que leva ao perfil + CTA. 1-2 frases. Mencione ${b.assinatura}.

━━━ FORMATO DE RESPOSTA ━━━
Retorne SOMENTE o JSON abaixo. Sem texto antes ou depois. Sem blocos markdown.

{
  "hook_visual": "[frase de abertura para tela — máx 8 palavras, sem ponto final]",
  "desenvolvimento": "[2-3 frases separadas por ' / ' para indicar cortes de cena]",
  "conclusao": "[virada + CTA — 1-2 frases, mencione ${b.assinatura}]",
  "caption": "[caption completa para publicação no feed]",
  "hashtags": "${b.hashtags}"
}`;
  }

  // ── ESTÁTICO ───────────────────────────────────────────────────────────────
  else if (post.format === "Estático") {
    specific =
`
━━━ CONTEÚDO VISUAL — 1080×1080px ━━━
Layout: fundo ${b.corSecundaria}. Estilo: ${b.estaticoCor}.
Hierarquia: pilar em small-caps acima → frase principal em ${b.fonteDisplay} itálico → texto de apoio menor → assinatura "${b.assinatura}" no rodapé.

A frase principal domina 60-70% do espaço. Espaço em branco é intencional.

Regras para a frase principal:
• Máx 12 palavras — quanto mais curta, maior o impacto visual
• Pode usar o hook original ou versão mais visual/provocativa
• Deve funcionar sozinha, sem contexto externo
• Tipografia em ${b.fonteDisplay} itálico, cor ${b.corTexto} sobre fundo ${b.corSecundaria}

━━━ FORMATO DE RESPOSTA ━━━
Retorne SOMENTE o JSON abaixo. Sem texto antes ou depois. Sem blocos markdown.

{
  "frase_principal": "[frase central — máx 12 palavras, visual e autossuficiente]",
  "texto_apoio": "[frase de apoio opcional — máx 1 linha, ou null se não necessário]",
  "caption": "[caption completa para publicação]",
  "hashtags": "${b.hashtags}"
}`;
  }

  // ── BASTIDOR ───────────────────────────────────────────────────────────────
  else if (post.format === "Bastidor") {
    specific =
`
━━━ BRIEFING DO BASTIDOR ━━━
Post humanizado — real, espontâneo, sem produção excessiva.
Objetivo: mostrar o que acontece por trás da marca. Conexão humana, não venda.
Não é sobre o produto — é sobre as pessoas e o processo.

Crie:
1. Sugestão de contexto visual (ambiente, ação, composição da cena)
2. Ângulo narrativo (o ponto humano — o que essa cena comunica sobre valores/processo)
3. Caption em primeira pessoa, tom direto e pessoal, sem exagero emocional, máx 5-6 linhas

━━━ FORMATO DE RESPOSTA ━━━
Retorne SOMENTE o JSON abaixo. Sem texto antes ou depois. Sem blocos markdown.

{
  "contexto_visual": "[descrição da cena — ambiente, ação, composição sugerida]",
  "angulo_narrativo": "[o ponto humano: o que essa cena comunica sobre o processo/valores]",
  "caption": "[caption em primeira pessoa, tom pessoal e direto]",
  "hashtags": "${b.hashtags}"
}`;
  }

  // ── ARCUS CLUB ─────────────────────────────────────────────────────────────
  else {
    specific =
`
━━━ CONTEÚDO PREMIUM — ${b.assinatura} ━━━
Post de posicionamento. Tom: autoridade + pertencimento.
Objetivo: despertar desejo de pertencer — não vender, convidar.
Visual: fundo ${b.corSecundaria}, acento dourado ${b.corPrimaria}, tipografia ${b.fonteDisplay}.

Regras:
• Headline: 8-12 palavras sobre transformação ou pertencimento — não sobre features ou preço
• Corpo: 2-3 frases sobre o que acontece dentro do programa, sem linguagem de vendas
• CTA: elegante, específico ao contexto — deriva de "${b.ctaPadrao}" mas não é cópia
• Tom: quem já sabe o valor não precisa de convencimento — você está convidando quem ainda não percebeu

━━━ FORMATO DE RESPOSTA ━━━
Retorne SOMENTE o JSON abaixo. Sem texto antes ou depois. Sem blocos markdown.

{
  "headline": "[headline principal — 8-12 palavras, pertencimento ou transformação]",
  "corpo": "[texto principal — 2-3 frases que comunicam o valor sem vender]",
  "cta_texto": "[CTA elegante contextualizado — não genérico]",
  "caption": "[caption completa para publicação]",
  "hashtags": "${b.hashtags}"
}`;
  }

  return base + specific;
}

// ── abertura de post em nova aba ─────────────────────────────────────────────
export function openPostInNewTab(post, rawContent = null) {
  const brand   = readBrand();
  const content = rawContent ? parseContent(rawContent) : null;
  const html    = buildHTML(post, brand, content);
  const blob    = new Blob([html], { type: "text/html;charset=utf-8" });
  const url     = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ── metadados por formato ────────────────────────────────────────────────────
const FMT = {
  Carrossel:    { bg: "#0A1525", border: "#1A4A9A", light: "#5B9BD5", label: "CARROSSEL" },
  "Estático":   { bg: "#0A1810", border: "#1B6B3A", light: "#5BBD87", label: "ESTÁTICO"  },
  Reels:        { bg: "#150820", border: "#6B1A9A", light: "#B57BD5", label: "REELS"     },
  Bastidor:     { bg: "#1A0E05", border: "#8A3A0A", light: "#D5905B", label: "BASTIDOR"  },
  "Arcus Club": { bg: "#1A0505", border: "#8A1A1A", light: "#D55B5B", label: "ARCUS CLUB"},
};

const SLIDE_STRUCTURE = [
  { label: "ABERTURA",    desc: "A frase que para o scroll — use o hook como ponto de partida" },
  { label: "CONTEXTO",    desc: "Por que isso acontece? Situa o leitor no problema"             },
  { label: "DIAGNÓSTICO", desc: "Como identificar esse padrão no próprio negócio"               },
  { label: "RAIZ",        desc: "O que está realmente por trás desse comportamento"             },
  { label: "SOLUÇÃO",     desc: "O que líderes e empresas que acertam fazem diferente"          },
  { label: "AÇÃO",        desc: "O passo prático que o leitor pode dar hoje mesmo"              },
  { label: "CTA",         desc: "Salva · Comenta · Acessa o link na bio"                       },
  { label: "EXTRA 1",     desc: "Conteúdo complementar" },
  { label: "EXTRA 2",     desc: "Conteúdo complementar" },
  { label: "EXTRA 3",     desc: "Conteúdo complementar" },
  { label: "EXTRA 4",     desc: "Conteúdo complementar" },
  { label: "EXTRA 5",     desc: "Conteúdo complementar" },
  { label: "EXTRA 6",     desc: "Conteúdo complementar" },
  { label: "CTA FINAL",   desc: "Chamada para ação — encerramento da série de slides" },
];

// ── builder principal ────────────────────────────────────────────────────────
function buildHTML(post, b, content = null) {
  const fmt       = FMT[post.format] || FMT["Estático"];
  const primary   = b.corPrimaria;
  const bg        = "#080808";
  const surface   = "#141414";
  const border    = "#2A2A2A";
  const text      = b.corTexto;
  const textMuted = "#A09890";
  const textDim   = "#5A5550";
  const fontD     = b.fonteDisplay || "Cormorant Garamond";
  const fontB     = b.fonteCorpo   || "Outfit";
  const sig       = b.assinatura   || "Arcus Club";
  const cta       = b.ctaPadrao    || "";
  const tags      = b.hashtags     || "";
  const n         = Math.max(2, Math.min(15, parseInt(b.carrosselSlides) || 7));

  const gfonts = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap`;

  const baseCSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: '${fontB}', Outfit, sans-serif; background: ${bg}; color: ${text}; min-height: 100vh; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
  `;

  const header = `
  <header style="position:sticky;top:0;z-index:100;background:rgba(8,8,8,.94);backdrop-filter:blur(12px);border-bottom:1px solid ${border};padding:0 40px;display:flex;align-items:center;justify-content:space-between;height:56px;">
    <div style="display:flex;align-items:center;gap:16px;">
      <span style="background:${fmt.bg};color:${fmt.light};border:1px solid ${fmt.border};border-radius:3px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;padding:3px 10px;text-transform:uppercase;">${fmt.label}</span>
      <span style="font-size:12px;color:${textDim};font-family:'DM Mono',monospace;letter-spacing:.08em;">${post.pilar.toUpperCase()}</span>
      <span style="font-size:12px;color:${textDim};font-family:'DM Mono',monospace;">${post.date} · ${post.week}</span>
    </div>
    <div style="font-family:'${fontD}',Georgia,serif;font-size:16px;font-style:italic;color:${primary};letter-spacing:.06em;">${sig}</div>
  </header>`;

  const hero = `
  <section style="padding:60px 40px 48px;border-bottom:1px solid ${border};position:relative;overflow:hidden;">
    <div style="position:absolute;top:-60px;right:-60px;width:400px;height:400px;background:radial-gradient(circle,${primary}08 0%,transparent 70%);pointer-events:none;"></div>
    <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;color:${primary}88;text-transform:uppercase;margin-bottom:20px;">${post.pilar} · ${post.date}</div>
    <h1 style="font-family:'${fontD}',Georgia,serif;font-size:clamp(32px,5vw,58px);font-weight:300;line-height:1.1;color:${text};font-style:italic;max-width:800px;">"${post.hook}"</h1>
    <div style="margin-top:24px;height:1px;width:80px;background:linear-gradient(90deg,${primary},transparent);"></div>
  </section>`;

  // ── footer com caption quando disponível ────────────────────────────────────
  const captionHtml = content?.caption ? `
    <div style="margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid ${border};">
      <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${primary}99;text-transform:uppercase;margin-bottom:14px;">Caption para Publicação</div>
      <div style="font-size:15px;color:${text};line-height:1.85;white-space:pre-wrap;font-family:'${fontB}',sans-serif;">${content.caption.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
    </div>` : "";

  const footer = `
  <footer style="margin-top:60px;padding:32px 40px 48px;border-top:1px solid ${border};">
    ${captionHtml}
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:32px;align-items:start;">
      <div>
        <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:10px;">CTA Padrão</div>
        <div style="font-size:14px;color:${textMuted};line-height:1.6;">${cta}</div>
        ${tags ? `<div style="margin-top:14px;font-family:'DM Mono',monospace;font-size:11px;color:${textDim};line-height:1.8;">${tags}</div>` : ""}
      </div>
      <div>
        <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:10px;">Paleta</div>
        <div style="display:flex;gap:8px;align-items:center;">
          ${[b.corPrimaria, b.corSecundaria, b.corDestaque, b.corTexto].map(c =>
            `<div title="${c}" style="width:24px;height:24px;border-radius:3px;background:${c};border:1px solid ${border};"></div>`
          ).join("")}
          <span style="font-size:12px;color:${textDim};margin-left:4px;">${fontD}</span>
        </div>
        ${b.tomDeVoz ? `<div style="margin-top:12px;font-size:12px;color:${textDim};line-height:1.6;font-style:italic;">${b.tomDeVoz.slice(0,120)}${b.tomDeVoz.length>120?"…":""}</div>` : ""}
      </div>
    </div>
  </footer>`;

  let body = "";

  // ── CARROSSEL ────────────────────────────────────────────────────────────────
  if (post.format === "Carrossel") {
    const slides = Array.from({ length: n }, (_, i) => {
      const isFirst = i === 0;
      const isLast  = i === n - 1;
      const st      = SLIDE_STRUCTURE[Math.min(i, SLIDE_STRUCTURE.length - 1)];
      const sd      = content?.slides?.[i] || null;
      const label   = sd?.label || st.label;
      const fmtBg   = isFirst ? `linear-gradient(145deg,${fmt.bg},${bg})` : surface;
      const fmtBrd  = isFirst ? `2px solid ${fmt.border}` : isLast ? `2px solid ${primary}44` : `1px solid ${border}`;
      const lblClr  = isFirst ? fmt.light : textDim;

      let inner = "";
      if (isFirst) {
        inner = `
          <div style="font-family:'${fontD}',Georgia,serif;font-size:18px;font-style:italic;font-weight:400;color:${text};line-height:1.5;flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px;">
            <div>"${sd?.titulo || post.hook}"</div>
            ${sd?.apoio ? `<div style="font-size:13px;font-style:normal;font-family:'${fontB}',sans-serif;color:${textMuted};margin-top:4px;">${sd.apoio}</div>` : ""}
          </div>`;
      } else if (isLast) {
        inner = `
          <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
            <div style="font-size:13px;color:${textMuted};line-height:1.6;">${sd?.corpo || cta}</div>
            <div style="font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:15px;margin-top:16px;">${sd?.assinatura || sig}</div>
          </div>`;
      } else {
        const hasAI = !!(sd?.titulo || sd?.corpo);
        inner = `
          <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
            ${sd?.titulo ? `<div style="font-family:'${fontD}',Georgia,serif;font-size:15px;font-style:italic;color:${text};line-height:1.3;">${sd.titulo}</div>` : ""}
            <div style="font-size:13px;color:${textMuted};line-height:1.6;">${sd?.corpo || st.desc}</div>
            ${!hasAI ? `<div style="border-top:1px dashed ${border};padding-top:10px;font-size:11px;color:${textDim};font-family:'DM Mono',monospace;letter-spacing:.05em;">[ escrever aqui ]</div>` : ""}
          </div>`;
      }

      return `
      <div style="width:260px;min-height:260px;border-radius:6px;flex-shrink:0;background:${fmtBg};border:${fmtBrd};padding:22px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.15em;color:${lblClr};text-transform:uppercase;">${label}</span>
          <span style="font-family:'DM Mono',monospace;font-size:9px;color:${textDim};">${String(i+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}</span>
        </div>
        ${inner}
      </div>`;
    });

    body = `
    ${header}${hero}
    <main style="padding:40px 40px 0;">
      <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:20px;">Estrutura dos Slides · ${n} slides</div>
      <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:16px;">${slides.join("")}</div>
      <div style="margin-top:32px;padding:20px;background:${surface};border:1px solid ${border};border-radius:4px;border-left:2px solid ${fmt.border};">
        <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:10px;">Orientações de Identidade</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
          ${[["Fundo","Cor de fundo: "+b.corSecundaria],["Tipografia","Fonte display: "+fontD+" · Corpo: "+fontB],["Acento","Cor primária: "+primary]].map(([k,v])=>`
          <div><div style="font-size:11px;color:${textDim};margin-bottom:4px;">${k}</div><div style="font-size:13px;color:${textMuted};">${v}</div></div>`).join("")}
        </div>
      </div>
    </main>
    ${footer}`;
  }

  // ── ESTÁTICO ─────────────────────────────────────────────────────────────────
  else if (post.format === "Estático") {
    const mainQuote = content?.frase_principal || post.hook;
    const apoio     = content?.texto_apoio;

    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:20px;">Mockup do Post</div>
      <div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">
        <div style="width:420px;height:420px;flex-shrink:0;border-radius:8px;background:${b.corSecundaria};border:1px solid ${fmt.border};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${primary},${b.corDestaque},transparent);"></div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;color:${primary}77;text-transform:uppercase;margin-bottom:28px;">${post.pilar}</div>
          <div style="font-family:'${fontD}',Georgia,serif;font-size:clamp(18px,3vw,26px);font-style:italic;font-weight:400;color:${b.corTexto};line-height:1.45;text-align:center;">"${mainQuote}"</div>
          ${apoio ? `<div style="margin-top:16px;font-size:13px;color:${textMuted};text-align:center;font-family:'${fontB}',sans-serif;">${apoio}</div>` : ""}
          <div style="position:absolute;bottom:24px;right:28px;font-family:'${fontD}',Georgia,serif;font-size:13px;font-style:italic;color:${primary};">${sig}</div>
          <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${primary}44,transparent);"></div>
        </div>
        <div style="flex:1;min-width:240px;">
          <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:16px;">Especificações</div>
          ${[
            ["Dimensão","1080 × 1080 px (1:1)"],
            ["Fundo",b.corSecundaria],
            ["Cor principal",primary],
            ["Fonte",fontD+" · display"],
            ["Pilar",post.pilar],
            ["Tom","Afirmativo · Direto · Sem rodeios"],
          ].map(([k,v]) => `
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${border};">
            <span style="font-size:12px;color:${textDim};font-family:'DM Mono',monospace;">${k}</span>
            <span style="font-size:13px;color:${textMuted};">${v}</span>
          </div>`).join("")}
        </div>
      </div>
    </main>
    ${footer}`;
  }

  // ── REELS ────────────────────────────────────────────────────────────────────
  else if (post.format === "Reels") {
    const dur  = b.reelsDuracao || "7–15s";
    const durN = parseInt(dur) || 15;
    const steps = content ? [
      { time:"0s – 2s",           label:"HOOK VISUAL",    color: fmt.light,      text: content.hook_visual   || "" },
      { time:"2s – porção central", label:"DESENVOLVIMENTO", color: primary,        text: content.desenvolvimento || "" },
      { time:"porção final",      label:"CONCLUSÃO / CTA", color: b.corDestaque,  text: content.conclusao     || "" },
    ] : [
      { time:"0s – 2s",                                label:"HOOK VISUAL",    color: fmt.light,     desc:"Frase de abertura em tela — sem contexto, direto ao ponto." },
      { time:`2s – ${Math.round(durN*0.6)}s`,          label:"DESENVOLVIMENTO", color: primary,       desc:"Argumento central em 1-2 frases. Provoca reflexão, não explica." },
      { time:`${Math.round(durN*0.6)}s – ${durN}s`,   label:"CONCLUSÃO / CTA", color: b.corDestaque, desc:"Virada ou pergunta final que leva ao perfil / link." },
    ];

    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="display:flex;gap:40px;align-items:flex-start;flex-wrap:wrap;">
        <div style="flex-shrink:0;">
          <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:16px;">Formato · ${dur}</div>
          <div style="width:220px;height:390px;border-radius:24px;border:2px solid ${fmt.border};background:${b.corSecundaria};position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;">
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,${bg}44 0%,transparent 40%,${bg}88 100%);pointer-events:none;"></div>
            <div style="text-align:center;z-index:1;">
              <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.15em;color:${primary};text-transform:uppercase;margin-bottom:12px;">${post.pilar}</div>
              <div style="font-family:'${fontD}',Georgia,serif;font-size:16px;font-style:italic;color:${b.corTexto};line-height:1.4;">"${content?.hook_visual || post.hook}"</div>
            </div>
            <div style="position:absolute;bottom:16px;left:0;right:0;text-align:center;font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:13px;">${sig}</div>
            <div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:40px;height:4px;border-radius:2px;background:${border};"></div>
          </div>
        </div>
        <div style="flex:1;min-width:280px;">
          <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:20px;">Roteiro</div>
          ${steps.map(st => `
          <div style="display:flex;gap:16px;margin-bottom:20px;">
            <div style="width:3px;border-radius:2px;background:${st.color};flex-shrink:0;min-height:60px;"></div>
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                <span style="font-family:'DM Mono',monospace;font-size:9px;color:${st.color};letter-spacing:.1em;text-transform:uppercase;">${st.label}</span>
                <span style="font-family:'DM Mono',monospace;font-size:10px;color:${textDim};">[${st.time}]</span>
              </div>
              <div style="font-size:13px;color:${textMuted};line-height:1.65;">${st.text || st.desc}</div>
              ${!st.text ? `<div style="margin-top:10px;border:1px dashed ${border};border-radius:3px;padding:10px;font-size:12px;color:${textDim};font-family:'DM Mono',monospace;">[ escrever aqui ]</div>` : ""}
            </div>
          </div>`).join("")}
          <div style="margin-top:8px;padding:14px;background:${surface};border:1px solid ${border};border-radius:4px;">
            <div style="font-size:11px;color:${textDim};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">CTA Final</div>
            <div style="font-size:13px;color:${textMuted};">${cta}</div>
          </div>
        </div>
      </div>
    </main>
    ${footer}`;
  }

  // ── BASTIDOR ─────────────────────────────────────────────────────────────────
  else if (post.format === "Bastidor") {
    const contexto = content?.contexto_visual;
    const angulo   = content?.angulo_narrativo;

    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;">
        <div style="aspect-ratio:1;border-radius:6px;background:${surface};border:1px dashed ${fmt.border};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;text-align:center;">
          <div style="width:48px;height:48px;border-radius:50%;border:2px dashed ${fmt.border};display:flex;align-items:center;justify-content:center;font-size:20px;color:${fmt.light};">◉</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.12em;color:${textDim};text-transform:uppercase;">Imagem ou Vídeo</div>
          ${contexto
            ? `<div style="font-size:13px;color:${textMuted};line-height:1.65;font-style:italic;">${contexto}</div>`
            : `<div style="font-size:13px;color:${textDim};line-height:1.6;">Foto ou clipe de bastidor<br>real · humano · espontâneo</div>`}
        </div>
        <div>
          <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:16px;">Briefing do Post</div>
          ${[
            ["Contexto",  contexto || "O que está acontecendo nessa cena"],
            ["Ângulo",    angulo   || "O que humaniza — não é sobre o produto, é sobre o processo"],
            ["Caption",   post.hook],
            ["Tom",       "Casual, direto, real. Sem texto excessivo na imagem."],
          ].map(([k,v]) => `
          <div style="margin-bottom:16px;">
            <div style="font-size:11px;color:${textDim};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">${k}</div>
            <div style="font-size:14px;color:${textMuted};line-height:1.6;font-style:${k==="Caption"?"italic":"normal"};padding:10px 14px;background:${surface};border:1px solid ${border};border-radius:3px;border-left:2px solid ${fmt.border};">${v}</div>
          </div>`).join("")}
          <div style="padding:14px;background:${surface};border:1px solid ${border};border-radius:4px;">
            <div style="font-size:11px;color:${textDim};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">CTA</div>
            <div style="font-size:13px;color:${textMuted};">${cta}</div>
          </div>
        </div>
      </div>
    </main>
    ${footer}`;
  }

  // ── ARCUS CLUB ───────────────────────────────────────────────────────────────
  else {
    const headline = content?.headline || post.hook;
    const corpo    = content?.corpo    || cta;
    const ctaTexto = content?.cta_texto || "Saiba Mais";

    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:24px;align-items:start;">
        <div style="border-radius:8px;background:linear-gradient(145deg,${b.corSecundaria},#100808);border:1px solid ${fmt.border};padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,${primary}0C 0%,transparent 70%);pointer-events:none;"></div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;color:${primary}77;text-transform:uppercase;margin-bottom:20px;">ARCUS CLUB · ${post.pilar.toUpperCase()}</div>
          <div style="font-family:'${fontD}',Georgia,serif;font-size:22px;font-style:italic;font-weight:400;color:${b.corTexto};line-height:1.45;margin-bottom:32px;">"${headline}"</div>
          <div style="height:1px;background:linear-gradient(90deg,${primary}44,transparent);margin-bottom:24px;"></div>
          <div style="font-size:14px;color:${textMuted};line-height:1.65;margin-bottom:24px;">${corpo}</div>
          <div style="display:inline-block;padding:10px 24px;background:${primary};color:#0A0800;border-radius:2px;font-size:12px;font-weight:600;font-family:'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;">${ctaTexto}</div>
          <div style="position:absolute;bottom:20px;right:24px;font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:14px;">${sig}</div>
        </div>
        <div>
          <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:16px;">Objetivo do Post</div>
          ${[
            ["Tipo",       post.pilar],
            ["Tom",        "Autoridade · Pertencimento · CTA direto mas elegante"],
            ["Objetivo",   "Despertar curiosidade e desejo de pertencer — não vender, convidar"],
            ["Visual",     "Escuro · premium · tipografia em destaque · sem poluição visual"],
            ["Métrica",    "Cliques no link · Mensagens diretas · Comentários de interesse"],
          ].map(([k,v]) => `
          <div style="margin-bottom:14px;">
            <div style="font-size:10px;color:${textDim};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">${k}</div>
            <div style="font-size:13px;color:${textMuted};line-height:1.6;">${v}</div>
          </div>`).join("")}
        </div>
      </div>
    </main>
    ${footer}`;
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${fmt.label} · ${post.pilar} · ${post.date}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="${gfonts}" rel="stylesheet">
<style>${baseCSS}</style>
</head>
<body>${body}</body>
</html>`;
}
