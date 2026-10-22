// Tela "Minhas escolhas" (#/historico) (RF-07, RF-11): o que a pessoa escolheu, quando,
// e a avaliação de cada prato. A nota muda as próximas sugestões (RF-08).

import { carregarCatalogo } from '../dados/catalogo.js'
import { listarEscolhas } from '../dados/escolhas.js'
import { minhasAvaliacoes } from '../dados/avaliacoes.js'
import { nomeDoMomento } from '../lib/momento.js'
import { quando } from '../lib/textos.js'
import { emReais } from '../lib/dinheiro.js'
import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'
import { notaEmEstrelas, formAvaliacao, ligarAvaliacoes } from '../componentes/avaliacao.js'

function notaAtual(avaliacao) {
  if (!avaliacao) return '<p class="escolha__sem-nota">Ainda sem avaliação.</p>'
  return `
    <p class="escolha__nota">${notaEmEstrelas(avaliacao.nota, 'Sua nota')}</p>
    ${avaliacao.comentario ? `<p class="escolha__comentario">“${escapar(avaliacao.comentario)}”</p>` : ''}
  `
}

export const historico = {
  titulo: 'Minhas escolhas',

  async montar(area) {
    area.innerHTML = '<h1>Minhas escolhas</h1><div data-corpo><p class="carregando">Carregando…</p></div>'
    const [{ pratos, restaurantes }, escolhas, minhas] = await Promise.all([
      carregarCatalogo(),
      listarEscolhas(),
      minhasAvaliacoes(),
    ])
    const corpo = area.querySelector('[data-corpo]')

    const itens = escolhas
      .map((escolha) => {
        const prato = pratos.find((p) => p.id === escolha.prato_id)
        return prato && { escolha, prato, restaurante: restaurantes.find((r) => r.id === prato.restaurante_id) }
      })
      .filter(Boolean)

    if (itens.length === 0) {
      corpo.innerHTML = `
        <p class="tela__intro">Você ainda não escolheu nenhum prato. Em "Hoje", toque em "Escolhi este".</p>
        <div class="acoes"><a class="botao botao--primario" href="#/hoje">${icone('prato')} Ver sugestões</a></div>
      `
      return
    }

    corpo.innerHTML = `
      <p class="tela__intro">Avalie o que você comeu: a nota muda as próximas sugestões.</p>
      <ol class="escolhas" role="list">
        ${itens
          .map(
            ({ escolha, prato, restaurante }) => `
              <li class="cartao escolha">
                <p class="escolha__quando">${icone('relogio')} ${quando(escolha.criado_em)} · ${nomeDoMomento(escolha.momento)}</p>
                <h2 class="escolha__prato"><a href="#/prato/${prato.id}">${escapar(prato.nome)}</a></h2>
                <p class="cartao-prato__onde">${restaurante ? escapar(restaurante.nome) : ''} · ${emReais(prato.preco)}</p>
                <div data-nota-de="${prato.id}">${notaAtual(minhas.get(prato.id))}</div>
                <details class="escolha__avaliar">
                  <summary>${icone('estrela')} <span data-resumo-de="${prato.id}">${minhas.has(prato.id) ? 'Mudar avaliação' : 'Avaliar este prato'}</span></summary>
                  ${formAvaliacao(prato, minhas.get(prato.id))}
                </details>
              </li>
            `,
          )
          .join('')}
      </ol>
    `

    // O mesmo prato pode aparecer em várias escolhas: atualiza a nota em todas.
    ligarAvaliacoes(corpo, (pratoId, nota, comentario) => {
      minhas.set(pratoId, { nota, comentario })
      corpo.querySelectorAll(`[data-nota-de="${pratoId}"]`).forEach((lugar) => (lugar.innerHTML = notaAtual(minhas.get(pratoId))))
      corpo.querySelectorAll(`[data-resumo-de="${pratoId}"]`).forEach((resumo) => (resumo.textContent = 'Mudar avaliação'))
    })
  },
}
