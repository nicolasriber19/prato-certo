# Requisitos: Prato Certo

Versão 3, 19/11/2026: **página única**. Base: `docs/brief.md`. Termos técnicos estão no glossário, no fim.

A versão 1 tinha login, perfil, sugestões por momento, favoritos e avaliações em várias telas. Na versão 3, o site virou **uma página só, sem login**. Ela tem as restrições, o que a pessoa gosta e uma tabela com os restaurantes e os preços. O que saiu está listado em "Fora desta versão". O código antigo continua no histórico do Git (commit `d530cee`).

## 1. Escopo

**Dentro desta versão**
- Uma página só, com quatro partes:
  1. capa com uma foto de prato, parada;
  2. restrições;
  3. o que a pessoa gosta;
  4. tabela de restaurantes e preços.
- A tabela é filtrada pelas restrições e pelos gostos e pode ser ordenada pelo menor preço, pela distância ou pelo restaurante.
- A distância é calculada a partir de um bairro de Brasília ou da localização do aparelho.
- As escolhas ficam guardadas no próprio navegador. Não há conta nem banco.
- Os restaurantes e os pratos são **de exemplo** (fictícios) e ficam em bairros de Brasília (`src/dados/catalogo.js`).

**Fora desta versão** (saíram na mudança para a página única)
- Conta, login e banco online (Supabase).
- Sugestões por momento (almoço rápido, jantar romântico, lanche econômico) e o cartão que desliza.
- Orçamento, favoritos, histórico de escolhas e avaliações.
- Telas de detalhe, a página de privacidade e a animação da capa.
- Dados reais de restaurantes, pedido, pagamento e sugestão feita por IA.

## 2. Requisitos funcionais

| ID | Descrição | Prioridade | Critério de aceitação |
|---|---|---|---|
| RF-01 | Marcar as restrições: vegano, vegetariano, sem glúten e sem lactose. | Precisa | **Dado** que marco "Vegano", **então** nenhum prato sem a marca "vegano" aparece na tabela.<br>**Dado** que marco "Vegano" e "Sem glúten", **então** só aparecem pratos com as duas marcas. |
| RF-02 | Marcar as cozinhas de que gosta. | Precisa | **Dado** que marco "Italiana" e "Japonesa", **então** a tabela mostra só pratos dessas cozinhas.<br>**Dado** que não marquei nenhuma, **então** a tabela mostra todas. |
| RF-03 | Ver uma tabela com o prato, o restaurante (com a cozinha e o bairro), a distância e o preço. | Precisa | **Dado** a página aberta, **então** vejo os 40 pratos, do mais barato para o mais caro, e acima da tabela o resumo "40 pratos em 10 restaurantes, de R$ 10,00 a R$ 79,00."<br>**Dado** um prato, **então** vejo os selos das restrições que ele atende. |
| RF-04 | Ordenar a tabela por menor preço, pelo mais perto ou por restaurante. | Precisa | **Dado** que escolhi um bairro, **quando** toco "Mais perto", **então** o restaurante mais perto vem primeiro. Num empate, vem o prato mais barato.<br>**Dado** que não escolhi um bairro, **quando** toco "Mais perto", **então** leio "Para ordenar por distância, escolha um bairro ou use sua localização", e o foco vai para o campo do bairro. Quando escolho o bairro, a tabela passa a ordenar por distância. |
| RF-05 | Dizer onde está: escolher um bairro ou usar a localização do aparelho. | Precisa | **Dado** que escolho "Asa Sul", **então** cada linha mostra a distância ("300 m", "6,7 km").<br>**Dado** que permito a localização, **então** a distância é calculada a partir de onde estou, e a localização não é guardada.<br>**Dado** que nego a localização, **então** leio "Sem permissão para ver sua localização. Escolha um bairro." |
| RF-06 | Guardar as escolhas no navegador. | Precisa | **Dado** que marquei restrições, gostos, bairro e ordem, **quando** recarrego a página, **então** tudo continua marcado. |
| RF-07 | Limpar as escolhas, com "Desfazer". | Deveria | **Dado** que tenho restrições ou gostos marcados, **quando** toco "Limpar escolhas", **então** tudo é desmarcado, e o botão vira "Desfazer".<br>**Quando** toco "Desfazer", **então** as escolhas voltam. |
| RF-08 | Aviso quando nada serve. | Precisa | **Dado** que nenhum prato atende às escolhas, **então** a tabela some e leio "Nenhum prato atende a tudo isso. Tente desmarcar uma cozinha ou uma restrição." |
| RF-09 | Apagar o que foi guardado. | Deveria | **Dado** o rodapé, **quando** toco "Apagar o que foi guardado", **então** as escolhas somem deste navegador, e a página volta ao começo. Isso inclui o que sobrou da versão com login. |

## 3. Requisitos não funcionais

