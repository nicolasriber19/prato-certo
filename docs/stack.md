# Stack: Prato Certo

Versão 3, 19/11/2026: **página única, sem login**. Base: `docs/brief.md` e `docs/requisitos.md`. A versão 1, de 22/10/2026, usava o Supabase para login e banco. Ela continua no histórico do Git (commit `d530cee`).

## 1. Decisão

**Vite + HTML, CSS e JavaScript puros. Sem servidor, sem banco e sem login.**

- **Página:** um só `index.html`, com as quatro partes da página (capa, restrições, gostos e tabela). Os links do topo são âncoras (`#restricoes`, `#gostos`, `#precos`).
- **Dados:** o catálogo de exemplo fica em `src/dados/catalogo.js` e vai junto com o site.
- **Escolhas da pessoa:** guardadas no `localStorage` do navegador (`src/lib/memoria.js`). A localização do aparelho é usada na hora e nunca é guardada.
- **Lógica da tabela:** funções puras em `src/lib/tabela.js` (filtrar, ordenar e resumir), testadas com `node --test`, sem biblioteca de teste.

**Por que essa:** sem login, um banco online não tem o que guardar. O catálogo cabe num arquivo, e as escolhas cabem no navegador. Assim, o site não depende de um serviço que pode ficar pausado (o Supabase grátis pausava depois de uma semana sem uso).

## 2. Dependências

| Pacote | Versão | Licença | Para quê (requisito) |
|---|---|---|---|
| `vite` | 8.3.5 | MIT | Rodar o site no computador e gerar a versão final em `dist/`. |
| `@fontsource/unbounded` | 5.3.0 | OFL-1.1 | Letra dos títulos grandes. Os arquivos vão junto com o site, sem CDN (RNF-08). Só o peso 800 e o alfabeto latino. |
| `@fontsource/onest` | 5.3.1 | OFL-1.1 | Letra do texto, nos pesos 400 e 700 e no alfabeto latino. Também fica guardada no site (RNF-08). |

O `@supabase/supabase-js` foi removido com `npm uninstall` na mudança para a página única.

**Regra para o futuro:** cada biblioteca nova precisa de um motivo ligado a um requisito. A versão e a licença são conferidas com `npm view <pacote> version license`.

## 3. Arquivos

```
index.html                 a página inteira (o HTML das 4 partes)
src/main.js                liga a página: chips, bairro, localização, ordem, tabela
src/lib/tabela.js          filtrar, ordenar e resumir (funções puras, testadas)
src/lib/memoria.js         guardar e apagar as escolhas no navegador
src/lib/distancia.js       bairros de Brasília e a distância em linha reta (Haversine)
src/lib/opcoes.js          restrições e cozinhas dos chips
src/lib/{dinheiro,html,icone,caminho}.js   ajudantes pequenos
src/componentes/chips.js   botões que ligam e desligam (aria-pressed)
src/dados/catalogo.js      10 restaurantes e 40 pratos de exemplo
src/styles/tokens.css      cores (com o contraste medido), letras, espaços
src/styles/base.css        reset, títulos, botões, foco
src/styles/pagina.css      o layout da página e a tabela (cartões no celular)
tests/                     tabela, distância e catálogo (npm test)
public/                    favicon, ícones (SVG) e a foto da capa
```

## 4. Comandos

- `npm run dev`: abre o site em `http://localhost:5180/prato-certo/`.
- `npm test`: roda os testes de `tests/`.
- `npm run build`: gera a versão final em `dist/`.
- `npm run preview`: mostra essa versão em `http://localhost:4180/prato-certo/`.

## 5. Onde publicar

- **GitHub Pages**, pelo GitHub Actions (`.github/workflows/publicar.yml`). A cada push na `main`, o GitHub roda os testes e o `npm run build` e publica a pasta `dist/`. Endereço: https://nicolasriber19.github.io/prato-certo/.
- Em Settings → Pages, a origem precisa ser **GitHub Actions**. Publicar a branch direto não funciona, porque o Vite precisa montar o site antes.
- O build não precisa de nenhum segredo.
- **Localização:** só funciona em HTTPS ou no `localhost`. O GitHub Pages já usa HTTPS.

## 6. Quando rever esta decisão

1. O site precisa de dados reais de restaurantes. Eles exigem uma chave secreta, e aí entra um servidor.
2. As escolhas precisam acompanhar a pessoa entre aparelhos. Aí voltam o login e o banco; o Supabase da versão 1 está no histórico do Git.
3. O catálogo cresce a ponto de pesar no carregamento. Aí ele passa a ser um arquivo JSON carregado à parte, ou vai para um banco.
