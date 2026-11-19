# Heurísticas de Nielsen no Prato Certo

Versão 1, 23/10/2026. As 10 heurísticas de usabilidade de Jakob Nielsen ([fonte](https://www.nngroup.com/articles/ten-usability-heuristics/)), e onde cada uma aparece no site.

O objetivo da versão 2 da interface era deixá-la **mais interativa e com cara de tecnologia, sem perder a usabilidade**. Por isso, cada efeito novo tem um motivo de usabilidade, e nenhum depende de movimento para funcionar.

## 1. Visibilidade do estado do sistema
O site sempre mostra o que está acontecendo, logo depois de cada ação.
- **Esqueletos de carregamento**: blocos no formato do conteúdo enquanto ele chega (`componentes/esqueleto.js`), no lugar de uma tela vazia.
- **Avisos flutuantes** depois de favoritar, escolher e salvar preferências (`componentes/avisos.js`).
- **Selos "Quero" e "Pular"** aparecem enquanto o cartão é arrastado, e ficam mais fortes conforme o arrasto avança.
- **Barra de progresso** e "Etapa 2 de 3" nas preferências.
- **"Sugestão 3 de 16"** embaixo do cartão, e o link da tela atual marcado na navegação.

## 2. Correspondência entre o sistema e o mundo real
- Linguagem do dia a dia: "Quero este", "Pular", "Almoço rápido", "Até R$ 50". Nada de "score" ou "algoritmo".
- **Motivos em palavras** em cada sugestão: "Vegano", "Bom para jantar romântico", "A 300 m".
- O gesto de deslizar imita separar cartas: para a direita fica, para a esquerda passa.
- Ícones familiares: coração para favorito, estrela para nota, alfinete para lugar.

## 3. Controle e liberdade do usuário
- **"Desfazer"** nos avisos de favoritar e de escolher, e **Ctrl+Z** como atalho.
- **"Voltar"** no baralho desfaz o último "Pular".
- Depois de escolher, "Ver outras sugestões" volta ao baralho.
- Nas preferências, "Voltar" entre as etapas, e tudo pode ser mudado depois.
- Tirar um favorito não some com o cartão na hora: dá para marcar de novo.

## 4. Consistência e padrões
- Os mesmos componentes em todas as telas: cartão de prato, chips, selos, botões e avisos.
- Uma cor para cada sentido: **vinho** para ação e marca, **verde** para restrição atendida, **dourado** para destaque, **vermelho** para erro.
- Ações principais sempre no mesmo lugar e com o mesmo nome ("Quero este", "Favoritar").
- Padrões da web: logo leva ao início, a navegação fica no pé da tela no celular e no topo no computador.

## 5. Prevenção de erros
- **Restrições são filtro, não sugestão**: um prato fora delas nunca aparece. Quando a pessoa abre um prato que não atende, aparece um aviso.
- Escolhas por chips, sem digitar (não há como escrever "vegano" errado).
- Uma cozinha não pode estar em "gosto" e "evito" ao mesmo tempo: ligar uma desliga a outra.
- "Apagar meus dados" pede confirmação, com o foco na opção segura ("Cancelar").
- O cartão só sai depois de passar de um limite de arrasto: um toque sem querer não pula nem escolhe.

## 6. Reconhecer em vez de lembrar
- O resumo do perfil fica no alto da tela Hoje ("Vegano · Até R$ 50 · Asa Sul"), com "Mudar" ao lado.
- O momento já vem escolhido pela hora do dia.
- Os selos de restrição aparecem em todo cartão.
- A dica do gesto fica escrita embaixo do cartão ("Arraste o cartão... No teclado, use as setas").

## 7. Flexibilidade e eficiência de uso
- **Três jeitos de decidir**: arrastar (celular), setas ← → (teclado) e botões (todo mundo).
- **Ctrl+Z** para desfazer sem procurar o botão.
- A sugestão já aparece ao abrir a tela, sem precisar de um "Me sugira".
- Quem quer comparar tem "Mais opções para você" embaixo do cartão, e a aba "Restaurantes".

## 8. Estética e design minimalista
- Um cartão em destaque por vez, com no máximo 3 motivos.
- Tema escuro com **uma** cor de ação (vinho) e **uma** de destaque (dourado): o olho vai direto para o que importa.
- Os efeitos (vidro no topo, brilho vinho atrás do prato, prato girando devagar) ficam no fundo e não disputam com o conteúdo.
- Cada tela tem uma ação principal, com a cor mais forte.

## 9. Ajudar a reconhecer, diagnosticar e recuperar erros
- Mensagens em português simples, dizendo o que fazer: "E-mail ou senha incorretos.", "Não deu para salvar. Confira sua internet e tente de novo."
- "Nada no seu orçamento. Estas são as opções mais em conta." em vez de uma lista vazia.
- Página "não encontrada" com um botão de volta ao início.
- Se o desfazer falhar, o aviso diz isso, em vez de fingir que deu certo.

## 10. Ajuda e documentação
- "Como funciona" contado pela rolagem na página inicial (CONTE → ESCOLHA → COMA), com o texto de cada passo também no HTML, para o leitor de tela.
- Uma prévia do cartão que desliza na página inicial, para experimentar antes de criar conta.
- Dica do gesto embaixo do cartão.
- Página de Privacidade explicando quais dados são guardados e para quê.
- Este documento e o `docs/requisitos.md`, para quem mantém o projeto.

## Acessibilidade junto com os efeitos
Todo efeito novo foi feito para não atrapalhar ninguém:
- Com **"reduzir movimento"** ligado no aparelho, as durações viram 0 s (`tokens.css`), os brilhos e os esqueletos param, e o cartão sai sem voar.
- O cartão que desliza recebe o foco do teclado e tem nome para o leitor de tela ("Sugestão 2 de 16: Espaguete ao pomodoro").
- Os avisos são lidos pelo leitor de tela sem tirar o foco do lugar, e não somem enquanto o mouse ou o foco estiver neles.
- Contraste AA conferido em todas as cores novas: os números estão em `src/styles/tokens.css`.
- Botões com 48 px de altura, inclusive "Desfazer" e o "×" dos avisos.
