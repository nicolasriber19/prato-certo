// Restaurantes e pratos DE EXEMPLO: a fonte única do catálogo.
//
// Os restaurantes são fictícios: nomes, endereços e preços foram inventados para o projeto.
// Os bairros e as coordenadas são de Brasília, aproximados.
//
// Usado de dois jeitos:
// - no modo demonstração (sem .env.local), o site lê daqui;
// - "npm run gerar-seed" escreve supabase/seed.sql a partir daqui (não edite o seed à mão).
//
// Atenção às marcas (tags): quem tem alergia confia nelas. Prato vegano também leva
// "vegetariano" e "sem_lactose". Na dúvida, não marque.

export const RESTAURANTES = [
  { id: 1, nome: 'Cantina Nonna Lia', bairro: 'Asa Sul', endereco: 'Endereço de exemplo, Asa Sul', latitude: -15.8105, longitude: -47.8975, faixa_preco: 3, cozinhas: ['italiana'], descricao: 'Massas frescas e risotos, à luz de velas.' },
  { id: 2, nome: 'Fogão de Lenha 104', bairro: 'Asa Norte', endereco: 'Endereço de exemplo, Asa Norte', latitude: -15.7655, longitude: -47.879, faixa_preco: 2, cozinhas: ['brasileira'], descricao: 'Comida caseira e prato feito no almoço.' },
  { id: 3, nome: 'Ipê Sushi Bar', bairro: 'Sudoeste', endereco: 'Endereço de exemplo, Sudoeste', latitude: -15.7975, longitude: -47.9245, faixa_preco: 3, cozinhas: ['japonesa'], descricao: 'Balcão de sushi e pratos quentes.' },
  { id: 4, nome: 'Horta & Grão', bairro: 'Noroeste', endereco: 'Endereço de exemplo, Noroeste', latitude: -15.7525, longitude: -47.9105, faixa_preco: 2, cozinhas: ['saudavel'], descricao: 'Bowls, saladas e sucos, com muitas opções veganas.' },
  { id: 5, nome: 'Casa do Xote', bairro: 'Guará', endereco: 'Endereço de exemplo, Guará', latitude: -15.8245, longitude: -47.9795, faixa_preco: 2, cozinhas: ['nordestina'], descricao: 'Cozinha nordestina, de tapioca a moqueca.' },
  { id: 6, nome: 'Cedro Cozinha Árabe', bairro: 'Asa Norte', endereco: 'Endereço de exemplo, Asa Norte', latitude: -15.759, longitude: -47.8835, faixa_preco: 2, cozinhas: ['arabe'], descricao: 'Esfihas, kibes e pratos para dividir.' },
  { id: 7, nome: 'Burger do Eixinho', bairro: 'Águas Claras', endereco: 'Endereço de exemplo, Águas Claras', latitude: -15.8395, longitude: -48.0265, faixa_preco: 1, cozinhas: ['hamburguer'], descricao: 'Hambúrgueres, inclusive vegano e sem glúten.' },
  { id: 8, nome: 'Taquería Pequi', bairro: 'Lago Sul', endereco: 'Endereço de exemplo, Lago Sul', latitude: -15.841, longitude: -47.8705, faixa_preco: 2, cozinhas: ['mexicana'], descricao: 'Tacos de milho, burritos e nachos.' },
  { id: 9, nome: 'Curry do Lago', bairro: 'Lago Norte', endereco: 'Endereço de exemplo, Lago Norte', latitude: -15.731, longitude: -47.8505, faixa_preco: 3, cozinhas: ['indiana'], descricao: 'Curries, samosas e pão naan.' },
  { id: 10, nome: 'Café Cerradinho', bairro: 'Taguatinga', endereco: 'Endereço de exemplo, Taguatinga', latitude: -15.8335, longitude: -48.0555, faixa_preco: 1, cozinhas: ['cafeteria'], descricao: 'Café, pão de queijo e lanches leves.' },
]

