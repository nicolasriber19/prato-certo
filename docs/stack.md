# Stack: Prato Certo

Decidido em 22/10/2026. Base: `docs/brief.md`, `docs/requisitos.md` e `docs/plano.md`.

## 1. Decisão

**Vite + HTML, CSS e JavaScript puros, com o Supabase para login e banco.**

- **Telas:** um só `index.html`, com rotas por `#` (`#/hoje`, `#/favoritos`). Funciona no GitHub Pages sem configuração extra.
- **Login e banco:** Supabase. O site fala direto com ele, sem servidor próprio.
- **Segurança:** a chave que vai no site é a *publishable*, que é pública. Quem protege os dados são as regras de acesso (RLS) de `supabase/schema.sql`.
- **Recomendação:** uma regra de pontos em `src/lib/recomendar.js`, que roda no navegador. Testada com `node --test`, sem biblioteca de teste.

**Por que essa:** é a mesma base do Superadega, que vocês já conhecem. E o Supabase entrega login e banco prontos, de graça, sem precisar manter um servidor.

## 2. Dependências

| Pacote | Versão (npm view, 22/10/2026) | Licença | Para quê (requisito) |
|---|---|---|---|
| `vite` | 8.3.5 | MIT | Rodar o site no computador e gerar a versão final em `dist/`. |
| `@supabase/supabase-js` | 2.118.0 | MIT | Login e leitura e escrita no banco (RF-01, RF-02, RF-06, RF-07). |
| `create-vite` | 9.3.1 | MIT | Só criou o projeto (`npm create vite`). Não fica instalado. |

```
$ node --version                                   v24.19.0
$ npm --version                                    11.17.0
$ npm view vite version license                    8.3.5  MIT
$ npm view @supabase/supabase-js version license   2.118.0  MIT
$ npm view create-vite version license             9.3.1  MIT
```

**Regra para o futuro:** cada biblioteca nova precisa de um motivo ligado a um requisito, e versão e licença conferidas com `npm view <pacote> version license`.

## 3. Alternativas descartadas

| Opção | Por que ficou de fora |
|---|---|
| **Firebase** | O banco (Firestore) não é SQL: ligar perfil, favoritos e avaliações fica mais trabalhoso. As regras de acesso têm uma linguagem própria. |
| **Sem servidor nenhum** (tudo no navegador) | Mais simples, mas sem conta de verdade: os dados ficariam presos a um aparelho. Vocês escolheram ter login. |
| **Vite + React** | Mais 3 dependências e um framework novo para aprender, sem um requisito que precise dele. |
| **Recomendação por IA** | Exige um servidor para esconder a chave, e cada uso tem custo. A regra de pontos é explicável e testável. |

## 4. Comandos

Criação (já feita, não precisa repetir):

```bash
npm create vite@9.3.1 . -- --template vanilla --no-interactive
```
```bash
npm install @supabase/supabase-js@2.118.0
```

Para trabalhar:
- `npm run dev`: abre o site em `http://localhost:5180/prato-certo/`.
- `npm test`: roda os testes de `tests/`.
- `npm run gerar-seed`: reescreve `supabase/seed.sql` a partir de `src/dados/catalogo-exemplo.js`. Rode sempre que mudar o catálogo; o `npm test` avisa se esquecer.
- `npm run conferir`: confere a conexão com o Supabase e os dados de exemplo (precisa do `.env.local`).
- `npm run build`: gera a versão final em `dist/`.
- `npm run preview`: mostra essa versão em `http://localhost:4180/prato-certo/`.

## 5. Modo demonstração (sem Supabase)

Sem o `.env.local`, o site abre no **modo demonstração**:
- uma faixa amarela avisa no topo;
- "Entrar" não pede e-mail nem senha;
- o catálogo vem de `src/dados/catalogo-exemplo.js`;
- perfil, favoritos, escolhas e avaliações ficam no `localStorage` deste navegador (`src/dados/local.js`).

Serve para testar sem internet e como **plano B na apresentação**, se o Supabase estiver pausado. As telas são as mesmas: só a camada `src/dados/` muda de lugar.

## 6. Configurar o Supabase (uma vez)

1. Criar uma conta e um projeto em supabase.com. Região: São Paulo (`sa-east-1`), a mais perto de Brasília.
2. Copiar `.env.example` para `.env.local` e preencher a URL e a chave *publishable* (painel → Project Settings → API Keys).
3. No painel, abrir SQL Editor → New query, colar `supabase/schema.sql` e rodar (Run). Depois, fazer o mesmo com `supabase/seed.sql`.
4. Durante o desenvolvimento, em Authentication → Sign In / Providers → Email, desligar "Confirm email". Assim, a conta de teste entra sem esperar o e-mail.
5. Rodar `npm run conferir`.

**Nunca** coloque a chave *secret* (ou a antiga *service_role*) no `.env.local` nem no código: ela ignora as regras de acesso.

## 7. Onde publicar

- **GitHub Pages:** serve para um projeto acadêmico. O `vite.config.js` já tem `base: '/prato-certo/'`, para o endereço `https://<usuário>.github.io/prato-certo/`.
- **Depois de publicar:** no Supabase, em Authentication → URL Configuration, colocar esse endereço em "Site URL". Sem isso, os links dos e-mails (confirmação, troca de senha) apontam para o `localhost`.
- **Localização:** só funciona em HTTPS ou no `localhost`. O GitHub Pages já usa HTTPS.

## 8. Quando rever esta decisão

1. O site precisa de dados reais de restaurantes, que exigem uma chave secreta: aí entra um servidor (por exemplo, uma Edge Function do Supabase).
2. A recomendação fica pesada demais para o navegador: passa a rodar no banco.
3. Entra alguém que já domina outra ferramenta, como React.