| ID | Requisito | Prioridade | Como testar |
|---|---|---|---|
| RNF-01 | Funciona em telas de 375 px a 1920 px. | Precisa | **Dado** a página nas larguras 375, 768, 1280 e 1920 px, **então** nada rola para o lado. No celular, cada linha da tabela vira um cartão. |
| RNF-02 | Tudo funciona pelo teclado. | Precisa | **Dado** que uso só Tab, Enter, Espaço e as setas do campo de bairro, **então** consigo marcar, ordenar e limpar, e sempre vejo o foco. |
| RNF-03 | Contraste suficiente entre o texto e o fundo. | Precisa | **Dado** qualquer texto, **então** o texto normal tem pelo menos 4,5:1 e o grande, 3:1 ([WCAG 2.1, nível AA](https://www.w3.org/TR/WCAG21/)). Os números estão em `src/styles/tokens.css`. |
| RNF-04 | A foto tem texto alternativo. | Precisa | **Dado** um leitor de tela, **quando** chego à foto, **então** ouço a descrição do prato. |
| RNF-05 | Sem animação. | Precisa | **Dado** a página, **então** nada gira nem desliza. As poucas transições de cor somem com "reduzir movimento". |
| RNF-06 | A página aparece rápido. | Deveria | **Dado** um celular simulado em 4G, **então** o maior conteúdo aparece em até 2,5 s ([LCP "bom"](https://web.dev/articles/lcp)). |
| RNF-07 | Funciona em Chrome, Edge, Firefox e Safari. | Deveria | **Dado** a versão mais recente de cada um, **então** tudo funciona igual. |
| RNF-08 | Sem CDN: as fontes, os ícones e os estilos vêm do próprio site. | Deveria | **Dado** que bloqueio os endereços externos, **quando** abro a página, **então** tudo carrega. |
| RNF-09 | Os botões são fáceis de tocar. | Precisa | **Dado** qualquer botão ou chip, **então** a área de toque tem pelo menos 44 × 44 px (aqui, 48 px). |
| RNF-10 | A letra é legível. | Deveria | **Dado** qualquer texto corrido, **então** a letra tem pelo menos 16 px. Só os rótulos curtos, em negrito e maiúsculas, têm 14 px. |
| RNF-11 | A página é marcada como português do Brasil. | Deveria | **Dado** um leitor de tela, **então** ele usa a pronúncia em português. |
| RNF-12 | A tabela continua sendo uma tabela para o leitor de tela. | Precisa | **Dado** o celular, em que as linhas viram cartões, **então** o leitor de tela continua anunciando a tabela, as linhas e as colunas (`role` explícito no HTML), e a coluna que define a ordem tem `aria-sort`. |
| RNF-13 | Sem rastreadores, sem analytics e sem servidor. | Deveria | **Dado** a página aberta, **quando** olho a rede, **então** só há pedidos ao próprio site. |

## 4. Conteúdo

| Conteúdo | Onde | Quem fornece |
|---|---|---|
| Restaurantes e pratos de exemplo (nome, preço, cozinha, marcas de restrição, bairro, coordenadas) | `src/dados/catalogo.js` | Eu rascunhei; vocês revisam |
| Foto da capa (espaguete ao pomodoro) | `public/img/prato/prato-espaguete.jpg` | Gerada por IA no Canva, ilustrativa (aviso no rodapé) |
| Ícones das restrições | `public/icons/icones.svg` | Desenhados em SVG e guardados no próprio site |

## 5. Dependências externas

| Dependência | Para quê | Risco | Plano B |
|---|---|---|---|
| Localização do navegador | Distância (RF-05) | A pessoa pode negar. Só funciona em HTTPS ou no `localhost`. | Escolher um bairro. |
| GitHub Pages | Publicar o site | Fora do ar ou cache antigo (até 10 min) | `npm run build` e `npm run preview` no computador. |

## 6. Riscos

1. Com dados fictícios, a tabela não serve para a vida real. Mitigação: o rodapé avisa que os restaurantes são de exemplo.
2. Uma marca de restrição errada num prato engana quem tem alergia. Mitigação: `tests/catalogo.test.js` confere as marcas (um prato vegano também precisa ser vegetariano e sem lactose), e o rodapé diz "Confirme sempre com o restaurante".
3. Restrições alimentares são um dado sensível. Mitigação: elas ficam só no navegador da pessoa, e o rodapé tem "Apagar o que foi guardado".

## Glossário

- **px (pixel):** unidade de medida da tela. 375 px é a largura de um celular pequeno.
- **Contraste:** diferença de claridade entre o texto e o fundo, medida como 4,5:1.
- **Texto alternativo:** descrição de uma imagem, lida em voz alta pelo leitor de tela.
- **Foco:** contorno que mostra qual botão está selecionado quando se usa o teclado.
- **aria-sort, role:** marcações invisíveis que dizem ao leitor de tela como a tabela está ordenada e o que é cada parte dela.
- **localStorage:** memória do navegador. O que fica nela não sai do aparelho.
- **LCP:** tempo até o maior conteúdo da página aparecer.
- **CDN:** servidores de outra empresa que entregam arquivos.
