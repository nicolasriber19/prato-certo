-- Prato Certo: restaurantes e pratos DE EXEMPLO.
--
-- Os restaurantes são fictícios: nomes, endereços e preços foram inventados para o projeto.
-- Os bairros e as coordenadas são de Brasília, aproximados.
--
-- Como usar: depois do schema.sql, SQL Editor → New query → colar este arquivo → Run.
-- Pode rodar de novo: atualiza as linhas pelo id, sem duplicar.
--
-- Atenção às marcas (tags): quem tem alergia confia nelas. Prato vegano também leva
-- "vegetariano" e "sem_lactose". Na dúvida, não marque.


-- Restaurantes -----------------------------------------------------------------

insert into public.restaurantes
  (id, nome, bairro, endereco, latitude, longitude, faixa_preco, cozinhas, descricao)
values
  (1,  'Cantina Nonna Lia',   'Asa Sul',      'Endereço de exemplo, Asa Sul',      -15.8105, -47.8975, 3, '{italiana}',   'Massas frescas e risotos, à luz de velas.'),
  (2,  'Fogão de Lenha 104',  'Asa Norte',    'Endereço de exemplo, Asa Norte',    -15.7655, -47.8790, 2, '{brasileira}', 'Comida caseira e prato feito no almoço.'),
  (3,  'Ipê Sushi Bar',       'Sudoeste',     'Endereço de exemplo, Sudoeste',     -15.7975, -47.9245, 3, '{japonesa}',   'Balcão de sushi e pratos quentes.'),
  (4,  'Horta & Grão',        'Noroeste',     'Endereço de exemplo, Noroeste',     -15.7525, -47.9105, 2, '{saudavel}',   'Bowls, saladas e sucos, com muitas opções veganas.'),
  (5,  'Casa do Xote',        'Guará',        'Endereço de exemplo, Guará',        -15.8245, -47.9795, 2, '{nordestina}', 'Cozinha nordestina, de tapioca a moqueca.'),
  (6,  'Cedro Cozinha Árabe', 'Asa Norte',    'Endereço de exemplo, Asa Norte',    -15.7590, -47.8835, 2, '{arabe}',      'Esfihas, kibes e pratos para dividir.'),
  (7,  'Burger do Eixinho',   'Águas Claras', 'Endereço de exemplo, Águas Claras', -15.8395, -48.0265, 1, '{hamburguer}', 'Hambúrgueres, inclusive vegano e sem glúten.'),
  (8,  'Taquería Pequi',      'Lago Sul',     'Endereço de exemplo, Lago Sul',     -15.8410, -47.8705, 2, '{mexicana}',   'Tacos de milho, burritos e nachos.'),
  (9,  'Curry do Lago',       'Lago Norte',   'Endereço de exemplo, Lago Norte',   -15.7310, -47.8505, 3, '{indiana}',    'Curries, samosas e pão naan.'),
  (10, 'Café Cerradinho',     'Taguatinga',   'Endereço de exemplo, Taguatinga',   -15.8335, -48.0555, 1, '{cafeteria}',  'Café, pão de queijo e lanches leves.')
on conflict (id) do update set
  nome        = excluded.nome,
  bairro      = excluded.bairro,
  endereco    = excluded.endereco,
  latitude    = excluded.latitude,
  longitude   = excluded.longitude,
  faixa_preco = excluded.faixa_preco,
  cozinhas    = excluded.cozinhas,
  descricao   = excluded.descricao;


-- Pratos -------------------------------------------------------------------------

insert into public.pratos
  (id, restaurante_id, nome, descricao, preco, cozinha, tags, momentos, tempo_preparo_min)
