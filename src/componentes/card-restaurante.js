// Cartão de um restaurante: nome, bairro, distância, faixa de preço e cozinhas.

import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'
import { formatarDistancia } from '../lib/distancia.js'
import { cozinha } from '../lib/opcoes.js'
import { botaoFavorito } from './card-prato.js'

const FAIXAS = ['', 'barato', 'preço médio', 'um pouco caro', 'caro']

// 2 → "$$" na tela, e "preço médio" para o leitor de tela.
export function faixaDePreco(faixa) {
  return `<span aria-hidden="true">${'$'.repeat(faixa)}</span><span class="visualmente-oculto">${FAIXAS[faixa]}</span>`
}

// grupo: { restaurante, distanciaKm, motivos } (de recomendarRestaurantes) ou só { restaurante }
export function cardRestaurante(grupo, { favorito = false } = {}) {
  const { restaurante, distanciaKm = null, motivos = [] } = grupo
  const detalhes = [
    escapar(restaurante.bairro),
    distanciaKm != null ? `a ${formatarDistancia(distanciaKm)}` : '',
    faixaDePreco(restaurante.faixa_preco),
    restaurante.cozinhas.map((id) => cozinha(id).nome).join(', '),
  ].filter(Boolean)

  return `
    <article class="cartao cartao-restaurante" data-restaurante="${restaurante.id}">
      <h3 class="cartao-prato__nome">
        ${icone('restaurante')}
        <a href="#/restaurante/${restaurante.id}">${escapar(restaurante.nome)}</a>
      </h3>
      <p class="cartao-prato__onde">${detalhes.join(' · ')}</p>
      ${
        motivos.length > 0
          ? `<ul class="motivos" aria-label="Por que sugerimos">
              ${motivos.map((motivo) => `<li>${icone('confere')} ${escapar(motivo)}</li>`).join('')}
            </ul>`
          : `<p>${escapar(restaurante.descricao)}</p>`
      }
      <div class="cartao__acoes">${botaoFavorito('restaurante', restaurante.id, favorito)}</div>
    </article>
  `
}
