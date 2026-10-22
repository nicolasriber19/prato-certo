// Tela "Preferências" (#/preferencias) (RF-02).
// No primeiro acesso, vem em 3 etapas, uma por vez. Depois, mostra tudo numa página só, para editar.
// Tudo é escolhido em chips: não precisa digitar nada.

import { lerPerfil, salvarPerfil } from '../dados/perfis.js'
import { chip, ligarChips, valoresLigados } from '../componentes/chips.js'
import { COZINHAS, RESTRICOES, ORCAMENTOS } from '../lib/opcoes.js'
import { BAIRROS } from '../lib/distancia.js'
import { irPara } from '../lib/rotas.js'
import { anunciar } from '../lib/anunciar.js'
import { icone } from '../lib/icone.js'

const PADRAO = { gostos: [], nao_gosta: [], restricoes: [], orcamento_max: 50, bairro: '' }

function grupoDeChips(nome, rotulo, opcoes) {
  return `<div class="chips" role="group" aria-labelledby="${rotulo}" data-grupo="${nome}">${opcoes.join('')}</div>`
}

function secoes(perfil) {
  const cozinhas = (campo) =>
    COZINHAS.map((c) => chip({ valor: c.id, texto: c.nome, ligado: perfil[campo].includes(c.id) }))

  return [
    `
      <section class="etapa" aria-labelledby="titulo-gostos">
        <h2 id="titulo-gostos">Do que você gosta?</h2>
        <p>Escolha quantas quiser. Elas aparecem mais nas sugestões.</p>
        ${grupoDeChips('gostos', 'titulo-gostos', cozinhas('gostos'))}
        <h3 id="titulo-evitar">E o que prefere evitar?</h3>
        <p>Essas aparecem menos.</p>
        ${grupoDeChips('nao_gosta', 'titulo-evitar', cozinhas('nao_gosta'))}
      </section>
    `,
    `
      <section class="etapa" aria-labelledby="titulo-restricoes">
        <h2 id="titulo-restricoes">Você tem alguma restrição?</h2>
        <p>Pratos fora delas nunca aparecem. Se não tiver nenhuma, é só seguir.</p>
        ${grupoDeChips(
          'restricoes',
          'titulo-restricoes',
          RESTRICOES.map((r) => chip({ valor: r.id, texto: r.nome, nomeDoIcone: r.icone, ligado: perfil.restricoes.includes(r.id) })),
        )}
      </section>
    `,
    `
      <section class="etapa" aria-labelledby="titulo-orcamento">
        <h2 id="titulo-orcamento">Quanto quer gastar por prato?</h2>
        ${grupoDeChips(
          'orcamento',
          'titulo-orcamento',
          ORCAMENTOS.map((o) => chip({ valor: String(o.valor), texto: o.nome, ligado: o.valor === perfil.orcamento_max })),
        )}
        <h3 id="titulo-bairro">Em que bairro você costuma estar?</h3>
        <p>Usamos para calcular a distância quando a localização do aparelho não está liberada. É opcional.</p>
        ${grupoDeChips(
          'bairro',
          'titulo-bairro',
          BAIRROS.map((b) => chip({ valor: b.nome, texto: b.nome, nomeDoIcone: 'pino', ligado: b.nome === perfil.bairro })),
        )}
      </section>
    `,
  ]
}

// Uma cozinha não pode estar em "gosto" e "evitar" ao mesmo tempo: ligar numa desliga na outra.
function ligarGrupos(form) {
  const grupo = (nome) => form.querySelector(`[data-grupo="${nome}"]`)
  const desligarNaOutra = (outra) => (ligados) => {
    grupo(outra).querySelectorAll('.chip[aria-pressed="true"]').forEach((item) => {
      if (ligados.includes(item.dataset.valor)) item.setAttribute('aria-pressed', 'false')
    })
  }
  ligarChips(grupo('gostos'), { aoMudar: desligarNaOutra('nao_gosta') })
  ligarChips(grupo('nao_gosta'), { aoMudar: desligarNaOutra('gostos') })
  ligarChips(grupo('restricoes'))
  ligarChips(grupo('orcamento'), { multiplo: false })
  ligarChips(grupo('bairro'), { multiplo: false })
}

