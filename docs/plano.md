# Plano: Prato Certo (projeto final de Desenvolvimento de Interfaces, CEUB)

## Contexto
O documento do projeto (Carlos Eduardo e Nicolas, CEUB, 2026) descreve um site que responde "o que vou comer hoje?". A pessoa cadastra:
- seus gostos;
- suas restrições (vegano, sem glúten, sem lactose);
- seu orçamento.

Com isso e com o momento (almoço rápido, jantar romântico, lanche econômico), o site sugere pratos ou restaurantes próximos. Também dá para favoritar e avaliar as escolhas.

Decisões que você tomou:
- **Pasta nova**: `C:\Users\ronei\prato-certo`, com Git próprio. O Superadega na pasta `SITE` não muda.
- **Tecnologia**: Vite + HTML, CSS e JS puros, a mesma base do Superadega.
- **Dados**: login e banco online. Escolhi o **Supabase** em vez do Firebase, porque:
  - o banco é SQL e as tabelas se ligam bem (perfil → favoritos → avaliações);
  - tem plano grátis e login por e-mail pronto;
  - a regra "cada um só vê os próprios dados" fica no banco (RLS).
- **Entregas extras**: você não marcou nenhuma. Faço só uma documentação leve (brief e requisitos). Se o professor pedir protótipo, teste ou slides, entram depois do passo 4.

Dependências: só `vite` e `@supabase/supabase-js`. Confiro a versão e a licença com `npm view` antes de instalar.

## 1. Telas (rotas por `#`, funcionam no GitHub Pages)
| Rota | Tela | Conteúdo |
|---|---|---|
| `#/` | Início (pública) | O que é, como funciona em 3 passos, botões "Criar conta" e "Entrar" |
| `#/entrar`, `#/criar-conta` | Conta | E-mail e senha (Supabase Auth), mensagens de erro claras |
| `#/preferencias` | Perfil | Primeiro acesso em 3 etapas: gostos (cozinhas), restrições, orçamento e bairro. Depois vira "Editar preferências" |
| `#/hoje` | **Principal** | "O que vou comer hoje?": momento já sugerido pelo horário, com troca em botões. Botão "Me sugira". Resultados em Pratos ou Restaurantes, com o "por que esta sugestão" e o botão "Outra sugestão" |
| `#/prato/:id`, `#/restaurante/:id` | Detalhe | Preço, selos de restrição, distância, "Abrir no mapa" (link), Favoritar, "Escolhi este", Avaliar |
| `#/favoritos` | Favoritos | Pratos e restaurantes salvos |
| `#/historico` | Minhas escolhas | O que escolhi e quando. Avaliar de 1 a 5 estrelas, com comentário |
| `#/privacidade` | Privacidade | Quais dados guardamos e para quê. Botão "Apagar meus dados" |

As telas logadas mandam quem não entrou para `#/entrar`.

## 2. Banco (Supabase), em `supabase/schema.sql` e `supabase/seed.sql`
- `restaurantes`: nome, bairro, endereço, latitude e longitude, faixa de preço, cozinhas. Leitura pública.
- `pratos`: restaurante, nome, descrição, preço, cozinha, `tags` (vegano, vegetariano, sem_gluten, sem_lactose), `momentos` (almoco_rapido, jantar_romantico, lanche_economico), tempo de preparo, foto. Leitura pública.
- `perfis`: id = usuário logado, nome, gostos, não gosta, restrições, orçamento máximo por prato (vazio = sem limite), bairro.
- `favoritos`: usuário + prato **ou** restaurante.
- `escolhas`: usuário, prato, momento, data.
- `avaliacoes`: usuário, prato, nota de 1 a 5, comentário. Uma por usuário e prato.
- **RLS** em todas as tabelas. Em `perfis`, `favoritos`, `escolhas` e `avaliacoes`, cada pessoa lê e grava só as próprias linhas. As notas de todos alimentam a média, sem mostrar quem deu.
- Seed: uns 10 restaurantes **fictícios** em bairros de Brasília e uns 40 pratos, cobrindo todas as restrições e momentos.

## 3. Como a recomendação funciona (`src/lib/recomendar.js`, função pura)
1. **Elimina**:
   - prato que não atende alguma restrição (ex.: vegano exige a tag `vegano`);
   - prato acima do orçamento.
   
   Se nada sobrar, mostra "Nada no seu orçamento. Veja opções um pouco acima".
2. **Pontua**:
   - cozinha de que gosta: +3;
   - cozinha de que não gosta: −5;
   - combina com o momento: +4;
   - distância: até 2 km +2, até 5 km +1;
   - média ≥ 4: +1;
   - sua nota 4–5: +2;
   - sua nota 1–2: −8 (mudou de −4: com −4, um prato com nota 1 ainda podia ficar em primeiro);
   - escolhido nos últimos 3 dias: −2, para variar;
   - favorito: +1.
