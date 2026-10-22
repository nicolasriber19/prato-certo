# Requisitos: Prato Certo

Versão 1, 22/10/2026. Base: `docs/brief.md`. Termos técnicos no glossário, no fim.

## 1. Escopo

**Dentro desta versão**
- Conta com e-mail e senha.
- Perfil com gostos, restrições, orçamento e bairro.
- Sugestões de pratos e restaurantes de acordo com o perfil e o momento.
- Favoritos, histórico de escolhas e avaliações.
- Restaurantes e pratos **de exemplo** (fictícios), em bairros de Brasília.

**Fora desta versão**
- Dados reais de restaurantes, vindos de outro serviço.
- Pedido, pagamento e entrega.
- Sugestão feita por IA.
- Login com Google e aplicativo de celular.

## 2. Requisitos funcionais

| ID | Descrição | Prioridade | Critério de aceitação |
|---|---|---|---|
| RF-01 | Criar conta, entrar e sair com e-mail e senha. | Precisa | **Dado** que não tenho conta, **quando** preencho e-mail e senha e toco "Criar conta", **então** entro no site.<br>**Dado** que não entrei, **quando** abro `#/hoje`, **então** vou para "Entrar".<br>**Dado** que errei a senha, **então** leio "E-mail ou senha incorretos". |
| RF-02 | Cadastrar e editar as preferências: gostos (cozinhas), cozinhas que quero evitar, restrições, orçamento e bairro. | Precisa | **Dado** o primeiro acesso, **quando** entro, **então** vejo as preferências em 3 etapas, com escolhas em botões.<br>**Dado** que salvei, **quando** recarrego a página, **então** tudo continua salvo.<br>Restrições: vegano, vegetariano, sem glúten e sem lactose. Orçamento: até quanto quero gastar por prato (até R$ 25, até R$ 50, até R$ 80 ou sem limite). |
| RF-03 | Escolher o momento: almoço rápido, jantar romântico ou lanche econômico. | Precisa | **Dado** que abro "Hoje" às 12h, **então** "Almoço rápido" já vem marcado.<br>**Quando** toco em outro momento, **então** as sugestões mudam. |
| RF-04 | Receber sugestões de pratos que respeitam as restrições e o orçamento, com o motivo de cada uma. | Precisa | **Dado** um perfil vegano, **quando** peço sugestões, **então** nenhum prato sem a marca "vegano" aparece.<br>**Dado** o orçamento "até R$ 25", **então** nenhum prato acima de R$ 25 aparece.<br>**Dado** um prato sugerido, **então** vejo até 3 motivos em palavras (ex.: "Vegano", "A 1,2 km").<br>**Dado** que nada atende ao orçamento, **então** leio "Nada no seu orçamento" e vejo opções um pouco acima. |
| RF-05 | Ver restaurantes próximos que combinam com o perfil, com a distância. | Precisa | **Dado** que permito a localização, **quando** abro a aba "Restaurantes", **então** vejo a distância de cada um ("a 1,2 km"), do mais perto para o mais longe entre os que combinam.<br>**Dado** que nego a localização, **então** a distância é calculada a partir do bairro do perfil. |
| RF-06 | Favoritar pratos e restaurantes e ver os favoritos. | Precisa | **Dado** um card, **quando** toco no coração, **então** ele fica cheio e o item aparece em "Favoritos".<br>**Quando** toco de novo, **então** o item sai de "Favoritos". |
| RF-07 | Registrar a escolha e avaliar de 1 a 5 estrelas, com comentário opcional. | Precisa | **Dado** um prato, **quando** toco "Escolhi este", **então** ele aparece em "Minhas escolhas" com a data.<br>**Dado** uma escolha, **quando** dou 4 estrelas e salvo, **então** a nota aparece ali e na média do prato. |
| RF-08 | Favoritos e avaliações mudam as próximas sugestões. | Deveria | **Dado** um prato que avaliei com 1 estrela, **quando** peço sugestões, **então** ele aparece mais abaixo do que antes.<br>**Dado** um prato que escolhi ontem, **então** ele perde posição, para variar. |
| RF-09 | Botão "Outra sugestão". | Deveria | **Dado** os resultados, **quando** toco "Outra sugestão", **então** vejo a próxima da lista, sem repetir até acabar. |
| RF-10 | Detalhe do prato e do restaurante, com "Abrir no mapa". | Deveria | **Dado** um card, **quando** toco nele, **então** vejo preço, selos de restrição, distância e o link "Abrir no mapa", que abre o mapa em outra aba. |
| RF-11 | Histórico de escolhas ("Minhas escolhas"). | Deveria | **Dado** que escolhi 3 pratos, **quando** abro "Minhas escolhas", **então** vejo os 3, do mais novo para o mais antigo. |
| RF-12 | Página de privacidade e botão "Apagar meus dados". | Deveria | **Dado** o rodapé, **quando** toco "Privacidade", **então** leio quais dados guardamos e para quê.<br>**Quando** toco "Apagar meus dados" e confirmo, **então** perfil, favoritos, escolhas e avaliações somem. [LGPD: confirmar] |
| RF-13 | Busca por nome de prato. | Poderia | **Dado** "Hoje", **quando** digito "taco", **então** vejo só pratos com "taco" no nome. |
| RF-14 | Recuperar a senha por e-mail. | Poderia | **Dado** "Entrar", **quando** toco "Esqueci a senha" e informo o e-mail, **então** recebo um link para criar outra senha. |
| RF-15 | Restaurantes reais, vindos de outro serviço. | Fora | Exige chave e tem custo por uso. Alternativa adotada: dados de exemplo no banco. |
| RF-16 | Pedido, pagamento e entrega. | Fora | Não faz parte do problema "o que vou comer hoje?". |
| RF-17 | Sugestão feita por IA. | Fora | Exige servidor para esconder a chave e tem custo por uso. Alternativa adotada: regra de pontos (ver `docs/plano.md`). |
| RF-18 | Login com Google. | Fora | Pode entrar depois. O Supabase já oferece. |

