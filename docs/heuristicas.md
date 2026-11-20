# Heurísticas de Nielsen no Prato Certo

Versão 3, 19/11/2026: **página única**. As 10 heurísticas de usabilidade de Jakob Nielsen ([fonte](https://www.nngroup.com/articles/ten-usability-heuristics/)), e onde cada uma aparece na página.

Na versão 3, o site virou uma página só, sem login e sem animação. Ela tem:
1. uma foto de prato parada na capa;
2. as restrições;
3. o que a pessoa gosta;
4. uma tabela de restaurantes e preços.

As heurísticas abaixo valem para essa página.

## 1. Visibilidade do estado do sistema
- **Resumo acima da tabela**, atualizado a cada toque: "16 pratos em 10 restaurantes, de R$ 15,00 a R$ 48,00". O leitor de tela também ouve o resumo (`aria-live`).
- Os chips ligados ficam em vinho **e** ganham um "confere", então o estado não depende só da cor.
- A coluna que define a ordem fica em dourado e sublinhada, e tem `aria-sort` para o leitor de tela.
- "Procurando você…" no botão enquanto a localização é buscada.

## 2. Correspondência entre o sistema e o mundo real
- Linguagem do dia a dia: "Onde você está?", "Mais perto", "Menor preço", "O que você gosta".
- A distância vem em metros ou quilômetros, como numa conversa ("300 m", "6,7 km"). O preço vem em reais ("R$ 39,00").
- Os bairros são os de Brasília, com o nome que todo mundo usa.

## 3. Controle e liberdade do usuário
- **"Limpar escolhas"** vira **"Desfazer"** logo depois de usado: um toque sem querer não apaga o trabalho.
- Todo chip liga e desliga com o mesmo toque.
- "Apagar o que foi guardado", no rodapé, tira as escolhas deste navegador.

## 4. Consistência e padrões
- Um só tipo de controle para escolher (os chips): nas restrições, nos gostos e na ordem.
- Uma cor para cada sentido: **vinho** para ação e escolha ligada, **verde** para restrição atendida e **dourado** para preço e destaque.
- A tabela segue o padrão da web: cabeçalho, linhas e preço alinhado à direita. No celular, ela vira cartões, como nos apps de comida.

## 5. Prevenção de erros
- **Restrição é filtro, não sugestão**: um prato que não atende a todas as restrições marcadas nunca aparece.
- Tudo é escolhido por toque, sem digitar. Não há como escrever "vegano" errado.
- "Mais perto" sem um local escolhido não bagunça a tabela. A página explica o que falta e leva o foco ao campo do bairro. Quando o bairro é escolhido, a ordem por distância entra sozinha. O chip fica com a borda tracejada enquanto falta o local.
- `tests/catalogo.test.js` confere as marcas dos pratos (vegano também é vegetariano e sem lactose).

## 6. Reconhecer em vez de lembrar
- Todas as opções ficam à vista: as 4 restrições, as 10 cozinhas e as 3 ordens.
- Cada prato mostra os selos das restrições que ele atende, a cozinha e o bairro do restaurante.
- As escolhas ficam guardadas: quem volta encontra tudo marcado.

## 7. Flexibilidade e eficiência de uso
- Dois jeitos de dizer onde está: o bairro (rápido, sem permissão) ou a localização do aparelho (mais exato).
- Links no topo levam direto a cada parte (Restrições, Gostos e Preços).
- A tabela já aparece completa ao abrir: quem só quer ver os preços não precisa marcar nada.

## 8. Estética e design minimalista
- Uma página, uma foto parada e uma tabela. Nada gira nem desliza.
- Tema escuro com **uma** cor de ação (vinho) e **uma** de destaque (dourado), que vai no preço, a informação mais procurada.
- Na tabela, só o necessário: prato, restaurante, distância e preço.

## 9. Ajudar a reconhecer, diagnosticar e recuperar erros
- Quando nada serve, a página diz o que fazer: "Nenhum prato atende a tudo isso. Tente desmarcar uma cozinha ou uma restrição."
- A localização negada ou indisponível vira uma frase com a saída: "Sem permissão para ver sua localização. Escolha um bairro."
- Para quem está longe de Brasília, a página avisa que as distâncias ficam grandes.

## 10. Ajuda e documentação
- Cada parte tem uma frase curta que explica a regra ("Um prato só aparece se atender a todas as que você marcar." e "Sem nenhuma marcada, a tabela mostra todas.").
- Os rótulos "Passo 1, 2 e 3" mostram a ordem de uso.
- O rodapé explica que os dados são de exemplo, que a foto é ilustrativa e o que fica guardado.
- Este documento e o `docs/requisitos.md` servem para quem mantém o projeto.

## Acessibilidade
- Contraste AA nas cores (os números estão em `src/styles/tokens.css`).
- Foco visível em azul claro, diferente do vinho e do dourado.
- Chips e botões com 48 px de altura.
- A tabela tem `role` explícito, para continuar sendo tabela no leitor de tela mesmo quando vira cartões no celular.
- "Pular para o conteúdo" no começo da página.
- A página é marcada como `lang="pt-BR"`.
- A foto tem texto alternativo.
