// Página principal: importa os estilos e liga o roteador das telas.
// Cada tela fica num arquivo de src/telas/ e é um objeto { titulo, montar }.

import './styles/tokens.css'
import './styles/base.css'
import './styles/telas.css'

import { iniciarRotas } from './lib/rotas.js'
import { marcarLinkAtual } from './componentes/topo.js'
import { emConstrucao } from './telas/em-construcao.js'
import { inicio } from './telas/inicio.js'
import { guia } from './telas/guia.js'
import { naoEncontrada } from './telas/nao-encontrada.js'

// exigeLogin: quem não entrou vai para "Entrar". A guarda é ligada no passo 7.
const rotas = [
  { caminho: '/', tela: inicio },
  { caminho: '/entrar', tela: emConstrucao('Entrar', 'Entre com seu e-mail e sua senha.', 7) },
  { caminho: '/criar-conta', tela: emConstrucao('Criar conta', 'Crie sua conta com e-mail e senha.', 7) },
  {
    caminho: '/preferencias',
    tela: emConstrucao('Suas preferências', 'Gostos, restrições, orçamento e bairro.', 8),
    exigeLogin: true,
  },
  {
    caminho: '/hoje',
    tela: emConstrucao('O que vou comer hoje?', 'Escolha o momento e receba sugestões.', 10),
    exigeLogin: true,
  },
  { caminho: '/prato/:id', tela: emConstrucao('Prato', 'Detalhes do prato.', 10), exigeLogin: true },
  {
    caminho: '/restaurante/:id',
    tela: emConstrucao('Restaurante', 'Detalhes do restaurante.', 11),
    exigeLogin: true,
  },
  { caminho: '/favoritos', tela: emConstrucao('Favoritos', 'Pratos e restaurantes que você salvou.', 12), exigeLogin: true },
  { caminho: '/historico', tela: emConstrucao('Minhas escolhas', 'O que você escolheu e as suas notas.', 13), exigeLogin: true },
  { caminho: '/privacidade', tela: emConstrucao('Privacidade', 'Quais dados guardamos e para quê.', 16) },
  { caminho: '/guia', tela: guia },
]

// "Pular para o conteúdo" leva o foco ao <main> sem mudar o endereço,
// para não confundir o roteador nem o botão "voltar".
document.querySelector('[data-pular]').addEventListener('click', (evento) => {
  evento.preventDefault()
  document.querySelector('#conteudo').focus()
})

iniciarRotas({
  rotas,
  alvo: document.querySelector('#conteudo'),
  naoEncontrada,
  aoAbrir: marcarLinkAtual,
})
