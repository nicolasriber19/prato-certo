// Telas de detalhe (RF-10): um prato (#/prato/12) e um restaurante (#/restaurante/3).

import { lerPerfil } from '../dados/perfis.js'
import { buscarPrato, buscarRestaurante } from '../dados/catalogo.js'
import { listarFavoritos } from '../dados/favoritos.js'
import { registrarEscolha } from '../dados/escolhas.js'
import { minhasAvaliacoes, notasDosPratos } from '../dados/avaliacoes.js'
import { recomendarPratos } from '../lib/recomendar.js'
import { momentoDaHora, nomeDoMomento } from '../lib/momento.js'
import { coordenadasDoBairro, distanciaKm, formatarDistancia } from '../lib/distancia.js'
import { cozinha, nomeDaRestricao } from '../lib/opcoes.js'
import { juntar, linkDoMapa } from '../lib/textos.js'
import { emReais } from '../lib/dinheiro.js'
import { irPara } from '../lib/rotas.js'
import { anunciar } from '../lib/anunciar.js'
import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'
import { selosDoPrato, botaoFavorito, botaoEscolher, ligarFavoritos, cardPrato } from '../componentes/card-prato.js'
import { faixaDePreco } from '../componentes/card-restaurante.js'
import { notaEmEstrelas, formAvaliacao, ligarAvaliacoes } from '../componentes/avaliacao.js'

// Estrutura comum: "Voltar", título fixo (recebe o foco) e o corpo, preenchido depois de carregar.
function esqueleto(area, titulo) {
  area.innerHTML = `
    <p><button type="button" class="botao botao--leve" data-voltar>${icone('voltar')} Voltar</button></p>
    <h1>${titulo}</h1>
    <div data-corpo><p class="carregando">Carregando…</p></div>
  `
  area.querySelector('[data-voltar]').addEventListener('click', () => {
    if (history.length > 1) history.back()
    else irPara('/hoje')
  })
  return area.querySelector('[data-corpo]')
}

function naoEncontrado(area, corpo, oQue) {
  area.querySelector('h1').textContent = `${oQue} não encontrado`
  corpo.innerHTML = `<div class="acoes"><a class="botao botao--primario" href="#/hoje">${icone('prato')} Ver sugestões</a></div>`
}

function linkMapa(lugar) {
  return `
    <a class="botao" href="${linkDoMapa(lugar)}" target="_blank" rel="noopener">
      ${icone('pino')} Abrir no mapa<span class="visualmente-oculto"> (abre em outra aba)</span>
    </a>
  `
}

function linhaFicha(rotulo, valor) {
  return valor ? `<div><dt>${rotulo}</dt><dd>${valor}</dd></div>` : ''
}

export const detalhePrato = {
  titulo: 'Prato',

  async montar(area, { id }) {
    const corpo = esqueleto(area, 'Prato')
    const encontrado = await buscarPrato(id)
    if (!encontrado) return naoEncontrado(area, corpo, 'Prato')

    const { prato, restaurante } = encontrado
    const [perfil, favoritos, minhas, notas] = await Promise.all([
      lerPerfil(),
      listarFavoritos(),
      minhasAvaliacoes(),
      notasDosPratos(),
    ])

    document.title = `${prato.nome} | Prato Certo`
    area.querySelector('h1').textContent = prato.nome

    const faltam = (perfil?.restricoes ?? []).filter((r) => !prato.tags.includes(r))
    const origem = coordenadasDoBairro(perfil?.bairro)
    const km = origem && restaurante ? distanciaKm(origem, restaurante) : null
    const nota = notas.get(prato.id)

    corpo.innerHTML = `
      ${
        faltam.length > 0
          ? `<p class="aviso aviso--erro">${icone('alerta')} <span>Atenção: este prato não é ${juntar(faltam.map(nomeDaRestricao)).toLowerCase()}.</span></p>`
          : ''
      }
      <p class="tela__intro">${escapar(prato.descricao)}</p>
      ${selosDoPrato(prato)}
      <dl class="ficha">
        ${linhaFicha('Restaurante', restaurante && `<a href="#/restaurante/${restaurante.id}">${escapar(restaurante.nome)}</a> · ${escapar(restaurante.bairro)}`)}
        ${linhaFicha('Preço', emReais(prato.preco))}
        ${linhaFicha('Preparo', `cerca de ${prato.tempo_preparo_min} min`)}
        ${linhaFicha('Cozinha', cozinha(prato.cozinha).nome)}
        ${linhaFicha('Bom para', prato.momentos.map(nomeDoMomento).join(', '))}
        ${linhaFicha('Distância', km != null && `a ${formatarDistancia(km)} de ${escapar(perfil.bairro)}`)}
        ${linhaFicha('Nota média', nota ? `${notaEmEstrelas(nota.media)} <span class="nota__total">(${nota.total === 1 ? '1 avaliação' : `${nota.total} avaliações`})</span>` : 'Ainda sem avaliações')}
      </dl>
      <div class="acoes" data-acoes>
        ${botaoEscolher(prato)}
        ${botaoFavorito('prato', prato.id, favoritos.pratos.has(prato.id))}
        ${restaurante ? linkMapa(restaurante) : ''}
      </div>
      <p class="confirmacao" role="status" data-confirmacao hidden></p>

      <section class="secao" aria-labelledby="titulo-avaliar">
        <h2 id="titulo-avaliar">Sua avaliação</h2>
        ${formAvaliacao(prato, minhas.get(prato.id))}
      </section>
    `

    ligarFavoritos(corpo)
    ligarAvaliacoes(corpo)

    corpo.querySelector('[data-acao="escolher"]').addEventListener('click', async (evento) => {
      const botao = evento.currentTarget
      if (botao.dataset.ocupado || botao.dataset.feito) return
      botao.dataset.ocupado = 'sim'
      try {
        await registrarEscolha(prato.id, momentoDaHora())
        botao.dataset.feito = 'sim'
        botao.lastChild.textContent = ' Escolhido'
        const confirmacao = corpo.querySelector('[data-confirmacao]')
        confirmacao.innerHTML = `${icone('confere')} <span>Boa escolha! Ele já está em <a href="#/historico">Minhas escolhas</a>.</span>`
        confirmacao.hidden = false
      } catch (erro) {
        console.error(erro)
        anunciar('Não deu para registrar a escolha. Tente de novo.')
      } finally {
        delete botao.dataset.ocupado
      }
    })
  },
}

