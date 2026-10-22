// Tela "Hoje" (#/hoje): a principal (RF-03, RF-04, RF-05, RF-09).
// Mostra uma sugestão em destaque, "Outra sugestão" e as outras opções, para o momento escolhido.
// Sem preferências salvas, leva a pessoa para #/preferencias.

import { lerPerfil } from '../dados/perfis.js'
import { carregarCatalogo } from '../dados/catalogo.js'
import { listarFavoritos } from '../dados/favoritos.js'
import { listarEscolhas, registrarEscolha } from '../dados/escolhas.js'
import { minhasAvaliacoes, notasDosPratos } from '../dados/avaliacoes.js'
import { recomendarPratos, recomendarRestaurantes } from '../lib/recomendar.js'
import { MOMENTOS, momentoDaHora, nomeDoMomento } from '../lib/momento.js'
import { coordenadasDoBairro } from '../lib/distancia.js'
import { ORCAMENTOS, nomeDaRestricao } from '../lib/opcoes.js'
import { juntar } from '../lib/textos.js'
import { trocarPara } from '../lib/rotas.js'
import { anunciar } from '../lib/anunciar.js'
import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'
import { chip, ligarChips } from '../componentes/chips.js'
import { cardPrato, ligarFavoritos } from '../componentes/card-prato.js'
import { cardRestaurante } from '../componentes/card-restaurante.js'

const OUTRAS_OPCOES = 6

// "Vegano · Até R$ 50 · Asa Sul"
function resumoDoPerfil(perfil) {
  const partes = [
    perfil.restricoes.length > 0 ? juntar(perfil.restricoes.map(nomeDaRestricao)) : 'Sem restrições',
    ORCAMENTOS.find((o) => o.valor === perfil.orcamento_max)?.nome ?? 'Sem limite',
    perfil.bairro,
  ]
  return partes.filter(Boolean).map(escapar).join(' · ')
}

