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

const FMT_MAP = {
  Carrossel:    { bg: "#0A1525", border: "#1A4A9A", light: "#5B9BD5", label: "CARROSSEL" },
  "Estático":   { bg: "#0A1810", border: "#1B6B3A", light: "#5BBD87", label: "ESTÁTICO"  },
  Reels:        { bg: "#150820", border: "#6B1A9A", light: "#B57BD5", label: "REELS"     },
  Bastidor:     { bg: "#1A0E05", border: "#8A3A0A", light: "#D5905B", label: "BASTIDOR"  },
  "Arcus Club": { bg: "#1A0505", border: "#8A1A1A", light: "#D55B5B", label: "ARCUS CLUB"},
};

function readBrand() {
  try { return { ...BRAND_FALLBACK, ...(JSON.parse(localStorage.getItem("arcus-brand")) || {}) }; }
  catch { return { ...BRAND_FALLBACK }; }
}

// ── detecção de tipo de conteúdo colado ──────────────────────────────────────
function detectContentType(raw) {
  const t = raw?.trim() || "";
  if (!t) return "empty";
  if (t.toLowerCase().startsWith("<!doctype") || t.toLowerCase().startsWith("<html")) return "html";
  // strip markdown fences
  const stripped = t.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim();
  if (stripped.toLowerCase().startsWith("<!doctype") || stripped.toLowerCase().startsWith("<html")) return "html-fenced";
  if (stripped.startsWith("{")) return "json";
  return "unknown";
}

function parseJSON(raw) {
  const t = raw?.trim() || "";
  const match = t.match(/\{[\s\S]*\}/);
  try { return match ? JSON.parse(match[0]) : null; } catch { return null; }
}

function stripFences(raw) {
  return raw.trim().replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "").trim();
}