values
  -- 1. Cantina Nonna Lia (italiana)
  (1,  1, 'Lasanha à bolonhesa',          'Massa fresca, molho de carne e queijo gratinado.',          52.00, 'italiana',   '{}',                                             '{jantar_romantico}',               30),
  (2,  1, 'Risoto de cogumelos',          'Arroz arbóreo, cogumelos frescos e parmesão.',              58.00, 'italiana',   '{vegetariano,sem_gluten}',                       '{jantar_romantico}',               35),
  (3,  1, 'Espaguete ao pomodoro',        'Molho de tomate fresco, alho e manjericão.',                39.00, 'italiana',   '{vegano,vegetariano,sem_lactose}',               '{almoco_rapido,jantar_romantico}', 20),
  (4,  1, 'Nhoque sem glúten ao sugo',    'Nhoque de batata com farinha de arroz e molho de tomate.',  46.00, 'italiana',   '{vegetariano,sem_gluten,sem_lactose}',           '{jantar_romantico}',               25),

  -- 2. Fogão de Lenha 104 (brasileira)
  (5,  2, 'Prato feito de frango grelhado', 'Arroz, feijão, salada e frango grelhado.',                26.00, 'brasileira', '{sem_gluten,sem_lactose}',                       '{almoco_rapido}',                  15),
  (6,  2, 'Feijoada completa',            'Feijoada com arroz, couve, farofa e laranja.',              42.00, 'brasileira', '{sem_gluten,sem_lactose}',                       '{almoco_rapido}',                  10),
  (7,  2, 'Escondidinho de carne seca',   'Purê de mandioca com carne seca desfiada e queijo.',        34.00, 'brasileira', '{sem_gluten}',                                   '{almoco_rapido}',                  15),
  (8,  2, 'Prato feito vegano',           'Arroz, feijão, legumes refogados e farofa de mandioca.',    24.00, 'brasileira', '{vegano,vegetariano,sem_gluten,sem_lactose}',    '{almoco_rapido}',                  10),

  -- 3. Ipê Sushi Bar (japonesa). O shoyu comum tem glúten.
  (9,  3, 'Combinado de 20 peças',        'Sushis e sashimis variados do dia.',                        79.00, 'japonesa',   '{sem_lactose}',                                  '{jantar_romantico}',               25),
  (10, 3, 'Temaki de salmão',             'Cone de alga com arroz, salmão e cebolinha.',               32.00, 'japonesa',   '{sem_lactose}',                                  '{almoco_rapido}',                  10),
  (11, 3, 'Yakissoba de legumes',         'Macarrão salteado com legumes e molho shoyu.',              38.00, 'japonesa',   '{vegano,vegetariano,sem_lactose}',               '{almoco_rapido}',                  15),
  (12, 3, 'Hossomaki de pepino',          'Oito peças de arroz e pepino enrolados na alga.',           18.00, 'japonesa',   '{vegano,vegetariano,sem_lactose}',               '{lanche_economico}',               10),

  -- 4. Horta & Grão (saudável)
  (13, 4, 'Bowl de quinoa e grão-de-bico', 'Quinoa, grão-de-bico assado, folhas e tahine.',            36.00, 'saudavel',   '{vegano,vegetariano,sem_gluten,sem_lactose}',    '{almoco_rapido}',                  10),
  (14, 4, 'Salada com frango e iogurte',  'Folhas, frango grelhado e molho de iogurte.',               34.00, 'saudavel',   '{sem_gluten}',                                   '{almoco_rapido}',                  10),
  (15, 4, 'Wrap de falafel',              'Pão folha com falafel, salada e molho de tahine.',          24.00, 'saudavel',   '{vegano,vegetariano,sem_lactose}',               '{almoco_rapido,lanche_economico}', 10),
  (16, 4, 'Tapioca de coco com suco verde', 'Tapioca com coco ralado e suco de couve com limão.',      19.00, 'saudavel',   '{vegano,vegetariano,sem_gluten,sem_lactose}',    '{lanche_economico}',               10),

  -- 5. Casa do Xote (nordestina)
  (17, 5, 'Baião de dois com carne de sol', 'Arroz, feijão-de-corda, queijo coalho e carne de sol.',   44.00, 'nordestina', '{sem_gluten}',                                   '{almoco_rapido}',                  20),
  (18, 5, 'Tapioca de queijo coalho',     'Tapioca recheada com queijo coalho na chapa.',              14.00, 'nordestina', '{vegetariano,sem_gluten}',                       '{lanche_economico}',               10),
  (19, 5, 'Cuscuz com ovo',               'Cuscuz de milho no vapor, sem manteiga, com ovo frito.',    16.00, 'nordestina', '{vegetariano,sem_gluten,sem_lactose}',           '{lanche_economico}',               10),
  (20, 5, 'Moqueca de banana-da-terra',   'Banana-da-terra, leite de coco, dendê e pimentões.',        48.00, 'nordestina', '{vegano,vegetariano,sem_gluten,sem_lactose}',    '{jantar_romantico}',               30),

  -- 6. Cedro Cozinha Árabe (árabe). O tabule leva trigo.
  (21, 6, 'Esfiha de carne (2 unidades)', 'Massa aberta com carne temperada e limão.',                 14.00, 'arabe',      '{sem_lactose}',                                  '{lanche_economico}',               10),
  (22, 6, 'Kibe assado com coalhada',     'Kibe de forno com coalhada seca e salada.',                 34.00, 'arabe',      '{}',                                             '{almoco_rapido}',                  15),
  (23, 6, 'Prato de homus, tabule e falafel', 'Para dividir, com pão sírio.',                          38.00, 'arabe',      '{vegano,vegetariano,sem_lactose}',               '{almoco_rapido,jantar_romantico}', 15),
  (24, 6, 'Shawarma de frango',           'Pão sírio com frango, salada e molho de alho.',             25.00, 'arabe',      '{sem_lactose}',                                  '{almoco_rapido,lanche_economico}', 10),

  -- 7. Burger do Eixinho (hambúrguer)
  (25, 7, 'X-burguer da casa',            'Pão, hambúrguer de carne, queijo e salada.',                24.00, 'hamburguer', '{}',                                             '{lanche_economico}',               15),
  (26, 7, 'Burger de grão-de-bico',       'Hambúrguer de grão-de-bico, maionese vegana e salada.',     23.00, 'hamburguer', '{vegano,vegetariano,sem_lactose}',               '{lanche_economico}',               15),
  (27, 7, 'Batata frita com páprica',     'Porção de batata frita em óleo separado.',                  15.00, 'hamburguer', '{vegano,vegetariano,sem_gluten,sem_lactose}',    '{lanche_economico}',               10),
  (28, 7, 'Burger no pão sem glúten',     'Hambúrguer de carne, queijo e salada no pão sem glúten.',   32.00, 'hamburguer', '{sem_gluten}',                                   '{almoco_rapido}',                  15),

  -- 8. Taquería Pequi (mexicana). As tortilhas de taco são de milho.
  (29, 8, 'Tacos de carnitas (3)',        'Tortilha de milho, porco desfiado, cebola e coentro.',      36.00, 'mexicana',   '{sem_gluten,sem_lactose}',                       '{almoco_rapido,jantar_romantico}', 15),
  (30, 8, 'Burrito de feijão e legumes',  'Tortilha de trigo, feijão, arroz, legumes e pico de gallo.', 32.00, 'mexicana',  '{vegano,vegetariano,sem_lactose}',               '{almoco_rapido}',                  15),
  (31, 8, 'Nachos com guacamole',         'Chips de milho com guacamole e pico de gallo.',             22.00, 'mexicana',   '{vegano,vegetariano,sem_gluten,sem_lactose}',    '{lanche_economico}',               10),
  (32, 8, 'Quesadilla de queijo',         'Tortilha de trigo com queijo derretido.',                   25.00, 'mexicana',   '{vegetariano}',                                  '{lanche_economico}',               10),

  -- 9. Curry do Lago (indiana)
  (33, 9, 'Frango tikka masala com arroz', 'Frango no molho de tomate e creme, com arroz basmati.',    56.00, 'indiana',    '{sem_gluten}',                                   '{jantar_romantico}',               25),
  (34, 9, 'Curry de grão-de-bico',        'Chana masala com leite de coco e arroz basmati.',           46.00, 'indiana',    '{vegano,vegetariano,sem_gluten,sem_lactose}',    '{jantar_romantico}',               20),
  (35, 9, 'Samosas de batata (3)',        'Pastéis assados de batata, ervilha e especiarias.',         22.00, 'indiana',    '{vegano,vegetariano,sem_lactose}',               '{lanche_economico}',               10),
  (36, 9, 'Palak paneer',                 'Queijo fresco indiano no creme de espinafre, com arroz.',   52.00, 'indiana',    '{vegetariano,sem_gluten}',                       '{jantar_romantico}',               25),

  -- 10. Café Cerradinho (cafeteria)
  (37, 10, 'Pão de queijo com café',      'Três pães de queijo e um café coado.',                      12.00, 'cafeteria',  '{vegetariano,sem_gluten}',                       '{lanche_economico}',                5),
  (38, 10, 'Sanduíche natural de frango', 'Pão integral, frango desfiado, cenoura e alface.',          16.00, 'cafeteria',  '{}',                                             '{almoco_rapido,lanche_economico}',  5),
  (39, 10, 'Bolo de cenoura sem lactose', 'Fatia de bolo de cenoura com cobertura de chocolate.',      10.00, 'cafeteria',  '{vegetariano,sem_lactose}',                      '{lanche_economico}',                5),
  (40, 10, 'Torrada com abacate',         'Pão de fermentação natural, abacate, limão e sementes.',    18.00, 'cafeteria',  '{vegano,vegetariano,sem_lactose}',               '{lanche_economico}',               10)
on conflict (id) do update set
  restaurante_id    = excluded.restaurante_id,
  nome              = excluded.nome,
  descricao         = excluded.descricao,
  preco             = excluded.preco,
  cozinha           = excluded.cozinha,
  tags              = excluded.tags,
  momentos          = excluded.momentos,
  tempo_preparo_min = excluded.tempo_preparo_min;


-- Os ids foram escritos à mão: avisa o banco de onde continuar a contagem.
select setval(pg_get_serial_sequence('public.restaurantes', 'id'), (select max(id) from public.restaurantes));
select setval(pg_get_serial_sequence('public.pratos', 'id'), (select max(id) from public.pratos));


-- Conferência: quantos pratos atendem cada restrição e cada momento (nenhum pode ser 0).
select marca, (select count(*) from public.pratos as p where marca = any (p.tags || p.momentos)) as pratos
from unnest(array['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose',
                  'almoco_rapido', 'jantar_romantico', 'lanche_economico']) as marca;
