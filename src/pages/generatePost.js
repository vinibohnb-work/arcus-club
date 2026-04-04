// ── Gerador de HTML para posts do calendário editorial ──────────────────────

const BRAND_FALLBACK = {
  corPrimaria: "#C9A84C", corSecundaria: "#0E0E0E", corTexto: "#F0EDE6",
  corDestaque: "#7B6FD4", fonteDisplay: "Cormorant Garamond", fonteCorpo: "Outfit",
  assinatura: "Arcus Club",
  ctaPadrao: "Quer estruturar sua empresa? Comenta ARCUS ou acessa o link na bio.",
  hashtags: "#liderança #gestão #empreendedorismo #arcusclub #cultura",
  carrosselSlides: "7", reelsDuracao: "7–15s",
  tomDeVoz: "",
};

function readBrand() {
  try { return { ...BRAND_FALLBACK, ...(JSON.parse(localStorage.getItem("arcus-brand")) || {}) }; }
  catch { return { ...BRAND_FALLBACK }; }
}

export function openPostInNewTab(post) {
  const brand = readBrand();
  const html  = buildHTML(post, brand);
  const blob  = new Blob([html], { type: "text/html;charset=utf-8" });
  const url   = URL.createObjectURL(blob);
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
  { label: "EXTRA 1",     desc: "Conteúdo complementar"   },
  { label: "EXTRA 2",     desc: "Conteúdo complementar"   },
  { label: "EXTRA 3",     desc: "Conteúdo complementar"   },
  { label: "EXTRA 4",     desc: "Conteúdo complementar"   },
  { label: "EXTRA 5",     desc: "Conteúdo complementar"   },
  { label: "EXTRA 6",     desc: "Conteúdo complementar"   },
  { label: "CTA FINAL",   desc: "Chamada para ação — encerramento da série de slides" },
  { label: "CTA FINAL",   desc: "Chamada para ação — encerramento da série de slides" },
];

