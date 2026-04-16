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

// ── gerador de prompt (HTML direto — formato provado) ───────────────────────
export function generatePrompt(post) {
  const b      = readBrand();
  const n      = Math.max(2, Math.min(15, parseInt(b.carrosselSlides) || 7));
  const handle = b.handle || "@oviniciusbohn";
  const slug   = post.hook
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const fmtSlides = { Carrossel: n, "Estático": 1, Reels: 5, Bastidor: 1, "Arcus Club": 1 };
  const fmtDesc   = {
    Carrossel:    "carrossel de Instagram",
    "Estático":   "post estático de Instagram",
    Reels:        "storyboard de Reels para Instagram",
    Bastidor:     "post de bastidor para Instagram",
    "Arcus Club": "post premium do Arcus Club para Instagram",
  };
  const totalSlides = fmtSlides[post.format] || 1;
  const NN          = String(totalSlides).padStart(2, "0");

  const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

  const base =
`━━━ INPUTS — PREENCHA ANTES DE ENVIAR ━━━
Pilar:  ${post.pilar}
Hook:   ${post.hook}
Handle: ${handle}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gere um arquivo HTML completo e autocontido que renderiza visualmente um ${fmtDesc[post.format] || "post de Instagram"}.
O HTML deve funcionar diretamente no navegador sem dependências externas, exceto Google Fonts.
Não inclua header, footer, painéis explicativos, swatches ou qualquer elemento de documentação.
O arquivo deve renderizar APENAS os slides do post, como seriam vistos no Instagram.

━━━ SISTEMA DE DESIGN ━━━
Google Fonts (importar obrigatoriamente):
https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Jost:wght@400;500;600&display=swap

Cores exatas:
  bg:           #080808
  text-main:    #F2EDE4
  text-muted:   #8A8070
  gold-start:   #C9A84C
  gold-end:     #E2C37A
  border:       #2A2A2A

Tipografia:
  display → 'Playfair Display', Georgia, serif   → headlines, frases de impacto — SEMPRE bold italic
  body    → 'Jost', sans-serif                   → texto corrido, labels, CTAs

Gradiente dourado (para palavras-chave em destaque):
  background: linear-gradient(135deg, #C9A84C, #E2C37A)
  -webkit-background-clip: text
  -webkit-text-fill-color: transparent
  background-clip: text
  display: inline-block

Estética: dark luxury. Grain texture. Glow radial dourado. Minimal. Sem emojis.

━━━ TOM E VOZ — REGRAS OBRIGATÓRIAS ━━━
Tom: conversa 1:1 com um empreendedor. Direto, sem rodeios, sem jargão acadêmico.
Proibido usar:
  • Fórmula "X não é Y. É Z" ou variações ("não é sobre X, é sobre Y", "não está X, está Y")
  • Fórmula "Você não tem X. Tem Y" / "Você não está X, está Y"
  • Travessões (—) em qualquer posição
  • Palavras: "jornada", "ecossistema", "impacto", "sinergias", "estratégico" (como adjetivo vago)
Prefira: observações concretas, situações que o leitor reconhece, afirmações diretas sem inversão forçada.

━━━ DIRETRIZES POR PILAR ━━━
Processos: sempre conectar à consequência financeira real — aumento de margem, redução de custo,
  aumento de lucro ou ganho de capacidade sem aumento de headcount. Evitar conteúdo de processo
  genérico ("tenha processos!"). O argumento deve tangibilizar o valor em termos de negócio.

Tecnologia e IA: SEMPRE conectar tecnologia à estratégia de negócio e ao resultado mensurável.
  Proibido: "IA é o futuro", "automatize tudo", conteúdo genérico de tendência.
  Obrigatório: qual problema de negócio a tecnologia resolve, qual resultado ela produz,
  por que a sequência (processo → simplificação → automação) importa antes da ferramenta.

Estratégia: focar em decisões de negócio com impacto em margem, modelo de receita ou escala.
  Conectar sempre ao concreto: um número, uma situação real, uma decisão que o leitor pode tomar.

Liderança e Cultura (25% do calendário): conteúdo humanizado, situações reconhecíveis,
  sem teoria de gestão. Tom mais próximo, primeira ou segunda pessoa.

━━━ ELEMENTOS VISUAIS DE FUNDO (presentes em TODOS os slides) ━━━
Aplicar dentro de cada slide via position:absolute, pointer-events:none, z-index baixo:

  1. Grain texture (z-index 5, opacity 0.18, mix-blend-mode overlay):
     background-image: ${GRAIN}
     background-repeat: repeat; background-size: 200px 200px

  2. Glow radial inferior-esquerdo (z-index 2, opacity 1):
     background: radial-gradient(ellipse 60% 70% at 0% 100%, #C9A84C45 0%, transparent 70%)
     position: absolute; bottom:0; left:0; right:0; height: 320px

  3. Glow de fundo sutil (z-index 2):
     background:
       radial-gradient(ellipse 60% 50% at 20% 40%, #C9A84C0D 0%, transparent 65%),
       radial-gradient(ellipse 40% 40% at 75% 50%, #C9A84C06 0%, transparent 60%)
     position: absolute; inset: 0

  4. Shape geométrico (z-index 2, direita do slide):
     width/height: 260px; border-radius: 50%
     border: 1px solid #C9A84C14
     position: absolute; right: 40px; top: 50%; transform: translateY(-50%)
     ::after pseudo-element: inset 24px; mesmo border

━━━ LAYOUT DOS SLIDES ━━━
Cada slide: width 1080px, height 1350px (formato 4:5 do Instagram), background #080808, position relative, overflow hidden, flex-shrink 0.
Os slides são exibidos centralizados na página, empilhados verticalmente, gap 24px, sobre fundo #333.
Body: display flex, flex-direction column, align-items center, padding 40px 0 64px, gap 24px.
Não há nav, header, footer nem qualquer outro elemento além dos slides.

━━━ ELEMENTOS FIXOS EM CADA SLIDE ━━━
Handle (position absolute, bottom 56px, right 64px, z-index 20):
  font-family Playfair Display, bold italic, font-size 22px, color #F2EDE4, opacity 0.5
  Texto: conforme Handle nos INPUTS.

Contador (position absolute, top 56px, left 64px, z-index 20):
  font-family Jost, font-size 13px, font-weight 500, letter-spacing 0.1em, color #8A8070, opacity 0.7
  Texto: "01/${NN}", "02/${NN}" etc.

━━━ DADOS DO POST ━━━
Formato: ${post.format}
Pilar, Hook e Handle: conforme seção INPUTS no topo deste prompt.
`;

  let specific = "";

  // ── CARROSSEL ──────────────────────────────────────────────────────────────
  if (post.format === "Carrossel") {
    const MID_LABELS = ["Contexto","Diagnóstico","Raiz","Solução","Ação","Extra 1","Extra 2","Extra 3","Extra 4","Extra 5","Extra 6"];
    const middleSlides = Array.from({length: n - 2}, (_, i) => {
      const lbl = MID_LABELS[Math.min(i, MID_LABELS.length - 1)];
      return `Slide ${i+2} ${lbl.toUpperCase().padEnd(12)}: label "${lbl}". Título impactivo ≤7 palavras com span.gold na palavra central. Corpo 2–3 linhas reais.`;
    }).join("\n");

    specific =
`
━━━ CONTEÚDO DOS ${n} SLIDES (TUDO REAL, SEM PLACEHOLDERS) ━━━
Use o Pilar e o Hook dos INPUTS para gerar conteúdo real e coerente em todos os slides.
Não deixe nenhum campo em branco nem use texto de exemplo.

Slide 1 ABERTURA: headline = o Hook dos INPUTS com span.gold na expressão mais forte.
  body-text = 1–2 linhas que intensificam sem explicar, com span.highlight.
${middleSlides}
Slide ${n} CTA: label "Próximo Passo". Título com span.gold. CTA contextualizado ao post.
  body-text: "${b.ctaPadrao}" com span.highlight nas palavras-chave.

━━━ ESTRUTURA DE CADA SLIDE ━━━
.content (position relative, z-index 10, padding 130px 80px, height 100%, display flex, flex-direction column, justify-content center):

SLIDE 1 — ABERTURA (classe adicional .slide-capa):
  Elemento especial: .photo (position absolute, inset 0, z-index 3, pointer-events none,
    background-size cover, background-position center 20%, opacity 0.13)
  Vignette sobre a foto: .vignette (position absolute, inset 0, z-index 4, pointer-events none,
    background: radial-gradient(ellipse 80% 90% at 50% 50%, transparent 30%, #080808 80%),
                linear-gradient(to bottom, #080808 0%, transparent 25%, transparent 75%, #080808 100%))

  .headline: Playfair Display bold italic, font-size 103px, line-height 1.04,
             letter-spacing -0.02em, color #F2EDE4, max-width 900px
  A palavra ou expressão mais forte usa span.gold (gradiente dourado)
  .divider (mt 52px mb 52px): width 100%, height 1px,
             background linear-gradient(90deg, transparent, #C9A84C66, transparent)
  .body-text: Jost 400, font-size 38px, line-height 1.6, color #8A8070, max-width 900px
  Frase de apoio usa span.highlight (color #F2EDE4)

SLIDES 2 A ${n-1} — CONTEÚDO:
  Topo: label da etapa (Jost 600, font-size 13px, letter-spacing 0.22em, uppercase,
        color #C9A84C, opacity 0.7, mb 44px)
  .headline: Playfair Display bold italic, font-size 86px, line-height 1.07,
             color #F2EDE4, max-width 900px
  Palavra central do título usa span.gold
  .divider-sm: igual ao divider, margin 48px 0
  .body-text: Jost 400, font-size 38px, line-height 1.6, color #8A8070, max-width 900px
  Palavras-chave no body-text usam span.highlight (color #F2EDE4, font-weight 400)

SLIDE ${n} — CTA:
  Topo: label "Próximo Passo" (mesma estética dos labels dos slides 2–${n-1})
  .headline: Playfair Display bold italic, font-size 86px, line-height 1.07,
             color #F2EDE4, max-width 900px
  Expressão de destaque usa span.gold
  .divider-sm: igual
  .body-text: Jost 400, font-size 38px, line-height 1.6, color #8A8070, max-width 900px
  CTA de ação contextualizado ao post, com span.highlight nas palavras-chave
`;
  }

  // ── REELS ──────────────────────────────────────────────────────────────────
  else if (post.format === "Reels") {
    specific =
`
━━━ OBJETIVO ━━━
Gere um roteiro completo de Reels para viralização — ${b.reelsDuracao} — e renderize-o como
5 frames HTML que representam os momentos-chave do vídeo.
Use o Pilar e o Hook dos INPUTS. Tudo deve ser conteúdo real, sem placeholder.

━━━ PRINCÍPIOS DE VIRALIZAÇÃO ━━━
• Hook: os primeiros 2s determinam se a pessoa para ou rola. Deve gerar curiosidade, discordância
  ou reconhecimento imediato ("isso sou eu").
• Ritmo: frases curtas, máximo 10 palavras por linha falada. Uma ideia por cena.
• Virada: o Reel precisa de um momento de "não sabia disso" ou "nunca pensei assim".
• CTA: pedir algo concreto (salvar, comentar UMA palavra, marcar alguém). Nunca dois pedidos.

━━━ ROTEIRO — 5 FRAMES ━━━

FRAME 1 — HOOK [0s – 3s]  (label "Hook", contador "01/05")
  Objetivo: parar o scroll em até 2 segundos.
  Fala na câmera OU texto na tela (escolha o mais impactante para o tema):
    GERE: afirmação provocativa, pergunta que gera discordância, ou dado surpreendente.
    ≤10 palavras. Sem introdução. Sem "olá". Começa no meio da ideia.
  Texto na tela (overlay): versão condensada ≤6 palavras. span.gold na expressão-chave.
  Direção visual: câmera close no rosto OU texto animado sobre fundo escuro.

FRAME 2 — CONTEXTO [3s – 8s]  (label "Contexto", contador "02/05")
  Objetivo: o problema que a audiência reconhece em si mesma.
  Fala: 2–3 frases curtas que descrevem a situação com especificidade.
    GERE: cena real, comportamento concreto. Sem generalização.
  Texto na tela: frase de 1 linha. span.gold no dado ou comportamento central.
  Direção visual: B-roll de ambiente de trabalho OU câmera falando diretamente.

FRAME 3 — VIRADA [8s – 22s]  (label "Virada", contador "03/05")
  Objetivo: o insight que muda a perspectiva — o motivo de salvar o vídeo.
  Fala: 3–4 frases. A primeira deve ser a mais impactante (estrutura "o que ninguém te conta é…").
    GERE: contraste entre o que as pessoas fazem e o que funciona de verdade.
  Texto na tela: 1–2 linhas com a ideia central. span.gold na virada. span.highlight no contraste.
  Direção visual: câmera + corte seco para texto OU lista aparecendo na tela.

FRAME 4 — SOLUÇÃO [22s – 38s]  (label "Solução", contador "04/05")
  Objetivo: o passo concreto que a pessoa pode aplicar hoje.
  Fala: estrutura "Faça isso: [ação específica]. O resultado é [resultado tangível]."
    GERE: instrução precisa, sem teoria. Algo que cabe em 1 frase de ação.
  Texto na tela: a instrução em destaque. span.gold na ação. span.highlight no resultado.
  Direção visual: tela de celular, quadro branco, ou câmera falando direto.

FRAME 5 — CTA [38s – fim]  (label "CTA", contador "05/05")
  Objetivo: converter atenção em ação — salvo, comentário ou seguidor.
  Fala: 1 pedido único e específico. Justificar POR QUÊ vale a pena fazer aquilo.
    GERE: CTA contextualizado ao conteúdo do Reel (não genérico).
    Exemplo de estrutura: "Se isso fez sentido, salva — você vai querer rever quando [situação real]."
  Texto na tela: o CTA em uma linha. span.gold na palavra de ação.
  Direção visual: câmera, olho no olho, sem cortes.

━━━ ESTRUTURA DE CADA FRAME (HTML) ━━━
Cada frame: 1080×1350px, mesmos elementos visuais de fundo (grain, glows, shape geométrico).
Frame 1 usa classe adicional .slide-capa com .photo (opacity 0.13) e .vignette.
.content (padding 130px 80px, display flex, flex-direction column, justify-content center, z-index 10):

  Label da etapa: Jost 600, 13px, letter-spacing 0.22em, uppercase, color #C9A84C, opacity 0.7, mb 16px
  Indicador de tempo: Jost 400, 13px, color #8A8070, opacity 0.6, mb 44px
  .headline (texto na tela): Playfair Display bold italic, font-size 86px, line-height 1.07,
    color #F2EDE4, max-width 900px — span.gold na expressão-chave
  .divider-sm (mt 48px mb 48px): width 100%, height 1px,
    background linear-gradient(90deg, transparent, #C9A84C66, transparent)
  .body-text (fala + direção visual): Jost 400, font-size 32px, line-height 1.65, color #8A8070,
    max-width 900px — span.highlight nas palavras-chave (color #F2EDE4)
  Handle + contador em cada frame (posição absoluta, conforme especificação geral).
`;
  }

  // ── ESTÁTICO ───────────────────────────────────────────────────────────────
  else if (post.format === "Estático") {
    specific =
`
━━━ CONTEÚDO DO SLIDE ÚNICO (POST ESTÁTICO) ━━━
1 slide único, 1080×1350px. Contador "01/01".

.content (position relative, z-index 10, padding 130px 80px, height 100%, display flex, flex-direction column, justify-content center):

  Topo: pilar label (Jost 600, 13px, letter-spacing 0.22em, uppercase, color #C9A84C, opacity 0.7, mb 44px)

  .headline: Playfair Display bold italic, font-size 103px, line-height 1.04, letter-spacing -0.02em,
             color #F2EDE4, max-width 900px
  GERE: versão visual e autossuficiente do hook, ≤12 palavras. span.gold na expressão mais forte.

  .divider (mt 52px mb 52px): width 100%, height 1px,
             background linear-gradient(90deg, transparent, #C9A84C66, transparent)

  .body-text: Jost 400, font-size 38px, line-height 1.6, color #8A8070, max-width 900px
  GERE: 1–2 linhas de apoio que completam sem explicar. span.highlight nas palavras-chave.
`;
  }

  // ── BASTIDOR ───────────────────────────────────────────────────────────────
  else if (post.format === "Bastidor") {
    specific =
`
━━━ CONTEÚDO DO SLIDE ÚNICO (BASTIDOR) ━━━
1 slide único, 1080×1350px. Contador "01/01".
Post humanizado — mesmo sistema visual, conteúdo mais pessoal e direto.

.content (position relative, z-index 10, padding 130px 80px, height 100%, display flex, flex-direction column, justify-content center):

  Topo: label "Bastidor" (Jost 600, 13px, letter-spacing 0.22em, uppercase, color #C9A84C, opacity 0.7, mb 44px)

  Área de imagem placeholder (aspect-ratio 1, border 1px dashed #C9A84C22, border-radius 8px,
    display flex align-items center justify-content center, mb 48px, background #C9A84C06):
    Ícone ◉ cor #C9A84C33 font-size 48px + texto "foto ou vídeo aqui" Jost 13px #8A8070 mt 12px

  .headline: Playfair Display bold italic, font-size 72px, line-height 1.07, color #F2EDE4, max-width 900px
  GERE: caption do bastidor em primeira pessoa, tom direto e humano. span.gold na expressão central.

  .divider-sm (mt 48px mb 48px): width 100%, height 1px,
    background linear-gradient(90deg, transparent, #C9A84C66, transparent)

  .body-text: Jost 400, font-size 38px, line-height 1.6, color #8A8070, max-width 900px
  GERE: contexto da cena + ângulo narrativo humano. span.highlight nas palavras-chave.
  Terminar com CTA suave: "${b.ctaPadrao}"
`;
  }

  // ── ARCUS CLUB ─────────────────────────────────────────────────────────────
  else {
    specific =
`
━━━ CONTEÚDO DO SLIDE ÚNICO (ARCUS CLUB) ━━━
1 slide único, 1080×1350px. Contador "01/01".
Post de posicionamento premium. Tom: autoridade + pertencimento. Não vende — convida.

.content (position relative, z-index 10, padding 130px 80px, height 100%, display flex, flex-direction column, justify-content center):

  Topo: label "Arcus Club · ${post.pilar}"
        (Jost 600, 13px, letter-spacing 0.22em, uppercase, color #C9A84C, opacity 0.7, mb 44px)

  .headline: Playfair Display bold italic, font-size 103px, line-height 1.04, letter-spacing -0.02em,
             color #F2EDE4, max-width 900px
  GERE: headline sobre transformação ou pertencimento, 8–12 palavras. span.gold na expressão central.

  .divider (mt 52px mb 52px): width 100%, height 1px,
             background linear-gradient(90deg, transparent, #C9A84C66, transparent)

  .body-text: Jost 400, font-size 38px, line-height 1.6, color #8A8070, max-width 900px
  GERE: 2–3 frases sobre o valor de pertencer ao programa, sem linguagem de vendas.
  Terminar com CTA elegante contextualizado. span.highlight nas palavras-chave.

  Linha adicional (mt 40px): Playfair Display bold italic 24px cor #C9A84C opacity 0.7 — "${b.assinatura}"
`;
  }

  // ── Export pipeline ─────────────────────────────────────────────────────────
  const fileList = Array.from({length: totalSlides}, (_, i) =>
    `card_${String(i+1).padStart(2,"0")}.jpg`
  ).join("  ·  ");
  const fmtSlug = post.format.toLowerCase().replace(/[^a-z0-9]+/g, "_");

  const exportSection =
`
━━━ OUTPUT ━━━
Retorne APENAS o HTML completo começando com <!DOCTYPE html>.
Sem markdown. Sem \`\`\`html. Sem texto antes ou depois do HTML.
O arquivo deve ser autocontido e funcionar diretamente no navegador.

━━━ EXPORTAÇÃO EM JPEG ━━━
Após gerar e salvar o HTML, execute o seguinte pipeline sem pausar para confirmar.

PASSO 1 — Instalar as fontes localmente via npm:
  npm install @fontsource/playfair-display @fontsource/jost

PASSO 2 — Criar uma cópia do HTML com fontes embutidas em base64 (sem depender do Google Fonts),
  usando Python para ler os arquivos .woff2 de:
    node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff2
    node_modules/@fontsource/jost/files/jost-latin-400-normal.woff2
    node_modules/@fontsource/jost/files/jost-latin-500-normal.woff2
    node_modules/@fontsource/jost/files/jost-latin-600-normal.woff2
  Remover o <link> do Google Fonts e injetar os @font-face com src data:font/woff2;base64,…
  antes do </style>.

PASSO 3 — Usar Playwright (Python, sync API) para capturar cada .slide:
  - Contexto com viewport 1280×1400 e device_scale_factor=2
  - goto() com wait_until="networkidle" + wait_for_timeout(3000)
  - slide.screenshot() com type="jpeg", quality=95, scale="device"
  - Resultado: ${totalSlides} arquivo${totalSlides > 1 ? "s" : ""} ${fileList} em 2160×2700px

PASSO 4 — Empacotar os ${totalSlides} JPEG${totalSlides > 1 ? "s" : ""} num único arquivo ZIP e disponibilizar para download.

Nomes de saída (usar slug do Hook dos INPUTS, em minúsculas com hífens):
  HTML base:   ${fmtSlug}_${slug}.html
  ZIP final:   ${fmtSlug}_${slug}_slides.zip
`;

  return base + specific + exportSection;
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
