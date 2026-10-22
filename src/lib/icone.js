// Desenha um ícone do arquivo public/icons/icones.svg.
// O ícone é decorativo (aria-hidden): o texto ao lado é que diz o que ele é.

import { caminho } from './caminho.js'

const ICONES = caminho('icons/icones.svg')

export function icone(nome, classe = 'icone') {
  return `<svg class="${classe}" aria-hidden="true"><use href="${ICONES}#${nome}"></use></svg>`
}