// ── abertura de post em nova aba ─────────────────────────────────────────────
export function openPostInNewTab(post, rawContent = null) {
  const brand = readBrand();
  const type  = detectContentType(rawContent);

  let html;
  if (type === "html" || type === "html-fenced") {
    html = type === "html-fenced" ? stripFences(rawContent) : rawContent.trim();
  } else if (type === "json") {
    html = buildHTML(post, brand, parseJSON(rawContent));
  } else {
    html = buildHTML(post, brand, null);
  }

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ── gerador de prompt (HTML direto) ─────────────────────────────────────────
export function generatePrompt(post) {
  const b   = readBrand();
  const n   = Math.max(2, Math.min(15, parseInt(b.carrosselSlides) || 7));
  const fmt = FMT_MAP[post.format] || FMT_MAP["Estático"];

  const gfonts = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap`;

  const base =
`Gere um arquivo HTML completo e autocontido para visualização de um post de Instagram.
O HTML deve funcionar diretamente no navegador sem dependências externas, exceto Google Fonts.

━━━ SISTEMA DE DESIGN ━━━
Google Fonts (importar obrigatoriamente):
${gfonts}

Cores exatas a usar:
  bg-page:      #080808   (fundo da página)
  bg-card:      #141414   (fundo dos cards/seções internas)
  border:       #2A2A2A   (bordas padrão)
  text-main:    ${b.corTexto}   (texto principal)
  text-muted:   #A09890   (texto secundário)
  text-dim:     #5A5550   (texto fraco, labels)
  gold:         ${b.corPrimaria}   (dourado — destaques, assinatura, CTAs)
  violet:       ${b.corDestaque}   (violeta — acentos secundários)
  fmt-bg:       ${fmt.bg}
  fmt-border:   ${fmt.border}
  fmt-light:    ${fmt.light}

Tipografia:
  display → '${b.fonteDisplay}', Georgia, serif   → títulos, citações — SEMPRE em itálico
  body    → '${b.fonteCorpo}', Outfit, sans-serif → texto corrido
  mono    → 'DM Mono', monospace                  → labels, badges, números (uppercase, letter-spacing ≥ .1em)

Estética: premium, austero, minimal. Fundo escuro. Texto respira no espaço. Sem emojis nos posts.

━━━ ESTRUTURA BASE OBRIGATÓRIA ━━━
1. <header> sticky, height 56px, background rgba(8,8,8,.94), backdrop-filter blur(12px), border-bottom 1px solid #2A2A2A
   • Esquerda: badge "${fmt.label}" (bg ${fmt.bg}, cor ${fmt.light}, borda ${fmt.border}, DM Mono 10px uppercase padding 3px 10px)
               + texto "${post.pilar.toUpperCase()}" (DM Mono 12px #5A5550)
               + texto "${post.date} · ${post.week}" (DM Mono 12px #5A5550)
   • Direita:  "${b.assinatura}" (${b.fonteDisplay} italic 16px cor ${b.corPrimaria})

2. <section> hero, padding 60px 40px 48px, border-bottom 1px solid #2A2A2A
   • "${post.pilar}" em DM Mono 10px uppercase cor ${b.corPrimaria}88 letter-spacing .22em mb 20px
   • Hook "${post.hook}" em ${b.fonteDisplay} italic font-size clamp(32px,5vw,58px) font-weight 300 lh 1.1 max-width 800px
   • Linha: height 1px, width 80px, background linear-gradient(90deg, ${b.corPrimaria}, transparent), mt 24px

3. <footer> padding 32px 40px 48px, border-top 1px solid #2A2A2A
   • Seção "Caption para Publicação" (DM Mono 10px uppercase label cor ${b.corPrimaria}99 mb 14px):
     texto da caption gerada em ${b.fonteCorpo} 15px lh 1.85 white-space:pre-wrap, mb 28px, pb 28px, border-bottom
   • Grid 2 colunas (2fr 1fr): [CTA padrão "${b.ctaPadrao}" + hashtags] | [4 swatches 24×24px das cores + nome da fonte]

━━━ IDENTIDADE DA MARCA ━━━
Assinatura: ${b.assinatura}
Tom de voz: ${b.tomDeVoz}
CTA padrão: ${b.ctaPadrao}
Hashtags: ${b.hashtags}

━━━ DADOS DO POST ━━━
Formato: ${post.format}
Pilar: ${post.pilar}
Hook (frase de abertura): "${post.hook}"
Data: ${post.date} · ${post.week}
`;

  let specific = "";

  // ── CARROSSEL ──────────────────────────────────────────────────────────────
  if (post.format === "Carrossel") {
    const LABELS = ["ABERTURA","CONTEXTO","DIAGNÓSTICO","RAIZ","SOLUÇÃO","AÇÃO","CTA","EXTRA 1","EXTRA 2","EXTRA 3","EXTRA 4","EXTRA 5","CTA FINAL"];
    const slideList = Array.from({length: n}, (_, i) => {
      const label = LABELS[Math.min(i, LABELS.length-1)];
      if (i === 0) return `  Slide 1 ABERTURA: título = o hook. Subtítulo de apoio (1 linha, intensifica sem explicar).`;
      if (i === n-1) return `  Slide ${n} CTA: texto CTA adaptado ao post + assinatura "${b.assinatura}" em ${b.fonteDisplay} italic ${b.corPrimaria}.`;
      return `  Slide ${i+1} ${label}: título impactivo ≤8 palavras + corpo 2-3 linhas (gere conteúdo real, sem placeholders).`;
    }).join("\n");

    specific =
`
━━━ SEÇÃO PRINCIPAL — CARROSSEL ${n} SLIDES ━━━
Após o hero, <main> padding 40px:
  Label "Estrutura dos Slides · ${n} slides" em DM Mono 11px #5A5550 uppercase mb 20px

Row de cards (overflow-x:auto, display:flex, gap:12px, pb:16px):
Cada card: width 270px, min-height 270px, border-radius 6px, padding 22px, display:flex flex-direction:column gap:12px flex-shrink:0

  • Slide 1: bg linear-gradient(145deg,${fmt.bg},#080808), borda 2px solid ${fmt.border}
    - Topo: label "ABERTURA" DM Mono 9px cor ${fmt.light} uppercase | contador "01/${String(n).padStart(2,"0")}" DM Mono 9px #5A5550
    - Corpo: "${post.hook}" em ${b.fonteDisplay} italic 18px lh 1.5 flex:1 alinhado ao centro vertical
    - Subtítulo de apoio logo abaixo: Outfit 13px cor #A09890 (GERE: 1 linha que intensifica o hook)

  • Slides 2 a ${n-1}: bg #141414, borda 1px solid #2A2A2A
    - Topo: label (${b.fonteDisplay} style) DM Mono 9px #5A5550 uppercase | contador
    - Título do slide: ${b.fonteDisplay} italic 15px cor ${b.corTexto} lh 1.3 (GERE título impactivo)
    - Corpo: Outfit 13px cor #A09890 lh 1.6 (GERE 2-3 linhas de conteúdo real sem placeholders)

  • Último slide (CTA): bg #141414, borda 2px solid ${b.corPrimaria}44
    - Corpo CTA: Outfit 13px cor #A09890 lh 1.6 (GERE CTA contextualizado ao argumento do post)
    - Assinatura: ${b.fonteDisplay} italic cor ${b.corPrimaria} font-size 15px mt auto

Após a row: bloco de identidade (bg #141414, borda-esq 2px ${fmt.border}) com 3 colunas: Fundo / Tipografia / Acento

CONTEÚDO A GERAR (${n} slides, TUDO REAL, sem "[escrever aqui]"):
${slideList}

Gere também a caption completa (inclui hashtags) para o footer.
`;
  }

  // ── REELS ──────────────────────────────────────────────────────────────────
  else if (post.format === "Reels") {
    specific =
`
━━━ SEÇÃO PRINCIPAL — REELS (${b.reelsDuracao}) ━━━
<main> padding 40px, display:flex gap:40px align-items:flex-start flex-wrap:wrap

Coluna esquerda — mockup de celular:
  width 220px height 390px border-radius 24px border 2px solid ${fmt.border}
  background ${b.corSecundaria} overflow:hidden position:relative
  Overlay de gradiente: linear-gradient(180deg, rgba(8,8,8,.44) 0%, transparent 40%, rgba(8,8,8,.88) 100%)
  Notch no topo: div 40px×4px border-radius 2px bg #2A2A2A centrado
  Conteúdo centralizado (z-index 1):
    - Pilar em DM Mono 9px uppercase cor ${b.corPrimaria} letter-spacing .15em mb 12px
    - Hook visual (gere versão visual ≤8 palavras) em ${b.fonteDisplay} italic 16px lh 1.4 text-center
  Assinatura no fundo: "${b.assinatura}" ${b.fonteDisplay} italic cor ${b.corPrimaria} 13px

Coluna direita — roteiro (flex:1 min-width:280px):
  Label "Roteiro" DM Mono 10px #5A5550 uppercase mb 20px
  3 blocos empilhados (mb 20px cada), cada bloco: display:flex gap:16px
    Linha vertical: width 3px border-radius 2px min-height 60px flex-shrink:0
    Conteúdo:
      - Label em DM Mono 9px uppercase + tempo entre colchetes DM Mono 10px #5A5550
      - Texto do roteiro em Outfit 13px #A09890 lh 1.65 (GERE conteúdo real)

  Bloco 1 "HOOK VISUAL" [0s–2s] linha cor ${fmt.light}:
    GERE: frase de impacto para tela, ≤8 palavras, sem ponto final, sem contexto
  Bloco 2 "DESENVOLVIMENTO" [2s – porção central] linha cor ${b.corPrimaria}:
    GERE: argumento central 2-3 frases (use ' / ' para indicar cortes de cena)
  Bloco 3 "CONCLUSÃO / CTA" [porção final] linha cor ${b.corDestaque}:
    GERE: virada + CTA mencionando ${b.assinatura} 1-2 frases

  Box "CTA Final" (bg #141414, borda #2A2A2A, mt 8px): "${b.ctaPadrao}"

Gere também a caption completa para o footer.
`;
  }

  // ── ESTÁTICO ───────────────────────────────────────────────────────────────
  else if (post.format === "Estático") {
    specific =
`
━━━ SEÇÃO PRINCIPAL — ESTÁTICO 1080×1080px ━━━
<main> padding 40px, display:flex gap:32px align-items:flex-start flex-wrap:wrap

Mockup quadrado (width 420px height 420px flex-shrink:0):
  background ${b.corSecundaria}
  border 1px solid ${fmt.border}
  border-radius 8px
  overflow:hidden position:relative
  Barra de destaque topo (height 3px): linear-gradient(90deg, ${b.corPrimaria}, ${b.corDestaque}, transparent)
  Conteúdo centralizado (padding 40px, text-align center):
    - Pilar: DM Mono 9px uppercase cor ${b.corPrimaria}77 letter-spacing .2em mb 28px
    - Frase principal: ${b.fonteDisplay} italic font-size clamp(18px,3vw,26px) lh 1.45 cor ${b.corTexto}
      GERE: versão visual do hook, ≤12 palavras, autossuficiente, impactiva
    - Texto de apoio (opcional, pode omitir se não agregar):
      Outfit 13px cor #A09890 text-center mt 16px
      GERE: 1 linha de apoio ou não inclua
  Assinatura canto inferior direito: "${b.assinatura}" ${b.fonteDisplay} italic cor ${b.corPrimaria} 13px

Coluna de especificações (flex:1 min-width:240px):
  Label "Especificações" DM Mono 10px #5A5550 uppercase mb 16px
  Tabela de linhas (border-bottom 1px #2A2A2A padding 10px 0) com:
    Dimensão / Fundo / Cor principal / Fonte / Pilar / Tom
  (preencha com os valores reais da identidade)

Gere também a caption completa para o footer.
`;
  }

  // ── BASTIDOR ───────────────────────────────────────────────────────────────
  else if (post.format === "Bastidor") {
    specific =
`
━━━ SEÇÃO PRINCIPAL — BASTIDOR ━━━
<main> padding 40px, display:grid grid-template-columns:1fr 1fr gap:24px align-items:start

Coluna 1 — placeholder de imagem/vídeo (aspect-ratio:1):
  background #141414
  border 1px dashed ${fmt.border}
  border-radius 6px
  Conteúdo centralizado (padding 32px, text-align center):
    - Ícone ◉ 48×48px circular border dashed ${fmt.border} cor ${fmt.light} font-size 20px
    - Label "Imagem ou Vídeo" DM Mono 11px #5A5550 uppercase letter-spacing .12em mt 12px
    - Sugestão de cena: Outfit 13px #5A5550 lh 1.6 mt 8px
      GERE: descrição da cena ideal para este post (ambiente, ação, composição)

Coluna 2 — briefing:
  Label "Briefing do Post" DM Mono 10px #5A5550 uppercase mb 16px
  4 campos empilhados (mb 16px cada):
    Label do campo DM Mono 11px #5A5550 uppercase letter-spacing .1em mb 6px
    Valor em bloco (padding 10px 14px, bg #141414, borda #2A2A2A, borda-esq 2px ${fmt.border})

  Campo "Contexto": GERE descrição do que acontece nessa cena
  Campo "Ângulo": GERE o ponto humano — o que essa cena comunica sobre processo/valores
  Campo "Caption": "${post.hook}" (em itálico)
  Campo "Tom": "Casual, direto, real. Sem texto excessivo na imagem."

  Box CTA (bg #141414, borda #2A2A2A): "${b.ctaPadrao}"

Gere também a caption completa (primeira pessoa, tom pessoal) para o footer.
`;
  }

  // ── ARCUS CLUB ─────────────────────────────────────────────────────────────
  else {
    specific =
`
━━━ SEÇÃO PRINCIPAL — ARCUS CLUB ━━━
<main> padding 40px, display:grid grid-template-columns:3fr 2fr gap:24px align-items:start

Coluna 1 — mockup premium:
  background linear-gradient(145deg, ${b.corSecundaria}, #100808)
  border 1px solid ${fmt.border}
  border-radius 8px
  padding 40px
  overflow:hidden position:relative
  Ornamento: div 200×200px radial-gradient ${b.corPrimaria}0C, posicionado top:-40px right:-40px

  Conteúdo:
    - Eyebrow "ARCUS CLUB · ${post.pilar.toUpperCase()}" DM Mono 9px cor ${b.corPrimaria}77 letter-spacing .22em uppercase mb 20px
    - Headline: ${b.fonteDisplay} italic 22px lh 1.45 cor ${b.corTexto} mb 32px
      GERE: headline sobre transformação ou pertencimento, 8-12 palavras, não sobre features
    - Linha separadora: 1px linear-gradient(90deg, ${b.corPrimaria}44, transparent) mb 24px
    - Corpo: Outfit 14px cor #A09890 lh 1.65 mb 24px
      GERE: 2-3 frases sobre o valor de pertencer ao programa, sem linguagem de vendas
    - Botão CTA: padding 10px 24px bg ${b.corPrimaria} cor #0A0800 border-radius 2px DM Mono 12px font-weight 600 uppercase letter-spacing .1em
      GERE: texto do botão contextualizado (não use "Saiba Mais" genérico)
    - Assinatura canto inferior direito: "${b.assinatura}" ${b.fonteDisplay} italic cor ${b.corPrimaria} 14px

Coluna 2 — brief (5 campos):
  Label DM Mono 10px #5A5550 uppercase mb 16px
  Campos: Tipo / Tom / Objetivo / Visual / Métrica (DM Mono label + Outfit valor)

Gere também a caption completa para o footer.
`;
  }

  const output =
`
━━━ OUTPUT ━━━
Retorne APENAS o HTML completo começando com <!DOCTYPE html>.
Sem markdown. Sem \`\`\`html. Sem texto antes ou depois do HTML.
O arquivo deve ser autocontido e funcionar diretamente no navegador.
`;

  return base + specific + output;
}

// ── metadados por formato ────────────────────────────────────────────────────
const FMT = FMT_MAP;

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

// ── template fallback (sem conteúdo gerado) ──────────────────────────────────
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
      </div>
    </div>
  </footer>`;

  let body = "";

  if (post.format === "Carrossel") {
    const slides = Array.from({ length: n }, (_, i) => {
      const isFirst = i === 0, isLast = i === n - 1;
      const st = SLIDE_STRUCTURE[Math.min(i, SLIDE_STRUCTURE.length - 1)];
      const sd = content?.slides?.[i] || null;
      const fmtBg  = isFirst ? `linear-gradient(145deg,${fmt.bg},${bg})` : surface;
      const fmtBrd = isFirst ? `2px solid ${fmt.border}` : isLast ? `2px solid ${primary}44` : `1px solid ${border}`;
      const lblClr = isFirst ? fmt.light : textDim;
      let inner = "";
      if (isFirst) {
        inner = `<div style="font-family:'${fontD}',Georgia,serif;font-size:18px;font-style:italic;color:${text};line-height:1.5;flex:1;display:flex;flex-direction:column;justify-content:center;gap:8px;">
          <div>"${sd?.titulo || post.hook}"</div>
          ${sd?.apoio ? `<div style="font-size:13px;font-style:normal;font-family:'${fontB}',sans-serif;color:${textMuted};margin-top:4px;">${sd.apoio}</div>` : ""}
        </div>`;
      } else if (isLast) {
        inner = `<div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="font-size:13px;color:${textMuted};line-height:1.6;">${sd?.corpo || cta}</div>
          <div style="font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:15px;margin-top:16px;">${sd?.assinatura || sig}</div>
        </div>`;
      } else {
        const hasAI = !!(sd?.titulo || sd?.corpo);
        inner = `<div style="flex:1;display:flex;flex-direction:column;gap:8px;">
          ${sd?.titulo ? `<div style="font-family:'${fontD}',Georgia,serif;font-size:15px;font-style:italic;color:${text};line-height:1.3;">${sd.titulo}</div>` : ""}
          <div style="font-size:13px;color:${textMuted};line-height:1.6;">${sd?.corpo || st.desc}</div>
          ${!hasAI ? `<div style="border-top:1px dashed ${border};padding-top:10px;font-size:11px;color:${textDim};font-family:'DM Mono',monospace;letter-spacing:.05em;">[ escrever aqui ]</div>` : ""}
        </div>`;
      }
      return `<div style="width:270px;min-height:270px;border-radius:6px;flex-shrink:0;background:${fmtBg};border:${fmtBrd};padding:22px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.15em;color:${lblClr};text-transform:uppercase;">${sd?.label || st.label}</span>
          <span style="font-family:'DM Mono',monospace;font-size:9px;color:${textDim};">${String(i+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}</span>
        </div>${inner}</div>`;
    });
    body = `${header}${hero}<main style="padding:40px 40px 0;">
      <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:20px;">Estrutura dos Slides · ${n} slides</div>
      <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:16px;">${slides.join("")}</div>
      <div style="margin-top:32px;padding:20px;background:${surface};border:1px solid ${border};border-radius:4px;border-left:2px solid ${fmt.border};">
        <div style="font-family:'DM Mono',monospace;font-size:10px;color:${textDim};text-transform:uppercase;letter-spacing:.15em;margin-bottom:10px;">Orientações de Identidade</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
          ${[["Fundo",b.corSecundaria],["Tipografia",fontD+" · "+fontB],["Acento",primary]].map(([k,v])=>`<div><div style="font-size:11px;color:${textDim};mb:4px;">${k}</div><div style="font-size:13px;color:${textMuted};">${v}</div></div>`).join("")}
        </div>
      </div></main>${footer}`;
  } else if (post.format === "Estático") {
    const mainQ = content?.frase_principal || post.hook;
    body = `${header}${hero}<main style="padding:40px;">
      <div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">
        <div style="width:420px;height:420px;flex-shrink:0;border-radius:8px;background:${b.corSecundaria};border:1px solid ${fmt.border};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${primary},${b.corDestaque},transparent);"></div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;color:${primary}77;text-transform:uppercase;margin-bottom:28px;">${post.pilar}</div>
          <div style="font-family:'${fontD}',Georgia,serif;font-size:clamp(18px,3vw,26px);font-style:italic;color:${b.corTexto};line-height:1.45;text-align:center;">"${mainQ}"</div>
          ${content?.texto_apoio ? `<div style="margin-top:16px;font-size:13px;color:${textMuted};text-align:center;">${content.texto_apoio}</div>` : ""}
          <div style="position:absolute;bottom:24px;right:28px;font-family:'${fontD}',Georgia,serif;font-size:13px;font-style:italic;color:${primary};">${sig}</div>
        </div>
        <div style="flex:1;min-width:240px;">
          <div style="font-family:'DM Mono',monospace;font-size:10px;color:${textDim};text-transform:uppercase;letter-spacing:.15em;margin-bottom:16px;">Especificações</div>
          ${[["Dimensão","1080 × 1080 px"],["Fundo",b.corSecundaria],["Cor principal",primary],["Fonte",fontD],["Pilar",post.pilar],["Tom","Afirmativo · Direto"]].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${border};"><span style="font-size:12px;color:${textDim};font-family:'DM Mono',monospace;">${k}</span><span style="font-size:13px;color:${textMuted};">${v}</span></div>`).join("")}
        </div>
      </div></main>${footer}`;
  } else if (post.format === "Reels") {
    const dur = b.reelsDuracao || "7–15s";
    const durN = parseInt(dur) || 15;
    const steps = content ? [
      { time:"0s–2s", label:"HOOK VISUAL", color:fmt.light, text:content.hook_visual||"" },
      { time:"2s–central", label:"DESENVOLVIMENTO", color:primary, text:content.desenvolvimento||"" },
      { time:"final", label:"CONCLUSÃO/CTA", color:b.corDestaque, text:content.conclusao||"" },
    ] : [
      { time:"0s–2s", label:"HOOK VISUAL", color:fmt.light, desc:"Frase de abertura em tela." },
      { time:`2s–${Math.round(durN*.6)}s`, label:"DESENVOLVIMENTO", color:primary, desc:"Argumento central." },
      { time:`${Math.round(durN*.6)}s–${durN}s`, label:"CONCLUSÃO/CTA", color:b.corDestaque, desc:"Virada + CTA." },
    ];
    body = `${header}${hero}<main style="padding:40px;">
      <div style="display:flex;gap:40px;align-items:flex-start;flex-wrap:wrap;">
        <div style="flex-shrink:0;">
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:${textDim};text-transform:uppercase;letter-spacing:.15em;margin-bottom:16px;">Formato · ${dur}</div>
          <div style="width:220px;height:390px;border-radius:24px;border:2px solid ${fmt.border};background:${b.corSecundaria};position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;">
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,8,8,.44) 0%,transparent 40%,rgba(8,8,8,.88) 100%);"></div>
            <div style="text-align:center;z-index:1;">
              <div style="font-family:'DM Mono',monospace;font-size:9px;color:${primary};text-transform:uppercase;letter-spacing:.15em;margin-bottom:12px;">${post.pilar}</div>
              <div style="font-family:'${fontD}',Georgia,serif;font-size:16px;font-style:italic;color:${b.corTexto};line-height:1.4;">"${content?.hook_visual||post.hook}"</div>
            </div>
            <div style="position:absolute;bottom:16px;left:0;right:0;text-align:center;font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:13px;">${sig}</div>
            <div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:40px;height:4px;border-radius:2px;background:${border};"></div>
          </div>
        </div>
        <div style="flex:1;min-width:280px;">
          <div style="font-family:'DM Mono',monospace;font-size:10px;color:${textDim};text-transform:uppercase;letter-spacing:.15em;margin-bottom:20px;">Roteiro</div>
          ${steps.map(st=>`<div style="display:flex;gap:16px;margin-bottom:20px;">
            <div style="width:3px;border-radius:2px;background:${st.color};flex-shrink:0;min-height:60px;"></div>
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                <span style="font-family:'DM Mono',monospace;font-size:9px;color:${st.color};letter-spacing:.1em;text-transform:uppercase;">${st.label}</span>
                <span style="font-family:'DM Mono',monospace;font-size:10px;color:${textDim};">[${st.time}]</span>
              </div>
              <div style="font-size:13px;color:${textMuted};line-height:1.65;">${st.text||st.desc}</div>
              ${!st.text?`<div style="margin-top:10px;border:1px dashed ${border};border-radius:3px;padding:10px;font-size:12px;color:${textDim};font-family:'DM Mono',monospace;">[ escrever aqui ]</div>`:""}
            </div>
          </div>`).join("")}
        </div>
      </div></main>${footer}`;
  } else if (post.format === "Bastidor") {
    body = `${header}${hero}<main style="padding:40px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
        <div style="aspect-ratio:1;border-radius:6px;background:${surface};border:1px dashed ${fmt.border};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;text-align:center;">
          <div style="width:48px;height:48px;border-radius:50%;border:2px dashed ${fmt.border};display:flex;align-items:center;justify-content:center;font-size:20px;color:${fmt.light};">◉</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:${textDim};text-transform:uppercase;letter-spacing:.12em;">Imagem ou Vídeo</div>
          <div style="font-size:13px;color:${textDim};line-height:1.6;">${content?.contexto_visual||"Foto ou clipe real · humano · espontâneo"}</div>
        </div>
        <div>
          ${[["Contexto",content?.contexto_visual||"O que está acontecendo nessa cena"],["Ângulo",content?.angulo_narrativo||"O que humaniza — processo e pessoas"],["Caption",post.hook],["Tom","Casual, direto, real."]].map(([k,v])=>`<div style="margin-bottom:16px;"><div style="font-size:11px;color:${textDim};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">${k}</div><div style="font-size:14px;color:${textMuted};line-height:1.6;font-style:${k==="Caption"?"italic":"normal"};padding:10px 14px;background:${surface};border:1px solid ${border};border-left:2px solid ${fmt.border};">${v}</div></div>`).join("")}
        </div>
      </div></main>${footer}`;
  } else {
    const headline = content?.headline || post.hook;
    const corpo    = content?.corpo    || cta;
    const ctaTxt   = content?.cta_texto || "Saiba Mais";
    body = `${header}${hero}<main style="padding:40px;">
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:24px;">
        <div style="border-radius:8px;background:linear-gradient(145deg,${b.corSecundaria},#100808);border:1px solid ${fmt.border};padding:40px;position:relative;overflow:hidden;">
          <div style="font-family:'DM Mono',monospace;font-size:9px;color:${primary}77;text-transform:uppercase;letter-spacing:.22em;margin-bottom:20px;">ARCUS CLUB · ${post.pilar.toUpperCase()}</div>
          <div style="font-family:'${fontD}',Georgia,serif;font-size:22px;font-style:italic;color:${b.corTexto};line-height:1.45;margin-bottom:32px;">"${headline}"</div>
          <div style="height:1px;background:linear-gradient(90deg,${primary}44,transparent);margin-bottom:24px;"></div>
          <div style="font-size:14px;color:${textMuted};line-height:1.65;margin-bottom:24px;">${corpo}</div>
          <div style="display:inline-block;padding:10px 24px;background:${primary};color:#0A0800;border-radius:2px;font-size:12px;font-weight:600;font-family:'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;">${ctaTxt}</div>
          <div style="position:absolute;bottom:20px;right:24px;font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:14px;">${sig}</div>
        </div>
        <div>${[["Tipo",post.pilar],["Tom","Autoridade · Pertencimento"],["Objetivo","Convidar, não vender"],["Visual","Escuro · premium"],["Métrica","Cliques · DMs · Comentários"]].map(([k,v])=>`<div style="margin-bottom:14px;"><div style="font-size:10px;color:${textDim};font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em;margin-bottom:5px;">${k}</div><div style="font-size:13px;color:${textMuted};line-height:1.6;">${v}</div></div>`).join("")}</div>
      </div></main>${footer}`;
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
