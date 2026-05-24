import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import ViniMarketing from './ViniMarketing'
import ViniMetas from './ViniMetas'
import ViniDashboard from './ViniDashboard'
import './ViniciusPage.css'

// ─── Static tab HTML content ─────────────────────────────────────────────────

const TAB_HTML = {
  metas: `
    <div class="tab-header" data-glyph="M">
      <div>
        <div class="tab-eyebrow">Estratégia · Metas</div>
        <div class="tab-title">A meta <em>absurda</em></div>
        <div class="tab-sub">1 venda por semana · 14 semanas · prazo: 01 de agosto de 2026.</div>
      </div>
      <div class="tab-header-phrase">Ou você bate a meta,<br><em>ou aprende por que não bateu.</em></div>
    </div>
    <div class="tab-body" style="max-width:none;">

      <!-- ── Hero ── -->
      <div style="display:grid;grid-template-columns:1fr 260px;border-radius:10px;overflow:hidden;margin-bottom:2.5rem;border:1px solid #222;">
        <div style="background:#0E0E0E;padding:52px 56px;display:flex;flex-direction:column;justify-content:space-between;min-height:260px;">
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:#B8933A;">META ABSURDA · 01/08/2026</div>
          <div>
            <div style="font-family:'Playfair Display',serif;font-size:clamp(80px,11vw,132px);font-weight:700;font-style:italic;color:#F5F2EC;line-height:0.85;letter-spacing:-0.02em;">14</div>
            <div style="font-family:'Playfair Display',serif;font-size:28px;font-style:italic;color:#D4B06A;margin-top:6px;">vendas</div>
          </div>
          <div style="border-top:1px solid rgba(255,255,255,0.07);padding-top:18px;">
            <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;color:rgba(255,255,255,0.3);">1 por semana · sem pausa · sem semana "de repouso"</div>
          </div>
        </div>
        <div style="background:#111;border-left:1px solid #222;padding:36px 32px;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:5px;">Receita mínima</div>
            <div style="font-family:'Playfair Display',serif;font-size:30px;font-weight:700;font-style:italic;color:#B8933A;line-height:1;">R$336k</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.28);margin-top:3px;">14 × R$24k · Scalasys</div>
          </div>
          <div style="height:1px;background:#1E1E1E;"></div>
          <div>
            <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.28);margin-bottom:5px;">Pipeline/semana</div>
            <div style="font-family:'Playfair Display',serif;font-size:30px;font-weight:700;font-style:italic;color:#3DBFB0;line-height:1;">4 reun.</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.28);margin-top:3px;">para fechar 1 · 25% close rate</div>
          </div>
        </div>
      </div>

      <!-- ── Marcos semanais ── -->
      <h3>Marcos semanais</h3>
      <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:2rem;">

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;background:var(--ink);padding:10px 20px;gap:16px;align-items:center;">
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;color:rgba(255,255,255,0.35);">SEM</div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;color:rgba(255,255,255,0.35);">PERÍODO</div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;color:rgba(255,255,255,0.35);">FECHAMENTO</div>
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.14em;color:rgba(255,255,255,0.35);">MARCO / CHECKPOINT</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#fff;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S01</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">27/04 – 01/05</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#7B6FD4;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">1ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">Ativar lista BNI + rede quente. 20 abordagens enviadas, 5 ligações realizadas, 2 reuniões agendadas.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#FAFAF8;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S02</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">04/05 – 08/05</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#7B6FD4;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">2ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">Cadência estabelecida: 4 reuniões/semana no calendário. CRM atualizado ao fim de cada dia.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#fff;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S03</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">11/05 – 15/05</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#7B6FD4;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">3ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">Oferecer Advisory ao 1º cliente fechado. 3 propostas simultâneas em aberto no CRM.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:15px 20px;gap:16px;align-items:center;background:#FBF7EE;border-bottom:1px solid #EDE5CC;border-left:3px solid #B8933A;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S04</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">18/05 – 22/05</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#B8933A;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:#6B4F1A;">4ª venda ★</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;"><strong style="color:var(--ink);">R$96k realizados.</strong> Pipeline renovado com fontes além do BNI. Catálogo de módulos começa a tomar forma.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#fff;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S05</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">25/05 – 29/05</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#3DBFB0;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">5ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">1º Advisory ativo (R$5k/mês recorrente). LinkedIn gerando primeiros inbounds orgânicos.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#FAFAF8;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S06</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">01/06 – 05/06</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#3DBFB0;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">6ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">2 Advisory ativos = R$10k/mês recorrente. 1º módulo da biblioteca marcado como reutilizável.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:15px 20px;gap:16px;align-items:center;background:#FBF7EE;border-bottom:1px solid #EDE5CC;border-left:3px solid #B8933A;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S07</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">08/06 – 12/06</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#B8933A;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:#6B4F1A;">7ª venda ★</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;"><strong style="color:var(--ink);">R$168k+ realizados.</strong> 7º Scalasys fechado. Recorrência mensal consolidando.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#fff;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S08</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">15/06 – 19/06</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#3DBFB0;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">8ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">3 Advisory = R$15k/mês. Pipeline com 5+ leads em proposta. Primeiras indicações de clientes ativos.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#FAFAF8;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S09</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">22/06 – 26/06</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#3DBFB0;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">9ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">LinkedIn: 3+ inbounds/semana. Primeiras indicações de clientes convertidas em reunião.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:15px 20px;gap:16px;align-items:center;background:#FBF7EE;border-bottom:1px solid #EDE5CC;border-left:3px solid #B8933A;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S10</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">29/06 – 03/07</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#B8933A;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:#6B4F1A;">10ª venda ★</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;"><strong style="color:var(--ink);">R$240k+ · 71% da meta.</strong> Recorrência mensal cobre o Advisory anual. Pipeline auto-sustentável.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#fff;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S11</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">06/07 – 10/07</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#7B6FD4;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">11ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">4 Advisory ativos. Foco em indicações de clientes atuais e expansão do catálogo de módulos.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#FAFAF8;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S12</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">13/07 – 17/07</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#7B6FD4;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">12ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">R$288k+. Pipeline com as últimas 2 vendas já em negociação ativa. 3 semanas para o prazo.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:13px 20px;gap:16px;align-items:center;background:#fff;border-bottom:1px solid #F0EDE8;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S13</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">20/07 – 24/07</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:6px;height:6px;border-radius:50%;background:#7B6FD4;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:14px;color:var(--ink);">13ª venda</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;">Penúltima semana. R$312k+. S14 já com reunião agendada e proposta pronta para apresentar.</div>
        </div>

        <div style="display:grid;grid-template-columns:58px 126px 152px 1fr;padding:18px 20px;gap:16px;align-items:center;background:#FBF7EE;border-left:4px solid #B8933A;">
          <div style="font-family:'DM Mono',monospace;font-size:12px;font-weight:500;color:var(--ink);">S14</div>
          <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);">27/07 – 01/08</div>
          <div style="display:flex;align-items:center;gap:7px;"><span style="width:8px;height:8px;border-radius:50%;background:#B8933A;flex-shrink:0;"></span><span style="font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:15px;color:#6B4F1A;">14ª venda ★★</span></div>
          <div style="font-size:13px;color:var(--muted);line-height:1.55;"><strong style="color:#6B4F1A;">META ABSURDA CONCLUÍDA.</strong> R$336k+ realizados em 14 semanas. Base de recorrência com Advisory ativo. Pronto para o próximo ciclo.</div>
        </div>

      </div>

      <!-- ── Pipeline mínimo ── -->
      <div class="rule-gold">
        <div class="rule-icon">◎</div>
        <div class="rule-content">
          <div class="rule-label">Pipeline mínimo para sustentar 1 venda/semana</div>
          <div class="rule-text">Para fechar 1 venda com consistência, você precisa de <strong>4 reuniões realizadas por semana</strong> (close rate de ~25%). Isso exige <strong>8 ligações</strong> (50% viram reunião) e <strong>15 abordagens ativas</strong> (55% chegam à ligação). São ~3 abordagens por dia útil. Semana sem abordagem = semana sem pipeline = venda comprometida daqui a 2–3 semanas.</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:1px;background:var(--border);border-radius:8px;overflow:hidden;margin-top:1rem;">
        <div style="background:#fff;padding:20px 24px;text-align:center;">
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">Abordagens</div>
          <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:700;font-style:italic;color:var(--ink);">15</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">por semana</div>
        </div>
        <div style="background:#fff;padding:20px 24px;text-align:center;">
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">Ligações</div>
          <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:700;font-style:italic;color:#7B6FD4;">8</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">por semana</div>
        </div>
        <div style="background:#fff;padding:20px 24px;text-align:center;">
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">Reuniões</div>
          <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:700;font-style:italic;color:#3DBFB0;">4</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">por semana</div>
        </div>
        <div style="background:#fff;padding:20px 24px;text-align:center;">
          <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;">Fechamentos</div>
          <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:700;font-style:italic;color:#B8933A;">1</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">por semana</div>
        </div>
      </div>

    </div>`,

  estrategia: `
    <div class="tab-header" data-glyph="E">
      <div>
        <div class="tab-eyebrow">Estratégia</div>
        <div class="tab-title">Os dois <em>produtos</em></div>
        <div class="tab-sub">Diagnóstico e Scalasys — o que é cada um e para quem.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body" style="max-width:none;">
      <div class="strat-cols">

        <!-- Diagnóstico — processo de venda -->
        <div class="strat-full">
          <div class="strat-stage">Entrada · Processo de venda</div>
          <div class="product-card">
            <div class="product-sidebar"><div><div class="product-type">Parte do comercial</div><div class="product-name">Diagnóstico Inicial</div><div class="product-duration">Conversa estruturada</div></div><div class="product-price"><div class="price-main">Grátis</div><div class="price-detail">sem compromisso</div></div></div>
            <div class="product-body"><p class="product-desc">Conversa estruturada para entender as dores, oportunidades de atuação e o contexto do negócio. Define se o Scalasys faz sentido para o momento do cliente — ou se ainda não é a hora.</p><div class="product-pillars"><span class="pillar-tag">Mapeamento de dores</span><span class="pillar-tag">Oportunidades de atuação</span><span class="pillar-tag">Fit comercial</span></div></div>
          </div>
        </div>

        <!-- Scalasys -->
        <div class="strat-full">
          <div class="strat-stage" style="color:var(--gold);">Produto Principal · Scalasys</div>
          <div class="product-card" style="border:1.5px solid var(--gold);border-top:3px solid var(--gold);">
            <div class="product-sidebar"><div><div class="product-type">Programa de desenvolvimento · 180 dias</div><div class="product-name">Scalasys</div><div class="product-duration">6 meses · sistemas e automações sob medida</div></div><div class="product-price"><div class="price-main" style="color:var(--gold);">R$24k</div><div class="price-detail">ou 12x R$2.000 no cartão</div></div></div>
            <div class="product-body"><p class="product-desc">Programa de 180 dias focado em aumentar a margem através da organização da operação. Diagnóstico completo, estruturação dos processos críticos, implementação acompanhada e consolidação. O cliente sai com o negócio rodando com menos dependência do fundador e margem crescente documentada.</p><div class="product-pillars"><span class="pillar-tag">Diagnóstico aprofundado</span><span class="pillar-tag">Processos documentados</span><span class="pillar-tag">Implementação acompanhada</span><span class="pillar-tag">Dashboard de indicadores</span><span class="pillar-tag">Plano de continuidade</span></div></div>
          </div>
        </div>

      </div>

      <div class="rule-gold" style="margin-top:2rem;">
        <div class="rule-icon">◎</div>
        <div class="rule-content"><div class="rule-label">A lógica dos dois produtos</div><div class="rule-text">O Diagnóstico é o comercial — uma conversa sem compromisso que define se há fit. O Scalasys é o produto: 180 dias de trabalho direto no negócio do cliente. Simples, sem tiers intermediários.</div></div>
      </div>
    </div>`,

  metodo: `
    <div class="tab-header" data-glyph="V">
      <div>
        <div class="tab-eyebrow">Comercial · Método</div>
        <div class="tab-title">Método de <em>venda</em></div>
        <div class="tab-sub">As seis etapas, o RICOM integrado em cada momento e o sketch tático.</div>
      </div>
      <div class="tab-header-phrase">O cliente não escolhe o melhor.<br><em>Escolhe o mais seguro.</em></div>
    </div>
    <div class="tab-body" style="max-width:none;">

      <div class="rule-gold">
        <div class="rule-icon">◎</div>
        <div class="rule-content"><div class="rule-label">O princípio central</div><div class="rule-text"><strong>Emoção antes da lógica. Expectativa antes da explicação.</strong> O cliente compra porque quer — não porque faz sentido. Seu trabalho é criar a imagem mental do <em>depois</em> antes de apresentar qualquer número. Na reunião de fechamento: ele fala 80% do tempo, você 20%. Quem pergunta conduz; quem explica, empurra.</div></div>
      </div>

      <h3>As seis etapas</h3>
      <div class="staircase">

        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Etapa 01</div><div class="stair-name">Abordagem</div></div>
          <div class="stair-right">
            <p><strong>Objetivo único: gerar uma resposta.</strong> Não venda o serviço — abra uma conversa. Uma frase que nomeia a dor, sem oferecer nada. Simples, diferente, relevante. Se precisar de mais de duas frases para explicar o que você faz, reescreva.</p>
            <p style="margin-top:10px;font-size:13px;font-style:italic;color:var(--muted);">"Vi que você está à frente de [empresa]. Tenho trabalhado com empresários em situações parecidas — negócio que cresce, mas a margem não acompanha. Posso te fazer uma pergunta?"</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">Via rede quente / BNI: substitua a primeira frase por uma referência ao contato em comum. O resto é igual.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">RICOM → R: Relacionamento — construa antes de ofertar. Nunca explique o produto aqui.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Etapa 02</div><div class="stair-name">Conseguir o WhatsApp</div></div>
          <div class="stair-right">
            <p><strong>Objetivo único: migrar para canal direto.</strong> WhatsApp encurta o ciclo — mensagem vista, resposta rápida, tom pessoal. Não explique o produto aqui. A incerteza mata a venda: deixe claro que a próxima conversa é rápida e sem compromisso.</p>
            <p style="margin-top:10px;font-size:13px;font-style:italic;color:var(--muted);">"Faz sentido a gente trocar uma mensagem no WhatsApp? Quero entender melhor o contexto da sua empresa antes de qualquer coisa — leva 20 minutos."</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">No WhatsApp: aqueça com uma observação sobre o negócio dele e proponha a ligação. Nada de apresentação de serviço.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">RICOM → R: Reduza a incerteza do próximo passo — ele precisa saber exatamente o que esperar.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Etapa 03</div><div class="stair-name">Ligação — mapear dores</div></div>
          <div class="stair-right">
            <p><strong>Duração: 20–30 minutos. Você fala menos de 30%.</strong> O objetivo é qualificar, mapear as dores reais e entender a história do cliente — o que ele já tentou e por que não funcionou. Esse histórico é seu ativo mais valioso na reunião.</p>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">Sequência de perguntas:</strong></p>
            <ul style="margin:6px 0 0 16px;font-size:13px;color:var(--muted);line-height:1.95;">
              <li>"Me conta como está a operação hoje — o que mais toma o seu tempo?"</li>
              <li>"Qual é o maior gargalo que está travando o crescimento agora?"</li>
              <li>"Você já tentou resolver isso de alguma forma? O que aconteceu?"</li>
              <li>"Se você resolver isso, o que muda concretamente no negócio nos próximos 6 meses?"</li>
              <li>"Quanto você estima que esse problema está custando por mês?"</li>
            </ul>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">Output esperado:</strong> 2–3 dores específicas, histórico de tentativas anteriores, estimativa de custo da dor, decisão de avançar para reunião.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">RICOM → I: Dores + urgência + quantificação + história anterior do cliente.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Etapa 04</div><div class="stair-name">Agendar a reunião</div></div>
          <div class="stair-right">
            <p><strong>Objetivo: garantir todos os decisores presentes.</strong> Reunião sem cônjuge, sócio ou diretor financeiro quase sempre termina em "vou pensar". Não agende se o decisor principal não puder — remarque sem hesitar. Isso não é pedantismo, é respeito pelo seu tempo.</p>
            <p style="margin-top:10px;font-size:13px;font-style:italic;color:var(--muted);">"Para aproveitarmos bem a reunião — quem mais estará envolvido nessa decisão? Prefiro fazer uma reunião que resolve do que duas que não chegam a lugar nenhum."</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">Confirme 24h antes. Use o intervalo para montar o sketch se os critérios forem atendidos.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">RICOM → O: Decisores identificados e confirmados. Sem exceções.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Etapa 05</div><div class="stair-name">Reunião</div></div>
          <div class="stair-right">
            <p><strong>Duração: 60–90 min. Ele fala 80%, você 20%.</strong> A reunião tem cinco movimentos — nessa ordem. Não pule etapas.</p>
            <ul style="margin:10px 0 0 16px;font-size:13px;color:var(--muted);line-height:2.0;">
              <li><strong style="color:var(--ink);">1. Venda o depois (emoção)</strong> — Antes de qualquer diagnóstico, pinte a imagem do negócio após o problema resolvido. "Imagina daqui a 6 meses: processo comercial rodando, equipe vendendo sem depender de você, margem crescendo junto com o faturamento. É isso que vamos construir." Crie a expectativa antes de qualquer explicação.</li>
              <li><strong style="color:var(--ink);">2. Espelhe as dores com as palavras dele</strong> — Use o que ele disse na ligação, palavra por palavra. "Você me disse que X. Quero entender isso melhor antes de qualquer coisa." Ele precisa sentir que você já entende o problema sem que ele precise explicar de novo.</li>
              <li><strong style="color:var(--ink);">3. Aprofunde e quantifique a perda</strong> — "Quanto isso custa por mês? Há quanto tempo está assim? O que acontece se daqui a 6 meses nada mudar?" A aversão a perda é mais forte que o desejo de ganho — faça ele sentir o custo do problema, não só o benefício da solução.</li>
              <li><strong style="color:var(--ink);">4. Apresente a solução (sketch primeiro, preço depois)</strong> — Se tiver sketch: "Com base no que você me contou, rascunhei como imagino a solução para o seu caso. Me diz se faz sentido." Só depois do sketch — ou depois de validar a dor — você apresenta o investimento. Nunca o contrário.</li>
              <li><strong style="color:var(--ink);">5. Antecipe a objeção antes do fechamento</strong> — "Qual é a sua maior dúvida sobre avançar?" Faça isso antes de apresentar o preço. A objeção que aparece no fechamento é a que não foi tratada na reunião.</li>
            </ul>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">RICOM → C + O + M aplicados aqui. Pertencimento: "empresários com quem trabalho passam por isso."</p>
          </div>
        </div>

        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Etapa 06</div><div class="stair-name">Conversão</div></div>
          <div class="stair-right">
            <p><strong>Fechamento direto, sem rodeios.</strong> "Faz sentido para você começar em [data]?" Se houver hesitação, identifique a objeção real antes de qualquer concessão. Nunca desconte para "ajudar a decidir" — isso destrói a percepção de valor e sinaliza que o preço era negociável desde o início.</p>
            <ul style="margin:10px 0 0 16px;font-size:13px;color:var(--muted);line-height:1.95;">
              <li><strong style="color:var(--ink);">Objeção de preço →</strong> "O processo que vamos montar juntos gera resultado mensalmente. Com base no que você me disse, o investimento se paga em [N] meses. O que está impedindo de avançar além do valor?"</li>
              <li><strong style="color:var(--ink);">Objeção de tempo →</strong> "Você me disse que esse problema está há [X meses]. O que muda nos próximos 3 meses se você não resolver agora?" Deixe a resposta vir dele — não preencha o silêncio.</li>
              <li><strong style="color:var(--ink);">Objeção de dúvida →</strong> "O que precisaria ser verdade para você se sentir seguro em avançar?" Reduza a incerteza com prova: depoimento, exemplo de cliente parecido, clareza sobre como funciona cada fase.</li>
            </ul>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);">Ao fechar: defina o próximo passo com data — contrato, primeiro pagamento, data de início. Nada de "te mando o material" sem prazo. O movimento que não tem data não acontece.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">RICOM → M: ROI concreto + custo de não agir. Dê a ele a desculpa racional para uma decisão que já tomou emocionalmente.</p>
          </div>
        </div>

      </div>

      <h3>RICOM — o framework integrado por etapa</h3>
      <div class="pillar-cards">
        <div class="pillar-card">
          <div class="pillar-header"><div class="pillar-icon">R</div><div class="pillar-title">Relacionamento</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Construa confiança antes de ofertar. O cliente compra de quem já entende o problema dele — não de quem aparece explicando o produto.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Ativo nas etapas 1 e 2</div>
              <div class="pillar-ex">Pesquise o lead antes de cada contato</div>
              <div class="pillar-ex">Nunca mencione preço antes de entender o problema</div>
            </div>
          </div>
        </div>
        <div class="pillar-card">
          <div class="pillar-header"><div class="pillar-icon">I</div><div class="pillar-title">Identificação de Dores</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Descubra as dores, o histórico de tentativas e o custo real do problema. A experiência anterior do cliente pesa mais do que qualquer argumento seu.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Ativo na etapa 3 (ligação)</div>
              <div class="pillar-ex">"Você já tentou resolver isso antes?"</div>
              <div class="pillar-ex">"Quanto isso custa por mês para você?"</div>
            </div>
          </div>
        </div>
        <div class="pillar-card">
          <div class="pillar-header"><div class="pillar-icon">C</div><div class="pillar-title">Critérios de Decisão</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Entenda como ele decide: o que precisa ser verdade para avançar, o que já tentou, o que o fez parar da última vez. Tire a conversa da disputa por preço.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Ativo nas etapas 4 e 5</div>
              <div class="pillar-ex">"O que precisaria ser verdade para você avançar?"</div>
              <div class="pillar-ex">"O que é mais importante: velocidade ou profundidade?"</div>
            </div>
          </div>
        </div>
        <div class="pillar-card">
          <div class="pillar-header"><div class="pillar-icon">O</div><div class="pillar-title">Objeções / Decisores</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Garanta todos os decisores na sala. Antecipe objeções na reunião — as que aparecem no follow-up são as que não foram tratadas enquanto ele estava presente.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Ativo nas etapas 4, 5 e 6</div>
              <div class="pillar-ex">Nunca feche sem todos os decisores</div>
              <div class="pillar-ex">"Qual é sua maior dúvida sobre avançar?"</div>
            </div>
          </div>
        </div>
        <div class="pillar-card">
          <div class="pillar-header"><div class="pillar-icon">M</div><div class="pillar-title">Métricas</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Calcule o custo do problema e o ROI da solução. Dê ao cliente a desculpa racional que ele precisa para justificar uma decisão que já tomou emocionalmente.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Ativo nas etapas 5 e 6</div>
              <div class="pillar-ex">"Em 12 meses, esse problema custou R$X."</div>
              <div class="pillar-ex">"O processo se paga em [N] meses."</div>
            </div>
          </div>
        </div>
      </div>

      <h3>O sketch tático — sua vantagem assimétrica</h3>
      <div class="rule-gold" style="border-left-color:var(--teal);">
        <div class="rule-icon" style="color:var(--teal);">✓</div>
        <div class="rule-content">
          <div class="rule-label" style="color:var(--teal);">Use — com critério</div>
          <div class="rule-text">O sketch é um rascunho de solução montado <strong>antes da reunião</strong>, com base nas dores da ligação. Não é a proposta — é a prova de que você já pensou no problema dele antes de ser contratado. O investimento é baixo (30–60 min em cima de um template), o impacto na conversão é alto: o cliente sai com a imagem mental do <em>depois</em>. <strong>Use apenas quando as dores se encaixam em um template existente</strong> — genérico é pior do que nada.</div>
        </div>
      </div>

      <div class="staircase" style="margin-top:1rem;">
        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Quando usar</div><div class="stair-name">Critérios de ativação</div></div>
          <div class="stair-right">
            <ul style="margin:0 0 0 16px;font-size:13px;color:var(--muted);line-height:1.9;">
              <li>O lead mencionou processos verbais, tudo na cabeça do dono ou falta de automação</li>
              <li>A ligação foi produtiva — ele abriu o jogo e as dores são claras e específicas</li>
              <li>As dores se encaixam em um dos templates de sketch pré-existentes</li>
              <li>Você tem pelo menos 24h até a reunião para personalizar com o nome da empresa e segmento</li>
            </ul>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">Não use</strong> se as dores foram vagas, se o lead está só explorando opções, ou se não tiver tempo para personalizar minimamente.</p>
          </div>
        </div>
        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Como montar</div><div class="stair-name">O que entra no sketch</div></div>
          <div class="stair-right">
            <p style="font-size:13px;color:var(--muted);">Parta de um template e personalize com: nome da empresa, segmento e as dores específicas mencionadas. O sketch pode ser:</p>
            <ul style="margin:8px 0 0 16px;font-size:13px;color:var(--muted);line-height:1.85;">
              <li>Um fluxo de automação (Make, n8n) com os processos do cliente mapeados</li>
              <li>Um dashboard de indicadores-chave para o negócio dele</li>
              <li>Um diagrama de como fica a operação <em>após</em> o Scalasys</li>
            </ul>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">Não precisa estar perfeito — precisa estar específico.</p>
          </div>
        </div>
        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Como apresentar</div><div class="stair-name">O pitch do sketch</div></div>
          <div class="stair-right">
            <p style="font-size:13px;color:var(--muted);">Apresente <strong>depois</strong> de espelhar as dores e <strong>antes</strong> de mostrar o investimento:</p>
            <p style="margin-top:8px;font-size:13px;font-style:italic;color:var(--muted);">"Com base no que você me contou, rascunhei como imagino a solução para o seu caso. Não é a proposta final — é a minha leitura do problema. Me diz se faz sentido."</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">A reação ao sketch calibra o escopo. Só depois você apresenta o investimento — ele já está emocionalmente investido.</p>
          </div>
        </div>
      </div>

      <h3>Templates de sketch (reutilizáveis)</h3>
      <div class="icp-grid">
        <div class="icp-card">
          <div class="icp-label">Clínica / Consultório</div>
          <div class="icp-title">Agendamento + follow-up automatizado</div>
          <p class="icp-text">Lead entra → IA qualifica → agenda → lembrete automático → pós-consulta + NPS → reativação de paciente inativo.</p>
        </div>
        <div class="icp-card">
          <div class="icp-label">Loja / Varejo</div>
          <div class="icp-title">Atendimento + pós-venda + reativação</div>
          <p class="icp-text">Atendimento padronizado → pós-compra → reativação de cliente inativo → gestão de estoque com alerta automático.</p>
        </div>
        <div class="icp-card">
          <div class="icp-label">Prestador de Serviços</div>
          <div class="icp-title">Proposta → execução → cobrança</div>
          <p class="icp-text">Briefing → orçamento com IA → aprovação → execução com checklist → cobrança automática → follow-up de indicação.</p>
        </div>
        <div class="icp-card">
          <div class="icp-label">Construção / Reforma</div>
          <div class="icp-title">Gestão de obra + comunicação com cliente</div>
          <p class="icp-text">Briefing → orçamento → cronograma → atualização automática de etapa → aprovação → medição → pagamento.</p>
        </div>
      </div>

      <div class="never-do" style="margin-top:1.5rem;">
        <div class="never-label">O que nunca fazer no ciclo de venda</div>
        <div class="never-item"><span class="never-x">✕</span><span>Começar a reunião explicando o produto — comece vendendo o <em>depois</em>. Emoção antes de lógica.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Mencionar preço antes de quantificar a dor — você vira commodity na hora.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Fazer reunião sem todos os decisores presentes — "vou mostrar para minha esposa" = venda perdida.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Deixar o produto parecer um risco — reduza incerteza com prova, exemplo e clareza de processo.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Oferecer desconto antes de entender a objeção real — reduz valor e sinaliza que o preço era mentira.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Preencher o silêncio após a pergunta de fechamento — faça a pergunta e espere. O próximo que falar, perde.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Terminar sem próximo passo com data — o lead some. Defina contrato, pagamento e início antes de sair da sala.</span></div>
      </div>

    </div>`,

  comercial: `
    <div class="tab-header" data-glyph="C">
      <div>
        <div class="tab-eyebrow">Comercial</div>
        <div class="tab-title">Como você <em>converte</em></div>
        <div class="tab-sub">Prospecção, processo de venda e pitches para cada oferta.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body">
      <h3 style="margin-top:0;">Prospecção — três fontes</h3>
      <div class="staircase">
        <div class="stair highlight"><div class="stair-left"><div class="stair-stage">Prioridade 01</div><div class="stair-name">Rede quente</div></div><div class="stair-right">Reative relacionamentos existentes. Mapeie 50 empresários que você conhece — A (ICP perfeito), B (ICP parcial), C (pode indicar). Aborde A e B com uma conversa direta.</div></div>
        <div class="stair"><div class="stair-left"><div class="stair-stage">Prioridade 02</div><div class="stair-name">LinkedIn outbound</div></div><div class="stair-right">20 conexões qualificadas por semana. A mensagem de abertura não vende — abre uma conversa. "Vi que você está à frente de uma empresa de [segmento]. Tenho trabalhado com empresários em estágios similares. Posso te fazer uma pergunta?"</div></div>
        <div class="stair"><div class="stair-left"><div class="stair-stage">Prioridade 03</div><div class="stair-name">Parceiros de indicação</div></div><div class="stair-right">Contadores, advogados empresariais e consultores de RH atendem o mesmo ICP sem competir. Mapeie 10 contadores e 5 advogados para parceria de indicação cruzada.</div></div>
      </div>
      <h3>Processo de venda</h3>
      <div class="sale-steps" style="margin-bottom:1.5rem;">
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 01</div><div class="sale-step-name">Contato inicial</div></div><div class="sale-step-right"><p class="sale-step-desc">Objetivo único: marcar a conversa de diagnóstico. Não venda o serviço — venda a conversa.</p><p class="sale-step-tip">Meta de uma mensagem: gerar uma resposta, não fechar uma venda.</p></div></div>
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 02</div><div class="sale-step-name">Qualificação rápida</div></div><div class="sale-step-right"><p class="sale-step-desc">Antes da reunião: faturamento, tamanho da equipe, problema principal. Define qual oferta faz sentido antes de você sentar.</p><p class="sale-step-tip">Não avance para o diagnóstico com quem claramente não é ICP do Scalasys.</p></div></div>
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 03</div><div class="sale-step-name">Diagnóstico</div></div><div class="sale-step-right"><p class="sale-step-desc">60–90 minutos. Faça perguntas, não apresentações. "Qual é o principal problema que está travando o seu crescimento?"</p><p class="sale-step-tip">O diagnóstico pode ser cobrado aqui (R$800–1.5k) ou usado como porta de entrada para o Scalasys.</p></div></div>
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 04</div><div class="sale-step-name">Proposta personalizada</div></div><div class="sale-step-right"><p class="sale-step-desc">Espelhe as palavras do cliente. Apresente os módulos recomendados, o escopo do projeto e o preço — baseado no que você encontrou no diagnóstico.</p><p class="sale-step-tip">Você não é um cardápio — é um médico. Diagnostica e prescreve.</p></div></div>
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 05</div><div class="sale-step-name">Fechamento</div></div><div class="sale-step-right"><p class="sale-step-desc">Peça o fechamento explicitamente. Entenda a objeção real antes de oferecer qualquer desconto.</p><p class="sale-step-tip">"Faz sentido para você começar em [data]?"</p></div></div>
      </div>
      <h3>Pitches por oferta</h3>
      <div class="pitch-blocks">
        <div class="pitch-block epc"><div class="pitch-label">Scalasys — empresário solo</div><p class="pitch-text">"Pelo que você me contou, você tem o negócio funcionando mas tudo passa por você — e isso está limitando o crescimento. A gente faz um diagnóstico da operação, identifica onde está o gargalo e implanta as soluções."</p></div>
        <div class="pitch-block arcus"><div class="pitch-label">Arcus Club — PME com equipe</div><p class="pitch-text">"O problema não é falta de demanda — é que a empresa não está estruturada para crescer. Trabalho com empresários nesse estágio por 6 meses — diagnóstico, implantação nos pilares de cultura, liderança e processos, e margem mensurável ao final."</p></div>
      </div>
      <div class="never-do">
        <div class="never-label">O que nunca fazer</div>
        <div class="never-item"><span class="never-x">✕</span><span>Mencionar preço antes do diagnóstico.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Apresentar as duas ofertas ao mesmo tempo como menu. A qualificação define qual se aplica — não o cliente.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Fazer o diagnóstico gratuito antes do Scalasys. Quem paga pelo diagnóstico tem intenção real.</span></div>
      </div>
      <h3>Pipeline</h3>
      <div class="pipeline" style="margin-top:0.75rem;">
        <div class="pipe-stage"><div class="pipe-num">01</div><div class="pipe-name">Lead mapeado</div><div class="pipe-action">Nome + contato</div></div>
        <div class="pipe-stage"><div class="pipe-num">02</div><div class="pipe-name">Abordagem feita</div><div class="pipe-action">Mensagem enviada</div></div>
        <div class="pipe-stage"><div class="pipe-num">03</div><div class="pipe-name">Resposta recebida</div><div class="pipe-action">Lead engajado</div></div>
        <div class="pipe-stage"><div class="pipe-num">04</div><div class="pipe-name">Diagnóstico realizado</div><div class="pipe-action">Proposta em prep.</div></div>
        <div class="pipe-stage"><div class="pipe-num">05</div><div class="pipe-name">Proposta enviada</div><div class="pipe-action">Aguardando decisão</div></div>
        <div class="pipe-stage won"><div class="pipe-num">✓</div><div class="pipe-name">Fechado</div><div class="pipe-action">Contrato assinado</div></div>
      </div>
    </div>`,

  'ops-scalasys': `
    <div class="tab-header" data-glyph="O">
      <div>
        <div class="tab-eyebrow">Estratégia · Operações</div>
        <div class="tab-title"><em>Scalasys</em></div>
        <div class="tab-sub">Como o produto funciona, o que entrega e como você executa.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body" style="max-width:none;">

      <div class="rule-gold">
        <div class="rule-icon">◎</div>
        <div class="rule-content"><div class="rule-label">O produto em uma frase</div><div class="rule-text">Você entra na operação do micro e pequeno empresário, mapeia os gargalos, estrutura os processos, define a estratégia e implementa IA onde faz sentido — em até 12 semanas, com escopo e valor fechados.</div></div>
      </div>

      <h3>ICP — Quem contrata</h3>
      <div class="icp-grid">
        <div class="icp-card indigo">
          <div class="icp-label">Perfil principal</div>
          <div class="icp-title">Micro e pequeno empresário solo</div>
          <p class="icp-text">Dentista, médico, lojista, prestador de serviços. Fatura entre R$10k–R$100k/mês. Opera no improviso. Tudo passa por ele — e o negócio para quando ele para.</p>
          <div class="icp-tags"><span class="icp-tag" style="background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);">0–5 funcionários</span></div>
        </div>
        <div class="icp-card">
          <div class="icp-label">Dor central</div>
          <div class="icp-title">"O negócio funciona, mas no improviso — e isso me custa caro."</div>
          <p class="icp-text">A operação roda, mas por esforço e sorte. Processos na cabeça, decisões sem critério, eficiência que nunca chega. Qualquer variação — um funcionário que sai, um mês ruim — e tudo ameaça desmoronar.</p>
        </div>
      </div>

      <h3>Os três eixos do produto</h3>
      <div class="pillar-cards">
        <div class="pillar-card featured">
          <div class="pillar-header"><div class="pillar-icon">P</div><div class="pillar-title">Processos</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Mapeia, documenta e padroniza os processos críticos da operação. O que hoje está na cabeça do dono vira manual executável pelo time.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Mapeamento dos processos críticos (atendimento, vendas, financeiro)</div>
              <div class="pillar-ex">Documentação em formato de playbook operacional</div>
              <div class="pillar-ex">Definição de indicadores por processo</div>
            </div>
          </div>
        </div>
        <div class="pillar-card featured">
          <div class="pillar-header"><div class="pillar-icon">E</div><div class="pillar-title">Estratégia</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Define prioridades, estrutura a tomada de decisão e posiciona o negócio para crescer com margem — não só com faturamento.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Diagnóstico de posicionamento e proposta de valor</div>
              <div class="pillar-ex">Mapa de prioridades estratégicas para 90 dias</div>
              <div class="pillar-ex">Modelo de decisão para o dono sair do operacional</div>
            </div>
          </div>
        </div>
        <div class="pillar-card featured">
          <div class="pillar-header"><div class="pillar-icon">IA</div><div class="pillar-title">IA &amp; Automação</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Implementa ferramentas de IA e automações nos processos onde o ganho é imediato: prospecção, atendimento, gestão e rotinas repetitivas.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Agente de prospecção ou atendimento com IA</div>
              <div class="pillar-ex">Automações de rotina (follow-up, relatórios, triagem)</div>
              <div class="pillar-ex">Stack de ferramentas configurado e documentado</div>
            </div>
          </div>
        </div>
      </div>

      <h3>Como a entrega funciona</h3>
      <div class="staircase">
        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Semanas 1–2</div><div class="stair-name">Diagnóstico aprofundado</div></div>
          <div class="stair-right">Imersão completa na operação: entrevistas, mapeamento dos processos existentes, análise de ferramentas e identificação dos gargalos que mais drenam margem. Entrega: relatório de diagnóstico com prioridades rankeadas e plano de implementação.</div>
        </div>
        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Semanas 3–8</div><div class="stair-name">Implementação</div></div>
          <div class="stair-right">Execução das prioridades definidas no diagnóstico. Processos documentados, automações configuradas, decisões estratégicas tomadas. Sessões semanais de acompanhamento — você aparece, executa, ajusta e avança.</div>
        </div>
        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Semanas 9–12</div><div class="stair-name">Consolidação e handoff</div></div>
          <div class="stair-right">Revisão do que foi implantado, ajustes finos, documentação final e handoff para o cliente operar sozinho. Entrega: playbook completo + stack de IA documentado e em funcionamento.</div>
        </div>
      </div>

      <h3>Escopo e entregáveis</h3>
      <div class="strat-cols">
        <div>
          <div class="strat-stage">Processos</div>
          <div class="product-card"><div class="product-body"><div class="product-pillars">
            <span class="pillar-tag">Mapa dos processos críticos</span>
            <span class="pillar-tag">Playbook operacional</span>
            <span class="pillar-tag">Indicadores por processo</span>
            <span class="pillar-tag">Checklist de rotinas</span>
            <span class="pillar-tag">Onboarding documentado</span>
          </div></div></div>
        </div>
        <div>
          <div class="strat-stage">Estratégia</div>
          <div class="product-card"><div class="product-body"><div class="product-pillars">
            <span class="pillar-tag">Diagnóstico de posicionamento</span>
            <span class="pillar-tag">Mapa de prioridades 90 dias</span>
            <span class="pillar-tag">Modelo de decisão</span>
            <span class="pillar-tag">Proposta de valor clara</span>
            <span class="pillar-tag">Critérios de precificação</span>
          </div></div></div>
        </div>
        <div>
          <div class="strat-stage">IA &amp; Automação</div>
          <div class="product-card"><div class="product-body"><div class="product-pillars">
            <span class="pillar-tag">Agente de IA configurado</span>
            <span class="pillar-tag">Automações de rotina</span>
            <span class="pillar-tag">Stack de ferramentas definido</span>
            <span class="pillar-tag">Documentação de uso</span>
            <span class="pillar-tag">Treinamento do cliente</span>
          </div></div></div>
        </div>
      </div>

      <div class="strat-full" style="margin-top:1.5rem;">
        <div class="product-card featured-indigo">
          <div class="product-sidebar"><div><div class="product-type">Pacote fechado</div><div class="product-name">Diagnóstico + Implementação</div><div class="product-duration">12 semanas · escopo fixo</div></div><div class="product-price"><div class="price-main">R$24k</div><div class="price-detail">valor fixo · sem surpresas</div></div></div>
          <div class="product-body"><p class="product-desc">Pacote único com escopo e valor definidos em contrato. O cliente sabe exatamente o que vai receber — sem horas extras, sem escopo aberto. Advisory opcional na sequência.</p><div class="product-pillars"><span class="pillar-tag">Diagnóstico aprofundado</span><span class="pillar-tag">Implementação acompanhada</span><span class="pillar-tag">Playbook entregue</span><span class="pillar-tag">IA configurada</span><span class="pillar-tag">Advisory opcional</span></div></div>
        </div>
      </div>

      <div class="discard-box" style="margin-top:1.5rem;">
        <div class="discard-label">Quem não é ICP para este produto</div>
        <ul class="discard-list">
          <li>Empresas que não querem investir em sistemas e automação sob medida</li>
          <li>Donos que não reconhecem o problema operacional — você diagnóstica, não converte crenças</li>
          <li>Quem quer consultoria pontual sem compromisso de implementação</li>
        </ul>
      </div>

    </div>`,

  'ops-arcus-removed': `<div></div>
    <div class="tab-body" style="max-width:none;">

      <div class="rule-gold">
        <div class="rule-icon">◎</div>
        <div class="rule-content"><div class="rule-label">O produto em uma frase</div><div class="rule-text">Você entra na PME como consultor de implantação por 6 meses — diagnostica os gargalos de cultura, liderança e processos, implanta as soluções e sai com margem crescente documentada.</div></div>
      </div>

      <h3>ICP — Quem contrata</h3>
      <div class="icp-grid">
        <div class="icp-card dark">
          <div class="icp-label">Perfil principal</div>
          <div class="icp-title">PME com equipe em expansão travada</div>
          <p class="icp-text">Faturamento R$500k–R$5M. Empresa com 5–40 funcionários. O dono virou o gargalo. A equipe cresce mas a produtividade não. A margem some e ninguém sabe por quê.</p>
          <div class="icp-tags"><span class="icp-tag" style="background:#E6F3EF;border-color:#1A6B5A;color:#1A6B5A;">Arcus Club</span></div>
        </div>
        <div class="icp-card">
          <div class="icp-label">Dor central</div>
          <div class="icp-title">"A empresa cresce, mas a margem some"</div>
          <p class="icp-text">Liderança fraca. Processos verbais. O dono continua resolvendo tudo. Retenção baixa. Contratações que não resolvem o problema.</p>
        </div>
      </div>

      <h3>Os três pilares do produto</h3>
      <div class="pillar-cards">
        <div class="pillar-card featured">
          <div class="pillar-header"><div class="pillar-icon">C</div><div class="pillar-title">Cultura</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Define e implanta os comportamentos, valores e ritmos que precisam existir para a empresa crescer sem o dono sendo o centro de tudo.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Diagnóstico de cultura atual vs. necessária</div>
              <div class="pillar-ex">Definição de valores e comportamentos esperados</div>
              <div class="pillar-ex">Rituais de equipe (reuniões, feedbacks, cadência)</div>
            </div>
          </div>
        </div>
        <div class="pillar-card featured">
          <div class="pillar-header"><div class="pillar-icon">L</div><div class="pillar-title">Liderança</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Desenvolve os líderes intermediários e redefine o papel do dono. A empresa para de depender de uma pessoa para funcionar.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Mapeamento de perfis de liderança existentes</div>
              <div class="pillar-ex">Plano de desenvolvimento individual por líder</div>
              <div class="pillar-ex">Delegação estruturada com critérios de decisão</div>
            </div>
          </div>
        </div>
        <div class="pillar-card featured">
          <div class="pillar-header"><div class="pillar-icon">P</div><div class="pillar-title">Processos</div></div>
          <div class="pillar-body">
            <p class="pillar-desc">Mapeia, redesenha e documenta os processos que mais impactam margem. Com equipe, a padronização é o que garante previsibilidade de resultado.</p>
            <div class="pillar-examples">
              <div class="pillar-ex">Mapeamento dos processos de maior impacto em margem</div>
              <div class="pillar-ex">Documentação e playbooks por área</div>
              <div class="pillar-ex">KPIs e dashboards de acompanhamento</div>
            </div>
          </div>
        </div>
      </div>

      <h3>Como a entrega funciona — 6 meses</h3>
      <div class="staircase">
        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Mês 1</div><div class="stair-name">Diagnóstico completo</div></div>
          <div class="stair-right">Imersão na empresa: entrevistas com dono, líderes e equipe-chave, análise de processos e indicadores, mapeamento de cultura atual. Entrega: relatório de diagnóstico com plano de implantação dos 5 meses seguintes.</div>
        </div>
        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Meses 2–3</div><div class="stair-name">Implantação de Processos</div></div>
          <div class="stair-right">Foco nos processos de maior impacto em margem. Documentação, padronização e treinamento da equipe. Acompanhamento semanal para garantir que o que foi desenhado funciona na prática.</div>
        </div>
        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Meses 3–4</div><div class="stair-name">Liderança e Cultura</div></div>
          <div class="stair-right">Desenvolvimento dos líderes identificados no diagnóstico. Implantação dos rituais de cultura. O dono começa a se afastar das decisões operacionais com segurança — porque tem pessoas e processos fazendo isso.</div>
        </div>
        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Meses 5–6</div><div class="stair-name">Consolidação e entrega</div></div>
          <div class="stair-right">Revisão de tudo que foi implantado, ajustes finos e KPIs validados. Documentação final e handoff. Apresentação dos resultados ao dono — margem antes e depois, autonomia da equipe, processos funcionando.</div>
        </div>
      </div>

      <h3>Escopo e entregáveis</h3>
      <div class="strat-cols">
        <div>
          <div class="strat-stage">Cultura</div>
          <div class="product-card"><div class="product-body"><div class="product-pillars">
            <span class="pillar-tag">Diagnóstico de cultura atual</span>
            <span class="pillar-tag">Manual de valores e comportamentos</span>
            <span class="pillar-tag">Rituais de equipe implantados</span>
            <span class="pillar-tag">Onboarding cultural estruturado</span>
          </div></div></div>
        </div>
        <div>
          <div class="strat-stage">Liderança</div>
          <div class="product-card"><div class="product-body"><div class="product-pillars">
            <span class="pillar-tag">Mapa de lideranças atuais</span>
            <span class="pillar-tag">Plano de desenvolvimento individual</span>
            <span class="pillar-tag">Modelo de delegação</span>
            <span class="pillar-tag">Critérios de decisão por nível</span>
          </div></div></div>
        </div>
        <div>
          <div class="strat-stage">Processos</div>
          <div class="product-card"><div class="product-body"><div class="product-pillars">
            <span class="pillar-tag">Processos críticos mapeados</span>
            <span class="pillar-tag">Playbooks por área</span>
            <span class="pillar-tag">KPIs e dashboard</span>
            <span class="pillar-tag">Relatório de resultados final</span>
          </div></div></div>
        </div>
      </div>

      <div class="strat-full" style="margin-top:1.5rem;">
        <div class="product-card featured-teal">
          <div class="product-sidebar"><div><div class="product-type">Mentoria exclusiva</div><div class="product-name">Consultoria de Implantação</div><div class="product-duration">12 meses de engajamento</div></div><div class="product-price"><div class="price-main">R$96k</div><div class="price-detail">R$8.000 / mês · anual</div></div></div>
          <div class="product-body"><p class="product-desc">Escopo definido no diagnóstico do mês 1. Você entra, estrutura e sai com resultado documentado. O cliente tem margem crescente e equipe com mais autonomia ao final de 6 meses.</p><div class="product-pillars"><span class="pillar-tag">Diagnóstico completo</span><span class="pillar-tag">Implantação nos 3 pilares</span><span class="pillar-tag">Acompanhamento semanal</span><span class="pillar-tag">Entregáveis documentados</span><span class="pillar-tag">Relatório de resultados</span></div></div>
        </div>
      </div>

      <div class="discard-box" style="margin-top:1.5rem;">
        <div class="discard-label">Quem não é ICP para este produto</div>
        <ul class="discard-list">
          <li>Empresas com menos de 5 funcionários — nesse caso, o produto correto é Margin Machine</li>
          <li>Dono que não aceita desenvolver liderança interna — sem delegação, o produto não gera resultado</li>
          <li>Faturamento abaixo de R$500k/ano — o ticket de R$96k não se sustenta na relação custo/benefício</li>
        </ul>
      </div>

    </div>`,

  'script-fechamento': `
    <div class="tab-header" data-glyph="S">
      <div>
        <div class="tab-eyebrow">Comercial · Script</div>
        <div class="tab-title">Script de <em>fechamento</em></div>
        <div class="tab-sub">Reunião de vendas — do minuto zero ao sim.</div>
      </div>
      <div class="tab-header-phrase">Ele já decidiu emocionalmente.<br><em>Dê a ele a lógica para confirmar.</em></div>
    </div>
    <div class="tab-body" style="max-width:780px;">

      <div class="rule-gold">
        <div class="rule-icon">◎</div>
        <div class="rule-content">
          <div class="rule-label">Como usar este script</div>
          <div class="rule-text">Roteiro de conversa — não um texto para ler. Cada passo tem um objetivo único: <strong>não avance sem completar o anterior.</strong> Ele fala 80% do tempo. As suas falas são gatilhos, não monólogos. O silêncio após uma pergunta é a sua ferramenta mais poderosa — não o preencha.</div>
        </div>
      </div>

      <h3>Antes de entrar</h3>
      <div class="staircase">
        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Prep</div><div class="stair-name">O que ter em mãos</div></div>
          <div class="stair-right">
            <ul style="margin:0 0 0 16px;font-size:13px;color:var(--muted);line-height:1.95;">
              <li>As 2–3 dores exatas da ligação — com as <strong>palavras dele</strong></li>
              <li>O número que ele estimou (custo do problema, tempo que está assim)</li>
              <li>O sketch personalizado, se os critérios foram atendidos</li>
              <li>Um caso de cliente parecido para reduzir incerteza</li>
              <li>Condições de pagamento prontas: à vista e parcelado</li>
            </ul>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);">Confirme 1h antes que <strong>todos os decisores</strong> estarão presentes. Se um cancelou, remarque — não faça a reunião pela metade.</p>
          </div>
        </div>
      </div>

      <h3>Os seis passos — em sequência</h3>
      <div class="staircase">

        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Passo 01</div><div class="stair-name">Acordo sim/não<br><span style="font-size:10px;font-weight:400;color:var(--muted);">0–5 min</span></div></div>
          <div class="stair-right">
            <p><strong>Estabeleça as regras do jogo antes de começar.</strong> Isso elimina o "vou pensar" no final — a saída mais comum e mais custosa. Você não está sendo agressivo; está sendo respeitoso com o tempo dos dois.</p>
            <p style="margin-top:10px;font-size:13px;font-style:italic;color:var(--muted);">"Antes de a gente começar, quero combinar uma coisa: no final dessa conversa, eu vou te perguntar se faz sentido avançar. Quero que você me diga sim ou não — não 'vou pensar'. Pode ser não — eu prefiro um não claro do que um talvez que não leva a lugar nenhum. Combinado?"</p>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);">Espere a confirmação. Só siga quando ele concordar. Quem diz "combinado" aqui dificilmente foge com "preciso pensar" no final.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">Princípio: reduza a incerteza do processo. Ele sabe o que vai acontecer — isso tira o medo de ser surpreendido.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Passo 02</div><div class="stair-name">Aprofundar a dor<br><span style="font-size:10px;font-weight:400;color:var(--muted);">5–25 min</span></div></div>
          <div class="stair-right">
            <p><strong>Ela fala, você escuta. Conecte com o que ele disse na ligação — com as palavras dele, não com as suas.</strong> Isso prova que você ouviu de verdade. Depois aprofunde: quantifique a perda e eleve a consciência sobre o custo de não agir.</p>
            <p style="margin-top:10px;font-size:13px;font-style:italic;color:var(--muted);">"Na nossa conversa, você me disse que [dor com as palavras exatas dele]. Quero entender isso melhor antes de qualquer coisa — me conta mais."</p>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">Perguntas de aprofundamento — use 2 ou 3:</strong></p>
            <ul style="margin:6px 0 0 16px;font-size:13px;color:var(--muted);line-height:1.95;">
              <li>"Há quanto tempo está assim?"</li>
              <li>"O que você já tentou para resolver? O que funcionou, o que não funcionou?"</li>
              <li>"Se eu te pedisse para colocar um número nisso — quanto esse problema custa por mês?"</li>
              <li>"O que acontece no teu negócio se daqui a 6 meses nada mudar?"</li>
              <li>"Se isso estivesse resolvido, o que ficaria diferente no teu dia a dia?"</li>
            </ul>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);">Anote as respostas. Você vai usá-las nos passos 5 e 6. Ele precisa ouvir as próprias palavras de volta — não as suas.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">Princípio: aversão a perda. "O que acontece se nada mudar?" pesa mais que "veja o que você ganha".</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Passo 03</div><div class="stair-name">Apresentação da solução<br><span style="font-size:10px;font-weight:400;color:var(--muted);">25–45 min</span></div></div>
          <div class="stair-right">
            <p><strong>Credencial + o que você oferece + diferencial.</strong> Nessa ordem. A credencial ancora quem você é antes de explicar o que faz. O diferencial não é o produto — é o resultado específico para as dores dele.</p>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">1. Credencial (30 segundos):</strong></p>
            <p style="margin-top:6px;font-size:13px;font-style:italic;color:var(--muted);">"Tenho trabalhado com empresários do Vale do Sinos que tinham exatamente esse perfil — bom faturamento, mas margem que não acompanha e operação que depende demais do dono. [Exemplo específico de resultado com cliente parecido, sem nome se necessário.]"</p>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">2. O que você oferece (sketch primeiro, se tiver):</strong></p>
            <p style="margin-top:6px;font-size:13px;font-style:italic;color:var(--muted);">"Com base no que você me contou — especialmente no [dor 1] e no [dor 2] — rascunhei como imagino a solução para o teu caso. Não é a proposta final; é a minha leitura do problema. Me diz se faz sentido."</p>
            <ul style="margin:8px 0 0 16px;font-size:13px;color:var(--muted);line-height:1.95;">
              <li><strong style="color:var(--ink);">Fase 1 (sem. 1–3):</strong> Diagnóstico — onde está o problema e por que ele persiste</li>
              <li><strong style="color:var(--ink);">Fase 2 (sem. 4–12):</strong> Implementação — processo comercial e operacional dentro do teu negócio</li>
              <li><strong style="color:var(--ink);">Fase 3 (sem. 13–22):</strong> Consolidação — o time opera, você supervisiona</li>
              <li><strong style="color:var(--ink);">Fase 4 (sem. 23–26):</strong> Entrega — handoff completo, negócio rodando sem depender de mim</li>
            </ul>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">3. Diferencial:</strong></p>
            <p style="margin-top:6px;font-size:13px;font-style:italic;color:var(--muted);">"A diferença não é o que eu vou te ensinar — é o que a gente vai construir dentro do teu negócio enquanto trabalhamos juntos. Você não recebe um curso; recebe o processo pronto, testado e documentado para rodar sem mim."</p>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);">Após cada fase: <em>"Isso faz sentido dado o que você me contou?"</em> Não avance sem a confirmação.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">Princípio: reduza a incerteza. Quanto mais claro o "como funciona", maior a conversão.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Passo 04</div><div class="stair-name">Verificar reação antes do preço<br><span style="font-size:10px;font-weight:400;color:var(--muted);">45–55 min</span></div></div>
          <div class="stair-right">
            <p><strong>Leia o sinal — só avance se estiver claro.</strong> Antes de qualquer número, use a pergunta de verificação abaixo. A objeção que aparece depois do preço é a que você não tratou aqui.</p>
            <div style="margin-top:12px;background:var(--ink);color:var(--bg);border-radius:8px;padding:12px 16px;font-size:14px;font-style:italic;">"O que você achou até aqui?"</div>
            <div style="margin-top:10px;background:rgba(255,255,255,0.04);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--muted);">
              <p><strong style="color:var(--ink);">"É exatamente o que eu preciso"</strong> → sinal verde, avance para o preço.</p>
              <p style="margin-top:8px;"><strong style="color:var(--ink);">"Interessante" / "Legal"</strong> → SINAL DE DESALINHAMENTO. Explore antes: <em>"O que especificamente faz sentido pra você? Tem algo que ainda não ficou claro?"</em></p>
            </div>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);">Só apresente o preço depois que o sinal for inequivocamente positivo. Se o interesse estiver baixo, volte para o passo 2 e aprofunde mais.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">Princípio: o produto não pode parecer risco. Objeção tratada aqui não volta no follow-up.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Passo 05</div><div class="stair-name">Preço — com firmeza e silêncio<br><span style="font-size:10px;font-weight:400;color:var(--muted);">55–65 min</span></div></div>
          <div class="stair-right">
            <p><strong>Fala e para. Quem falar primeiro depois do preço, perde.</strong> Apresente o investimento com clareza, sem rodeio. Depois: silêncio total.</p>
            <div style="margin-top:12px;background:var(--ink);color:var(--bg);border-radius:8px;padding:12px 16px;font-size:14px;font-style:italic;">"O investimento para essa mentoria é de R$24.000 — ou em 12 vezes de R$2.000 no cartão."</div>
            <div style="margin-top:10px;background:rgba(255,255,255,0.04);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--muted);">
              <p><strong style="color:var(--ink);font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.08em;">REGRA FUNDAMENTAL:</strong> Depois de falar o preço, pare. Não justifique, não preencha o silêncio. Quem falar primeiro depois do preço está em desvantagem. Espere.</p>
            </div>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">Princípio: dê a desculpa racional. Ela já decidiu emocionalmente — ajude-a a se sentir inteligente com a compra.</p>
          </div>
        </div>

        <div class="stair highlight">
          <div class="stair-left"><div class="stair-stage">Passo 06</div><div class="stair-name">Fechamento<br><span style="font-size:10px;font-weight:400;color:var(--muted);">"Parabéns, não obrigada"</span></div></div>
          <div class="stair-right">
            <p><strong>Quando ela disser sim: parabéns, não obrigada.</strong> "Obrigada" coloca você em posição de gratidão. "Parabéns" reconhece a coragem dela — é ela que fez algo significativo.</p>
            <div style="margin-top:12px;background:var(--ink);color:var(--bg);border-radius:8px;padding:12px 16px;font-size:14px;font-style:italic;">"Parabéns pela decisão. Esse é um passo importante e eu tenho certeza que vamos chegar lá juntas."</div>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);">Defina tudo na sala: contrato, primeiro pagamento, data de início. Nada de "te mando por e-mail" sem prazo. O que não tem data não acontece.</p>
            <p style="margin-top:10px;font-size:13px;color:var(--muted);"><strong style="color:var(--ink);">Se ela disser não:</strong> <em>"Entendo. Posso te fazer uma última pergunta — o que teria que ser diferente para fazer sentido?"</em> Ouça sem defender. Um não claro hoje vale mais do que um talvez que se arrasta por semanas.</p>
            <p style="margin-top:10px;font-size:11px;color:var(--teal);font-family:'DM Mono',monospace;letter-spacing:0.08em;">Princípio: venda pertencimento. Ela não está comprando um serviço — está entrando num grupo seleto de empresárias que resolveram isso.</p>
          </div>
        </div>

      </div>

      <h3>Tratamento de objeções</h3>
      <div class="staircase">

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Objeção 01</div><div class="stair-name">"Está caro"</div></div>
          <div class="stair-right">
            <p style="font-size:13px;color:var(--muted);">Nunca responda com desconto. Primeiro entenda o que está por baixo:</p>
            <p style="margin-top:8px;font-size:13px;font-style:italic;color:var(--muted);">"Entendo. Caro em relação a quê — ao valor disponível agora, ou ao resultado que você espera?"</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">Se for disponibilidade: ofereça parcelamento sem alterar o total. Se for percepção de valor: volte ao número que ele deu. <em>"Você me disse que isso custa R$X por mês. Em 6 meses são R$Y. O investimento é R$24k — você está pagando para resolver um problema que custa mais do que isso."</em></p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Objeção 02</div><div class="stair-name">"Preciso pensar"</div></div>
          <div class="stair-right">
            <p style="font-size:13px;color:var(--muted);">Lembre do acordo do passo 1. Nunca saia sem saber o que está por baixo.</p>
            <p style="margin-top:8px;font-size:13px;font-style:italic;color:var(--muted);">"A gente combinou no início que ia sair com um sim ou não. O que especificamente você precisa avaliar? Se eu souber o que está te travando, posso te ajudar a chegar na resposta agora."</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">Se ele não conseguir nomear: provavelmente é medo de errar — não falta de informação. <em>"O que aconteceria de errado se você avançasse e não funcionasse como esperado?"</em> Reduza o risco, não o preço.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Objeção 03</div><div class="stair-name">"Não é o momento"</div></div>
          <div class="stair-right">
            <p style="font-size:13px;color:var(--muted);">Use aversão a perda — não urgência artificial.</p>
            <p style="margin-top:8px;font-size:13px;font-style:italic;color:var(--muted);">"Entendo. Só uma pergunta: o que muda no teu negócio nos próximos 3 meses se esse problema continuar como está?"</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">Deixe responder. Depois: <em>"O processo leva 180 dias. Se começar em [mês], termina em [mês+6]. Qual seria o melhor momento para estar com isso resolvido?"</em> — o prazo vem dele, não de você.</p>
          </div>
        </div>

        <div class="stair">
          <div class="stair-left"><div class="stair-stage">Objeção 04</div><div class="stair-name">"Vou falar com minha esposa / sócio"</div></div>
          <div class="stair-right">
            <p style="font-size:13px;color:var(--muted);">O decisor certo não estava na sala — ou ele está buscando uma saída. Descubra qual dos dois é.</p>
            <p style="margin-top:8px;font-size:13px;font-style:italic;color:var(--muted);">"Claro. Para te ajudar nessa conversa — qual é a tua posição? Se você estivesse decidindo sozinho, o que você faria?"</p>
            <p style="margin-top:8px;font-size:13px;color:var(--muted);">Se quiser avançar: ofereça reunião com todos antes de qualquer contrato. Se estiver usando o sócio como escudo: a objeção real está em outro lugar — volte para as perguntas de aprofundamento.</p>
          </div>
        </div>

      </div>

      <div class="never-do" style="margin-top:1.5rem;">
        <div class="never-label">O que nunca fazer nessa reunião</div>
        <div class="never-item"><span class="never-x">✕</span><span>Pular o acordo do passo 1 — sem ele, o "preciso pensar" no final é garantido.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Falar mais de 20% do tempo — se você está falando mais, está empurrando. Volte para as perguntas.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Mostrar o preço antes de verificar a reação (passo 4) — número sem contexto emocional é só um obstáculo.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Preencher o silêncio após o preço — faça a pergunta e espere. O próximo que falar, perde.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Dizer "obrigado" ao fechar — diga "parabéns". Um sinalizao que você precisava; o outro, que ele decidiu bem.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Sair sem contrato, pagamento e data de início definidos na sala — o que não fica claro ali não acontece.</span></div>
      </div>

    </div>`,

  marketing: `
    <div class="tab-header" data-glyph="M">
      <div>
        <div class="tab-eyebrow">Marketing</div>
        <div class="tab-title">Autoridade e <em>audiência</em></div>
        <div class="tab-sub">Seus pilares de conteúdo, canais, quem você quer atrair e como o FLG converte audiência em clientes.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body">
      <div class="rule-gold">
        <div class="rule-icon">◎</div>
        <div class="rule-content"><div class="rule-label">A regra de ouro do FLG</div><div class="rule-text"><strong>Demonstre competência sem vender.</strong> Cada conteúdo deve gerar identificação no ICP e mostrar que você entende o problema melhor do que ele. A venda acontece na conversa direta — nunca no post.</div></div>
      </div>
      <h3>Seus quatro pilares de conteúdo</h3>
      <div class="pillar-cards">
        <div class="pillar-card featured"><div class="pillar-header"><div class="pillar-icon">1</div><div class="pillar-title">A tese central</div></div><div class="pillar-body"><p class="pillar-desc">Posts que provam que o lucro está na organização. Conecta estrutura interna com resultado financeiro.</p><div class="pillar-examples"><div class="pillar-ex">Por que empresas que crescem às vezes ficam mais pobres</div><div class="pillar-ex">O que acontece com a margem quando os processos são verbais</div><div class="pillar-ex">Empresa organizada vs. caótica com mesmo faturamento</div></div></div></div>
        <div class="pillar-card"><div class="pillar-header"><div class="pillar-icon">2</div><div class="pillar-title">Erros de gestão que o ICP comete</div></div><div class="pillar-body"><p class="pillar-desc">Padrões que você vê repetidamente. Quando o ICP lê, pensa: "isso sou eu."</p><div class="pillar-examples"><div class="pillar-ex">O dono que resolve tudo e acha que isso é liderança</div><div class="pillar-ex">A empresa que contrata para crescer e fica mais travada</div><div class="pillar-ex">Processos que existem na cabeça e em nenhum outro lugar</div></div></div></div>
        <div class="pillar-card"><div class="pillar-header"><div class="pillar-icon">3</div><div class="pillar-title">IA e automação para o empresário</div></div><div class="pillar-body"><p class="pillar-desc">Como tecnologia resolve problemas operacionais reais — sem jargão técnico.</p><div class="pillar-examples"><div class="pillar-ex">Como um agente de IA faz o trabalho de um SDR sem CLT</div><div class="pillar-ex">O que você pode automatizar esta semana no seu negócio</div><div class="pillar-ex">IA não substitui processo — ela amplifica. Primeiro organize, depois automatize</div></div></div></div>
        <div class="pillar-card"><div class="pillar-header"><div class="pillar-icon">4</div><div class="pillar-title">Bastidores e cases</div></div><div class="pillar-body"><p class="pillar-desc">Como você trabalha, o que você implanta, resultados reais. Prova de método e de resultado.</p><div class="pillar-examples"><div class="pillar-ex">O que um diagnóstico de empresa revela na primeira semana</div><div class="pillar-ex">Margem antes e depois da implantação de processos</div><div class="pillar-ex">Como um agente de prospecção mudou a rotina de um cliente</div></div></div></div>
      </div>
      <h3>Canais e cadência</h3>
      <div class="channel-grid" style="grid-template-columns:1fr;">
        <div class="channel-card primary"><div class="channel-header"><div class="channel-name">LinkedIn</div><div class="channel-badge">Canal principal</div></div><div class="channel-row"><div class="channel-lbl">Posts de texto longo</div><div class="channel-val">3× / semana</div></div><div class="channel-row"><div class="channel-lbl">Carrossel ou imagem de apoio</div><div class="channel-val">1× / semana</div></div><div class="channel-row"><div class="channel-lbl">Comentários estratégicos em perfis do ICP</div><div class="channel-val">Diário</div></div><div class="channel-row"><div class="channel-lbl">Novas conexões qualificadas</div><div class="channel-val">20× / semana</div></div></div>
      </div>
      <div class="channel-grid">
        <div class="channel-card"><div class="channel-header"><div class="channel-name">WhatsApp</div><div class="channel-badge">Nutrição</div></div><div class="channel-row"><div class="channel-lbl">Conteúdo curto e relevante</div><div class="channel-val">1× / semana</div></div><div class="channel-row"><div class="channel-lbl">Mensagem conversacional</div><div class="channel-val">1× / semana</div></div></div>
        <div class="channel-card"><div class="channel-header"><div class="channel-name">Podcast</div><div class="channel-badge">Futuro</div></div><div class="channel-row"><div class="channel-lbl">Formato</div><div class="channel-val">Conversacional</div></div><div class="channel-row"><div class="channel-lbl">Tema central</div><div class="channel-val">Gestão e automação</div></div></div>
      </div>
      <h3>O ICP do Scalasys</h3>
      <div class="icp-grid">
        <div class="icp-card indigo"><div class="icp-label">Perfil principal</div><div class="icp-title">Micro e pequeno empresário solo</div><p class="icp-text">Dentista, médico, lojista, prestador de serviços. O negócio funciona, mas no improviso — e isso custa caro. Sem estrutura, sem automação, sem tempo para resolver sozinho.</p><div class="icp-tags"><span class="icp-tag" style="background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);">Scalasys</span></div></div>
        <div class="icp-card"><div class="icp-label">A dor central</div><div class="icp-title">"Funciona, mas no improviso"</div><p class="icp-text">A operação roda por esforço e sorte. Qualquer variação ameaça desmoronar. É essa dor que o seu conteúdo nomeia.</p></div>
      </div>
      <div class="discard-box" style="margin-top:1.25rem;">
        <div class="discard-label">Quem não é seu ICP</div>
        <ul class="discard-list">
          <li>Startups sem faturamento — o ticket das suas consultorias não se sustenta nesse estágio</li>
          <li>Donos que acreditam que o problema é só de vendas — sem reconhecer os gargalos internos</li>
          <li>Quem quer palestra ou inspiração — seu produto é implantação, não motivação</li>
        </ul>
      </div>
      <h3>Como o FLG converte audiência em clientes</h3>
      <div class="funnel-flg">
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 1</div><div class="ff-name">Visibilidade</div></div><div class="ff-right">Posts consistentes sobre a tese. Seu ICP te encontra pelo conteúdo — não por anúncio.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 2</div><div class="ff-name">Identificação</div></div><div class="ff-right">Ele lê e pensa "isso sou eu". Salva o post. Começa a seguir. Você virou relevante — ainda sem nenhuma conversa.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 3</div><div class="ff-name">Confiança</div></div><div class="ff-right">Após semanas consumindo seu conteúdo, ele te vê como referência. Você sabe do que fala. Ele sente isso.</div></div>
        <div class="ff-step highlight"><div class="ff-left"><div class="ff-stage">Etapa 4</div><div class="ff-name">Inbound</div></div><div class="ff-right">Quando o problema fica urgente, você já é a primeira pessoa que ele pensa. Ele te procura — sem você precisar prospectar.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 5</div><div class="ff-name">Conversa e diagnóstico</div></div><div class="ff-right">A reunião com quem veio por inbound começa com confiança estabelecida. O ciclo de venda é 3× mais curto que outbound frio.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 6</div><div class="ff-name">Indicação</div></div><div class="ff-right">Cliente com resultado vira seguidor ativo e indica. Cada cliente entregue alimenta o pipeline orgânico e expande o catálogo de módulos.</div></div>
      </div>
    </div>`,

}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRODUCT_LABELS = {
  'diagnostico': 'Diagnóstico',
  'scalasys':    'Scalasys',
}

