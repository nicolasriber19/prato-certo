// Foto do prato (espaguete ao pomodoro visto de cima), usada na capa e na história do Início.
// As fotos foram geradas por IA no Canva e são ilustrativas (o rodapé avisa).
//
// public/img/prato/prato-vazio.jpg      o prato preto, vazio
// public/img/prato/prato-espaguete.jpg  o mesmo prato, com a comida
// As duas têm 1080 × 1080 px, fundo preto e o prato no mesmo lugar (centro em 49,9% × 50,5%,
// raio de 44,4%), então dá para empilhar uma sobre a outra.
//
// montavel: empilha o prato vazio embaixo e a comida em cima. A comida aparece do centro para fora
// e gira até o lugar conforme a variável CSS --massa (0 a 1), que vem da rolagem (styles/inicio.css).
// prioridade: a foto da capa é a primeira coisa grande da página (LCP), então carrega antes.

import { caminho } from '../lib/caminho.js'

function foto(arquivo, classe, prioridade) {
  const carregamento = prioridade ? 'fetchpriority="high"' : 'loading="lazy"'
  // alt vazio: a foto é decorativa e fica dentro de um aria-hidden; o título da seção já diz o que é.
  return `<img class="${classe}" src="${caminho(`img/prato/${arquivo}`)}" alt="" width="1080" height="1080" decoding="async" ${carregamento} />`
}

export function pratoFoto({ montavel = false, prioridade = false } = {}) {
  return `
    <div class="prato-foto${montavel ? ' prato-foto--montavel' : ''}">
      ${montavel ? foto('prato-vazio.jpg', 'prato-foto__vazio', prioridade) : ''}
      ${foto('prato-espaguete.jpg', 'prato-foto__comida', prioridade)}
    </div>
  `
}
