-- ============================================================
-- IMPORTAÇÃO: Leads do diretório BNI → vini_leads
-- Execute UMA VEZ no SQL Editor do Supabase
-- Fonte: lista física BNI (51 membros)
-- Todos inseridos em stage = 'mapeado' | source = 'BNI'
-- notes = ramo de atividade (conforme diretório)
-- ============================================================

INSERT INTO public.vini_leads (name, company, phone, source, notes, stage)
VALUES
  -- ── Foto 1 (entradas 1–25) ────────────────────────────────
  ('Tarcísio de Oliveira',        'Sedoclin',                                 '51 99326 7114', 'BNI', 'Segurança e Medicina do Trabalho',                                          'mapeado'),
  ('Igor Rebelatto',               'Certpar',                                  '51 99268 9885', 'BNI', 'Certificado Digital e Sistema de Notas Eletrônicas',                        'mapeado'),
  ('Márcio Reis',                  'Maintech',                                 '51 98404 8512', 'BNI', 'Automação e Manutenção Eletrônica Industrial',                              'mapeado'),
  ('João Arthur Wendling',         'Carbon Marketing',                         '51 99910 8095', 'BNI', 'Tráfego Pago',                                                              'mapeado'),
  ('Regiane da Silva',             'Renascency Uniformes',                     '51 99766 8904', 'BNI', 'Uniformes',                                                                 'mapeado'),
  ('Maiquel Rodrigo Scherer',      'Out Arquitetura',                          '54 99185 3974', 'BNI', 'Arquitetura',                                                               'mapeado'),
  ('Graziele Pedrotti',            'Prediservice',                             '51 98224 1385', 'BNI', 'Serviços de Limpeza',                                                       'mapeado'),
  ('Denise Poeta',                 'Wallau Corretora',                         '51 98214 0444', 'BNI', 'Seguro — Veículo e Residencial',                                            'mapeado'),
  ('Lucas Rübenich',               'Instigue',                                 '51 99989 9787', 'BNI', 'Construção Civil',                                                          'mapeado'),
  ('Alex John',                    'John Advogados',                           '51 99947 7268', 'BNI', 'Direito do Consumidor',                                                     'mapeado'),
  ('Rodolfo Wittmann',             'Dualcon Conectividade',                    '51 99316 4674', 'BNI', 'Serviços de Tecnologia e Hardware',                                         'mapeado'),
  ('Cleverson Moreira',            'Hub Softwares e Soluções',                 '51 99978 2650', 'BNI', 'Sistema de Gestão para Varejo (ERP)',                                       'mapeado'),
  ('Giovani Emmert',               'TS Telecom',                               '51 99327 6179', 'BNI', 'Internet / Fibra',                                                          'mapeado'),
  ('Fábio Hechsel',                'Organize Finanças Empresariais',           '51 99178 9122', 'BNI', 'BPO Financeiro',                                                            'mapeado'),
  ('Sandro Soares',                'Soares e Gimenez',                         '51 98213 5885', 'BNI', 'Marcas e Patentes',                                                         'mapeado'),
  ('Enri Siqueira',                'Geração Energia',                          '51 99540 5662', 'BNI', 'Energia Solar',                                                             'mapeado'),
  ('Débora Paulon',                'Wallau Corretora',                         '51 99319 7801', 'BNI', 'Planos de Saúde e Odontológicos',                                           'mapeado'),
  ('Luan Braga Chaves',            'Braga Advocacia',                          '51 99391 1887', 'BNI', 'Direito do Trabalho',                                                       'mapeado'),
  ('Lucas Heck',                   'Heck Imóveis',                             '51 99958 0030', 'BNI', 'Corretor de Imóveis / Encosta da Serra',                                    'mapeado'),
  ('Elittielly Milani',            'MP Ótica',                                 '51 99327 5652', 'BNI', 'Produtos Óticos',                                                           'mapeado'),
  ('Rafael Popovicz',              'Studio Black',                             '51 99999 8217', 'BNI', 'Branding',                                                                  'mapeado'),
  ('Cris Gonçalves',               'Cristiane Gonçalves Finanças Estratégicas','51 99279 8484', 'BNI', 'Consórcio',                                                                 'mapeado'),
  ('Alex Rafael Acker',            'Mais Verde Gestão Ambiental',              '51 99740 3150', 'BNI', 'Licenciamento e Gestão Ambiental',                                          'mapeado'),
  ('Cristine Vebber',              'Consultório Cris Vebber',                  '51 98143 7717', 'BNI', 'Odontologia — Implantes',                                                   'mapeado'),
  ('Pablo F. F. Dias',             'Instituto da Coluna Vertebral',            '51 99890 8930', 'BNI', 'Coluna Vertebral',                                                          'mapeado'),

  -- ── Foto 2 — entrada sem numeração (topo da página 2) ─────
  ('Carline Roberta da Silva',     'Nektar Negócios Financeiros',              '51 98441 5442', 'BNI', 'Empreendimentos e Financiamentos PF/PJ',                                    'mapeado'),

  -- ── Foto 2 (entradas 26–50) ───────────────────────────────
  ('Sidney Lima de Araújo',        'Sidma Comunicação Visual',                 '51 99531 3062', 'BNI', 'Comunicação Visual',                                                        'mapeado'),
  ('Magnun Vargas',                'Spazio Del Sonno',                         '51 3380 5555',  'BNI', 'Colchões',                                                                  'mapeado'),
  ('Nathalia Conoratto',           'Ferragem Casa Lar',                        '51 99748 9210', 'BNI', 'Comércio de Ferragem e Materiais de Construção',                            'mapeado'),
  ('Carin Zorn',                   'TI Soluções',                              '51 99258 3410', 'BNI', 'Sistemas de Segurança',                                                     'mapeado'),
  ('Fernando Gabriel dos Santos',  'Conectando Viajantes',                     '51 99177 4016', 'BNI', 'Agência de Viagem',                                                         'mapeado'),
  ('Magda Rezi Carvalho',          'Pórtico Estruturas Pré-Fabricadas',        '51 98449 7861', 'BNI', 'Estruturas Pré-Fabricadas',                                                 'mapeado'),
  ('Ivan Paludo',                  'Tríades Consultoria',                      '51 99994 2965', 'BNI', 'Consultoria de Gestão Financeira Empresarial',                              'mapeado'),
  ('Raquel Schuh',                 'RHAR Recrutamento e Seleção',              '51 98262 5555', 'BNI', 'Recrutamento e Seleção',                                                    'mapeado'),
  ('Marcos de Bona',               'Alpha Produtora',                          '51 99269 8466', 'BNI', 'Agência de Publicidade',                                                    'mapeado'),
  ('Injule da Silva',              'Pasta Nono',                               '54 99653 1475', 'BNI', 'Serviço de Alimentação',                                                    'mapeado'),
  ('Nathan Farias',                'Nathan Farias Advocacia',                  '51 98505 1276', 'BNI', 'Direito Criminal',                                                          'mapeado'),
  ('Everton Cezimbra',             'JB3 Investimentos',                        '51 99683 6497', 'BNI', 'Assessoria de Investimentos',                                               'mapeado'),
  ('Indiala Silva',                'G&S Contabilidade',                        '51 99689 5204', 'BNI', 'Serviços de Contabilidade',                                                 'mapeado'),
  ('Ericles Kunz',                 'Sabrina Schuck Fotografia',                '54 99606 5495', 'BNI', 'Atividades de Fotografia',                                                  'mapeado'),
  ('Diego Holanda',                'Blick Clinic',                             '51 3840 1700',  'BNI', 'Oftalmologia',                                                              'mapeado'),
  ('Germano Gross',                'Revit Eletrônicos',                        '51 99942 4428', 'BNI', 'Comércio e Assistência Técnica de Aparelhos Apple',                         'mapeado'),
  ('Renata Cabral Melendo',        'Franqueada Prudential',                    '51 98465 4000', 'BNI', 'Seguro de Vida e Previdência',                                              'mapeado'),
  ('Roger Johann Guerini',         'Adega Villa Borghetto',                    '51 99256 9015', 'BNI', 'Loja de Bebidas',                                                           'mapeado'),
  ('Graziele Segatto da Cunha',    'Igui Piscinas Novo Hamburgo',              '51 99464 4910', 'BNI', 'Comércio de Piscinas',                                                      'mapeado'),
  ('Eloize Fagundes',              'Vita Comunicação',                         '51 99378 2271', 'BNI', 'Produção de Vídeos e Filmes',                                               'mapeado'),
  ('Jonatas Rafael Pereira',       'Mustazo Barbearia',                        '51 99688 3211', 'BNI', 'Serviços de Barbearia',                                                     'mapeado'),
  ('Gian Bianchin Machado',        'Process Base',                             '51 98544 5411', 'BNI', 'Consultoria e Assessoria em Processos Gerenciais e Administrativos',        'mapeado'),
  ('Indiana Barbosa',              'Bespeak Novo Hamburgo',                    '49 99915 7556', 'BNI', 'Treinamento & Coaching',                                                    'mapeado'),
  ('Renan Carvalho',               'Garen Decor',                              '19 99689 0389', 'BNI', 'Fabricação de Móveis',                                                      'mapeado');

-- Confirmar quantos leads foram inseridos:
SELECT COUNT(*) AS leads_importados
FROM public.vini_leads
WHERE source = 'BNI';
