import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import './ViniciusPage.css'

// ─── Static tab HTML content ─────────────────────────────────────────────────

const TAB_HTML = {
  dashboard: `
    <div class="tab-header" data-glyph="D">
      <div>
        <div class="tab-eyebrow">Dashboard</div>
        <div class="tab-title">Visão <em>geral</em></div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body"></div>`,

  metas: `
    <div class="tab-header" data-glyph="M">
      <div>
        <div class="tab-eyebrow">Estratégia · Metas</div>
        <div class="tab-title">Metas de <em>vendas</em></div>
        <div class="tab-sub">30, 90 e 180 dias — foco em fechamento.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body" style="max-width:none;">
      <div class="metas-grid">

        <!-- 30 dias -->
        <div class="metas-col indigo">
          <div class="metas-period-header indigo">
            <div class="metas-period-eyebrow">Primeiros</div>
            <div class="metas-period-num">30</div>
            <div class="metas-period-unit">dias</div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">01</div>
            <div><div class="metas-goal-title">2 contratos EPC fechados</div><div class="metas-goal-val">R$48k em caixa</div></div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">02</div>
            <div><div class="metas-goal-title">1 diagnóstico Arcus Club realizado</div><div class="metas-goal-val">proposta enviada</div></div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">03</div>
            <div><div class="metas-goal-title">Pipeline com 10 leads qualificados ativos</div><div class="metas-goal-val">rede quente + LinkedIn</div></div>
          </div>
          <div class="metas-total">
            <div class="metas-total-label">Receita gerada</div>
            <div class="metas-total-val">R$48k</div>
          </div>
        </div>

        <!-- 90 dias -->
        <div class="metas-col teal">
          <div class="metas-period-header teal">
            <div class="metas-period-eyebrow">Primeiros</div>
            <div class="metas-period-num">90</div>
            <div class="metas-period-unit">dias</div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">01</div>
            <div><div class="metas-goal-title">6 contratos EPC fechados</div><div class="metas-goal-val">R$144k acumulados</div></div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">02</div>
            <div><div class="metas-goal-title">2 contratos Arcus Club fechados</div><div class="metas-goal-val">R$70k · 1 piloto + 1 full</div></div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">03</div>
            <div><div class="metas-goal-title">3 Advisory iniciados</div><div class="metas-goal-val">R$9k / mês recorrente</div></div>
          </div>
          <div class="metas-total">
            <div class="metas-total-label">Receita gerada</div>
            <div class="metas-total-val">R$214k</div>
          </div>
        </div>

        <!-- 180 dias -->
        <div class="metas-col gold">
          <div class="metas-period-header gold">
            <div class="metas-period-eyebrow">Primeiros</div>
            <div class="metas-period-num">180</div>
            <div class="metas-period-unit">dias</div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">01</div>
            <div><div class="metas-goal-title">12 contratos EPC + 4 Arcus fechados</div><div class="metas-goal-val">R$288k + R$166k = R$454k</div></div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">02</div>
            <div><div class="metas-goal-title">6 Advisory ativos</div><div class="metas-goal-val">R$18k / mês recorrente</div></div>
          </div>
          <div class="metas-goal">
            <div class="metas-goal-num">03</div>
            <div><div class="metas-goal-title">Base do clube de mentoria estruturada</div><div class="metas-goal-val">Advisory como porta de entrada</div></div>
          </div>
          <div class="metas-total">
            <div class="metas-total-label">Receita gerada</div>
            <div class="metas-total-val">R$500k+</div>
          </div>
        </div>

      </div>
    </div>`,

  estrategia: `
    <div class="tab-header" data-glyph="E">
      <div>
        <div class="tab-eyebrow">Estratégia</div>
        <div class="tab-title">As duas <em>ofertas</em></div>
        <div class="tab-sub">Comparativo lado a lado e o detalhe de cada produto.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body" style="max-width:none;">
      <div class="compare" style="margin-bottom:1rem;">
        <div class="compare-card epc"><div class="compare-header"><div class="compare-name">Estrutura para Crescer</div><div class="compare-sub">Micro e pequeno empresário</div></div><div class="compare-row"><div class="compare-key">Cliente</div><div class="compare-val">Solo, 0–5 funcionários</div></div><div class="compare-row"><div class="compare-key">Diagnóstico inicial</div><div class="compare-val">Gratuito (comercial)</div></div><div class="compare-row"><div class="compare-key">Pacote fechado</div><div class="compare-val">R$24k</div></div><div class="compare-row"><div class="compare-key">Advisory</div><div class="compare-val">Opcional · recorrente</div></div><div class="compare-row"><div class="compare-key">LTV estimado</div><div class="compare-val">R$30k+</div></div></div>
        <div class="compare-card arcus"><div class="compare-header"><div class="compare-name">Arcus Club</div><div class="compare-sub">PME com equipe</div></div><div class="compare-row"><div class="compare-key">Cliente</div><div class="compare-val">5–40 funcionários</div></div><div class="compare-row"><div class="compare-key">Consultoria</div><div class="compare-val">R$48k / 6 meses</div></div><div class="compare-row"><div class="compare-key">Recorrência</div><div class="compare-val">Advisory R$36k/ano</div></div><div class="compare-row"><div class="compare-key">1º cliente</div><div class="compare-val">~R$22k (piloto)</div></div><div class="compare-row"><div class="compare-key">LTV estimado</div><div class="compare-val">~R$78k</div></div></div>
      </div>
      <div class="rule-gold" style="margin-bottom:2rem;">
        <div class="rule-icon">↑</div>
        <div class="rule-content"><div class="rule-label">A escada entre as ofertas</div><div class="rule-text">O cliente de Estrutura para Crescer que cresce vira candidato natural para a Arcus Club. Você entra cedo na trajetória dele com um investimento acessível — e quando ele tiver equipe e escala, a venda da Arcus já está quase feita.</div></div>
      </div>
      <div class="strat-cols">

        <!-- Etapa 1: Diagnóstico Inicial — ambos os produtos -->
        <div class="strat-full">
          <div class="strat-stage">Etapa 1 · Diagnóstico Inicial — válido para ambas as ofertas</div>
          <div class="product-card">
            <div class="product-sidebar"><div><div class="product-type">Parte do comercial</div><div class="product-name">Diagnóstico Inicial</div><div class="product-duration">Conversa estruturada</div></div><div class="product-price"><div class="price-main">Grátis</div><div class="price-detail">sem compromisso</div></div></div>
            <div class="product-body"><p class="product-desc">Conversa estruturada para entender as dores, oportunidades de atuação e o contexto do negócio. Define qual das duas ofertas faz sentido — ou se nenhuma se aplica.</p><div class="product-pillars"><span class="pillar-tag">Mapeamento de dores</span><span class="pillar-tag">Oportunidades de atuação</span><span class="pillar-tag">Fit comercial</span></div></div>
          </div>
        </div>

        <!-- Etapa 2: produto-específico, duas colunas de igual largura -->
        <div>
          <div class="strat-stage">Etapa 2 · Estrutura para Crescer</div>
          <div class="product-card featured-indigo">
            <div class="product-sidebar"><div><div class="product-type">Pacote fechado</div><div class="product-name">Diagnóstico Aprofundado + Implementação</div><div class="product-duration">Escopo definido na proposta</div></div><div class="product-price"><div class="price-main">R$24k</div><div class="price-detail">valor fixo · sem surpresas</div></div></div>
            <div class="product-body"><p class="product-desc">Diagnóstico profundo dos gargalos operacionais seguido da implementação dos processos e ferramentas prioritários. O cliente compra um pacote único com escopo e valor fechados.</p><div class="product-pillars"><span class="pillar-tag">Diagnóstico aprofundado</span><span class="pillar-tag">Processos implantados</span><span class="pillar-tag">Ferramentas configuradas</span><span class="pillar-tag">Resultado documentado</span></div></div>
          </div>
        </div>
        <div>
          <div class="strat-stage">Etapa 2 · Arcus Club</div>
          <div class="product-card featured-teal">
            <div class="product-sidebar"><div><div class="product-type">Produto core</div><div class="product-name">Consultoria de Implantação</div><div class="product-duration">6 meses de engajamento</div></div><div class="product-price"><div class="price-main">R$48k</div><div class="price-detail">R$8.000 / mês</div><div class="price-badge" style="background:rgba(184,147,58,0.2);color:#D4B06A;">1º cliente: ~R$22k</div></div></div>
            <div class="product-body"><p class="product-desc">Diagnóstico dos principais gargalos seguido de implantação direta nos três pilares. Você entra, estrutura e sai com o resultado documentado — margem crescente e equipe com mais autonomia.</p><div class="product-pillars"><span class="pillar-tag">Cultura</span><span class="pillar-tag">Liderança</span><span class="pillar-tag">Processos</span><span class="pillar-tag">Margem mensurável</span></div></div>
          </div>
        </div>

        <!-- Etapa 3: Advisory — ambos os produtos -->
        <div class="strat-full">
          <div class="strat-stage">Etapa 3 · Advisory Estratégico — válido para ambas as ofertas</div>
          <div class="product-card">
            <div class="product-sidebar"><div><div class="product-type">Recorrência · opcional</div><div class="product-name">Advisory Estratégico</div><div class="product-duration">Mensal · renovação semestral</div></div><div class="product-price"><div class="price-main">R$36k</div><div class="price-detail">R$3.000 / mês · anual</div></div></div>
            <div class="product-body"><p class="product-desc">Acompanhamento estratégico contínuo após a implementação ou consultoria. O Advisory é o portal de entrada para um clube de mentoria — onde clientes com perfis complementares crescem juntos.</p><div class="product-pillars"><span class="pillar-tag">Acompanhamento mensal</span><span class="pillar-tag">Acesso direto</span><span class="pillar-tag">Iterações nos processos</span><span class="pillar-tag">Base para o clube de mentoria</span></div></div>
          </div>
        </div>

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
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 02</div><div class="sale-step-name">Qualificação rápida</div></div><div class="sale-step-right"><p class="sale-step-desc">Antes da reunião: faturamento, tamanho da equipe, problema principal. Define qual oferta faz sentido antes de você sentar.</p><p class="sale-step-tip">Não avance para o diagnóstico com quem claramente não é ICP de nenhuma das duas ofertas.</p></div></div>
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 03</div><div class="sale-step-name">Diagnóstico</div></div><div class="sale-step-right"><p class="sale-step-desc">60–90 minutos. Faça perguntas, não apresentações. "Qual é o principal problema que está travando o seu crescimento?"</p><p class="sale-step-tip">Para EPC: o diagnóstico pode ser cobrado aqui (R$800–1.5k). Para Arcus: faz parte da venda.</p></div></div>
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 04</div><div class="sale-step-name">Proposta personalizada</div></div><div class="sale-step-right"><p class="sale-step-desc">Espelhe as palavras do cliente. Para EPC: apresente os módulos recomendados com escopo e preço. Para Arcus: apresente o plano de implantação baseado no que você encontrou.</p><p class="sale-step-tip">Você não é um cardápio — é um médico. Diagnostica e prescreve.</p></div></div>
        <div class="sale-step"><div class="sale-step-left"><div class="sale-step-num">ETAPA 05</div><div class="sale-step-name">Fechamento</div></div><div class="sale-step-right"><p class="sale-step-desc">Peça o fechamento explicitamente. Entenda a objeção real antes de oferecer qualquer desconto.</p><p class="sale-step-tip">"Faz sentido para você começar em [data]?"</p></div></div>
      </div>
      <h3>Pitches por oferta</h3>
      <div class="pitch-blocks">
        <div class="pitch-block epc"><div class="pitch-label">Estrutura para Crescer — empresário solo</div><p class="pitch-text">"Pelo que você me contou, você tem o negócio funcionando mas tudo passa por você — e isso está limitando o crescimento. A gente faz um diagnóstico da operação, identifica onde está o gargalo e implanta as soluções."</p></div>
        <div class="pitch-block arcus"><div class="pitch-label">Arcus Club — PME com equipe</div><p class="pitch-text">"O problema não é falta de demanda — é que a empresa não está estruturada para crescer. Trabalho com empresários nesse estágio por 6 meses — diagnóstico, implantação nos pilares de cultura, liderança e processos, e margem mensurável ao final."</p></div>
      </div>
      <div class="never-do">
        <div class="never-label">O que nunca fazer</div>
        <div class="never-item"><span class="never-x">✕</span><span>Mencionar preço antes do diagnóstico.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Apresentar as duas ofertas ao mesmo tempo como menu. A qualificação define qual se aplica — não o cliente.</span></div>
        <div class="never-item"><span class="never-x">✕</span><span>Fazer o diagnóstico gratuito para Estrutura para Crescer. Quem paga pelo diagnóstico tem intenção real.</span></div>
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
      <h3>Os dois perfis de ICP</h3>
      <div class="icp-grid">
        <div class="icp-card dark"><div class="icp-label">ICP Arcus Club</div><div class="icp-title">PME com equipe em expansão travada</div><p class="icp-text">Faturamento R$500k–R$5M. Empresa com 5–40 funcionários. O dono virou o gargalo. A margem some e ninguém sabe por quê.</p><div class="icp-tags"><span class="icp-tag" style="background:#E6F3EF;border-color:#1A6B5A;color:#1A6B5A;">Arcus Club</span></div></div>
        <div class="icp-card indigo"><div class="icp-label">ICP Estrutura para Crescer</div><div class="icp-title">Micro e pequeno empresário solo</div><p class="icp-text">Dentista, médico, lojista, prestador de serviços. Fatura bem mas opera no improviso. Não tem estrutura, não tem automação, não tem tempo para resolver sozinho.</p><div class="icp-tags"><span class="icp-tag" style="background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.2);color:rgba(255,255,255,0.8);">Estrutura para Crescer</span></div></div>
      </div>
      <div class="icp-grid">
        <div class="icp-card"><div class="icp-label">A dor comum</div><div class="icp-title">"O negócio depende demais de mim"</div><p class="icp-text">A dor central é a mesma para os dois perfis. É essa dor que o seu conteúdo nomeia.</p></div>
        <div class="icp-card"><div class="icp-label">A escada natural</div><div class="icp-title">Estrutura para Crescer alimenta a Arcus</div><p class="icp-text">O cliente que contrata EPC hoje, quando crescer e tiver equipe, é o candidato natural para a Arcus Club.</p></div>
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
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 1</div><div class="ff-name">Visibilidade</div></div><div class="ff-right">Posts consistentes sobre a tese. Os dois perfis de ICP te encontram pelo conteúdo — não por anúncio.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 2</div><div class="ff-name">Identificação</div></div><div class="ff-right">Ele lê e pensa "isso sou eu". Salva o post. Começa a seguir. Você virou relevante — ainda sem nenhuma conversa.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 3</div><div class="ff-name">Confiança</div></div><div class="ff-right">Após semanas consumindo seu conteúdo, ele te vê como referência. Você sabe do que fala. Ele sente isso.</div></div>
        <div class="ff-step highlight"><div class="ff-left"><div class="ff-stage">Etapa 4</div><div class="ff-name">Inbound</div></div><div class="ff-right">Quando o problema fica urgente, você já é a primeira pessoa que ele pensa. Ele te procura — sem você precisar prospectar.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 5</div><div class="ff-name">Conversa e diagnóstico</div></div><div class="ff-right">A reunião com quem veio por inbound começa com confiança estabelecida. O ciclo de venda é 3× mais curto que outbound frio.</div></div>
        <div class="ff-step"><div class="ff-left"><div class="ff-stage">Etapa 6</div><div class="ff-name">Indicação e escada</div></div><div class="ff-right">Cliente com resultado vira seguidor ativo e indica. Clientes de EPC que crescem sobem para a Arcus Club.</div></div>
      </div>
    </div>`,

  'op-epc': `
    <div class="tab-header" data-glyph="E" style="border-top:3px solid #3D3D8F;">
      <div>
        <div class="tab-eyebrow">Operação · Estrutura para Crescer</div>
        <div class="tab-title">Como você <em>entrega</em></div>
        <div class="tab-sub">Do diagnóstico pago à implementação modular — o que acontece depois que o cliente fecha.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body">
      <h3 style="margin-top:0;">Modelo de entrega</h3>
      <div class="flow-steps" style="margin-bottom:1.5rem;">
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">01</div><div class="flow-content"><div class="flow-title">Diagnóstico pago (R$800–1.5k)</div><div class="flow-desc">Sessão de 90–120 min + relatório com mapeamento de gargalos, módulos recomendados e investimento. O cliente decide o que fechar.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">02</div><div class="flow-content"><div class="flow-title">Contrato e briefing dos módulos</div><div class="flow-desc">Definição do escopo final, acesso às ferramentas do cliente e prazo de entrega por módulo.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">03</div><div class="flow-content"><div class="flow-title">Implementação dos módulos</div><div class="flow-desc">Você configura, testa e entrega funcionando. Cada módulo tem prazo próprio — de 3 a 10 dias dependendo da complexidade.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">04</div><div class="flow-content"><div class="flow-title">Handoff e treinamento</div><div class="flow-desc">Sessão de entrega com o cliente: como usar, como acompanhar, o que esperar. O cliente precisa saber operar o que foi implantado.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">05</div><div class="flow-content"><div class="flow-title">Manutenção mensal (opcional)</div><div class="flow-desc">R$800–1.5k/mês para monitoramento, iterações e novos módulos conforme o negócio cresce.</div></div></div>
      </div>
      <h3>Capacidade operacional</h3>
      <div class="quad-grid">
        <div class="q-cell dark"><div class="q-label">Clientes simultâneos</div><span class="q-highlight">Capacidade maior</span><p class="q-text">A natureza modular permite mais projetos paralelos. Um projeto de 2–3 módulos ocupa significativamente menos tempo que uma consultoria de 6 meses.</p></div>
        <div class="q-cell"><div class="q-label">Prazo por módulo</div><p class="q-text">3 a 10 dias por módulo, dependendo da complexidade. Um projeto completo de 3 módulos leva em média 3–4 semanas.</p></div>
        <div class="q-cell"><div class="q-label">Primeiro cliente</div><p class="q-text">Diagnóstico a preço de custo ou gratuito no primeiro cliente-piloto. Objetivo: gerar o case documentado com antes e depois.</p></div>
        <div class="q-cell dark"><div class="q-label">Gatilho para contratar</div><span class="q-highlight">3+ projetos simultâneos</span><p class="q-text">Quando a demanda de EPC começar a competir com a Arcus Club pelo seu tempo, é o sinal para trazer um colaborador técnico.</p></div>
      </div>
    </div>`,

  'op-arcus': `
    <div class="tab-header" data-glyph="A" style="border-top:3px solid #1A6B5A;">
      <div>
        <div class="tab-eyebrow">Operação · Arcus Club</div>
        <div class="tab-title">Consultoria <em>mês a mês</em></div>
        <div class="tab-sub">Onboarding, modelo de entrega e capacidade operacional da consultoria de 6 meses.</div>
      </div>
      <div class="tab-header-phrase">Eu faço você lucrar mais com<br><em>sua estrutura atual.</em></div>
    </div>
    <div class="tab-body">
      <h3 style="margin-top:0;">Onboarding pós-fechamento</h3>
      <div class="flow-steps" style="margin-bottom:1.5rem;">
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">01</div><div class="flow-content"><div class="flow-title">Contrato e pagamento</div><div class="flow-desc">Contrato assinado e entrada confirmada antes de qualquer início de trabalho.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">02</div><div class="flow-content"><div class="flow-title">Briefing de empresa</div><div class="flow-desc">Formulário estruturado preenchido pelo cliente — faturamento, equipe, processos existentes, maiores dores percebidas.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">03</div><div class="flow-content"><div class="flow-title">Reunião de kick-off</div><div class="flow-desc">Apresentação da metodologia, alinhamento de expectativas, definição de canais de comunicação e cadência de reuniões.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">04</div><div class="flow-content"><div class="flow-title">Workspace compartilhado</div><div class="flow-desc">Espaço onde o cliente acompanha o andamento, entregáveis e marcos do projeto em tempo real.</div></div></div>
        <div class="flow-step"><div class="flow-num" style="font-size:0.85rem;">05</div><div class="flow-content"><div class="flow-title">Início do diagnóstico</div><div class="flow-desc">Semana 1 — primeiras reuniões de imersão. Mapear gargalos reais antes de propor qualquer solução.</div></div></div>
      </div>
      <h3>Entrega mês a mês</h3>
      <div class="timeline" style="margin-bottom:1.5rem;">
        <div class="tl-item"><div class="tl-month"><div class="tl-month-label">Mês</div><div class="tl-month-num">01</div></div><div class="tl-content"><div class="tl-phase">Diagnóstico profundo</div><p class="tl-desc">Reuniões de imersão 2× por semana. Mapeamento completo de gargalos nos três pilares.</p><div class="tl-deliverable-label">Entregável</div><div class="tl-deliverable">Relatório de Diagnóstico + Plano de Implantação priorizado</div></div></div>
        <div class="tl-item"><div class="tl-month"><div class="tl-month-label">Meses</div><div class="tl-month-num">02</div><div class="tl-month-range">e 03</div></div><div class="tl-content"><div class="tl-phase">Implantação inicial</div><p class="tl-desc">Sessões quinzenais. Primeiros processos documentados, testados e em funcionamento.</p><div class="tl-deliverable-label">Entregável</div><div class="tl-deliverable">Processos documentados + Relatório de progresso</div></div></div>
        <div class="tl-item"><div class="tl-month"><div class="tl-month-label">Meses</div><div class="tl-month-num">04</div><div class="tl-month-range">e 05</div></div><div class="tl-content"><div class="tl-phase">Consolidação</div><p class="tl-desc">Aprofundamento nos pilares restantes. Desenvolvimento da equipe para autonomia gradual do dono.</p><div class="tl-deliverable-label">Entregável</div><div class="tl-deliverable">Processos validados + Métricas de resultado parcial</div></div></div>
        <div class="tl-item"><div class="tl-month"><div class="tl-month-label">Mês</div><div class="tl-month-num">06</div></div><div class="tl-content"><div class="tl-phase">Fechamento e oferta de Advisory</div><p class="tl-desc">Documentação completa, mensuração final da margem, case formatado e proposta de Advisory.</p><div class="tl-deliverable-label">Entregável</div><div class="tl-deliverable">Case documentado + Relatório de margem + Proposta de Advisory</div></div></div>
      </div>
      <h3>Capacidade operacional</h3>
      <div class="quad-grid">
        <div class="q-cell dark"><div class="q-label">Clientes simultâneos</div><span class="q-highlight">Até 4</span><p class="q-text">Limite conservador para manter qualidade de entrega e margem operacional adequada.</p></div>
        <div class="q-cell"><div class="q-label">Primeiro cliente</div><p class="q-text">~R$22k (piloto com desconto). Não é falta de confiança no valor — é construir o case que derruba a resistência dos próximos.</p></div>
        <div class="q-cell"><div class="q-label">Receita por ciclo</div><p class="q-text">4 clientes × R$36k = R$144k por ciclo de 6 meses. Mais R$12k/mês em Advisory quando os primeiros clientes concluem.</p></div>
        <div class="q-cell dark"><div class="q-label">Gatilho para contratar</div><span class="q-highlight">2 ciclos consecutivos</span><p class="q-text">Com 3–4 clientes simultâneos + receita recorrente acima de R$30k/mês. Contratar antes cria custo antes de ter tração confirmada.</p></div>
      </div>
    </div>`,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRODUCT_LABELS = {
  'epc-diagnostico': 'Diagnóstico EPC',
  'epc-implementacao': 'Implementação EPC',
  'epc-manutencao': 'Manutenção EPC',
  'arcus-consultoria': 'Consultoria Arcus',
  'arcus-advisory': 'Advisory Arcus',
}

// ─── CRM constants ────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { key: 'mapeado',           label: 'Mapeado' },
  { key: 'abordagem1',        label: 'Abordagem 1' },
  { key: 'abordagem2',        label: 'Abordagem 2' },
  { key: 'abordagem3',        label: 'Abordagem 3' },
  { key: 'reuniao_agendada',  label: 'Reunião Agendada' },
  { key: 'reuniao_realizada', label: 'Reunião Realizada' },
  { key: 'proposta',          label: 'Proposta Enviada' },
  { key: 'recusa',            label: 'Recusa' },
]