// ── builder principal ────────────────────────────────────────────────────────
function buildHTML(post, b) {
  const fmt       = FMT[post.format] || FMT["Estático"];
  const primary   = b.corPrimaria;
  const bg        = "#080808";
  const surface   = "#141414";
  const surface2  = "#1C1C1C";
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
    .mono { font-family: 'DM Mono', monospace; }
    .disp { font-family: '${fontD}', 'Cormorant Garamond', Georgia, serif; }
  `;

  // ── header fixo ─────────────────────────────────────────────────────────────
  const header = `
  <header style="position:sticky;top:0;z-index:100;background:rgba(8,8,8,.94);backdrop-filter:blur(12px);border-bottom:1px solid ${border};padding:0 40px;display:flex;align-items:center;justify-content:space-between;height:56px;">
    <div style="display:flex;align-items:center;gap:16px;">
      <span style="background:${fmt.bg};color:${fmt.light};border:1px solid ${fmt.border};border-radius:3px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;padding:3px 10px;text-transform:uppercase;">${fmt.label}</span>
      <span style="font-size:12px;color:${textDim};font-family:'DM Mono',monospace;letter-spacing:.08em;">${post.pilar.toUpperCase()}</span>
      <span style="font-size:12px;color:${textDim};font-family:'DM Mono',monospace;">${post.date} · ${post.week}</span>
    </div>
    <div style="font-family:'${fontD}',Georgia,serif;font-size:16px;font-style:italic;color:${primary};letter-spacing:.06em;">${sig}</div>
  </header>`;

  // ── hero ─────────────────────────────────────────────────────────────────────
  const hero = `
  <section style="padding:60px 40px 48px;border-bottom:1px solid ${border};position:relative;overflow:hidden;">
    <div style="position:absolute;top:-60px;right:-60px;width:400px;height:400px;background:radial-gradient(circle,${primary}08 0%,transparent 70%);pointer-events:none;"></div>
    <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;color:${primary}88;text-transform:uppercase;margin-bottom:20px;">${post.pilar} · ${post.date}</div>
    <h1 style="font-family:'${fontD}',Georgia,serif;font-size:clamp(32px,5vw,58px);font-weight:300;line-height:1.1;color:${text};font-style:italic;max-width:800px;">"${post.hook}"</h1>
    <div style="margin-top:24px;height:1px;width:80px;background:linear-gradient(90deg,${primary},transparent);"></div>
  </section>`;

  // ── footer ───────────────────────────────────────────────────────────────────
  const footer = `
  <footer style="margin-top:60px;padding:32px 40px;border-top:1px solid ${border};display:grid;grid-template-columns:2fr 1fr;gap:32px;align-items:start;">
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
  </footer>`;

  // ── HTML por formato ─────────────────────────────────────────────────────────
  let body = "";

  // ── CARROSSEL ────────────────────────────────────────────────────────────────
  if (post.format === "Carrossel") {
    const slides = Array.from({ length: n }, (_, i) => {
      const isFirst = i === 0;
      const isLast  = i === n - 1;
      const st      = SLIDE_STRUCTURE[Math.min(i, SLIDE_STRUCTURE.length - 1)];
      return `
      <div style="width:260px;min-height:260px;border-radius:6px;flex-shrink:0;background:${isFirst ? `linear-gradient(145deg,${fmt.bg},${bg})` : surface};border:${isFirst ? `2px solid ${fmt.border}` : isLast ? `2px solid ${primary}44` : `1px solid ${border}`};padding:22px;display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.15em;color:${isFirst ? fmt.light : textDim};text-transform:uppercase;">${st.label}</span>
          <span style="font-family:'DM Mono',monospace;font-size:9px;color:${textDim};">${String(i+1).padStart(2,"0")} / ${String(n).padStart(2,"0")}</span>
        </div>
        ${isFirst
          ? `<div style="font-family:'${fontD}',Georgia,serif;font-size:18px;font-style:italic;font-weight:400;color:${text};line-height:1.5;flex:1;display:flex;align-items:center;">"${post.hook}"</div>`
          : isLast
            ? `<div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                 <div style="font-size:13px;color:${textMuted};line-height:1.6;">${cta}</div>
                 <div style="font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:15px;margin-top:16px;">${sig}</div>
               </div>`
            : `<div style="flex:1;">
                 <div style="font-size:13px;color:${textMuted};line-height:1.6;margin-bottom:10px;">${st.desc}</div>
                 <div style="border-top:1px dashed ${border};padding-top:10px;font-size:11px;color:${textDim};font-family:'DM Mono',monospace;letter-spacing:.05em;">[ escrever aqui ]</div>
               </div>`
        }
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
    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:20px;">Mockup do Post</div>
      <div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">
        <!-- Mockup quadrado -->
        <div style="width:420px;height:420px;flex-shrink:0;border-radius:8px;background:${b.corSecundaria};border:1px solid ${fmt.border};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${primary},${b.corDestaque},transparent);"></div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;color:${primary}77;text-transform:uppercase;margin-bottom:28px;">${post.pilar}</div>
          <div style="font-family:'${fontD}',Georgia,serif;font-size:clamp(18px,3vw,26px);font-style:italic;font-weight:400;color:${b.corTexto};line-height:1.45;text-align:center;">"${post.hook}"</div>
          <div style="position:absolute;bottom:24px;right:28px;font-family:'${fontD}',Georgia,serif;font-size:13px;font-style:italic;color:${primary};">${sig}</div>
          <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${primary}44,transparent);"></div>
        </div>
        <!-- Especificações -->
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
    const dur   = b.reelsDuracao || "7–15s";
    const durN  = parseInt(dur) || 15;
    const steps = [
      { time:"0s – 2s",         label:"HOOK VISUAL",   color: fmt.light,  desc:"Frase de abertura em tela — sem contexto, direto ao ponto. Pode ser texto em overlay ou fala." },
      { time:"2s – "+Math.round(durN*0.6)+"s", label:"DESENVOLVIMENTO", color: primary, desc:"Argumento central em 1-2 frases. Provoca reflexão, não explica. Mantém ritmo rápido." },
      { time:Math.round(durN*0.6)+"s – "+durN+"s", label:"CONCLUSÃO / CTA", color: BRAND_FALLBACK.corDestaque, desc:"Virada ou pergunta final que leva ao perfil / link. Opcional: texto na tela com CTA." },
    ];
    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="display:flex;gap:40px;align-items:flex-start;flex-wrap:wrap;">
        <!-- Phone mockup -->
        <div style="flex-shrink:0;">
          <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:16px;">Formato · ${dur}</div>
          <div style="width:220px;height:390px;border-radius:24px;border:2px solid ${fmt.border};background:${b.corSecundaria};position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;">
            <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(180deg,${bg}44 0%,transparent 40%,${bg}88 100%);pointer-events:none;"></div>
            <div style="text-align:center;z-index:1;">
              <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.15em;color:${primary};text-transform:uppercase;margin-bottom:12px;">${post.pilar}</div>
              <div style="font-family:'${fontD}',Georgia,serif;font-size:16px;font-style:italic;color:${b.corTexto};line-height:1.4;">"${post.hook}"</div>
            </div>
            <div style="position:absolute;bottom:16px;left:0;right:0;text-align:center;font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:13px;">${sig}</div>
            <div style="position:absolute;top:12px;left:50%;transform:translateX(-50%);width:40px;height:4px;border-radius:2px;background:${border};"></div>
          </div>
        </div>
        <!-- Roteiro -->
        <div style="flex:1;min-width:280px;">
          <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:20px;">Roteiro Sugerido</div>
          ${steps.map((st, i) => `
          <div style="display:flex;gap:16px;margin-bottom:20px;">
            <div style="width:3px;border-radius:2px;background:${st.color};flex-shrink:0;min-height:60px;"></div>
            <div>
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                <span style="font-family:'DM Mono',monospace;font-size:9px;color:${st.color};letter-spacing:.1em;text-transform:uppercase;">${st.label}</span>
                <span style="font-family:'DM Mono',monospace;font-size:10px;color:${textDim};">[${st.time}]</span>
              </div>
              <div style="font-size:13px;color:${textMuted};line-height:1.65;">${st.desc}</div>
              <div style="margin-top:10px;border:1px dashed ${border};border-radius:3px;padding:10px;font-size:12px;color:${textDim};font-family:'DM Mono',monospace;">[ escrever aqui ]</div>
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
    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start;">
        <!-- Placeholder de imagem/vídeo -->
        <div style="aspect-ratio:1;border-radius:6px;background:${surface};border:1px dashed ${fmt.border};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:32px;text-align:center;">
          <div style="width:48px;height:48px;border-radius:50%;border:2px dashed ${fmt.border};display:flex;align-items:center;justify-content:center;font-size:20px;color:${fmt.light};">◉</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:.12em;color:${textDim};text-transform:uppercase;">Imagem ou Vídeo</div>
          <div style="font-size:13px;color:${textDim};line-height:1.6;">Foto ou clipe de bastidor<br>real · humano · espontâneo</div>
        </div>
        <!-- Briefing -->
        <div>
          <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.15em;color:${textDim};text-transform:uppercase;margin-bottom:16px;">Briefing do Post</div>
          ${[
            ["Contexto",    "O que está acontecendo nessa cena — evento, reunião, bastidor de encontro, decisão tomada"],
            ["Ângulo",      "O que humaniza — não é sobre o produto, é sobre o processo e as pessoas por trás"],
            ["Caption",     post.hook],
            ["Tom",         "Casual, direto, real. Sem texto excessivo na imagem."],
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
    body = `
    ${header}${hero}
    <main style="padding:40px;">
      <div style="display:grid;grid-template-columns:3fr 2fr;gap:24px;align-items:start;">
        <!-- Post mockup premium -->
        <div style="border-radius:8px;background:linear-gradient(145deg,${b.corSecundaria},#100808);border:1px solid ${fmt.border};padding:40px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-40px;right:-40px;width:200px;height:200px;background:radial-gradient(circle,${primary}0C 0%,transparent 70%);pointer-events:none;"></div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;color:${primary}77;text-transform:uppercase;margin-bottom:20px;">ARCUS CLUB · ${post.pilar.toUpperCase()}</div>
          <div style="font-family:'${fontD}',Georgia,serif;font-size:22px;font-style:italic;font-weight:400;color:${b.corTexto};line-height:1.45;margin-bottom:32px;">"${post.hook}"</div>
          <div style="height:1px;background:linear-gradient(90deg,${primary}44,transparent);margin-bottom:24px;"></div>
          <div style="font-size:14px;color:${textMuted};line-height:1.65;margin-bottom:24px;">${cta}</div>
          <div style="display:inline-block;padding:10px 24px;background:${primary};color:#0A0800;border-radius:2px;font-size:12px;font-weight:600;font-family:'DM Mono',monospace;letter-spacing:.1em;text-transform:uppercase;">Saiba Mais</div>
          <div style="position:absolute;bottom:20px;right:24px;font-family:'${fontD}',Georgia,serif;font-style:italic;color:${primary};font-size:14px;">${sig}</div>
        </div>
        <!-- Brief -->
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