// ─── CRM constants ────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { key: 'mapeado',           label: 'Mapeado' },
  { key: 'abordagem1',        label: 'Abordagem 1' },
  { key: 'abordagem2',        label: 'Abordagem 2' },
  { key: 'abordagem3',        label: 'Abordagem 3' },
  { key: 'whatsapp',          label: 'WhatsApp obtido' },
  { key: 'msg_pre_ligacao',   label: 'Mensagem pré-ligação' },
  { key: 'ligacao',           label: 'Ligação realizada' },
  { key: 'reuniao_agendada',  label: 'Reunião agendada' },
  { key: 'reuniao_realizada', label: 'Reunião realizada' },
  { key: 'proposta',          label: 'Proposta enviada' },
  { key: 'fechado',           label: 'Fechado ✓' },
  { key: 'recusa',            label: 'Recusa' },
]

const COLD_STAGES = [
  { key: 'cold_mapeado',  label: 'Mapeado' },
  { key: 'cold_contato1', label: 'Primeiro Contato' },
  { key: 'cold_contato2', label: 'Segundo Contato' },
  { key: 'cold_contato3', label: 'Terceiro Contato' },
  { key: 'cold_recusa',   label: 'Recusa' },
]

function isColdLead(lead) {
  return lead?.stage?.startsWith('cold_')
}

