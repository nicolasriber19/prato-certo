// Configuração do Vite.
// Doc: https://vite.dev/config/  e  https://vite.dev/guide/static-deploy (GitHub Pages)

import { defineConfig } from 'vite'

export default defineConfig({
  // O site fica em https://<usuário>.github.io/prato-certo/
  // No HTML e no CSS, "/img/x.webp" ganha esse começo sozinho no build.
  // No JavaScript, use caminho() de src/lib/caminho.js.
  // Num domínio próprio, troque para '/'.
  base: '/prato-certo/',

  // "mpa": arquivo que não existe responde 404, em vez de devolver o index.html.
  // As telas usam rotas com "#" (#/hoje, #/favoritos), então isso não as atrapalha.
  appType: 'mpa',

  // Portas próprias, para não brigar com o Superadega (5173 e 4173).
  server: { port: 5180, strictPort: true },
  preview: { port: 4180, strictPort: true },
})
