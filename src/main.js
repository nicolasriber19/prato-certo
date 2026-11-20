// Prato Certo: uma página só.
//   1. Restrições (chips)   2. O que você gosta (chips)   3. Tabela de restaurantes e preços
// A lógica de filtrar e ordenar fica em src/lib/tabela.js (testada em tests/tabela.test.js).
// Aqui só ligamos a página: ler as escolhas, desenhar a tabela e guardar no navegador.

// Letras guardadas no próprio site (RNF-08): só o alfabeto latino, que cobre o português.
import '@fontsource/unbounded/latin-800.css'
import '@fontsource/onest/latin-400.css'
import '@fontsource/onest/latin-700.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/pagina.css'

import { RESTAURANTES, PRATOS } from './dados/catalogo.js'
import { RESTRICOES, COZINHAS, nomeDaRestricao, cozinha } from './lib/opcoes.js'
import { BAIRROS, coordenadasDoBairro, distanciaKm, formatarDistancia } from './lib/distancia.js'
import { linhasDaTabela, ordenar, resumo } from './lib/tabela.js'
import { lerEscolhas, gravarEscolhas, apagarTudo, apagarRestosDaVersaoAntiga, PADRAO } from './lib/memoria.js'
import { chip, ligarChips } from './componentes/chips.js'
import { emReais } from './lib/dinheiro.js'
import { escapar } from './lib/html.js'

// Os jeitos de ordenar que aparecem na tela (src/lib/tabela.js tem mais um, por nome do prato).
const ORDENS = [
  { id: 'preco', nome: 'Menor preço', legenda: 'do menor para o maior preço' },
  { id: 'distancia', nome: 'Mais perto', legenda: 'do mais perto para o mais longe' },
  { id: 'restaurante', nome: 'Restaurante', legenda: 'por restaurante' },
]
const AQUI = 'aqui' // valor do <select> quando a pessoa usa a localização do aparelho
const DICA_SEM_LOCAL = 'Escolha um bairro para ver a distância até cada restaurante.'
const CENTRO_DE_BRASILIA = { latitude: -15.7939, longitude: -47.8828 }

const $ = (seletor) => document.querySelector(seletor)
const el = {
  restricoes: $('[data-restricoes]'),
  gostos: $('[data-gostos]'),
  onde: $('[data-onde]'),
  localizar: $('[data-localizar]'),
  dicaLocal: $('[data-dica-local]'),
  ordem: $('[data-ordem]'),
  resumo: $('[data-resumo]'),
  limpar: $('[data-limpar]'),
  tabela: $('[data-tabela]'),
  legenda: $('[data-legenda]'),
  linhas: $('[data-linhas]'),
  vazio: $('[data-vazio]'),
  apagar: $('[data-apagar]'),
  apagado: $('[data-apagado]'),
}

// ---------- Estado ----------

apagarRestosDaVersaoAntiga()

// localizacao: { latitude, longitude } do aparelho, só nesta visita (nunca é guardada).
// desfazer: as escolhas de antes do "Limpar", enquanto der para voltar atrás.
// querPerto: a pessoa pediu "Mais perto" antes de dizer onde está.
const estado = { ...validar(lerEscolhas()), localizacao: null, desfazer: null, querPerto: false }

// O que veio do navegador pode ser de uma versão antiga do site: fica só o que ainda existe.
function validar(escolhas) {
  const restricoes = escolhas.restricoes.filter((id) => RESTRICOES.some((item) => item.id === id))
  const gostos = escolhas.gostos.filter((id) => COZINHAS.some((item) => item.id === id))
  const bairro = coordenadasDoBairro(escolhas.bairro) ? escolhas.bairro : ''
  let ordem = ORDENS.some((item) => item.id === escolhas.ordem) ? escolhas.ordem : PADRAO.ordem
  if (ordem === 'distancia' && !bairro) ordem = PADRAO.ordem
  return { restricoes, gostos, bairro, ordem }
}

function origem() {
  return estado.localizacao ?? coordenadasDoBairro(estado.bairro)
}

// Toda mudança feita pela pessoa passa por aqui: atualiza, guarda e redesenha.
function mudar(parcial, { mensagem = '' } = {}) {
  Object.assign(estado, parcial)
  if (!('desfazer' in parcial)) estado.desfazer = null
  if (origem()) estado.querPerto = false
  gravarEscolhas(estado)
  desenhar({ mensagem })
}