// foto vazia (null) = imagem provisória. texto_alternativo vazio = o site usa o nome do prato.
export const PRATOS = [
  // 1. Cantina Nonna Lia (italiana)
  { id: 1, restaurante_id: 1, nome: 'Lasanha à bolonhesa', descricao: 'Massa fresca, molho de carne e queijo gratinado.', preco: 52, cozinha: 'italiana', tags: [], momentos: ['jantar_romantico'], tempo_preparo_min: 30, foto: null, texto_alternativo: '' },
  { id: 2, restaurante_id: 1, nome: 'Risoto de cogumelos', descricao: 'Arroz arbóreo, cogumelos frescos e parmesão.', preco: 58, cozinha: 'italiana', tags: ['vegetariano', 'sem_gluten'], momentos: ['jantar_romantico'], tempo_preparo_min: 35, foto: null, texto_alternativo: '' },
  { id: 3, restaurante_id: 1, nome: 'Espaguete ao pomodoro', descricao: 'Molho de tomate fresco, alho e manjericão.', preco: 39, cozinha: 'italiana', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['almoco_rapido', 'jantar_romantico'], tempo_preparo_min: 20, foto: null, texto_alternativo: '' },
  { id: 4, restaurante_id: 1, nome: 'Nhoque sem glúten ao sugo', descricao: 'Nhoque de batata com farinha de arroz e molho de tomate.', preco: 46, cozinha: 'italiana', tags: ['vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['jantar_romantico'], tempo_preparo_min: 25, foto: null, texto_alternativo: '' },

  // 2. Fogão de Lenha 104 (brasileira)
  { id: 5, restaurante_id: 2, nome: 'Prato feito de frango grelhado', descricao: 'Arroz, feijão, salada e frango grelhado.', preco: 26, cozinha: 'brasileira', tags: ['sem_gluten', 'sem_lactose'], momentos: ['almoco_rapido'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 6, restaurante_id: 2, nome: 'Feijoada completa', descricao: 'Feijoada com arroz, couve, farofa e laranja.', preco: 42, cozinha: 'brasileira', tags: ['sem_gluten', 'sem_lactose'], momentos: ['almoco_rapido'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 7, restaurante_id: 2, nome: 'Escondidinho de carne seca', descricao: 'Purê de mandioca com carne seca desfiada e queijo.', preco: 34, cozinha: 'brasileira', tags: ['sem_gluten'], momentos: ['almoco_rapido'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 8, restaurante_id: 2, nome: 'Prato feito vegano', descricao: 'Arroz, feijão, legumes refogados e farofa de mandioca.', preco: 24, cozinha: 'brasileira', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['almoco_rapido'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },

  // 3. Ipê Sushi Bar (japonesa). O shoyu comum tem glúten.
  { id: 9, restaurante_id: 3, nome: 'Combinado de 20 peças', descricao: 'Sushis e sashimis variados do dia.', preco: 79, cozinha: 'japonesa', tags: ['sem_lactose'], momentos: ['jantar_romantico'], tempo_preparo_min: 25, foto: null, texto_alternativo: '' },
  { id: 10, restaurante_id: 3, nome: 'Temaki de salmão', descricao: 'Cone de alga com arroz, salmão e cebolinha.', preco: 32, cozinha: 'japonesa', tags: ['sem_lactose'], momentos: ['almoco_rapido'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 11, restaurante_id: 3, nome: 'Yakissoba de legumes', descricao: 'Macarrão salteado com legumes e molho shoyu.', preco: 38, cozinha: 'japonesa', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['almoco_rapido'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 12, restaurante_id: 3, nome: 'Hossomaki de pepino', descricao: 'Oito peças de arroz e pepino enrolados na alga.', preco: 18, cozinha: 'japonesa', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },

  // 4. Horta & Grão (saudavel)
  { id: 13, restaurante_id: 4, nome: 'Bowl de quinoa e grão-de-bico', descricao: 'Quinoa, grão-de-bico assado, folhas e tahine.', preco: 36, cozinha: 'saudavel', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['almoco_rapido'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 14, restaurante_id: 4, nome: 'Salada com frango e iogurte', descricao: 'Folhas, frango grelhado e molho de iogurte.', preco: 34, cozinha: 'saudavel', tags: ['sem_gluten'], momentos: ['almoco_rapido'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 15, restaurante_id: 4, nome: 'Wrap de falafel', descricao: 'Pão folha com falafel, salada e molho de tahine.', preco: 24, cozinha: 'saudavel', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['almoco_rapido', 'lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 16, restaurante_id: 4, nome: 'Tapioca de coco com suco verde', descricao: 'Tapioca com coco ralado e suco de couve com limão.', preco: 19, cozinha: 'saudavel', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },

  // 5. Casa do Xote (nordestina)
  { id: 17, restaurante_id: 5, nome: 'Baião de dois com carne de sol', descricao: 'Arroz, feijão-de-corda, queijo coalho e carne de sol.', preco: 44, cozinha: 'nordestina', tags: ['sem_gluten'], momentos: ['almoco_rapido'], tempo_preparo_min: 20, foto: null, texto_alternativo: '' },
  { id: 18, restaurante_id: 5, nome: 'Tapioca de queijo coalho', descricao: 'Tapioca recheada com queijo coalho na chapa.', preco: 14, cozinha: 'nordestina', tags: ['vegetariano', 'sem_gluten'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 19, restaurante_id: 5, nome: 'Cuscuz com ovo', descricao: 'Cuscuz de milho no vapor, sem manteiga, com ovo frito.', preco: 16, cozinha: 'nordestina', tags: ['vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 20, restaurante_id: 5, nome: 'Moqueca de banana-da-terra', descricao: 'Banana-da-terra, leite de coco, dendê e pimentões.', preco: 48, cozinha: 'nordestina', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['jantar_romantico'], tempo_preparo_min: 30, foto: null, texto_alternativo: '' },

  // 6. Cedro Cozinha Árabe (arabe). O tabule leva trigo.
  { id: 21, restaurante_id: 6, nome: 'Esfiha de carne (2 unidades)', descricao: 'Massa aberta com carne temperada e limão.', preco: 14, cozinha: 'arabe', tags: ['sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 22, restaurante_id: 6, nome: 'Kibe assado com coalhada', descricao: 'Kibe de forno com coalhada seca e salada.', preco: 34, cozinha: 'arabe', tags: [], momentos: ['almoco_rapido'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 23, restaurante_id: 6, nome: 'Prato de homus, tabule e falafel', descricao: 'Para dividir, com pão sírio.', preco: 38, cozinha: 'arabe', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['almoco_rapido', 'jantar_romantico'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 24, restaurante_id: 6, nome: 'Shawarma de frango', descricao: 'Pão sírio com frango, salada e molho de alho.', preco: 25, cozinha: 'arabe', tags: ['sem_lactose'], momentos: ['almoco_rapido', 'lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },

  // 7. Burger do Eixinho (hamburguer)
  { id: 25, restaurante_id: 7, nome: 'X-burguer da casa', descricao: 'Pão, hambúrguer de carne, queijo e salada.', preco: 24, cozinha: 'hamburguer', tags: [], momentos: ['lanche_economico'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 26, restaurante_id: 7, nome: 'Burger de grão-de-bico', descricao: 'Hambúrguer de grão-de-bico, maionese vegana e salada.', preco: 23, cozinha: 'hamburguer', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 27, restaurante_id: 7, nome: 'Batata frita com páprica', descricao: 'Porção de batata frita em óleo separado.', preco: 15, cozinha: 'hamburguer', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 28, restaurante_id: 7, nome: 'Burger no pão sem glúten', descricao: 'Hambúrguer de carne, queijo e salada no pão sem glúten.', preco: 32, cozinha: 'hamburguer', tags: ['sem_gluten'], momentos: ['almoco_rapido'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },

  // 8. Taquería Pequi (mexicana). As tortilhas de taco são de milho.
  { id: 29, restaurante_id: 8, nome: 'Tacos de carnitas (3)', descricao: 'Tortilha de milho, porco desfiado, cebola e coentro.', preco: 36, cozinha: 'mexicana', tags: ['sem_gluten', 'sem_lactose'], momentos: ['almoco_rapido', 'jantar_romantico'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 30, restaurante_id: 8, nome: 'Burrito de feijão e legumes', descricao: 'Tortilha de trigo, feijão, arroz, legumes e pico de gallo.', preco: 32, cozinha: 'mexicana', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['almoco_rapido'], tempo_preparo_min: 15, foto: null, texto_alternativo: '' },
  { id: 31, restaurante_id: 8, nome: 'Nachos com guacamole', descricao: 'Chips de milho com guacamole e pico de gallo.', preco: 22, cozinha: 'mexicana', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 32, restaurante_id: 8, nome: 'Quesadilla de queijo', descricao: 'Tortilha de trigo com queijo derretido.', preco: 25, cozinha: 'mexicana', tags: ['vegetariano'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },

  // 9. Curry do Lago (indiana)
  { id: 33, restaurante_id: 9, nome: 'Frango tikka masala com arroz', descricao: 'Frango no molho de tomate e creme, com arroz basmati.', preco: 56, cozinha: 'indiana', tags: ['sem_gluten'], momentos: ['jantar_romantico'], tempo_preparo_min: 25, foto: null, texto_alternativo: '' },
  { id: 34, restaurante_id: 9, nome: 'Curry de grão-de-bico', descricao: 'Chana masala com leite de coco e arroz basmati.', preco: 46, cozinha: 'indiana', tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'], momentos: ['jantar_romantico'], tempo_preparo_min: 20, foto: null, texto_alternativo: '' },
  { id: 35, restaurante_id: 9, nome: 'Samosas de batata (3)', descricao: 'Pastéis assados de batata, ervilha e especiarias.', preco: 22, cozinha: 'indiana', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
  { id: 36, restaurante_id: 9, nome: 'Palak paneer', descricao: 'Queijo fresco indiano no creme de espinafre, com arroz.', preco: 52, cozinha: 'indiana', tags: ['vegetariano', 'sem_gluten'], momentos: ['jantar_romantico'], tempo_preparo_min: 25, foto: null, texto_alternativo: '' },

  // 10. Café Cerradinho (cafeteria)
  { id: 37, restaurante_id: 10, nome: 'Pão de queijo com café', descricao: 'Três pães de queijo e um café coado.', preco: 12, cozinha: 'cafeteria', tags: ['vegetariano', 'sem_gluten'], momentos: ['lanche_economico'], tempo_preparo_min: 5, foto: null, texto_alternativo: '' },
  { id: 38, restaurante_id: 10, nome: 'Sanduíche natural de frango', descricao: 'Pão integral, frango desfiado, cenoura e alface.', preco: 16, cozinha: 'cafeteria', tags: [], momentos: ['almoco_rapido', 'lanche_economico'], tempo_preparo_min: 5, foto: null, texto_alternativo: '' },
  { id: 39, restaurante_id: 10, nome: 'Bolo de cenoura sem lactose', descricao: 'Fatia de bolo de cenoura com cobertura de chocolate.', preco: 10, cozinha: 'cafeteria', tags: ['vegetariano', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 5, foto: null, texto_alternativo: '' },
  { id: 40, restaurante_id: 10, nome: 'Torrada com abacate', descricao: 'Pão de fermentação natural, abacate, limão e sementes.', preco: 18, cozinha: 'cafeteria', tags: ['vegano', 'vegetariano', 'sem_lactose'], momentos: ['lanche_economico'], tempo_preparo_min: 10, foto: null, texto_alternativo: '' },
]
