// Página principal: importa os estilos, descobre quem está logado e liga o roteador.
// Cada tela fica num arquivo de src/telas/ e é um objeto { titulo, montar }.

import './styles/tokens.css'
import './styles/base.css'
import './styles/telas.css'
import './styles/animacao.css'

import { modoDemonstracao } from './lib/supabase.js'
import { iniciarSessao, estaLogado, aoMudarSessao, sair } from './lib/sessao.js'
import { iniciarRotas, irPara } from './lib/rotas.js'
import { marcarLinkAtual, atualizarTopo } from './componentes/topo.js'
import { inicio } from './telas/inicio.js'
import { entrar, criarConta } from './telas/entrar.js'
import { preferencias } from './telas/preferencias.js'
import { hoje } from './telas/hoje.js'
import { detalhePrato, detalheRestaurante } from './telas/detalhe.js'
import { favoritos } from './telas/favoritos.js'
import { historico } from './telas/historico.js'
import { privacidade } from './telas/privacidade.js'
import { guia } from './telas/guia.js'
import { naoEncontrada } from './telas/nao-encontrada.js'

// exigeLogin: quem não entrou vai para "Entrar".
// soVisitante: quem já entrou vai direto para "Hoje".
const rotas = [
  { caminho: '/', tela: inicio },
  { caminho: '/entrar', tela: entrar, soVisitante: true },
  { caminho: '/criar-conta', tela: criarConta, soVisitante: true },
  { caminho: '/preferencias', tela: preferencias, exigeLogin: true },
  { caminho: '/hoje', tela: hoje, exigeLogin: true },
  { caminho: '/prato/:id', tela: detalhePrato, exigeLogin: true },
  { caminho: '/restaurante/:id', tela: detalheRestaurante, exigeLogin: true },
  { caminho: '/favoritos', tela: favoritos, exigeLogin: true },
  { caminho: '/historico', tela: historico, exigeLogin: true },
  { caminho: '/privacidade', tela: privacidade },
  { caminho: '/guia', tela: guia },
]

function guarda(rota, caminho) {
  if (rota.exigeLogin && !estaLogado()) return `/entrar?volta=${encodeURIComponent(caminho)}`
  if (rota.soVisitante && estaLogado()) return '/hoje'
  return null
}

// "Pular para o conteúdo" leva o foco ao <main> sem mudar o endereço,
// para não confundir o roteador nem o botão "voltar".
document.querySelector('[data-pular]').addEventListener('click', (evento) => {
  evento.preventDefault()
  document.querySelector('#conteudo').focus()
})

document.querySelector('[data-sair]').addEventListener('click', () => sair())

document.querySelector('[data-aviso-demo]').hidden = !modoDemonstracao

await iniciarSessao()
atualizarTopo(estaLogado())

aoMudarSessao(() => {
  atualizarTopo(estaLogado())
  if (!estaLogado()) irPara('/')
})

iniciarRotas({
  rotas,
  alvo: document.querySelector('#conteudo'),
  naoEncontrada,
  guarda,
  aoAbrir: marcarLinkAtual,
})