const CRM_SOURCES    = ['LinkedIn', 'Rede quente', 'Indicação', 'Inbound', 'Evento', 'Outro']
const CRM_INT_TYPES  = ['Ligação', 'Mensagem', 'Reunião', 'E-mail', 'Outro']
const CRM_STEP_TYPES = ['Ligar', 'Enviar mensagem', 'Enviar proposta', 'Agendar reunião', 'Reunião de fechamento', 'Follow-up', 'Outro']

function fmtBRL(n) {
  if (!n && n !== 0) return '—'
  return `R$ ${Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
}

function cycleMonth(joinDate) {
  if (!joinDate) return '—'
  const start = new Date(joinDate)
  const now = new Date()
  const months = Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24 * 30)))
  return Math.min(months, 6)
}

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ViniciusPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [scalasysClients, setScalasysClients] = useState([])
  const [contracts, setContracts] = useState([])
  const [modal, setModal] = useState(null) // 'scalasys' | 'contract'
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  // CRM state
  const [crmLeads, setCrmLeads] = useState([])
  const [crmSearch, setCrmSearch] = useState('')
  const [crmSelectedId, setCrmSelectedId] = useState(null)
  const [crmDetailTab, setCrmDetailTab] = useState('historico')
  const [crmModal, setCrmModal] = useState(null) // 'lead' | 'int' | 'step'
  const [crmForm, setCrmForm] = useState({})
  const [crmSaving, setCrmSaving] = useState(false)
  const [crmError, setCrmError] = useState(null)
  const [crmFilters, setCrmFilters] = useState({ source: null, product: null, linkedin: null, overdue: false })
  const [crmPool, setCrmPool] = useState('hot') // 'hot' | 'cold'
  const [sendToHot, setSendToHot] = useState(null) // { leadId, stage }

  useEffect(() => { fetchAll(); fetchCrmLeads() }, [])

  async function fetchAll() {
    const [scalasys, conts] = await Promise.all([
      supabase.from('scalasys_clients').select('*').eq('status', 'ativo').order('created_at'),
      supabase.from('vini_contracts').select('*').eq('status', 'ativo').order('created_at'),
    ])
    setScalasysClients(scalasys.data || [])
    setContracts(conts.data || [])
  }

  function showTab(tab) {
    setActiveTab(tab)
  }

  function openModal(type) {
    setForm({})
    setFormError(null)
    setModal(type)
  }

  async function handleSaveScalasys(e) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const { error } = await supabase.from('scalasys_clients').insert({
      name: form.name,
      company: form.company || '',
      phase: form.phase || '',
      next_action: form.next_action || '',
      monthly_recurring: parseFloat(form.monthly_recurring) || 0,
      start_date: form.start_date || null,
    })
    if (error) { setFormError(error.message); setSaving(false); return }
    setSaving(false)
    setModal(null)
    fetchAll()
  }

  async function handleSaveContract(e) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const { error } = await supabase.from('vini_contracts').insert({
      client_name: form.client_name,
      product: form.product,
      total_value: parseFloat(form.total_value) || 0,
      payments_received: parseFloat(form.payments_received) || 0,
      next_payment_date: form.next_payment_date || null,
      next_payment_amount: parseFloat(form.next_payment_amount) || 0,
    })
    if (error) { setFormError(error.message); setSaving(false); return }
    setSaving(false)
    setModal(null)
    fetchAll()
  }

  const totalReceived = contracts.reduce((s, c) => s + (Number(c.payments_received) || 0), 0)
  const totalRecurring = 0 // sem produtos recorrentes ativos no momento

  function f(field) {
    return { value: form[field] || '', onChange: e => setForm({ ...form, [field]: e.target.value }) }
  }

  // ─── CRM helpers ────────────────────────────────────────────────────────────

  async function fetchCrmLeads() {
    const { data } = await supabase.from('vini_leads').select('*').order('created_at')
    setCrmLeads(data || [])
  }

  async function crmUpdateLead(id, updates) {
    // Optimistic update — reflete na UI imediatamente
    setCrmLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
    const { error } = await supabase.from('vini_leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    // Reverte se o banco recusar
    if (error) {
      console.error('[CRM] update error:', error.message)
      setCrmLeads(prev => prev.map(l => l.id === id ? { ...l, ...Object.fromEntries(Object.keys(updates).map(k => [k, l[k]])) } : l))
    }
  }

  async function crmSaveLead(e) {
    e.preventDefault()
    setCrmSaving(true)
    setCrmError(null)
    const { data, error } = await supabase.from('vini_leads').insert({
      name:      crmForm.leadName,
      company:   crmForm.leadCompany   || '',
      phone:     crmForm.leadPhone     || '',
      linkedin:  crmForm.leadLinkedin  || '',
      instagram: crmForm.leadInstagram || '',
      source:    crmForm.leadSource    || '',
      stage:     crmForm.leadStage     || 'mapeado',
      notes:     crmForm.leadNotes     || '',
    }).select().single()
    if (error) {
      setCrmError(error.message)
      setCrmSaving(false)
      return
    }
    if (data) setCrmLeads(prev => [...prev, data])
    setCrmSaving(false)
    setCrmModal(null)
    setCrmForm({})
    setCrmError(null)
  }

  async function crmDeleteLead(id) {
    if (!window.confirm('Excluir este lead?')) return
    await supabase.from('vini_leads').delete().eq('id', id)
    setCrmLeads(prev => prev.filter(l => l.id !== id))
    setCrmSelectedId(null)
  }

  async function crmSaveInt(e) {
    e.preventDefault()
    setCrmSaving(true)
    const lead = crmLeads.find(l => l.id === crmSelectedId)
    const ints = [...(lead.interactions || []), {
      id:   crypto.randomUUID(),
      type: crmForm.intType,
      date: crmForm.intDate,
      note: crmForm.intNote || '',
    }]
    await crmUpdateLead(crmSelectedId, { interactions: ints })
    setCrmSaving(false)
    setCrmModal(null)
    setCrmForm({})
  }

  async function crmDeleteInt(leadId, intId) {
    const lead = crmLeads.find(l => l.id === leadId)
    const ints = (lead.interactions || []).filter(i => i.id !== intId)
    await crmUpdateLead(leadId, { interactions: ints })
  }

  async function crmSaveStep(e) {
    e.preventDefault()
    setCrmSaving(true)
    const lead = crmLeads.find(l => l.id === crmSelectedId)
    const steps = [...(lead.next_steps || []), {
      id:    crypto.randomUUID(),
      type:  crmForm.stepType,
      title: crmForm.stepTitle || crmForm.stepType,
      date:  crmForm.stepDate,
      note:  crmForm.stepNote || '',
      done:  false,
    }]
    await crmUpdateLead(crmSelectedId, { next_steps: steps })
    setCrmSaving(false)
    setCrmModal(null)
    setCrmForm({})
  }

  async function crmToggleStep(leadId, stepId) {
    const lead = crmLeads.find(l => l.id === leadId)
    const steps = (lead.next_steps || []).map(s => s.id === stepId ? { ...s, done: !s.done } : s)
    await crmUpdateLead(leadId, { next_steps: steps })
  }

  async function crmDeleteStep(leadId, stepId) {
    const lead = crmLeads.find(l => l.id === leadId)
    const steps = (lead.next_steps || []).filter(s => s.id !== stepId)
    await crmUpdateLead(leadId, { next_steps: steps })
  }

  function crmF(field) {
    return { value: crmForm[field] || '', onChange: e => setCrmForm({ ...crmForm, [field]: e.target.value }) }
  }

  const filteredCrmLeads = crmLeads.filter(l => {
    if (crmSearch) {
      const q = crmSearch.toLowerCase()
      const match = l.name.toLowerCase().includes(q) ||
        (l.company || '').toLowerCase().includes(q) ||
        (l.source || '').toLowerCase().includes(q)
      if (!match) return false
    }
    if (crmFilters.source === 'sdr'    && l.source !== 'SDR Agent') return false
    if (crmFilters.source === 'manual' && l.source === 'SDR Agent') return false
    if (crmFilters.linkedin === 'connected'    && !l.linkedin_connected)  return false
    if (crmFilters.linkedin === 'notconnected' && l.linkedin_connected)   return false
    if (crmFilters.overdue) {
      const pending = (l.next_steps || []).filter(s => !s.done)
      const next = pending.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
      if (!next || !next.date || new Date(next.date) >= new Date()) return false
    }
    return true
  })

  return (
    <div className="vini-page">

      {/* ── SIDEBAR ── */}
      <nav className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-eyebrow">Plano FLG 2026</div>
          <div className="brand-name">Vinícius <em>Bohn</em></div>
          <div className="brand-sub">Founder Led Growth · Confidencial</div>
        </div>
        <div className="sidebar-nav">

          <div className={`nav-item${activeTab === 'dashboard' ? ' active' : ''}`} onClick={() => showTab('dashboard')}>
            <div className="nav-dot" /><span className="nav-label">Dashboard</span>
          </div>

          <div className="nav-divider" />

          <div className={`nav-item${activeTab === 'estrategia' ? ' active' : ''}`} onClick={() => showTab('estrategia')}>
            <div className="nav-dot" /><span className="nav-label">Estratégia</span>
          </div>
          <div style={{ padding: '0 0 0.25rem 0' }}>
            <div className={`nav-sub-item${activeTab === 'metas' ? ' active' : ''}`} onClick={() => showTab('metas')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">Metas</span>
            </div>
            <div className={`nav-sub-item${activeTab === 'check' ? ' active' : ''}`} onClick={() => showTab('check')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">Check Semanal</span>
            </div>
            <div className={`nav-sub-item${activeTab === 'ops-scalasys' ? ' active' : ''}`} onClick={() => showTab('ops-scalasys')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">Operações · Scalasys</span>
            </div>
          </div>

          <div className="nav-divider" />

          <div className={`nav-item${activeTab === 'comercial' ? ' active' : ''}`} onClick={() => showTab('comercial')}>
            <div className="nav-dot" /><span className="nav-label">Comercial</span>
          </div>
          <div style={{ padding: '0 0 0.25rem 0' }}>
            <div className={`nav-sub-item${activeTab === 'metodo' ? ' active' : ''}`} onClick={() => showTab('metodo')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">Método de Venda</span>
            </div>
            <div className={`nav-sub-item${activeTab === 'script-fechamento' ? ' active' : ''}`} onClick={() => showTab('script-fechamento')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">Script Fechamento</span>
            </div>
            <div className={`nav-sub-item${activeTab === 'crm' ? ' active' : ''}`} onClick={() => showTab('crm')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">CRM</span>
            </div>
            <div className={`nav-sub-item${activeTab === 'clientes' ? ' active' : ''}`} onClick={() => showTab('clientes')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">Clientes Ativos</span>
            </div>
          </div>

          <div className="nav-divider" />

          <div className={`nav-item${activeTab === 'marketing' ? ' active' : ''}`} onClick={() => showTab('marketing')}>
            <div className="nav-dot" /><span className="nav-label">Marketing</span>
          </div>
          <div style={{ padding: '0 0 0.25rem 0' }}>
            <div className={`nav-sub-item${activeTab === 'calendario' ? ' active' : ''}`} onClick={() => showTab('calendario')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">Plano de Marketing</span>
            </div>
          </div>

          <div className="nav-divider" />

          <div className={`nav-item${activeTab === 'financeiro' ? ' active' : ''}`} onClick={() => showTab('financeiro')}>
            <div className="nav-dot" /><span className="nav-label">Financeiro</span>
          </div>

        </div>
        <div className="sidebar-footer">Abril 2026 · Uso pessoal</div>
      </nav>

      {/* ── MAIN ── */}
      <main className="main">

        {/* Static tabs */}
        {Object.keys(TAB_HTML).map(tab => (
          <div
            key={tab}
            className={`tab-content${activeTab === tab ? ' active' : ''}`}
            dangerouslySetInnerHTML={{ __html: TAB_HTML[tab] }}
          />
        ))}

        {/* ── DASHBOARD (dynamic) ── */}
        <div className={`tab-content${activeTab === 'dashboard' ? ' active' : ''}`}>
          <ViniDashboard
            crmLeads={crmLeads}
            contracts={contracts}
            scalasysClients={scalasysClients}
          />
        </div>

        {/* ── CRM (dynamic) ── */}
        <div className={`tab-content${activeTab === 'crm' ? ' active' : ''}`}>
          <div className="tab-header">
            <div>
              <div className="tab-eyebrow">Comercial · CRM</div>
              <div className="tab-title">Gestão de <em>leads e pipeline</em></div>
              <div className="tab-sub">Pipeline de prospecção ativa — mova, qualifique e feche.</div>
            </div>
            <div className="tab-header-phrase">Eu faço você lucrar mais com<br /><em>sua estrutura atual.</em></div>
          </div>
          <div className="tab-body" style={{ maxWidth: 'none' }}>

            {/* HOT / COLD toggle */}
            <div className="crm-pool-toggle">
              <button
                className={`crm-pool-btn${crmPool === 'hot' ? ' active hot' : ''}`}
                onClick={() => setCrmPool('hot')}
              >🔥 HOT CRM</button>
              <button
                className={`crm-pool-btn${crmPool === 'cold' ? ' active cold' : ''}`}
                onClick={() => setCrmPool('cold')}
              >❄ COLD CRM</button>
            </div>

            <div className="crm-toolbar">
              <input
                className="crm-search"
                placeholder="Buscar lead…"
                value={crmSearch}
                onChange={e => setCrmSearch(e.target.value)}
              />
              <button
                className="vini-btn gold"
                onClick={() => {
                  setCrmForm({ leadStage: crmPool === 'cold' ? 'cold_mapeado' : 'mapeado' })
                  setCrmModal('lead')
                }}
              >+ Novo lead</button>
            </div>

            {/* Filters — only on HOT */}
            {crmPool === 'hot' && (
              <div className="crm-filter-bar">
                <div className="crm-filter-group">
                  <span className="crm-filter-label">Origem</span>
                  {[
                    { key: 'sdr',    label: 'SDR Agent', cls: 'sdr' },
                    { key: 'manual', label: 'Manual',    cls: '' },
                  ].map(f => (
                    <button
                      key={f.key}
                      className={`crm-filter-pill${crmFilters.source === f.key ? ` active ${f.cls}` : ''}`}
                      onClick={() => setCrmFilters(p => ({ ...p, source: p.source === f.key ? null : f.key }))}
                    >{f.label}</button>
                  ))}
                </div>
                <div className="crm-filter-group">
                  <span className="crm-filter-label">LinkedIn</span>
                  {[
                    { key: 'connected',    label: 'Conectado',     cls: 'li' },
                    { key: 'notconnected', label: 'Não conectado', cls: '' },
                  ].map(f => (
                    <button
                      key={f.key}
                      className={`crm-filter-pill${crmFilters.linkedin === f.key ? ` active ${f.cls}` : ''}`}
                      onClick={() => setCrmFilters(p => ({ ...p, linkedin: p.linkedin === f.key ? null : f.key }))}
                    >{f.label}</button>
                  ))}
                </div>
                <div className="crm-filter-group">
                  <button
                    className={`crm-filter-pill${crmFilters.overdue ? ' active overdue' : ''}`}
                    onClick={() => setCrmFilters(p => ({ ...p, overdue: !p.overdue }))}
                  >⚠ Atrasado</button>
                </div>
              </div>
            )}

            {/* ── HOT BOARD ── */}
            {crmPool === 'hot' && (
              <div className="crm-board">
                {PIPELINE_STAGES.map(stage => {
                  const stageLeads = filteredCrmLeads.filter(l => l.stage === stage.key)
                  const isRecusa = stage.key === 'recusa'
                  return (
                    <div key={stage.key} className={`crm-col${isRecusa ? ' recusa' : ''}`}>
                      <div className="crm-col-header">
                        <span className="crm-col-name">{stage.label}</span>
                        <span className="crm-col-count">{stageLeads.length}</span>
                      </div>
                      <div className="crm-cards">
                        {stageLeads.map(lead => {
                          const pending = (lead.next_steps || []).filter(s => !s.done)
                          const next = pending.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
                          const overdue = next && next.date && new Date(next.date) < new Date()
                          const recusaFromLabel = isRecusa && lead.recusa_from
                            ? PIPELINE_STAGES.find(s => s.key === lead.recusa_from)?.label
                            : null
                          return (
                            <div
                              key={lead.id}
                              className={`crm-card${isRecusa ? ' recusa' : overdue ? ' overdue' : ''}`}
                              onClick={() => { setCrmSelectedId(lead.id); setCrmDetailTab('historico') }}
                            >
                              {lead.source === 'SDR Agent' && <span className="crm-sdr-badge">SDR</span>}
                              <div className="crm-card-name">{lead.name}</div>
                              {lead.company && <div className="crm-card-company">{lead.company}</div>}
                              {lead.source && lead.source !== 'SDR Agent' && <div className="crm-card-source">{lead.source}</div>}
                              {recusaFromLabel && <div className="crm-recusa-from">← {recusaFromLabel}</div>}
                              <div className="crm-card-foot">
                                <span />{/* product tag removido — tudo é Scalasys */}
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                  {!isRecusa && next && (
                                    <span className={`crm-card-date${overdue ? ' overdue' : ''}`}>{fmtDate(next.date)}</span>
                                  )}
                                  {lead.linkedin_connected && (
                                    <svg className="crm-li-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="24" height="24" rx="4" fill="#0A66C2"/>
                                      <path d="M7.5 9.5H5V19H7.5V9.5ZM6.25 8.4C7.08 8.4 7.75 7.73 7.75 6.9C7.75 6.07 7.08 5.4 6.25 5.4C5.42 5.4 4.75 6.07 4.75 6.9C4.75 7.73 5.42 8.4 6.25 8.4ZM19 19H16.5V14.1C16.5 12.4 15.77 11.9 14.81 11.9C13.79 11.9 12.79 12.67 12.79 14.15V19H10.29V9.5H12.69V10.6H12.72C13.07 9.92 14.08 9.28 15.29 9.28C17.65 9.28 19 10.72 19 13.35V19Z" fill="white"/>
                                    </svg>
                                  )}
                                  {lead.instagram_connected && (
                                    <svg className="crm-ig-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <defs>
                                        <radialGradient id="ig-card-grad" cx="30%" cy="107%" r="150%">
                                          <stop offset="0%" stopColor="#ffd676"/>
                                          <stop offset="25%" stopColor="#f86f3e"/>
                                          <stop offset="50%" stopColor="#e1306c"/>
                                          <stop offset="75%" stopColor="#833ab4"/>
                                          <stop offset="100%" stopColor="#4f5bd5"/>
                                        </radialGradient>
                                      </defs>
                                      <rect width="24" height="24" rx="5" fill="url(#ig-card-grad)"/>
                                      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.6"/>
                                      <circle cx="12" cy="12" r="3.1" fill="none" stroke="white" strokeWidth="1.6"/>
                                      <circle cx="16.3" cy="7.7" r="0.9" fill="white"/>
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      {!isRecusa && (
                        <button
                          className="crm-col-add"
                          onClick={() => { setCrmForm({ leadStage: stage.key }); setCrmModal('lead') }}
                        >+ lead</button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── COLD BOARD ── */}
            {crmPool === 'cold' && (
              <div className="crm-board">
                {COLD_STAGES.map(stage => {
                  const stageLeads = filteredCrmLeads.filter(l => l.stage === stage.key)
                  const isRecusa = stage.key === 'cold_recusa'
                  return (
                    <div key={stage.key} className={`crm-col${isRecusa ? ' recusa' : ''}`}>
                      <div className="crm-col-header">
                        <span className="crm-col-name">{stage.label}</span>
                        <span className="crm-col-count">{stageLeads.length}</span>
                      </div>
                      <div className="crm-cards">
                        {stageLeads.map(lead => {
                          const recusaFromLabel = isRecusa && lead.recusa_from
                            ? COLD_STAGES.find(s => s.key === lead.recusa_from)?.label
                            : null
                          return (
                            <div
                              key={lead.id}
                              className={`crm-card${isRecusa ? ' recusa' : ''}`}
                              onClick={() => { setCrmSelectedId(lead.id); setCrmDetailTab('historico') }}
                            >
                              {lead.source === 'SDR Agent' && <span className="crm-sdr-badge">SDR</span>}
                              <div className="crm-card-name">{lead.name}</div>
                              {lead.company && <div className="crm-card-company">{lead.company}</div>}
                              {lead.source && lead.source !== 'SDR Agent' && <div className="crm-card-source">{lead.source}</div>}
                              {recusaFromLabel && <div className="crm-recusa-from">← {recusaFromLabel}</div>}
                              <div className="crm-card-foot">
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                  {lead.linkedin_connected && (
                                    <svg className="crm-li-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="24" height="24" rx="4" fill="#0A66C2"/>
                                      <path d="M7.5 9.5H5V19H7.5V9.5ZM6.25 8.4C7.08 8.4 7.75 7.73 7.75 6.9C7.75 6.07 7.08 5.4 6.25 5.4C5.42 5.4 4.75 6.07 4.75 6.9C4.75 7.73 5.42 8.4 6.25 8.4ZM19 19H16.5V14.1C16.5 12.4 15.77 11.9 14.81 11.9C13.79 11.9 12.79 12.67 12.79 14.15V19H10.29V9.5H12.69V10.6H12.72C13.07 9.92 14.08 9.28 15.29 9.28C17.65 9.28 19 10.72 19 13.35V19Z" fill="white"/>
                                    </svg>
                                  )}
                                  {lead.instagram_connected && (
                                    <svg className="crm-ig-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <defs>
                                        <radialGradient id="ig-cold-grad" cx="30%" cy="107%" r="150%">
                                          <stop offset="0%" stopColor="#ffd676"/>
                                          <stop offset="25%" stopColor="#f86f3e"/>
                                          <stop offset="50%" stopColor="#e1306c"/>
                                          <stop offset="75%" stopColor="#833ab4"/>
                                          <stop offset="100%" stopColor="#4f5bd5"/>
                                        </radialGradient>
                                      </defs>
                                      <rect width="24" height="24" rx="5" fill="url(#ig-cold-grad)"/>
                                      <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="1.6"/>
                                      <circle cx="12" cy="12" r="3.1" fill="none" stroke="white" strokeWidth="1.6"/>
                                      <circle cx="16.3" cy="7.7" r="0.9" fill="white"/>
                                    </svg>
                                  )}
                                </div>
                                {!isRecusa && (
                                  <button
                                    className="crm-send-hot-btn"
                                    onClick={e => {
                                      e.stopPropagation()
                                      setSendToHot({ leadId: lead.id, stage: 'mapeado' })
                                    }}
                                  >→ HOT</button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      {!isRecusa && (
                        <button
                          className="crm-col-add"
                          onClick={() => { setCrmForm({ leadStage: stage.key }); setCrmModal('lead') }}
                        >+ lead</button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        </div>

        {/* ── CLIENTES ATIVOS (dynamic) ── */}
        <div className={`tab-content${activeTab === 'clientes' ? ' active' : ''}`}>
          <div className="tab-header">
            <div>
              <div className="tab-eyebrow">Comercial · Clientes</div>
              <div className="tab-title">Clientes <em>ativos</em></div>
              <div className="tab-sub">Todos os clientes em andamento — Scalasys.</div>
            </div>
            <div className="tab-header-phrase">Eu faço você lucrar mais com<br /><em>sua estrutura atual.</em></div>
          </div>
          <div className="tab-body">

            <div className="vini-section-bar">
              <h3 style={{ margin: 0 }}>Scalasys</h3>
              <button className="vini-btn" onClick={() => openModal('scalasys')}>+ Novo cliente</button>
            </div>
            {scalasysClients.length === 0
              ? <div className="vini-empty" style={{ marginBottom: '2rem' }}>Nenhum cliente Scalasys ativo ainda.</div>
              : (
                <div className="vini-table-wrap" style={{ marginBottom: '2.5rem' }}>
                  <table className="vini-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Fase</th>
                        <th>Próxima ação</th>
                        <th style={{ textAlign: 'right' }}>Recorrência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scalasysClients.map(c => (
                        <tr key={c.id}>
                          <td className="name">{c.name}</td>
                          <td>{c.phase || '—'}</td>
                          <td>{c.next_action || '—'}</td>
                          <td className="mono" style={{ textAlign: 'right' }}>
                            {c.monthly_recurring ? `${fmtBRL(c.monthly_recurring)}/mês` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }


          </div>
        </div>

        {/* ── CHECK SEMANAL (dynamic) ── */}
        <div className={`tab-content${activeTab === 'check' ? ' active' : ''}`}>
          <div className="tab-header">
            <div>
              <div className="tab-eyebrow">Estratégia · Check Semanal</div>
              <div className="tab-title">Acompanhamento <em>semanal</em></div>
              <div className="tab-sub">Reflexão por semana + funil de conversão com taxas em tempo real.</div>
            </div>
            <div className="tab-header-phrase">Ou você bate a meta,<br /><em>ou aprende por que não bateu.</em></div>
          </div>
          <div className="tab-body" style={{ maxWidth: 'none' }}>
            <ViniMetas crmLeads={crmLeads} />
          </div>
        </div>

        {/* ── PLANO DE MARKETING (dynamic) ── */}
        <div className={`tab-content${activeTab === 'calendario' ? ' active' : ''}`}>
          <div className="tab-header">
            <div>
              <div className="tab-eyebrow">Marketing · Calendário</div>
              <div className="tab-title">Plano de <em>conteúdo</em></div>
              <div className="tab-sub">Calendário editorial · gere prompts e acompanhe a execução.</div>
            </div>
            <div className="tab-header-phrase">Eu faço você lucrar mais com<br /><em>sua estrutura atual.</em></div>
          </div>
          <div className="tab-body" style={{ maxWidth: 'none' }}>
            <ViniMarketing />
          </div>
        </div>

        {/* ── FINANCEIRO (dynamic) ── */}
        <div className={`tab-content${activeTab === 'financeiro' ? ' active' : ''}`}>
          <div className="tab-header" data-glyph="F">
            <div>
              <div className="tab-eyebrow">Financeiro</div>
              <div className="tab-title">Receita e <em>recorrência</em></div>
              <div className="tab-sub">O que entrou, o que está previsto e se você está no caminho da meta.</div>
            </div>
            <div className="tab-header-phrase">Eu faço você lucrar mais com<br /><em>sua estrutura atual.</em></div>
          </div>
          <div className="tab-body">

            <h3 style={{ marginTop: 0 }}>Resumo do mês</h3>
            <div className="vini-kpi-grid">
              <div className="vini-kpi dark">
                <div className="vini-kpi-label">Receita realizada</div>
                <div className="vini-kpi-val">{fmtBRL(totalReceived)}</div>
                <div className="vini-kpi-sub">Soma dos recebimentos</div>
              </div>
              <div className="vini-kpi light teal">
                <div className="vini-kpi-label">Contratos ativos</div>
                <div className="vini-kpi-val">{contracts.length}</div>
                <div className="vini-kpi-sub">Total de contratos</div>
              </div>
              <div className="vini-kpi light indigo">
                <div className="vini-kpi-label">Recorrência ativa</div>
                <div className="vini-kpi-val">{fmtBRL(totalRecurring)}</div>
                <div className="vini-kpi-sub">Advisory + Manutenção Scalasys</div>
              </div>
            </div>

            <div className="vini-section-bar">
              <h3 style={{ margin: 0 }}>Contratos ativos</h3>
              <button className="vini-btn" onClick={() => openModal('contract')}>+ Novo contrato</button>
            </div>

            {contracts.length === 0
              ? <div className="vini-empty" style={{ marginBottom: '1.5rem' }}>Nenhum contrato ativo ainda.</div>
              : (
                <div className="vini-table-wrap" style={{ marginBottom: '1.5rem' }}>
                  <table className="vini-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Produto</th>
                        <th>Valor total</th>
                        <th>Recebido</th>
                        <th>Próx. pagamento</th>
                        <th style={{ textAlign: 'right' }}>Próx. valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map(c => (
                        <tr key={c.id}>
                          <td className="name">{c.client_name}</td>
                          <td>
                            <span className={`badge ${c.product === 'scalasys' || c.product === 'margin-machine' ? 'indigo' : 'gold'}`}>
                              {PRODUCT_LABELS[c.product] || (c.product === 'margin-machine' ? 'Scalasys' : c.product)}
                            </span>
                          </td>
                          <td className="mono">{fmtBRL(c.total_value)}</td>
                          <td className="teal">{fmtBRL(c.payments_received)}</td>
                          <td>{fmtDate(c.next_payment_date)}</td>
                          <td className="mono" style={{ textAlign: 'right' }}>{fmtBRL(c.next_payment_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }

          </div>
        </div>

      </main>

      {/* ── MODAL: Novo cliente Scalasys ── */}
      {modal === 'scalasys' && (
        <div className="vini-modal-overlay" onClick={() => setModal(null)}>
          <div className="vini-modal" onClick={e => e.stopPropagation()}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Novo cliente — Scalasys</div>
              <button className="vini-modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <form onSubmit={handleSaveScalasys} className="vini-modal-form">
              <label>
                Nome do cliente *
                <input type="text" required {...f('name')} placeholder="Ex: João Silva" />
              </label>
              <label>
                Empresa
                <input type="text" {...f('company')} placeholder="Ex: Clínica Saúde Total" />
              </label>
              <label>
                Fase atual
                <input type="text" {...f('phase')} placeholder="Ex: Diagnóstico, Desenvolvimento, Revisão…" />
              </label>
              <label>
                Próxima ação
                <input type="text" {...f('next_action')} placeholder="Ex: Reunião de handoff em 20/04" />
              </label>
              <label>
                Recorrência mensal (R$)
                <input type="number" min="0" step="50" {...f('monthly_recurring')} placeholder="0" />
              </label>
              <label>
                Data de início
                <input type="date" {...f('start_date')} />
              </label>
              {formError && <div className="vini-error">{formError}</div>}
              <div className="vini-modal-actions">
                <button type="button" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar cliente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CRM: Lead detail modal ── */}
      {crmSelectedId && (() => {
        const lead = crmLeads.find(l => l.id === crmSelectedId)
        if (!lead) return null
        const interactions = (lead.interactions || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date))
        const steps = (lead.next_steps || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date))
        return (
          <div className="vini-modal-overlay" onClick={() => setCrmSelectedId(null)}>
            <div className="vini-modal" key={crmSelectedId} onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
              <div className="vini-modal-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    className="crm-name-input"
                    defaultValue={lead.name}
                    placeholder="Nome do lead"
                    onBlur={e => { if (e.target.value.trim() && e.target.value !== lead.name) crmUpdateLead(lead.id, { name: e.target.value.trim() }) }}
                  />
                  <input
                    className="crm-company-input"
                    defaultValue={lead.company || ''}
                    placeholder="Empresa"
                    onBlur={e => { if (e.target.value !== (lead.company || '')) crmUpdateLead(lead.id, { company: e.target.value }) }}
                  />
                  {lead.source && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{lead.source}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    style={{ fontSize: 11, color: '#A03030', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
                    onClick={() => crmDeleteLead(lead.id)}
                  >Excluir</button>
                  <button className="vini-modal-close" onClick={() => setCrmSelectedId(null)}>×</button>
                </div>
              </div>

              {/* Contact info */}
              <div className="crm-contact-row">
                <div className="crm-contact-field">
                  <span className="crm-contact-label">Celular</span>
                  <input
                    className="crm-contact-input"
                    defaultValue={lead.phone || ''}
                    placeholder="+55 51 9…"
                    onBlur={e => { if (e.target.value !== (lead.phone || '')) crmUpdateLead(lead.id, { phone: e.target.value }) }}
                  />
                </div>
                <div className="crm-contact-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="crm-contact-label">LinkedIn</span>
                    <button
                      className={`crm-li-connect-btn${lead.linkedin_connected ? ' connected' : ''}`}
                      onClick={() => crmUpdateLead(lead.id, { linkedin_connected: !lead.linkedin_connected })}
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 10, height: 10, display: 'inline', verticalAlign: 'middle', marginRight: 3 }}>
                        <rect width="24" height="24" rx="3" fill="currentColor"/>
                        <path d="M7.5 9.5H5V19H7.5V9.5ZM6.25 8.4C7.08 8.4 7.75 7.73 7.75 6.9C7.75 6.07 7.08 5.4 6.25 5.4C5.42 5.4 4.75 6.07 4.75 6.9C4.75 7.73 5.42 8.4 6.25 8.4ZM19 19H16.5V14.1C16.5 12.4 15.77 11.9 14.81 11.9C13.79 11.9 12.79 12.67 12.79 14.15V19H10.29V9.5H12.69V10.6H12.72C13.07 9.92 14.08 9.28 15.29 9.28C17.65 9.28 19 10.72 19 13.35V19Z" fill="white"/>
                      </svg>
                      {lead.linkedin_connected ? 'Conectado' : 'Conectar'}
                    </button>
                  </div>
                  <input
                    className="crm-contact-input"
                    defaultValue={lead.linkedin || ''}
                    placeholder="linkedin.com/in/…"
                    onBlur={e => { if (e.target.value !== (lead.linkedin || '')) crmUpdateLead(lead.id, { linkedin: e.target.value }) }}
                  />
                </div>
              </div>

              {/* Instagram row */}
              <div className="crm-contact-row">
                <div className="crm-contact-field" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="crm-contact-label">Instagram</span>
                    <button
                      className={`crm-ig-connect-btn${lead.instagram_connected ? ' connected' : ''}`}
                      onClick={() => crmUpdateLead(lead.id, { instagram_connected: !lead.instagram_connected })}
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 10, height: 10, display: 'inline', verticalAlign: 'middle', marginRight: 3 }}>
                        <rect width="24" height="24" rx="4" fill="currentColor"/>
                        <rect x="6" y="6" width="12" height="12" rx="3.5" fill="none" stroke="white" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="2"/>
                        <circle cx="16.3" cy="7.7" r="1" fill="white"/>
                      </svg>
                      {lead.instagram_connected ? 'Seguindo' : 'Seguir'}
                    </button>
                  </div>
                  <input
                    className="crm-contact-input"
                    defaultValue={lead.instagram || ''}
                    placeholder="@usuario"
                    onBlur={e => { if (e.target.value !== (lead.instagram || '')) crmUpdateLead(lead.id, { instagram: e.target.value }) }}
                  />
                </div>
              </div>

              {/* SDR metadata banner */}
              {lead.source === 'SDR Agent' && lead.sdr_data && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.5rem 1.25rem', borderBottom: '0.5px solid var(--border)',
                  background: '#F0F4FF',
                }}>
                  <span className="crm-sdr-badge" style={{ marginBottom: 0 }}>SDR Agent</span>
                  {lead.sdr_data.score != null && (
                    <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#3D5FA0' }}>
                      Score: <strong>{lead.sdr_data.score}</strong>/100
                    </span>
                  )}
                  {lead.sdr_data.original_source && (
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      via {lead.sdr_data.original_source}
                    </span>
                  )}
                  {lead.sdr_data.source_url && (
                    <a
                      href={lead.sdr_data.source_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 11, color: '#3D5FA0', marginLeft: 'auto' }}
                    >Ver fonte ↗</a>
                  )}
                </div>
              )}

              {/* Stage pills */}
              {(() => {
                const isCold = isColdLead(lead)
                const stages = isCold ? COLD_STAGES : PIPELINE_STAGES
                const recusaKey = isCold ? 'cold_recusa' : 'recusa'
                return (
                  <>
                    <div className="crm-stage-row">
                      {stages.map(s => (
                        <button
                          key={s.key}
                          className={`crm-stage-pill${lead.stage === s.key ? ' active' : ''}${s.key === recusaKey ? ' recusa' : ''}`}
                          onClick={() => {
                            if (s.key === recusaKey) {
                              crmUpdateLead(lead.id, { stage: recusaKey, recusa_from: lead.stage })
                            } else {
                              crmUpdateLead(lead.id, { stage: s.key, recusa_from: null })
                            }
                          }}
                        >{s.label}</button>
                      ))}
                    </div>
                    {lead.stage === recusaKey && lead.recusa_from && (
                      <div className="crm-recusa-banner">
                        Recusou na etapa: <strong>{stages.find(s => s.key === lead.recusa_from)?.label || lead.recusa_from}</strong>
                      </div>
                    )}
                    {isCold && (
                      <div style={{ padding: '0.5rem 1.25rem 0', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          className="crm-send-hot-btn"
                          style={{ fontSize: 12, padding: '5px 14px' }}
                          onClick={() => setSendToHot({ leadId: lead.id, stage: 'mapeado' })}
                        >→ Mover para HOT CRM</button>
                      </div>
                    )}
                  </>
                )
              })()}

              {/* Notes */}
              <div className="crm-notes-row">
                <textarea
                  className="crm-notes"
                  placeholder="Notas sobre o lead…"
                  defaultValue={lead.notes || ''}
                  onBlur={e => { if (e.target.value !== (lead.notes || '')) crmUpdateLead(lead.id, { notes: e.target.value }) }}
                />
              </div>

              {/* Tabs */}
              <div className="crm-dtabs">
                <button className={`crm-dtab${crmDetailTab === 'historico' ? ' active' : ''}`} onClick={() => setCrmDetailTab('historico')}>
                  Histórico ({interactions.length})
                </button>
                <button className={`crm-dtab${crmDetailTab === 'proximos' ? ' active' : ''}`} onClick={() => setCrmDetailTab('proximos')}>
                  Próximos passos ({steps.filter(s => !s.done).length})
                </button>
              </div>

              <div className="crm-dcontent">
                {crmDetailTab === 'historico' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1.25rem 0' }}>
                      <button className="vini-btn" onClick={() => { setCrmForm({}); setCrmModal('int') }}>+ Interação</button>
                    </div>
                    {interactions.length === 0
                      ? <div className="vini-empty" style={{ margin: '0.75rem 1.25rem' }}>Nenhuma interação registrada.</div>
                      : interactions.map(int => (
                        <div key={int.id} className="crm-int-item">
                          <div className="crm-int-head">
                            <span className="crm-int-type">{int.type}</span>
                            <span className="crm-int-date">{fmtDate(int.date)}</span>
                            <button className="crm-del-btn" onClick={() => crmDeleteInt(lead.id, int.id)}>×</button>
                          </div>
                          {int.note && <div className="crm-int-note">{int.note}</div>}
                        </div>
                      ))
                    }
                  </>
                )}
                {crmDetailTab === 'proximos' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.75rem 1.25rem 0' }}>
                      <button className="vini-btn" onClick={() => { setCrmForm({}); setCrmModal('step') }}>+ Próximo passo</button>
                    </div>
                    {steps.length === 0
                      ? <div className="vini-empty" style={{ margin: '0.75rem 1.25rem' }}>Nenhum próximo passo.</div>
                      : steps.map(step => {
                        const sOverdue = step.date && !step.done && new Date(step.date) < new Date()
                        return (
                          <div key={step.id} className={`crm-step-item${step.done ? ' done' : ''}${sOverdue ? ' overdue' : ''}`}>
                            <button className="crm-step-check" onClick={() => crmToggleStep(lead.id, step.id)}>
                              {step.done ? '✓' : '○'}
                            </button>
                            <div className="crm-step-body">
                              <div className="crm-step-head">
                                <span className="crm-step-type">{step.type}</span>
                                <span className="crm-step-date">{fmtDate(step.date)}</span>
                                <button className="crm-del-btn" onClick={() => crmDeleteStep(lead.id, step.id)}>×</button>
                              </div>
                              {step.title && <div className="crm-step-title">{step.title}</div>}
                              {step.note  && <div className="crm-step-note">{step.note}</div>}
                            </div>
                          </div>
                        )
                      })
                    }
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── CRM: Add lead modal ── */}
      {crmModal === 'lead' && (
        <div className="vini-modal-overlay" onClick={() => { setCrmModal(null); setCrmError(null) }} style={{ zIndex: 10000 }}>
          <div className="vini-modal" onClick={e => e.stopPropagation()}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Novo lead</div>
              <button className="vini-modal-close" onClick={() => { setCrmModal(null); setCrmError(null) }}>×</button>
            </div>
            <form onSubmit={crmSaveLead} className="vini-modal-form">
              <label>Nome *<input type="text" required {...crmF('leadName')} placeholder="Ex: João Silva" /></label>
              <label>Empresa<input type="text" {...crmF('leadCompany')} placeholder="Ex: Clínica Saúde Total" /></label>
              <label>Telefone<input type="text" {...crmF('leadPhone')} placeholder="+55 51 9…" /></label>
              <label>LinkedIn<input type="text" {...crmF('leadLinkedin')} placeholder="linkedin.com/in/…" /></label>
              <label>Instagram<input type="text" {...crmF('leadInstagram')} placeholder="@usuario" /></label>
              <label>Origem
                <select {...crmF('leadSource')}>
                  <option value="">Selecione…</option>
                  {CRM_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label>Etapa do pipeline
                <select {...crmF('leadStage')}>
                  {(isColdLead({ stage: crmForm.leadStage })
                    ? COLD_STAGES.filter(s => s.key !== 'cold_recusa')
                    : PIPELINE_STAGES.filter(s => s.key !== 'recusa')
                  ).map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </label>
              <label>Notas<textarea {...crmF('leadNotes')} placeholder="Contexto inicial…" /></label>
              {crmError && <div className="vini-error">{crmError}</div>}
              <div className="vini-modal-actions">
                <button type="button" onClick={() => { setCrmModal(null); setCrmError(null) }}>Cancelar</button>
                <button type="submit" disabled={crmSaving}>{crmSaving ? 'Salvando…' : 'Salvar lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CRM: Send to HOT modal ── */}
      {sendToHot && (
        <div className="vini-modal-overlay" onClick={() => setSendToHot(null)} style={{ zIndex: 10001 }}>
          <div className="vini-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Mover para HOT CRM</div>
              <button className="vini-modal-close" onClick={() => setSendToHot(null)}>×</button>
            </div>
            <div className="vini-modal-form">
              <label>Etapa no HOT CRM
                <select
                  value={sendToHot.stage}
                  onChange={e => setSendToHot(p => ({ ...p, stage: e.target.value }))}
                >
                  {PIPELINE_STAGES.filter(s => s.key !== 'recusa').map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </label>
              <div className="vini-modal-actions">
                <button type="button" onClick={() => setSendToHot(null)}>Cancelar</button>
                <button
                  type="button"
                  onClick={async () => {
                    await crmUpdateLead(sendToHot.leadId, { stage: sendToHot.stage, recusa_from: null })
                    setSendToHot(null)
                    setCrmPool('hot')
                  }}
                >Mover para HOT →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CRM: Add interaction modal ── */}
      {crmModal === 'int' && (
        <div className="vini-modal-overlay" onClick={() => setCrmModal(null)} style={{ zIndex: 10000 }}>
          <div className="vini-modal" onClick={e => e.stopPropagation()}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Registrar interação</div>
              <button className="vini-modal-close" onClick={() => setCrmModal(null)}>×</button>
            </div>
            <form onSubmit={crmSaveInt} className="vini-modal-form">
              <label>Tipo *
                <select required {...crmF('intType')}>
                  <option value="">Selecione…</option>
                  {CRM_INT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>Data *<input type="date" required {...crmF('intDate')} /></label>
              <label>Nota<textarea {...crmF('intNote')} placeholder="O que aconteceu?" /></label>
              <div className="vini-modal-actions">
                <button type="button" onClick={() => setCrmModal(null)}>Cancelar</button>
                <button type="submit" disabled={crmSaving}>{crmSaving ? 'Salvando…' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CRM: Add step modal ── */}
      {crmModal === 'step' && (
        <div className="vini-modal-overlay" onClick={() => setCrmModal(null)} style={{ zIndex: 10000 }}>
          <div className="vini-modal" onClick={e => e.stopPropagation()}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Próximo passo</div>
              <button className="vini-modal-close" onClick={() => setCrmModal(null)}>×</button>
            </div>
            <form onSubmit={crmSaveStep} className="vini-modal-form">
              <label>Ação *
                <select required {...crmF('stepType')}>
                  <option value="">Selecione…</option>
                  {CRM_STEP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>Título<input type="text" {...crmF('stepTitle')} placeholder="Ex: Enviar proposta Scalasys" /></label>
              <label>Data *<input type="date" required {...crmF('stepDate')} /></label>
              <label>Nota<textarea {...crmF('stepNote')} placeholder="Contexto adicional…" /></label>
              <div className="vini-modal-actions">
                <button type="button" onClick={() => setCrmModal(null)}>Cancelar</button>
                <button type="submit" disabled={crmSaving}>{crmSaving ? 'Salvando…' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Novo contrato ── */}
      {modal === 'contract' && (
        <div className="vini-modal-overlay" onClick={() => setModal(null)}>
          <div className="vini-modal" onClick={e => e.stopPropagation()}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Novo contrato</div>
              <button className="vini-modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <form onSubmit={handleSaveContract} className="vini-modal-form">
              <label>
                Nome do cliente *
                <input type="text" required {...f('client_name')} placeholder="Ex: Empresa Ltda" />
              </label>
              <label>
                Produto *
                <select required {...f('product')}>
                  <option value="">Selecione…</option>
                  <option value="diagnostico">Diagnóstico</option>
                  <option value="scalasys">Scalasys</option>
                </select>
              </label>
              <label>
                Valor total do contrato (R$)
                <input type="number" min="0" step="100" {...f('total_value')} placeholder="0" />
              </label>
              <label>
                Já recebido (R$)
                <input type="number" min="0" step="100" {...f('payments_received')} placeholder="0" />
              </label>
              <label>
                Data do próximo pagamento
                <input type="date" {...f('next_payment_date')} />
              </label>
              <label>
                Valor do próximo pagamento (R$)
                <input type="number" min="0" step="100" {...f('next_payment_amount')} placeholder="0" />
              </label>
              {formError && <div className="vini-error">{formError}</div>}
              <div className="vini-modal-actions">
                <button type="button" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar contrato'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