function lerFormulario(form) {
  const valores = (nome) => valoresLigados(form.querySelector(`[data-grupo="${nome}"]`))
  const [orcamento = 'null'] = valores('orcamento')
  const [bairro = ''] = valores('bairro')
  return {
    gostos: valores('gostos'),
    nao_gosta: valores('nao_gosta'),
    restricoes: valores('restricoes'),
    orcamento_max: orcamento === 'null' ? null : Number(orcamento),
    bairro,
  }
}

export const preferencias = {
  titulo: 'Suas preferências',

  async montar(area) {
    // O título fica fixo (o roteador põe o foco nele); só o corpo muda depois de carregar.
    area.innerHTML = '<h1>Suas preferências</h1><div data-corpo><p class="carregando">Carregando…</p></div>'
    const salvo = await lerPerfil()
    const primeiraVez = !salvo
    const perfil = { ...PADRAO, ...salvo }
    const partes = secoes(perfil)

    if (primeiraVez) area.querySelector('h1').textContent = 'Conte do que você gosta'
    area.querySelector('[data-corpo]').innerHTML = `
      <p class="tela__intro">
        ${primeiraVez ? 'São 3 etapas rápidas. Depois, é só pedir sugestões.' : 'Mude o que quiser e toque em "Salvar".'}
      </p>
      ${primeiraVez ? '<p class="etapas__progresso" data-progresso></p>' : ''}
      <form class="preferencias" data-preferencias>
        ${partes.join('')}
        <p class="aviso aviso--erro" role="alert" data-erro hidden></p>
        <div class="acoes">
          ${primeiraVez ? `<button type="button" class="botao" data-voltar>${icone('voltar')} Voltar</button>` : ''}
          <button type="submit" class="botao botao--primario botao--grande" data-avancar>${icone('confere')} Salvar</button>
        </div>
      </form>
    `

    const form = area.querySelector('[data-preferencias]')
    const etapas = [...form.querySelectorAll('.etapa')]
    const botaoAvancar = form.querySelector('[data-avancar]')
    const botaoVoltar = form.querySelector('[data-voltar]')
    let atual = 0

    ligarGrupos(form)

    function mostrarEtapa(indice, { focar = true } = {}) {
      atual = indice
      etapas.forEach((etapa, i) => (etapa.hidden = i !== indice))
      area.querySelector('[data-progresso]').textContent = `Etapa ${indice + 1} de ${etapas.length}`
      botaoVoltar.hidden = indice === 0
      const ultima = indice === etapas.length - 1
      botaoAvancar.innerHTML = ultima
        ? `${icone('prato')} Salvar e ver sugestões`
        : `${icone('confere')} Continuar`
      if (focar) {
        const titulo = etapas[indice].querySelector('h2')
        titulo.setAttribute('tabindex', '-1')
        titulo.focus()
      }
    }

    if (primeiraVez) {
      mostrarEtapa(0, { focar: false }) // o foco já está no título da tela
      botaoVoltar.addEventListener('click', () => mostrarEtapa(atual - 1))
    }

    form.addEventListener('submit', async (evento) => {
      evento.preventDefault()
      if (primeiraVez && atual < etapas.length - 1) {
        mostrarEtapa(atual + 1)
        return
      }
      if (form.dataset.ocupado) return
      form.dataset.ocupado = 'sim'
      try {
        await salvarPerfil(lerFormulario(form))
        anunciar('Preferências salvas.')
        irPara('/hoje')
      } catch (erro) {
        console.error(erro)
        const aviso = form.querySelector('[data-erro]')
        aviso.textContent = 'Não deu para salvar agora. Confira sua internet e tente de novo.'
        aviso.hidden = false
      } finally {
        delete form.dataset.ocupado
      }
    })
  },
}