// ---------- Desenho ----------

function desenharChips() {
  el.restricoes.innerHTML = RESTRICOES.map((item) =>
    chip({ valor: item.id, texto: item.nome, nomeDoIcone: item.icone, ligado: estado.restricoes.includes(item.id) }),
  ).join('')
  el.gostos.innerHTML = COZINHAS.map((item) =>
    chip({ valor: item.id, texto: item.nome, ligado: estado.gostos.includes(item.id) }),
  ).join('')
  el.ordem.innerHTML = ORDENS.map((item) => chip({ valor: item.id, texto: item.nome })).join('')
}

function sincronizar(grupo, ligados) {
  grupo.querySelectorAll('.chip').forEach((item) => {
    item.setAttribute('aria-pressed', String(ligados.includes(item.dataset.valor)))
  })
}

function desenharLocais() {
  const opcoes = [
    '<option value="">Escolha um bairro</option>',
    estado.localizacao ? `<option value="${AQUI}">Minha localização</option>` : '',
    ...BAIRROS.map(({ nome }) => `<option>${escapar(nome)}</option>`),
  ]
  el.onde.innerHTML = opcoes.join('')
  el.onde.value = estado.localizacao ? AQUI : estado.bairro
}

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`

function textoDoResumo({ pratos, restaurantes, menorPreco, maiorPreco }) {
  if (pratos === 0) return 'Nenhum prato encontrado.'
  const faixa = menorPreco === maiorPreco ? `por ${emReais(menorPreco)}` : `de ${emReais(menorPreco)} a ${emReais(maiorPreco)}`
  return `${plural(pratos, 'prato', 'pratos')} em ${plural(restaurantes, 'restaurante', 'restaurantes')}, ${faixa}.`
}

function celulaDaDistancia(km) {
  if (km === null) {
    return `<td role="cell" class="tabela__distancia tabela__distancia--vazia">
      <span aria-hidden="true">—</span><span class="visualmente-oculto">escolha um bairro</span>
    </td>`
  }
  return `<td role="cell" class="tabela__distancia">${escapar(formatarDistancia(km))}</td>`
}

function linhaDaTabela({ prato, restaurante, distanciaKm: km }) {
  const selos = prato.tags.map((tag) => `<li class="selo">${escapar(nomeDaRestricao(tag))}</li>`).join('')
  return `
    <tr role="row">
      <td role="cell" class="tabela__prato">
        <span class="tabela__nome">${escapar(prato.nome)}</span>
        ${selos ? `<ul class="selos" aria-label="Serve para">${selos}</ul>` : ''}
      </td>
      <td role="cell" class="tabela__restaurante">
        <span class="tabela__nome-restaurante">${escapar(restaurante?.nome ?? 'Restaurante')}</span>
        <span class="tabela__detalhe">${escapar(cozinha(prato.cozinha).nome)} · ${escapar(restaurante?.bairro ?? '')}</span>
      </td>
      ${celulaDaDistancia(km)}
      <td role="cell" class="tabela__preco">${escapar(emReais(prato.preco))}</td>
    </tr>
  `
}

function desenhar({ mensagem = '' } = {}) {
  const linhas = ordenar(
    linhasDaTabela({
      pratos: PRATOS,
      restaurantes: RESTAURANTES,
      restricoes: estado.restricoes,
      gostos: estado.gostos,
      origem: origem(),
    }),
    estado.ordem,
  )
  const ordem = ORDENS.find((item) => item.id === estado.ordem)

  sincronizar(el.restricoes, estado.restricoes)
  sincronizar(el.gostos, estado.gostos)
  sincronizar(el.ordem, [estado.ordem])
  el.ordem.querySelector('[data-valor="distancia"]').classList.toggle('chip--espera', !origem())

  // aria-sort diz ao leitor de tela qual coluna manda na ordem.
  el.tabela.querySelectorAll('th[data-coluna]').forEach((th) => {
    if (th.dataset.coluna === estado.ordem) th.setAttribute('aria-sort', 'ascending')
    else th.removeAttribute('aria-sort')
  })
  // Sem local, a coluna Distância mostra "—": a dica embaixo do campo explica por quê.
  if (!origem() && !el.dicaLocal.textContent) el.dicaLocal.textContent = DICA_SEM_LOCAL
  if (origem() && el.dicaLocal.textContent === DICA_SEM_LOCAL) el.dicaLocal.textContent = ''

  el.legenda.textContent = `Pratos que servem para você, ${ordem.legenda}.`
  el.linhas.innerHTML = linhas.map(linhaDaTabela).join('')
  el.tabela.hidden = linhas.length === 0
  el.vazio.hidden = linhas.length > 0

  el.resumo.textContent = [mensagem, textoDoResumo(resumo(linhas))].filter(Boolean).join(' ')

  const temEscolhas = estado.restricoes.length > 0 || estado.gostos.length > 0
  el.limpar.hidden = !temEscolhas && !estado.desfazer
  el.limpar.textContent = estado.desfazer ? 'Desfazer' : 'Limpar escolhas'
}

// ---------- Ações ----------

ligarChips(el.restricoes, { aoMudar: (restricoes) => mudar({ restricoes }) })
ligarChips(el.gostos, { aoMudar: (gostos) => mudar({ gostos }) })

el.ordem.addEventListener('click', (evento) => {
  const tocado = evento.target.closest('.chip')
  if (!tocado) return
  if (tocado.dataset.valor === 'distancia' && !origem()) {
    estado.querPerto = true
    el.dicaLocal.textContent = 'Para ordenar por distância, escolha um bairro ou use sua localização.'
    el.onde.focus()
    return
  }
  mudar({ ordem: tocado.dataset.valor })
})

// "Limpar escolhas" desmarca restrições e gostos. Logo depois, o mesmo botão vira "Desfazer".
el.limpar.addEventListener('click', () => {
  if (estado.desfazer) {
    const { restricoes, gostos } = estado.desfazer
    mudar({ restricoes, gostos, desfazer: null }, { mensagem: 'Escolhas de volta.' })
  } else {
    const desfazer = { restricoes: estado.restricoes, gostos: estado.gostos }
    mudar({ restricoes: [], gostos: [], desfazer }, { mensagem: 'Escolhas limpas.' })
  }
})

el.onde.addEventListener('change', () => {
  const bairro = el.onde.value
  if (bairro === AQUI) return
  const parcial = { bairro, localizacao: null }
  if (bairro && estado.querPerto) parcial.ordem = 'distancia'
  if (!bairro && estado.ordem === 'distancia') parcial.ordem = 'preco'
  el.dicaLocal.textContent = ''
  mudar(parcial)
  desenharLocais()
})

function procurando(sim) {
  el.localizar.setAttribute('aria-disabled', String(sim))
  el.localizar.lastChild.textContent = sim ? ' Procurando você…' : ' Usar minha localização'
}

el.localizar.addEventListener('click', () => {
  if (el.localizar.getAttribute('aria-disabled') === 'true') return
  if (!('geolocation' in navigator)) {
    el.dicaLocal.textContent = 'Este navegador não informa a localização. Escolha um bairro.'
    return
  }
  procurando(true)
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      procurando(false)
      const localizacao = { latitude: coords.latitude, longitude: coords.longitude }
      const longe = distanciaKm(localizacao, CENTRO_DE_BRASILIA) > 100
      el.dicaLocal.textContent = longe
        ? 'Você parece estar longe de Brasília, então as distâncias ficam grandes. Se quiser, escolha um bairro.'
        : 'Usando sua localização. Ela não é guardada.'
      mudar({ localizacao, ...(estado.querPerto ? { ordem: 'distancia' } : {}) })
      desenharLocais()
    },
    (erro) => {
      procurando(false)
      el.dicaLocal.textContent =
        erro.code === erro.PERMISSION_DENIED
          ? 'Sem permissão para ver sua localização. Escolha um bairro.'
          : 'Não deu para achar sua localização agora. Escolha um bairro.'
    },
    { timeout: 10000, maximumAge: 5 * 60 * 1000 },
  )
})

el.apagar.addEventListener('click', () => {
  apagarTudo()
  Object.assign(estado, structuredClone(PADRAO), { localizacao: null, desfazer: null, querPerto: false })
  el.dicaLocal.textContent = ''
  desenharLocais()
  desenhar()
  el.apagado.textContent = 'Pronto: apagado. A página voltou ao começo.'
})

// ---------- Início ----------

desenharChips()
desenharLocais()
desenhar()