export const detalheRestaurante = {
  titulo: 'Restaurante',

  async montar(area, { id }) {
    const corpo = esqueleto(area, 'Restaurante')
    const encontrado = await buscarRestaurante(id)
    if (!encontrado) return naoEncontrado(area, corpo, 'Restaurante')

    const { restaurante, pratos } = encontrado
    const [perfil, favoritos, minhas, notas] = await Promise.all([
      lerPerfil(),
      listarFavoritos(),
      minhasAvaliacoes(),
      notasDosPratos(),
    ])

    document.title = `${restaurante.nome} | Prato Certo`
    area.querySelector('h1').textContent = restaurante.nome

    const origem = coordenadasDoBairro(perfil?.bairro)
    const km = origem ? distanciaKm(origem, restaurante) : null

    // Os pratos daqui, na ordem da recomendação e só os que respeitam as restrições.
    // O orçamento não esconde nada aqui: a pessoa quer ver o cardápio inteiro.
    const { sugestoes } = recomendarPratos({
      pratos,
      restaurantes: [restaurante],
      perfil: { ...(perfil ?? { restricoes: [] }), orcamento_max: null },
      momento: momentoDaHora(),
      origem,
      medias: new Map([...notas].map(([pratoId, nota]) => [pratoId, nota.media])),
      minhasNotas: new Map([...minhas].map(([pratoId, a]) => [pratoId, a.nota])),
      favoritos: favoritos.pratos,
    })
    const fora = pratos.length - sugestoes.length

    corpo.innerHTML = `
      <p class="tela__intro">${escapar(restaurante.descricao)}</p>
      <dl class="ficha">
        ${linhaFicha('Bairro', escapar(restaurante.bairro))}
        ${linhaFicha('Endereço', escapar(restaurante.endereco))}
        ${linhaFicha('Preço', faixaDePreco(restaurante.faixa_preco))}
        ${linhaFicha('Cozinha', restaurante.cozinhas.map((c) => cozinha(c).nome).join(', '))}
        ${linhaFicha('Distância', km != null && `a ${formatarDistancia(km)} de ${escapar(perfil.bairro)}`)}
      </dl>
      <div class="acoes">
        ${botaoFavorito('restaurante', restaurante.id, favoritos.restaurantes.has(restaurante.id))}
        ${linkMapa(restaurante)}
      </div>

      <section class="secao" aria-labelledby="titulo-pratos">
        <h2 id="titulo-pratos">Pratos para você</h2>
        ${
          fora > 0
            ? `<p>${fora === 1 ? '1 prato daqui não atende' : `${fora} pratos daqui não atendem`} às suas restrições e não aparece${fora === 1 ? '' : 'm'}.</p>`
            : ''
        }
        ${
          sugestoes.length > 0
            ? `<ul class="cartoes" role="list">
                ${sugestoes.map((s) => `<li>${cardPrato(s, { favorito: favoritos.pratos.has(s.prato.id), maxMotivos: 2 })}</li>`).join('')}
              </ul>`
            : `<p class="aviso">${icone('alerta')} <span>Nenhum prato daqui atende às suas restrições.</span></p>`
        }
      </section>
    `

    ligarFavoritos(corpo)
  },
}