const CRM_PRODUCTS  = [
  { key: null,    label: '—' },
  { key: 'epc',   label: 'EPC' },
  { key: 'arcus', label: 'Arcus' },
]

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
  const [operacaoOpen, setOperacaoOpen] = useState(true)
  const [epcClients, setEpcClients] = useState([])
  const [arcusClients, setArcusClients] = useState([])
  const [contracts, setContracts] = useState([])
  const [modal, setModal] = useState(null) // 'epc' | 'contract'
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

  useEffect(() => { fetchAll(); fetchCrmLeads() }, [])

  async function fetchAll() {
    const [epc, arcus, conts] = await Promise.all([
      supabase.from('vini_epc_clients').select('*').eq('status', 'ativo').order('created_at'),
      supabase.from('mentees').select('id,name,stage,join_date,last_contact,tags').eq('stage', 'Ativo').order('name'),
      supabase.from('vini_contracts').select('*').eq('status', 'ativo').order('created_at'),
    ])
    setEpcClients(epc.data || [])
    setArcusClients(arcus.data || [])
    setContracts(conts.data || [])
  }

  function showTab(tab) {
    setActiveTab(tab)
    if (['op-epc', 'op-epc-clientes', 'op-arcus', 'op-arcus-clientes'].includes(tab)) {
      setOperacaoOpen(true)
    }
  }

  function openModal(type) {
    setForm({})
    setFormError(null)
    setModal(type)
  }

  async function handleSaveEpc(e) {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    const modules = form.modules
      ? form.modules.split(',').map(s => s.trim()).filter(Boolean)
      : []
    const { error } = await supabase.from('vini_epc_clients').insert({
      name: form.name,
      modules,
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
  const totalRecurring = contracts
    .filter(c => c.product === 'epc-manutencao' || c.product === 'arcus-advisory')
    .reduce((s, c) => s + (Number(c.next_payment_amount) || 0), 0)

  const isOperacaoActive = ['op-epc', 'op-epc-clientes', 'op-arcus', 'op-arcus-clientes'].includes(activeTab)

  function f(field) {
    return { value: form[field] || '', onChange: e => setForm({ ...form, [field]: e.target.value }) }
  }

  // ─── CRM helpers ────────────────────────────────────────────────────────────

  async function fetchCrmLeads() {
    const { data } = await supabase.from('vini_leads').select('*').order('created_at')
    setCrmLeads(data || [])
  }

  async function crmUpdateLead(id, updates) {
    const { error } = await supabase.from('vini_leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) setCrmLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  async function crmSaveLead(e) {
    e.preventDefault()
    setCrmSaving(true)
    const { data, error } = await supabase.from('vini_leads').insert({
      name:   crmForm.leadName,
      phone:  crmForm.leadPhone  || '',
      source: crmForm.leadSource || '',
      stage:  crmForm.leadStage  || 'mapeado',
      notes:  crmForm.leadNotes  || '',
    }).select().single()
    if (!error && data) setCrmLeads(prev => [...prev, data])
    setCrmSaving(false)
    setCrmModal(null)
    setCrmForm({})
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

  const filteredCrmLeads = crmLeads.filter(l =>
    !crmSearch ||
    l.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
    (l.source || '').toLowerCase().includes(crmSearch.toLowerCase())
  )

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
          </div>

          <div className={`nav-item${activeTab === 'comercial' ? ' active' : ''}`} onClick={() => showTab('comercial')}>
            <div className="nav-dot" /><span className="nav-label">Comercial</span>
          </div>
          <div style={{ padding: '0 0 0.25rem 0' }}>
            <div className={`nav-sub-item${activeTab === 'crm' ? ' active' : ''}`} onClick={() => showTab('crm')} style={{ paddingLeft: '2.5rem' }}>
              <div className="nav-sub-dot" /><span className="nav-sub-label">CRM</span>
            </div>
          </div>

          <div className={`nav-item${activeTab === 'marketing' ? ' active' : ''}`} onClick={() => showTab('marketing')}>
            <div className="nav-dot" /><span className="nav-label">Marketing</span>
          </div>

          <div className="nav-divider" />

          <div className={`nav-item${activeTab === 'financeiro' ? ' active' : ''}`} onClick={() => showTab('financeiro')}>
            <div className="nav-dot" /><span className="nav-label">Financeiro</span>
          </div>

          <div className="nav-divider" />

          <div className={`nav-group${operacaoOpen ? ' open' : ''}`}>
            <div className={`nav-group-header${isOperacaoActive ? ' active' : ''}`} onClick={() => setOperacaoOpen(o => !o)}>
              <div className="nav-group-dot" />
              <span className="nav-group-label-text">Operação</span>
              <span className="nav-chevron">›</span>
            </div>
            <div className="nav-sub">
              <div className="nav-sub-section-label">Estrutura para Crescer</div>
              <div className={`nav-sub-item${activeTab === 'op-epc' ? ' active' : ''}`} onClick={() => showTab('op-epc')}>
                <div className="nav-sub-dot" style={{ background: 'var(--indigo)', opacity: 0.6 }} /><span className="nav-sub-label">Entrega</span>
              </div>
              <div className={`nav-sub-item${activeTab === 'op-epc-clientes' ? ' active' : ''}`} onClick={() => showTab('op-epc-clientes')}>
                <div className="nav-sub-dot" style={{ background: 'var(--indigo)', opacity: 0.6 }} /><span className="nav-sub-label">Clientes Ativos</span>
              </div>
              <div className="nav-sub-section-label" style={{ marginTop: '0.25rem' }}>Arcus Club</div>
              <div className={`nav-sub-item${activeTab === 'op-arcus' ? ' active' : ''}`} onClick={() => showTab('op-arcus')}>
                <div className="nav-sub-dot" style={{ background: 'var(--teal)', opacity: 0.7 }} /><span className="nav-sub-label">Entrega</span>
              </div>
              <div className={`nav-sub-item${activeTab === 'op-arcus-clientes' ? ' active' : ''}`} onClick={() => showTab('op-arcus-clientes')}>
                <div className="nav-sub-dot" style={{ background: 'var(--teal)', opacity: 0.7 }} /><span className="nav-sub-label">Clientes Ativos</span>
              </div>
            </div>
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
            <div className="crm-toolbar">
              <input
                className="crm-search"
                placeholder="Buscar lead…"
                value={crmSearch}
                onChange={e => setCrmSearch(e.target.value)}
              />
              <button
                className="vini-btn gold"
                onClick={() => { setCrmForm({}); setCrmModal('lead') }}
              >+ Novo lead</button>
            </div>
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
                            <div className="crm-card-name">{lead.name}</div>
                            {lead.source && <div className="crm-card-source">{lead.source}</div>}
                            {recusaFromLabel && (
                              <div className="crm-recusa-from">← {recusaFromLabel}</div>
                            )}
                            <div className="crm-card-foot">
                              {lead.product
                                ? <span className="crm-product-tag" data-product={lead.product}>
                                    {lead.product === 'epc' ? 'EPC' : 'Arcus'}
                                  </span>
                                : <span />
                              }
                              {!isRecusa && next && (
                                <span className={`crm-card-date${overdue ? ' overdue' : ''}`}>
                                  {fmtDate(next.date)}
                                </span>
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
          </div>
        </div>

        {/* ── EPC CLIENTES (dynamic) ── */}
        <div className={`tab-content${activeTab === 'op-epc-clientes' ? ' active' : ''}`}>
          <div className="tab-header" data-glyph="E" style={{ borderTop: '3px solid var(--indigo)' }}>
            <div>
              <div className="tab-eyebrow">Operação · Estrutura para Crescer</div>
              <div className="tab-title">Clientes <em>ativos</em></div>
              <div className="tab-sub">Visão rápida de cada projeto em andamento — fase, próxima ação e recorrência.</div>
            </div>
            <div className="tab-header-phrase">Eu faço você lucrar mais com<br /><em>sua estrutura atual.</em></div>
          </div>
          <div className="tab-body">
            <div className="vini-section-bar">
              <h3 style={{ margin: 0 }}>Projetos ativos</h3>
              <button className="vini-btn" onClick={() => openModal('epc')}>+ Novo cliente</button>
            </div>
            {epcClients.length === 0
              ? <div className="vini-empty">Nenhum cliente ativo ainda. Os primeiros aparecerão aqui após o fechamento.</div>
              : (
                <div className="vini-table-wrap">
                  <table className="vini-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Módulos</th>
                        <th>Fase</th>
                        <th>Próxima ação</th>
                        <th style={{ textAlign: 'right' }}>Recorrência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {epcClients.map(c => (
                        <tr key={c.id}>
                          <td className="name">{c.name}</td>
                          <td>{(c.modules || []).join(', ') || '—'}</td>
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

        {/* ── ARCUS CLIENTES (dynamic — mentees) ── */}
        <div className={`tab-content${activeTab === 'op-arcus-clientes' ? ' active' : ''}`}>
          <div className="tab-header" data-glyph="A" style={{ borderTop: '3px solid var(--teal)' }}>
            <div>
              <div className="tab-eyebrow">Operação · Arcus Club</div>
              <div className="tab-title">Clientes <em>ativos</em></div>
              <div className="tab-sub">Visão rápida de cada consultoria em andamento — mês do ciclo, próxima reunião e status do Advisory.</div>
            </div>
            <div className="tab-header-phrase">Eu faço você lucrar mais com<br /><em>sua estrutura atual.</em></div>
          </div>
          <div className="tab-body">
            {arcusClients.length === 0
              ? <div className="vini-empty">Nenhum cliente ativo ainda.</div>
              : (
                <div className="vini-table-wrap">
                  <table className="vini-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Mês do ciclo</th>
                        <th>Fase</th>
                        <th>Último contato</th>
                        <th style={{ textAlign: 'right' }}>Advisory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arcusClients.map(m => {
                        const hasAdvisory = (m.tags || []).some(t => /advisory/i.test(t))
                        return (
                          <tr key={m.id}>
                            <td className="name">{m.name}</td>
                            <td className="mono">{cycleMonth(m.join_date)} / 6</td>
                            <td>{m.stage || '—'}</td>
                            <td>{fmtDate(m.last_contact)}</td>
                            <td style={{ textAlign: 'right' }}>
                              {hasAdvisory
                                ? <span className="badge teal">Ativo</span>
                                : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
                              }
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
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
                <div className="vini-kpi-sub">Advisory + Manutenção EPC</div>
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
                            <span className={`badge ${c.product.startsWith('arcus') ? 'teal' : 'indigo'}`}>
                              {PRODUCT_LABELS[c.product] || c.product}
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

      {/* ── MODAL: Novo cliente EPC ── */}
      {modal === 'epc' && (
        <div className="vini-modal-overlay" onClick={() => setModal(null)}>
          <div className="vini-modal" onClick={e => e.stopPropagation()}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Novo cliente — Estrutura para Crescer</div>
              <button className="vini-modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <form onSubmit={handleSaveEpc} className="vini-modal-form">
              <label>
                Nome do cliente *
                <input type="text" required {...f('name')} placeholder="Ex: João Silva" />
              </label>
              <label>
                Módulos contratados
                <input type="text" {...f('modules')} placeholder="SDR, Conteúdo, Processo crítico" />
                <span className="vini-modal-hint">Separe por vírgula</span>
              </label>
              <label>
                Fase atual
                <input type="text" {...f('phase')} placeholder="Ex: Implementação, Handoff, Manutenção…" />
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
                <div>
                  <div className="vini-modal-title">{lead.name}</div>
                  {lead.source && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{lead.source}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    style={{ fontSize: 11, color: '#A03030', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
                    onClick={() => crmDeleteLead(lead.id)}
                  >Excluir</button>
                  <button className="vini-modal-close" onClick={() => setCrmSelectedId(null)}>×</button>
                </div>
              </div>

              {/* Stage pills */}
              <div className="crm-stage-row">
                {PIPELINE_STAGES.map(s => (
                  <button
                    key={s.key}
                    className={`crm-stage-pill${lead.stage === s.key ? ' active' : ''}${s.key === 'recusa' ? ' recusa' : ''}`}
                    onClick={() => {
                      if (s.key === 'recusa') {
                        crmUpdateLead(lead.id, { stage: 'recusa', recusa_from: lead.stage })
                      } else {
                        crmUpdateLead(lead.id, { stage: s.key, recusa_from: null })
                      }
                    }}
                  >{s.label}</button>
                ))}
              </div>

              {/* Recusa origin badge */}
              {lead.stage === 'recusa' && lead.recusa_from && (
                <div className="crm-recusa-banner">
                  Recusou na etapa: <strong>{PIPELINE_STAGES.find(s => s.key === lead.recusa_from)?.label || lead.recusa_from}</strong>
                </div>
              )}

              {/* Product tag */}
              <div className="crm-product-row">
                <span className="crm-product-row-label">Produto</span>
                <div className="crm-product-row-pills">
                  {CRM_PRODUCTS.map(p => (
                    <button
                      key={String(p.key)}
                      className={`crm-product-pill${lead.product === p.key ? ' active' : ''}`}
                      data-product={p.key}
                      onClick={() => crmUpdateLead(lead.id, { product: p.key })}
                    >{p.label}</button>
                  ))}
                </div>
              </div>

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
        <div className="vini-modal-overlay" onClick={() => setCrmModal(null)} style={{ zIndex: 10000 }}>
          <div className="vini-modal" onClick={e => e.stopPropagation()}>
            <div className="vini-modal-header">
              <div className="vini-modal-title">Novo lead</div>
              <button className="vini-modal-close" onClick={() => setCrmModal(null)}>×</button>
            </div>
            <form onSubmit={crmSaveLead} className="vini-modal-form">
              <label>Nome *<input type="text" required {...crmF('leadName')} placeholder="Ex: João Silva" /></label>
              <label>Telefone<input type="text" {...crmF('leadPhone')} placeholder="+55 51 9…" /></label>
              <label>Origem
                <select {...crmF('leadSource')}>
                  <option value="">Selecione…</option>
                  {CRM_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label>Etapa do pipeline
                <select {...crmF('leadStage')}>
                  {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </label>
              <label>Notas<textarea {...crmF('leadNotes')} placeholder="Contexto inicial…" /></label>
              <div className="vini-modal-actions">
                <button type="button" onClick={() => setCrmModal(null)}>Cancelar</button>
                <button type="submit" disabled={crmSaving}>{crmSaving ? 'Salvando…' : 'Salvar lead'}</button>
              </div>
            </form>
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
              <label>Título<input type="text" {...crmF('stepTitle')} placeholder="Ex: Enviar proposta EPC" /></label>
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
                  <option value="epc-diagnostico">Diagnóstico EPC</option>
                  <option value="epc-implementacao">Implementação EPC</option>
                  <option value="epc-manutencao">Manutenção EPC (recorrência)</option>
                  <option value="arcus-consultoria">Consultoria Arcus Club</option>
                  <option value="arcus-advisory">Advisory Arcus (recorrência)</option>
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
