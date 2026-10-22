// Cartão de um prato: nome, restaurante, preço, selos de restrição e os motivos da sugestão.
// Os botões não fazem nada sozinhos: a tela escuta os cliques pelo data-acao.

import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'
import { emReais } from '../lib/dinheiro.js'
import { formatarDistancia } from '../lib/distancia.js'
import { RESTRICOES } from '../lib/opcoes.js'
import { caminho } from '../lib/caminho.js'
import { anunciar } from '../lib/anunciar.js'
import { favoritar, desfavoritar } from '../dados/favoritos.js'

export function selosDoPrato(prato) {
  const selos = RESTRICOES.filter((restricao) => prato.tags.includes(restricao.id))
  if (selos.length === 0) return ''
  return `
    <ul class="selos" aria-label="Restrições que o prato atende">
      ${selos.map((restricao) => `<li class="selo">${icone(restricao.icone)} ${restricao.nome}</li>`).join('')}
    </ul>
  `
}

export function botaoFavorito(tipo, id, ligado) {
  return `
    <button type="button" class="botao botao-favorito" data-acao="favoritar" data-tipo="${tipo}" data-id="${id}" aria-pressed="${ligado}">
      ${icone(ligado ? 'coracao-cheio' : 'coracao')}
      <span data-texto>${ligado ? 'Favorito' : 'Favoritar'}</span>
    </button>
  `
}

// Troca o botão no lugar (sem redesenhar o cartão), para o foco não se perder.
export function marcarFavorito(botao, ligado) {
  botao.setAttribute('aria-pressed', String(ligado))
  botao.querySelector('use').setAttribute('href', caminho(`icons/icones.svg#${ligado ? 'coracao-cheio' : 'coracao'}`))
  botao.querySelector('[data-texto]').textContent = ligado ? 'Favorito' : 'Favoritar'
}

// O coração "pulsa" ao favoritar (styles/animacao.css). Tirar e pôr a classe de novo
// faz a animação recomeçar mesmo em toques rápidos.
function pulsar(botao) {
  botao.classList.remove('botao-favorito--pulso')
  void botao.offsetWidth // força o navegador a "esquecer" a animação anterior
  botao.classList.add('botao-favorito--pulso')
}

// Liga todos os botões de coração dentro de "area".
// aoMudar(tipo, id, ligado) é chamado depois de salvar (ex.: a tela de favoritos tira o cartão).
export function ligarFavoritos(area, { aoMudar } = {}) {
  area.addEventListener('click', async (evento) => {
    const botao = evento.target.closest('[data-acao="favoritar"]')
    // "ocupado" em vez de disabled: desabilitar um botão com foco faz o foco se perder.
    if (!botao || botao.dataset.ocupado) return
    const { tipo } = botao.dataset
    const id = Number(botao.dataset.id)
    const ligar = botao.getAttribute('aria-pressed') !== 'true'

    botao.dataset.ocupado = 'sim'
    try {
      await (ligar ? favoritar(tipo, id) : desfavoritar(tipo, id))
      // O mesmo prato pode aparecer duas vezes na tela (destaque e lista): marca os dois.
      area
        .querySelectorAll(`[data-acao="favoritar"][data-tipo="${tipo}"][data-id="${id}"]`)
        .forEach((outro) => marcarFavorito(outro, ligar))
      if (ligar) pulsar(botao)
      anunciar(ligar ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.')
      aoMudar?.(tipo, id, ligar)
    } catch (erro) {
      console.error(erro)
      anunciar('Não deu para salvar o favorito. Tente de novo.')
    } finally {
      delete botao.dataset.ocupado
    }
  })
}

// escolhido: a pessoa já tocou nele nesta visita (o botão vira "Escolhido").
export function botaoEscolher(prato, escolhido = false) {
  return `
    <button type="button" class="botao botao--primario" data-acao="escolher" data-id="${prato.id}">
      ${icone('confere')} ${escolhido ? 'Escolhido' : 'Escolhi este'}
    </button>
  `
}

// sugestao: { prato, restaurante, motivos, distanciaKm } (de recomendar.js)
// destaque: cartão grande, no alto da tela "Hoje"
export function cardPrato(sugestao, { favorito = false, destaque = false, escolhido = false, maxMotivos = 3, acoes = true } = {}) {
  const { prato, restaurante, motivos = [], distanciaKm = null } = sugestao
  const Titulo = destaque ? 'h2' : 'h3'
  const foto = prato.foto
    ? `<img class="cartao__foto" src="${caminho(prato.foto)}" alt="${escapar(prato.texto_alternativo || prato.nome)}" loading="lazy" />`
    : ''
  const onde = [
    restaurante ? `<a href="#/restaurante/${restaurante.id}">${escapar(restaurante.nome)}</a>` : '',
    restaurante ? escapar(restaurante.bairro) : '',
    distanciaKm != null ? `a ${formatarDistancia(distanciaKm)}` : '',
  ].filter(Boolean)

  return `
    <article class="cartao cartao-prato${destaque ? ' cartao-prato--destaque' : ''}" data-prato="${prato.id}">
      ${foto}
      <${Titulo} class="cartao-prato__nome"><a href="#/prato/${prato.id}">${escapar(prato.nome)}</a></${Titulo}>
      <p class="cartao-prato__onde">${onde.join(' · ')}</p>
      <p class="cartao-prato__preco">
        <strong>${emReais(prato.preco)}</strong>
        <span class="cartao-prato__tempo">${icone('relogio')} cerca de ${prato.tempo_preparo_min} min</span>
      </p>
      ${selosDoPrato(prato)}
      ${
        motivos.length > 0
          ? `<ul class="motivos" aria-label="Por que sugerimos">
              ${motivos.slice(0, maxMotivos).map((motivo) => `<li>${icone('confere')} ${escapar(motivo)}</li>`).join('')}
            </ul>`
          : ''
      }
      ${
        acoes
          ? `<div class="cartao__acoes">
              ${destaque ? botaoEscolher(prato, escolhido) : ''}
              ${botaoFavorito('prato', prato.id, favorito)}
            </div>`
          : ''
      }
    </article>
  `
}
