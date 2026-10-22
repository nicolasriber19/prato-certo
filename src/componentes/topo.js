// Topo e navegação principal: marca o link da tela atual e mostra
// "Entrar" para visitantes ou a navegação e "Sair" para quem entrou.

// Links que valem para mais de um endereço: #/prato/12 conta como "Hoje".
const SECOES = {
  '/hoje': ['/hoje', '/prato/', '/restaurante/'],
  '/favoritos': ['/favoritos'],
  '/historico': ['/historico'],
  '/preferencias': ['/preferencias'],
}

export function marcarLinkAtual(caminho) {
  document.querySelectorAll('[data-navegacao] a').forEach((link) => {
    const destino = link.getAttribute('href').slice(1) // "#/hoje" → "/hoje"
    const comecos = SECOES[destino] ?? [destino]
    const atual = comecos.some((comeco) => caminho === comeco || caminho.startsWith(comeco))
    if (atual) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

// Até o passo 7 (login), o topo mostra tudo. Depois, main.js chama esta função
// sempre que a sessão mudar.
export function atualizarTopo(logado) {
  document.querySelectorAll('[data-so-logado]').forEach((item) => (item.hidden = !logado))
  document.querySelectorAll('[data-so-visitante]').forEach((item) => (item.hidden = logado))
}
