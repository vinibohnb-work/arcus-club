# ============================================================
# SDR Agent — Arcus Club
# Configurações de ICP, fontes e parâmetros de execução
# ============================================================

# ── Definição do ICP (usada no prompt de qualificação) ───────
ICP = """
IDEAL CUSTOMER PROFILE (ICP) — Arcus Club

QUEM (obrigatório — pessoa física, não página de empresa):
  Founder, CEO, co-founder, sócio-proprietário ou dono de negócio.
  Profissional liberal com negócio próprio: médico, dentista, advogado,
  contador, arquiteto, etc. — desde que tenha equipe e clínica/escritório próprio.
  NÃO é: funcionário, coach freelancer, influencer sem empresa, página de empresa.

TAMANHO (faixa aceitável):
  Mínimo: faturamento estimado de R$200.000/ano e ao menos 2 pessoas na equipe.
  Máximo: até ~200 funcionários ou ~R$100 milhões de faturamento.
  Empresas grandes demais (acima desses limites) NÃO são ICP — são complexas demais
  para o modelo de mentoria do Arcus Club.

FOCO GEOGRÁFICO (prioridade máxima nesta fase):
  Novo Hamburgo, RS e região do Vale do Sinos
  (São Leopoldo, Sapucaia do Sul, Campo Bom, Canoas, Esteio, Estância Velha).
  Lead fora dessa região → penalizar score em 20 pontos.
  Lead sem localização identificável → penalizar score em 10 pontos.

CONTATO OBRIGATÓRIO:
  O lead DEVE ter ao menos um dos seguintes para ser aprovado:
  - URL do perfil LinkedIn pessoal (linkedin.com/in/...)
  - Handle do Instagram pessoal (@usuario)
  - Número de WhatsApp / telefone celular
  Se nenhum desses for encontrado → score = 0, status = "descartado".

PONTUAÇÃO DE FIT (0–100):
  90–100 → Perfeito: pessoa confirmada, empresa real, equipe, localização Novo Hamburgo/Vale dos Sinos, contato encontrado
  70–89  → Bom: founder/dono confirmado, empresa operacional, região RS, tem contato
  50–69  → Provável: sinais de dono/empresa, fora da região ou contexto limitado, tem contato
  30–49  → Fraco: poucos sinais de ICP, sem localização confirmada
   0–29  → Descartar: não é pessoa física, empresa grande demais, sem contato, MLM, funcionário

SINAIS POSITIVOS (aumentam o score):
  Localização: Novo Hamburgo, Vale do Sinos, RS
  Tem LinkedIn pessoal (/in/) com histórico consistente
  Tem Instagram pessoal ativo
  Telefone/WhatsApp identificado
  Menciona equipe, funcionários, colaboradores
  Empresa com 1–200 funcionários
  Faturamento estimado entre R$200k e R$100M
  Profissional liberal com clínica/consultório/escritório próprio e equipe

SINAIS NEGATIVOS (diminuem o score fortemente):
  Página de empresa no LinkedIn (/company/) ou Instagram comercial sem dono identificado
  Empresa com sinais de +200 funcionários ou faturamento acima de R$100M
  Unicórnio, empresa listada em bolsa, grande corporação
  MLM, afiliados, rede de marketing
  Sem nenhum contato encontrado (linkedin, instagram ou telefone)
  Solopreneur sem equipe
  Fora do Brasil ou fora de RS sem justificativa
"""

# ── Queries para Google Custom Search ────────────────────────
# Foco em Novo Hamburgo e Vale do Sinos
GOOGLE_SEARCH_QUERIES = [
    # LinkedIn — Founders e sócios em Novo Hamburgo / Vale do Sinos
    'site:linkedin.com/in "Novo Hamburgo" "fundador" OR "sócio-proprietário" OR "CEO" empresa',
    'site:linkedin.com/in "Novo Hamburgo" "proprietário" OR "dono" empresa equipe',
    'site:linkedin.com/in "Vale do Sinos" "fundador" OR "CEO" OR "sócio" empresa',
    'site:linkedin.com/in "São Leopoldo" OR "Sapucaia do Sul" "fundador" OR "CEO" empresa',
    'site:linkedin.com/in "Campo Bom" OR "Canoas" OR "Esteio" "fundador" OR "sócio" empresa',
    'site:linkedin.com/in "Novo Hamburgo" "Rio Grande do Sul" empreendedor empresa',
    'site:linkedin.com/in "Novo Hamburgo" médico OR dentista OR advogado "sócio" OR "proprietário" clínica',

    # LinkedIn — Profissionais liberais com negócio próprio na região
    'site:linkedin.com/in "Novo Hamburgo" médico "clínica" "sócio" OR "proprietário"',
    'site:linkedin.com/in "Vale do Sinos" dentista "clínica" "sócio" OR "proprietário"',
    'site:linkedin.com/in "Novo Hamburgo" advogado "escritório" "sócio-fundador" OR "sócio-proprietário"',
    'site:linkedin.com/in "Novo Hamburgo" contador "escritório" "sócio" empresa',

    # Instagram — Empreendedores em Novo Hamburgo
    'site:instagram.com "Novo Hamburgo" "fundador" OR "CEO" empresa negócios',
    'site:instagram.com "Novo Hamburgo" "empresário" OR "empreendedor" empresa equipe',
    'site:instagram.com "Novo Hamburgo" "dono" OR "proprietário" empresa',
    'site:instagram.com "Vale do Sinos" "fundador" OR "CEO" empresa',
    'site:instagram.com "Novo Hamburgo" médico OR dentista clínica proprietário',

    # Sites de empresas de Novo Hamburgo
    '"Novo Hamburgo" "fundadores" "nossa equipe" site:*.com.br',
    '"Novo Hamburgo" "sobre nós" "fundador" OR "sócio" empresa site:*.com.br',
    '"Novo Hamburgo" "quem somos" "fundador" OR "proprietário" site:*.com.br',
    '"Novo Hamburgo" "nossa história" "fundamos" site:*.com.br',

    # Por segmento em Novo Hamburgo / RS
    '"agência" OR "agência digital" "Novo Hamburgo" fundadores equipe site:*.com.br',
    '"software" OR "tecnologia" "Novo Hamburgo" fundadores equipe site:*.com.br',
    '"consultoria" "Novo Hamburgo" fundadores "nossa equipe" site:*.com.br',
    '"clínica" "Novo Hamburgo" "médico" OR "dentista" "equipe" site:*.com.br',
    '"indústria" OR "distribuidora" "Novo Hamburgo" fundadores equipe site:*.com.br',
]

