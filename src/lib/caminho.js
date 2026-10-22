// Monta o endereço de um arquivo da pasta public/ dentro do JavaScript.
//
// No HTML e no CSS, escreva "/img/foto.webp": o Vite acrescenta o base sozinho.
// No JavaScript ele não acrescenta nada, então use sempre esta função:
//   caminho('icons/icones.svg')  →  "/site-superadega/icons/icones.svg"
// (o base vem de vite.config.js)

export function caminho(arquivo) {
  return import.meta.env.BASE_URL + arquivo.replace(/^\//, '')
}
