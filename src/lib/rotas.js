// Roteador por "#": cada endereço #/algo mostra uma tela dentro do <main>.
// Exemplos: #/hoje, #/prato/12. Funciona no GitHub Pages, que não conhece essas rotas,
// porque o navegador nunca manda a parte depois do "#" para o servidor.
//
// Cada tela é um objeto { titulo, montar(area, parametros) }.
// montar() desenha a tela dentro de "area" e pode ser async (para buscar dados).

let config
let primeiraTela = true

// rotas:          [{ caminho: '/prato/:id', tela, exigeLogin }]
// alvo:           onde as telas são desenhadas (o <main>)
// naoEncontrada:  tela para endereços que não existem
// guarda(rota, caminho): devolve outro caminho para desviar (ex.: '/entrar'), ou nada
// aoAbrir(caminho): avisa a cada troca de tela (o topo marca o link atual)
export function iniciarRotas(configuracao) {
  config = configuracao
  window.addEventListener('hashchange', abrir)
  abrir()
}

export function irPara(caminho) {
  location.hash = `#${caminho}`
}

// Como irPara, mas sem deixar a tela atual no histórico do "voltar".
// Ex.: quem abre #/hoje sem preferências vai para #/preferencias; voltar não cai de novo em #/hoje.
export function trocarPara(caminho) {
  location.replace(`#${caminho}`)
}

// Abre de novo a tela atual (ex.: depois de entrar ou sair da conta).
export function recarregarTela() {
  abrir()
}

// Parte depois do "?" no endereço: #/entrar?volta=/hoje → { volta: '/hoje' }
export function parametrosDaBusca() {
  const busca = location.hash.split('?')[1] ?? ''
  return Object.fromEntries(new URLSearchParams(busca))
}

function caminhoAtual() {
  const hash = location.hash
  return hash.startsWith('#/') ? hash.slice(1).split('?')[0] : '/'
}

function encontrar(caminho) {
  const partes = caminho.split('/').filter(Boolean)

  for (const rota of config.rotas) {
    const modelo = rota.caminho.split('/').filter(Boolean)
    if (modelo.length !== partes.length) continue

    const parametros = {}
    const combina = modelo.every((pedaco, i) => {
      if (pedaco.startsWith(':')) {
        parametros[pedaco.slice(1)] = decodeURIComponent(partes[i])
        return true
      }
      return pedaco === partes[i]
    })
    if (combina) return { rota, parametros }
  }
  return null
}

async function abrir() {
  // Âncora comum (ex.: #conteudo) não é tela: a tela atual continua.
  // Na primeira abertura, ela vira a tela inicial.
  if (location.hash && !location.hash.startsWith('#/') && !primeiraTela) return

  const caminho = caminhoAtual()
  const achou = encontrar(caminho)

  const desvio = achou && config.guarda?.(achou.rota, caminho)
  if (desvio) {
    location.replace(`#${desvio}`) // replace: o "voltar" não cai de novo na tela bloqueada
    return
  }

  const { rota, parametros } = achou ?? { rota: { tela: config.naoEncontrada }, parametros: {} }
  const { tela } = rota

  // Cada tela ganha uma área nova. Se a pessoa trocar de tela antes de a anterior
  // terminar de carregar, a anterior escreve numa área que já saiu da página.
  const area = document.createElement('div')
  area.className = 'tela'
  config.alvo.replaceChildren(area)

  document.title = `${tela.titulo} | Prato Certo`
  window.scrollTo(0, 0)
  config.aoAbrir?.(caminho)

  let carregando
  try {
    carregando = tela.montar(area, parametros)
  } catch (erro) {
    carregando = Promise.reject(erro) // erro na parte que não é async: cai no aviso abaixo
  }

  // Leva o foco ao título da tela nova, para o leitor de tela anunciar a troca (RNF-02).
  // Na primeira tela, não: o foco fica no começo da página, como em qualquer site.
  const titulo = area.querySelector('h1')
  if (titulo && !primeiraTela) {
    titulo.setAttribute('tabindex', '-1')
    titulo.focus()
  }
  primeiraTela = false

  try {
    await carregando
  } catch (erro) {
    console.error(erro)
    area.insertAdjacentHTML(
      'beforeend',
      '<p class="aviso aviso--erro" role="alert">Algo deu errado ao abrir esta tela. Tente de novo em instantes.</p>',
    )
  }
}