3. **Devolve** a lista ordenada, com os motivos em palavras ("Vegano", "Bom para almoço rápido", "A 1,2 km"). A tela mostra esses motivos.
- **Momento automático**: das 11h às 14h, almoço; das 18h às 23h, jantar; no resto do dia, lanche.
- **Distância**: localização do navegador, só com permissão, e a fórmula de Haversine (`src/lib/distancia.js`). Se a pessoa negar, usa o bairro do perfil.

## 4. Árvore de arquivos
```
prato-certo/
├─ index.html  vite.config.js (base '/prato-certo/')  package.json
├─ .env.example   VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
├─ .env.local     valores reais (fora do Git, já coberto por *.local)
├─ .gitignore  .gitattributes   copiados do SITE
├─ .claude/launch.json          prato-certo-dev (5173) e prato-certo-preview (4173)
├─ docs/       brief.md, requisitos.md, stack.md (no formato dos docs do SITE)
├─ supabase/   schema.sql, seed.sql
├─ tests/      recomendar.test.js   (roda com `node --test`, sem dependência)
├─ public/     favicon.svg, icons/icones.svg, img/pratos/
└─ src/
   ├─ main.js                 estilos, sessão e roteador
   ├─ lib/                    supabase.js (cliente), rotas.js, sessao.js, recomendar.js,
   │                          distancia.js, momento.js, dinheiro.js, caminho.js
   ├─ dados/                  perfis.js, catalogo.js, favoritos.js, escolhas.js, avaliacoes.js
   │                          (todas as chamadas ao Supabase ficam aqui)
   ├─ telas/                  inicio, entrar, preferencias, hoje, detalhe, favoritos, historico, privacidade
   ├─ componentes/            card-prato, card-restaurante, estrelas, chips
   └─ styles/                 tokens.css, base.css, telas.css, animacao.css
```
**Reaproveitado do SITE:**
- `src/lib/dinheiro.js` (`emReais`) e `src/lib/caminho.js`, iguais;
- `src/styles/base.css` (foco visível, botões de 48 px, letra de 18 px);
- a estrutura de `tokens.css`, com cores novas;
- o padrão `try/catch` do `localStorage` em `src/lib/lista.js`, para guardar um rascunho das preferências;
- o `vite.config.js` (`base` e `appType: 'mpa'`) e a ideia do sprite `icones.svg`.

## 5. Passos (15 a 30 minutos cada; cada um termina com um teste)
**Fase 0: preparação**
0. Criar `C:\Users\ronei\prato-certo` com `npm create vite@latest . -- --template vanilla`, rodar `git init`, copiar `.gitignore` e `.gitattributes` e criar o `launch.json`. Abrir a pasta nesta sessão. *Testar:* `npm run dev` abre em `localhost:5180/prato-certo/` (porta própria: a 5173 é do Superadega).
1. Escrever `docs/brief.md` (a partir do .docx), `docs/requisitos.md` (RF/RNF com "Dado/quando/então") e `docs/stack.md`. *Testar:* você lê e aprova.

**Fase 1: Supabase** (você cria a conta; eu escrevo o SQL e o código)
2. **Você**: criar o projeto no supabase.com e colar a URL e a *publishable key* no `.env.local`. Para facilitar os testes, desligue "Confirm email" em Auth. **Eu**: instalar `@supabase/supabase-js` e criar `src/lib/supabase.js`. *Testar:* uma consulta simples responde sem erro.
3. `supabase/schema.sql` com as tabelas, as RLS e as políticas. **Você** cola no SQL Editor. *Testar:* sem login, ler `perfis` devolve vazio.
4. `supabase/seed.sql` com os restaurantes e os pratos. *Testar:* as contagens batem e todas as restrições e momentos têm prato.

**Fase 2: esqueleto e identidade**
5. Roteador por `#`, topo com navegação, rodapé e telas vazias. *Testar:* todas as rotas abrem, e o "voltar" do navegador funciona.
6. Tokens de cor (contraste AA), tipografia e ícones SVG: restrições, momentos, coração, estrela. *Testar:* verificador de contraste do DevTools.

**Fase 3: conta e perfil**
7. Criar conta, entrar e sair, com rotas protegidas. *Testar:* sem login, `#/hoje` manda para `#/entrar`.
8. Preferências em 3 etapas, salvas em `perfis`, e edição depois. *Testar:* recarregar e ver tudo salvo.

