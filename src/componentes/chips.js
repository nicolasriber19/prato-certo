// Chips: botões de escolha que ficam ligados ou desligados.
// Usados nas preferências (gostos, restrições, orçamento) e no momento da refeição.
// aria-pressed diz ao leitor de tela se o chip está ligado. Ligado, ele também
// mostra um "confere", para não depender só da cor.

import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'

export function chip({ valor, texto, nomeDoIcone, ligado = false }) {
  return `
    <button type="button" class="chip" data-valor="${escapar(valor)}" aria-pressed="${ligado}">
      ${icone('confere', 'icone chip__confere')}
      ${nomeDoIcone ? icone(nomeDoIcone) : ''}
      ${escapar(texto)}
    </button>
  `
}

// multiplo: true deixa ligar vários (gostos); false liga só um por vez (orçamento).
// aoMudar recebe a lista de valores ligados.
export function ligarChips(grupo, { multiplo = true, aoMudar = () => {} } = {}) {
  grupo.addEventListener('click', (evento) => {
    const tocado = evento.target.closest('.chip')
    if (!tocado || !grupo.contains(tocado)) return

    if (multiplo) {
      tocado.setAttribute('aria-pressed', String(tocado.getAttribute('aria-pressed') !== 'true'))
    } else {
      grupo.querySelectorAll('.chip').forEach((item) => item.setAttribute('aria-pressed', String(item === tocado)))
    }
    aoMudar(valoresLigados(grupo))
  })
}

export function valoresLigados(grupo) {
  return [...grupo.querySelectorAll('.chip[aria-pressed="true"]')].map((item) => item.dataset.valor)
}