export const hoje = {
  titulo: 'O que vou comer hoje?',

  async montar(area) {
    area.innerHTML = '<h1>O que vou comer hoje?</h1><div data-corpo><p class="carregando">Buscando sugestões…</p></div>'

    const [perfil, catalogo, favoritos, escolhas, minhas, notas] = await Promise.all([
      lerPerfil(),
      carregarCatalogo(),
      listarFavoritos(),
      listarEscolhas(),
      minhasAvaliacoes(),
      notasDosPratos(),
    ])
    if (!perfil) {
      trocarPara('/preferencias')
      return
    }

    const estado = {
      momento: momentoDaHora(),
      aba: 'pratos',
      indice: 0, // qual sugestão está em destaque ("Outra sugestão" soma 1)
      origem: coordenadasDoBairro(perfil.bairro),
      origemTexto: perfil.bairro ? `do bairro ${perfil.bairro} (do seu perfil)` : null, // "a partir do bairro..."
      escolhas,
      escolhidosAgora: new Set(), // pratos escolhidos nesta visita: o botão vira "Escolhido"
    }

    const corpo = area.querySelector('[data-corpo]')
    corpo.innerHTML = `
      <p class="resumo-perfil">
        ${icone('ajustes')} <span>${resumoDoPerfil(perfil)}</span>
        <a href="#/preferencias">Mudar</a>
      </p>

      <h2 class="titulo-pequeno" id="titulo-momento">Qual é o momento?</h2>
      <div class="chips" role="group" aria-labelledby="titulo-momento" data-momentos>
        ${MOMENTOS.map((m) => chip({ valor: m.id, texto: m.nome, nomeDoIcone: m.icone, ligado: m.id === estado.momento })).join('')}
      </div>

      <div class="barra-local">
        <p data-local></p>
        <button type="button" class="botao" data-usar-local hidden>${icone('localizacao')} Usar minha localização</button>
      </div>

      <div class="abas" role="group" aria-label="Ver sugestões de">
        <button type="button" class="aba" data-aba="pratos" aria-pressed="true">${icone('prato')} Pratos</button>
        <button type="button" class="aba" data-aba="restaurantes" aria-pressed="false">${icone('restaurante')} Restaurantes</button>
      </div>

      <div data-resultados></div>
    `

    const resultados = corpo.querySelector('[data-resultados]')
    const textoLocal = corpo.querySelector('[data-local]')
    const botaoLocal = corpo.querySelector('[data-usar-local]')

    function calcular() {
      return recomendarPratos({
        pratos: catalogo.pratos,
        restaurantes: catalogo.restaurantes,
        perfil,
        momento: estado.momento,
        origem: estado.origem,
        medias: new Map([...notas].map(([id, nota]) => [id, nota.media])),
        minhasNotas: new Map([...minhas].map(([id, avaliacao]) => [id, avaliacao.nota])),
        favoritos: favoritos.pratos,
        escolhas: estado.escolhas,
      })
    }

    function desenharLocal() {
      textoLocal.innerHTML = estado.origem
        ? `${icone('pino')} <span>Distâncias a partir ${escapar(estado.origemTexto)}.</span>`
        : `${icone('pino')} <span>Sem localização: as distâncias não aparecem.</span>`
    }

    function htmlDosPratos(sugestoes, acimaDoOrcamento) {
      const total = sugestoes.length
      const indice = estado.indice % total
      const atual = sugestoes[indice]
      const resto = [...sugestoes.slice(indice + 1), ...sugestoes.slice(0, indice)].slice(0, OUTRAS_OPCOES)
      const escolhido = estado.escolhidosAgora.has(atual.prato.id)

      return `
        ${
          acimaDoOrcamento
            ? `<p class="aviso">${icone('alerta')} <span>Nada no seu orçamento. Estas são as opções mais em conta.</span></p>`
            : ''
        }
        <p class="rotulo-destaque">Sua sugestão para ${nomeDoMomento(estado.momento).toLowerCase()}</p>
        ${cardPrato(atual, { destaque: true, escolhido, favorito: favoritos.pratos.has(atual.prato.id) })}
        ${
          escolhido
            ? `<p class="confirmacao" role="status">${icone('confere')} <span>Boa escolha! Depois, conte como foi em <a href="#/historico">Minhas escolhas</a>.</span></p>`
            : ''
        }
        <div class="acoes acoes--outra">
          <button type="button" class="botao" data-acao="outra">${icone('outra')} Outra sugestão</button>
          <span class="contador-sugestao">Sugestão ${indice + 1} de ${total}</span>
        </div>

        ${
          resto.length > 0
            ? `<h2 class="titulo-secao">Outras opções</h2>
              <ul class="cartoes" role="list">
                ${resto.map((s) => `<li>${cardPrato(s, { favorito: favoritos.pratos.has(s.prato.id), maxMotivos: 2 })}</li>`).join('')}
              </ul>`
            : ''
        }
      `
    }

    function htmlDosRestaurantes(sugestoes) {
      const grupos = recomendarRestaurantes(sugestoes)
      return `
        <h2 class="titulo-secao">Restaurantes com pratos para você</h2>
        <ul class="cartoes" role="list">
          ${grupos.map((g) => `<li>${cardRestaurante(g, { favorito: favoritos.restaurantes.has(g.restaurante.id) })}</li>`).join('')}
        </ul>
      `
    }

    function desenhar() {
      // Guarda qual botão tinha o foco, para devolver depois de redesenhar.
      const comFoco = document.activeElement?.closest?.('[data-resultados] [data-acao]')?.dataset.acao

      const { sugestoes, acimaDoOrcamento } = calcular()
      if (sugestoes.length === 0) {
        resultados.innerHTML = `
          <p class="aviso">${icone('alerta')} <span>Nenhum prato de exemplo atende a todas as suas restrições.</span></p>
          <div class="acoes"><a class="botao" href="#/preferencias">${icone('ajustes')} Mudar preferências</a></div>
        `
        return
      }
      resultados.innerHTML =
        estado.aba === 'pratos' ? htmlDosPratos(sugestoes, acimaDoOrcamento) : htmlDosRestaurantes(sugestoes)

      if (comFoco) resultados.querySelector(`[data-acao="${comFoco}"]`)?.focus()
    }

    // Momento
    ligarChips(corpo.querySelector('[data-momentos]'), {
      multiplo: false,
      aoMudar: ([momento]) => {
        estado.momento = momento
        estado.indice = 0
        desenhar()
        anunciar(`Sugestões para ${nomeDoMomento(momento).toLowerCase()}.`)
      },
    })

    // Abas: Pratos ou Restaurantes
    corpo.querySelectorAll('[data-aba]').forEach((aba) => {
      aba.addEventListener('click', () => {
        estado.aba = aba.dataset.aba
        corpo.querySelectorAll('[data-aba]').forEach((outra) => outra.setAttribute('aria-pressed', String(outra === aba)))
        desenhar()
      })
    })

    // Localização do aparelho: só com permissão. Só funciona em HTTPS ou no localhost.
    if ('geolocation' in navigator) {
      botaoLocal.hidden = false
      botaoLocal.addEventListener('click', () => {
        textoLocal.innerHTML = `${icone('localizacao')} <span>Procurando sua localização…</span>`
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            estado.origem = { latitude: coords.latitude, longitude: coords.longitude }
            estado.origemTexto = 'de onde você está agora'
            botaoLocal.hidden = true
            desenharLocal()
            desenhar()
            anunciar('Pronto: distâncias a partir de onde você está.')
          },
          () => {
            desenharLocal()
            textoLocal.insertAdjacentHTML(
              'beforeend',
              ` <span class="texto-erro">Não deu para usar sua localização${estado.origem ? ', então seguimos com o bairro' : ''}.</span>`,
            )
          },
          { timeout: 10000, maximumAge: 5 * 60 * 1000 },
        )
      })
    }

    // Botões dos cartões
    ligarFavoritos(resultados, {
      aoMudar: (tipo, id, ligado) => {
        const conjunto = tipo === 'prato' ? favoritos.pratos : favoritos.restaurantes
        if (ligado) conjunto.add(id)
        else conjunto.delete(id)
      },
    })

    resultados.addEventListener('click', async (evento) => {
      const botao = evento.target.closest('[data-acao]')
      if (!botao) return

      if (botao.dataset.acao === 'outra') {
        const { sugestoes } = calcular()
        estado.indice = (estado.indice + 1) % sugestoes.length
        desenhar()
        const nome = sugestoes[estado.indice].prato.nome
        anunciar(estado.indice === 0 ? `Você viu todas. De volta à primeira: ${nome}.` : `Sugestão ${estado.indice + 1}: ${nome}.`)
      }

      if (botao.dataset.acao === 'escolher' && !botao.dataset.ocupado) {
        const pratoId = Number(botao.dataset.id)
        if (estado.escolhidosAgora.has(pratoId)) return
        botao.dataset.ocupado = 'sim'
        try {
          const escolha = await registrarEscolha(pratoId, estado.momento)
          estado.escolhas = [escolha, ...estado.escolhas]
          estado.escolhidosAgora.add(pratoId)
          // Não redesenha a lista: o prato escolhido continua em destaque até a pessoa pedir outra.
          botao.innerHTML = `${icone('confere')} Escolhido`
          botao.closest('.cartao').insertAdjacentHTML(
            'afterend',
            `<p class="confirmacao" role="status">${icone('confere')} <span>Boa escolha! Depois, conte como foi em <a href="#/historico">Minhas escolhas</a>.</span></p>`,
          )
        } catch (erro) {
          console.error(erro)
          anunciar('Não deu para registrar a escolha. Tente de novo.')
        } finally {
          delete botao.dataset.ocupado
        }
      }
    })

    desenharLocal()
    desenhar()
  },
}