**Fase 4: recomendação** (o coração do projeto)
9. `recomendar.js`, `momento.js`, `distancia.js` e `tests/recomendar.test.js`. *Testar:* `node --test`. Um perfil vegano nunca recebe carne, o orçamento é respeitado, e a ordem segue os pontos.
10. Tela `#/hoje`: momento, "Me sugira", cards com os motivos, "Outra sugestão" e a aba Pratos/Restaurantes. *Testar:* trocar o momento muda os resultados.
11. Localização com permissão, "a X km" e "Abrir no mapa". *Testar:* negar a permissão faz o site usar o bairro.

**Fase 5: favoritos e avaliações**
12. Coração nos cards e no detalhe, e a tela Favoritos. *Testar:* favoritar, recarregar e ver o item lá.
13. "Escolhi este", Histórico, avaliação com estrelas, e a nota entrando na recomendação. *Testar:* um prato com nota 1 cai no ranking.

**Fase 6: qualidade e entrega**
14. Estados de carregando, vazio e erro (sem internet ou Supabase fora). Animação leve no card, que respeita `prefers-reduced-motion`.
15. Responsivo de 375 a 1920 px, uso só pelo teclado, textos alternativos e `lang="pt-BR"`.
16. Página de privacidade e "Apagar meus dados", que apaga as linhas da própria pessoa.
17. `npm run build`, publicação no GitHub Pages e o endereço publicado configurado em "Site URL" no Supabase. **Antes de criar o repositório ou fazer push, eu pergunto**: o projeto é em dupla, e o repositório pode ficar na conta de um de vocês.

## 6. Riscos e plano B
| Risco | Plano B |
|---|---|
| O Supabase grátis **pausa o projeto depois de 7 dias parado** | Abrir o painel na véspera da apresentação. Gravar um vídeo curto do fluxo |
| O e-mail de confirmação demora ou bate no limite | Desligar "Confirm email" durante o desenvolvimento |
| A chave vazar | O site só usa a *publishable key*, que é pública. A segurança vem das RLS. A chave `service_role` nunca entra no código |
| Os dados são fictícios | Deixar escrito "restaurantes de exemplo". Nada de nomes reais com preços inventados |
| A pessoa nega a localização | Usar o bairro do perfil |

## 7. Fora desta versão
- Dados reais de restaurantes (Google Places: tem custo e exige chave).
- Recomendação por IA.
- Login com Google.
- Pedido ou pagamento.
- Aplicativo de celular.

## Verificação
- **Lógica**: `node --test` em `tests/recomendar.test.js`.
- **Telas**: `preview_start` com `prato-certo-dev`. Passo pelas telas públicas e confiro o console e a rede.
- **Login**: as senhas vão para o Supabase, um site de fora. Por isso, **você** cria e entra na conta de teste no navegador do app. Depois eu sigo testando as telas logadas:
  1. preferências;
  2. sugestões;
  3. favoritar;
  4. escolher;
  5. avaliar;
  6. ver a recomendação mudar.
- **Segurança**: com a conta A logada, tentar ler os favoritos da conta B pelo console tem que voltar vazio.
- **Layout e acesso**: larguras de 375, 768, 1280 e 1920 px, fluxo inteiro só com Tab, Enter e Espaço, e `prefers-reduced-motion` ligado.
- **Final**: `npm run build` e `npm run preview` sem erros.

## Decisões tomadas durante a implementação
- **Orçamento**: só o valor máximo por prato (até R$ 25, R$ 50, R$ 80 ou sem limite). Um valor mínimo não ajudava a escolher.
- **Portas próprias**: `5180` (dev) e `4180` (preview), porque a 5173 é do Superadega.
- **Guia de estilo** em `#/guia`: cores, letras, botões, chips, selos e ícones numa tela só. Não aparece na navegação.
- **Navegação**: barra fixa no pé da tela até 959 px. A partir de 960 px, fica no topo, porque antes disso não cabe ao lado da marca.
- **Testes** em `tests/`: recomendação, momento pela hora, distância e catálogo (`npm test`).
- **Modo demonstração**: sem `.env.local`, o site usa o catálogo de exemplo e guarda tudo no navegador. Permitiu fazer e testar os passos 7 a 16 antes de o Supabase existir, e serve de plano B na apresentação.
- **Catálogo com fonte única**: `src/dados/catalogo-exemplo.js`. O `supabase/seed.sql` é gerado dele (`npm run gerar-seed`).
- **Tela Hoje sem o botão "Me sugira"**: a sugestão já aparece ao abrir, para o momento da hora. Um toque a menos.
- **Nota baixa pesa −8** (era −4): com −4, um prato que a pessoa avaliou com 1 estrela ainda podia aparecer em primeiro.
- **Favoritos**: tirar um favorito não some com o cartão na hora; ele fica até sair da tela, para dar para desfazer.