## 3. Requisitos não funcionais

| ID | Requisito | Prioridade | Como testar |
|---|---|---|---|
| RNF-01 | Funciona em telas de 375 px a 1920 px. | Precisa | **Dado** o site nas larguras 375, 768, 1280 e 1920 px, **quando** passo por todas as telas, **então** nada rola para o lado, e nenhum texto ou botão fica cortado. |
| RNF-02 | Tudo funciona pelo teclado. | Precisa | **Dado** que uso só Tab, Enter e Espaço, **quando** entro, peço uma sugestão, favorito e avalio, **então** consigo fazer tudo e sempre vejo o foco. |
| RNF-03 | Contraste suficiente entre texto e fundo. | Precisa | **Dado** qualquer texto, **quando** meço, **então** o texto normal tem pelo menos 4,5:1 e o grande, 3:1. Fonte: [WCAG 2.1, nível AA](https://www.w3.org/TR/WCAG21/). |
| RNF-04 | Toda imagem que traz informação tem texto alternativo. | Precisa | **Dado** um leitor de tela, **quando** passo pelos cards, **então** ouço o nome do prato. Imagens só decorativas são puladas. |
| RNF-05 | Respeita o pedido de menos movimento (prefers-reduced-motion). | Precisa | **Dado** o aparelho com "reduzir movimento" ligado, **quando** uso o site, **então** nada desliza nem pula. |
| RNF-06 | A página aparece e responde rápido. | Deveria | **Dado** um celular simulado em 4G, **quando** abro a página, **então** o maior conteúdo aparece em até 2,5 s ([LCP "bom"](https://web.dev/articles/lcp)). |
| RNF-07 | Funciona em Chrome, Edge, Firefox e Safari. | Deveria | **Dado** a versão mais recente de cada um, **quando** faço o fluxo inteiro, **então** tudo funciona igual. |
| RNF-08 | Sem CDN: fontes, ícones e estilos vêm do próprio site. | Deveria | **Dado** que bloqueio os endereços externos, menos o Supabase, **quando** abro o site, **então** tudo carrega. |
| RNF-09 | Os botões são fáceis de tocar. | Precisa | **Dado** qualquer botão, **quando** meço, **então** a área de toque tem pelo menos 44 × 44 px ([WCAG 2.5.5](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)). |
| RNF-10 | A letra é legível. | Deveria | **Dado** qualquer texto corrido, **então** a letra tem pelo menos 16 px. |
| RNF-11 | A página é marcada como português do Brasil. | Deveria | **Dado** um leitor de tela, **então** ele usa a pronúncia em português. |
| RNF-12 | Cada pessoa só vê e muda os próprios dados. | Precisa | **Dado** que entrei com a conta A, **quando** tento ler os favoritos da conta B, **então** não recebo nada. As regras ficam no banco (RLS), não só na tela. |
| RNF-13 | Sem rastreadores nem analytics. | Deveria | **Dado** o site aberto, **quando** olho a rede, **então** só há pedidos ao próprio site e ao Supabase. |

## 4. Conteúdo necessário

| Conteúdo | Usado em | Quem fornece |
|---|---|---|
| Restaurantes e pratos de exemplo (nome, preço, cozinha, restrições, momentos) | RF-04, RF-05 | Eu rascunho em `supabase/seed.sql`, vocês revisam |
| Fotos dos pratos | RF-04, RNF-04 | Vocês, opcional. Enquanto isso, uma imagem provisória |
| Textos da página inicial (o que é, como funciona) | Início | Eu rascunho, vocês aprovam |
| Ícones (restrições, momentos, coração, estrela) | Todas as telas | Eu desenho em SVG, guardados no próprio site |
| Política de privacidade | RF-12 | Eu rascunho, vocês revisam [LGPD: confirmar] |

## 5. Dependências externas

| Dependência | Para quê | Risco | Plano B |
|---|---|---|---|
| Supabase (plano grátis) | Login e banco (RF-01, RF-02, RF-06, RF-07) | O projeto é **pausado** depois de 1 semana sem uso. O e-mail de confirmação tem limite por hora. | Abrir o painel antes de apresentar. Desligar a confirmação de e-mail durante o desenvolvimento. |
| Localização do navegador | Distância (RF-05) | A pessoa pode negar. Só funciona em HTTPS ou no `localhost`. | Usar o bairro do perfil. |
| Link de mapa | "Abrir no mapa" (RF-10) | Abre outro site. | Mostrar o endereço em texto. |

## 6. Riscos e perguntas em aberto

**Riscos**
1. Com dados fictícios, a sugestão não serve para a vida real. Mitigação: deixar claro que são restaurantes de exemplo.
2. Uma marca de restrição errada num prato engana quem tem alergia. Mitigação: revisar o `seed.sql` e avisar "Confirme com o restaurante".
3. Se as regras de acesso (RLS) ficarem erradas, uma pessoa vê os dados de outra. Mitigação: o teste do RNF-12.

**Perguntas em aberto**: ver a seção 8 do `docs/brief.md`.

## Glossário

- **Supabase:** serviço online que guarda o banco de dados e cuida do login.
- **RLS (Row Level Security):** regras no banco que dizem quem pode ler ou mudar cada linha.
- **Chave publishable:** chave do Supabase que pode ficar no site. Sozinha, ela não abre nada que as regras não permitam.
- **Seed:** arquivo que preenche o banco com dados de exemplo.
- **px (pixel):** unidade de medida da tela. 375 px é a largura de um celular pequeno.
- **Contraste:** diferença de claridade entre o texto e o fundo, medida como 4,5:1.
- **Texto alternativo:** descrição de uma imagem, lida em voz alta pelo leitor de tela.
- **Foco:** contorno que mostra qual botão está selecionado quando se usa o teclado.
- **prefers-reduced-motion:** ajuste do aparelho em que a pessoa pede menos animação.
- **LCP:** tempo até o maior conteúdo da página aparecer.
- **CDN:** servidores de outra empresa que entregam arquivos.
- **LGPD:** lei brasileira sobre o uso de dados pessoais.