# ── Queries para Google Maps / Places ────────────────────────
# Foco em Novo Hamburgo e cidades do Vale do Sinos
GOOGLE_MAPS_QUERIES = [
    {
        "query": "agência de marketing digital",
        "cities": ["Novo Hamburgo", "São Leopoldo", "Campo Bom"],
    },
    {
        "query": "empresa de tecnologia software",
        "cities": ["Novo Hamburgo", "São Leopoldo", "Canoas"],
    },
    {
        "query": "consultoria empresarial",
        "cities": ["Novo Hamburgo", "São Leopoldo"],
    },
    {
        "query": "clínica médica particular",
        "cities": ["Novo Hamburgo", "São Leopoldo", "Campo Bom"],
    },
    {
        "query": "clínica odontológica",
        "cities": ["Novo Hamburgo", "São Leopoldo", "Sapucaia do Sul"],
    },
    {
        "query": "escritório de advocacia",
        "cities": ["Novo Hamburgo", "São Leopoldo"],
    },
    {
        "query": "escritório de contabilidade",
        "cities": ["Novo Hamburgo", "Campo Bom", "Esteio"],
    },
    {
        "query": "academia de ginástica crossfit",
        "cities": ["Novo Hamburgo", "São Leopoldo"],
    },
    {
        "query": "construtora incorporadora",
        "cities": ["Novo Hamburgo", "São Leopoldo", "Estância Velha"],
    },
    {
        "query": "indústria fábrica distribuidora",
        "cities": ["Novo Hamburgo", "Campo Bom", "Sapucaia do Sul"],
    },
    {
        "query": "clínica de estética beleza",
        "cities": ["Novo Hamburgo", "São Leopoldo"],
    },
    {
        "query": "escola curso treinamento empresarial",
        "cities": ["Novo Hamburgo", "São Leopoldo"],
    },
]

# ── Parâmetros de qualificação ────────────────────────────────
QUALIFICATION_THRESHOLD = 55   # Score mínimo para salvar o lead (0–100)
BATCH_SIZE = 5                 # Leads por chamada ao Claude

# ── Rate limiting (segundos entre requisições) ────────────────
RATE_LIMIT_GOOGLE = 1.0        # SerpAPI / Google CSE
RATE_LIMIT_MAPS = 0.6          # Google Places
RATE_LIMIT_BRASIL_API = 0.5    # BrasilAPI
RATE_LIMIT_CLAUDE = 1.5        # Anthropic API (entre batches)

# ── Limites por execução ──────────────────────────────────────
MAX_GOOGLE_QUERIES_PER_RUN = 25   # SerpAPI free: 100/mês. Ajuste conforme plano.
MAX_MAPS_QUERIES_PER_RUN = 60
MAPS_MIN_REVIEWS = 15             # Menor threshold para cidades menores como Novo Hamburgo

# ── Campos válidos na tabela vini_leads (destino do SDR Agent) ───────────────
# Os campos originais do agente (linkedin_url, founder_name, etc.) são
# mapeados em storage.py antes do insert. VALID_COLUMNS é usado apenas
# como referência interna — a filtragem real está em _map_to_vini_lead().
VALID_COLUMNS = {
    "name", "company", "phone", "linkedin", "source", "stage", "notes", "sdr_data",
    # campos SDR brutos (usados internamente antes do mapeamento)
    "founder_name", "company_name", "email", "website",
    "instagram_handle", "linkedin_url",
    "cnpj", "segment", "employees_estimate", "revenue_estimate",
    "city", "state", "country",
    "source_url", "source_query", "qualification_score", "qualification_notes", "raw_data",
}
