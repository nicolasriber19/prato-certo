# Brief: Prato Certo

Versão 1, 22/10/2026; atualizado em 19/11/2026 para a página única (versão 3). Base: documento "Projeto final Desenvolvimento de Interfaces" (CEUB, Ciência da Computação, 2026), de Carlos Eduardo Sarkis Carvalho e Nicolas Silveira Ribeiro.

Marcas usadas: [fato] está no documento do projeto; [suposição] é hipótese nossa, a validar; [proposta] é sugestão de implementação; [a confirmar] depende de vocês ou do professor.

## 1. O produto em uma frase

Um site que responde "o que vou comer hoje?" [fato]. Na versão 3, ele cabe numa página só. A pessoa marca as restrições e o que gosta, e uma tabela mostra os pratos que servem, com o restaurante, a distância e o preço. [proposta]

O documento original também pedia orçamento, momento (almoço rápido, jantar romântico, lanche econômico), favoritos e avaliações [fato]. Essas partes ficaram de fora da página única por decisão da dupla em 19/11/2026. A versão anterior, com elas, está no histórico do Git.

## 2. Público-alvo

- **Quem é:** quem decide todo dia o que ou onde comer. [fato] Em especial, estudantes e trabalhadores de Brasília. [suposição]
- **Quem mais precisa:** quem tem restrição alimentar, como vegano, sem glúten ou sem lactose. [fato]
- **O que quer:** decidir rápido, sem abrir vários apps nem ler cardápios inteiros. [suposição]
- **O que atrapalha a decisão:**
  1. O cansaço de escolher todo dia. [suposição]
  2. O medo de pedir algo que a pessoa não pode comer. [suposição]
  3. Sugestões genéricas, que ignoram o bolso e a ocasião. [suposição]

## 3. Objetivo do site

- **Ação principal:** ver, numa tabela, os pratos que servem para a pessoa e quanto custam. [proposta]
- **Ações secundárias:**
  - Marcar restrições e gostos, que ficam guardados no navegador. [fato]
  - Ordenar por preço ou pela distância, a partir de um bairro ou da localização. [proposta]

## 4. Proposta de valor

1. A tabela é pessoal: respeita as restrições e os gostos. [fato]
2. A restrição é filtro obrigatório: um prato que não atende nunca aparece. [proposta]
3. Tudo numa tela só: prato, restaurante, distância e preço, sem abrir cardápios. [proposta]
4. Sem conta: as escolhas ficam no navegador da pessoa. [proposta]

## 5. Concorrentes e referências

| Tipo | O que faz bem | O que vamos fazer diferente |
|---|---|---|
| Apps de entrega de comida | Catálogo enorme, filtros por categoria e pedido na hora. [suposição] | Foco em **decidir**, não em pedir. Uma tabela só, com o preço e a distância lado a lado. [proposta] |
| Mapas e guias de avaliação | Notas e comentários de muita gente. [suposição] | As restrições são filtro obrigatório, não um detalhe. Sem conta e sem cadastro. [proposta] |

## 6. Tom de voz

- **Como a marca fala:** amigável, direta e sem julgar o que a pessoa come. [suposição]
- **O que a marca nunca diria:**
  - "Você não deveria comer isso." [suposição]
  - Termos técnicos como "algoritmo", "filtro booleano" ou "score". [suposição]

## 7. Como saberemos que deu certo

- Em até 30 segundos, a pessoa marca as restrições e acha um prato que serve, com o preço. [proposta]
- Quem tem restrição nunca vê um prato que não pode comer. [proposta]
- Metas finais: [a confirmar].

## 8. Perguntas em aberto

- O professor pede algo além do site: protótipo, teste com usuários ou apresentação? Qual é a data de entrega? [a confirmar]
- Os restaurantes ficam fictícios ou entram restaurantes reais? Nesta versão, são fictícios. [a confirmar]
- Só Brasília? Quais bairros? [a confirmar]
- Em qual conta do GitHub fica o repositório (de qual dos dois)? [a confirmar]
