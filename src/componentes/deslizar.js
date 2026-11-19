// Cartão que desliza (tela Hoje): arrastar para a direita = "Quero este"; para a esquerda = "Pular".
//
// Três jeitos de fazer a mesma coisa (heurística "flexibilidade e eficiência de uso"):
// - gesto de arrastar, com o dedo ou o mouse;
// - setas ← e → do teclado, com o cartão em foco;
// - os botões "Pular" e "Quero este", embaixo do cartão (o jeito mais óbvio, para todo mundo).
// Enquanto arrasta, um selo "Quero" ou "Pular" aparece (visibilidade do estado do sistema).
//
// No celular, arrastar para cima e para baixo continua rolando a página (touch-action: pan-y no CSS).

const LIMITE_PX = 110 // quanto arrastar para valer...
const LIMITE_FRACAO = 0.3 // ...ou 30% da largura do cartão, o que for menor
const INICIO_DO_GESTO = 8 // px: abaixo disso, ainda é um toque, não um arrasto

function semMovimento() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

function tempoMedioMs() {
  return (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tempo-medio')) || 0) * 1000
}

// cartao: o elemento que se move. aoDireita / aoEsquerda: o que fazer quando o gesto vale.
export function ligarDeslizar(cartao, { aoDireita, aoEsquerda }) {
  let inicioX = null
  let inicioY = 0
  let ponteiro = null
  let arrastando = false
  let deslocamento = 0

  function mover(x) {
    deslocamento = x
    const forca = Math.min(Math.abs(x) / LIMITE_PX, 1)
    cartao.style.transform = x === 0 ? '' : `translateX(${x}px) rotate(${x / 20}deg)`
    cartao.style.setProperty('--forca-quero', x > 0 ? forca : 0)
    cartao.style.setProperty('--forca-pular', x < 0 ? forca : 0)
  }

  // O cartão sai voando para o lado e só então a ação acontece.
  // Com "reduzir movimento", a ação acontece na hora, sem voo.
  let saiu = false // um cartão só sai uma vez (evita escolher duas vezes num toque duplo)

  function sair(direcao) {
    if (saiu) return
    saiu = true
    const acao = direcao > 0 ? aoDireita : aoEsquerda
    if (semMovimento()) {
      acao()
      return
    }
    cartao.classList.remove('deslizavel--arrastando')
    cartao.classList.add('deslizavel--saindo')
    mover(direcao * Math.max(window.innerWidth, 600))
    setTimeout(acao, tempoMedioMs())
  }

  // O gesto também começa em cima dos links (nome do prato, restaurante), que ocupam boa
  // parte do cartão. Para isso, o link não pode ser "arrastável" pelo navegador...
  cartao.querySelectorAll('a').forEach((link) => (link.draggable = false))
  // ...e o clique que vem logo depois de um arrasto não pode abrir o link.
  let acabouDeArrastar = false
  cartao.addEventListener(
    'click',
    (evento) => {
      if (!acabouDeArrastar) return
      evento.preventDefault()
      evento.stopPropagation()
      acabouDeArrastar = false
    },
    true,
  )

  cartao.addEventListener('pointerdown', (evento) => {
    // Botões dentro do cartão (ex.: Favoritar) continuam funcionando normalmente.
    if (evento.button !== 0 || evento.target.closest('button, input, textarea, label, summary')) return
    inicioX = evento.clientX
    inicioY = evento.clientY
    ponteiro = evento.pointerId
    arrastando = false
  })

  cartao.addEventListener('pointermove', (evento) => {
    if (inicioX === null || evento.pointerId !== ponteiro) return
    const x = evento.clientX - inicioX
    const y = evento.clientY - inicioY
    if (!arrastando) {
      if (Math.abs(x) < INICIO_DO_GESTO) return
      // Mais vertical do que horizontal: a pessoa quer rolar a página, não arrastar.
      if (Math.abs(y) > Math.abs(x)) {
        inicioX = null
        return
      }
      arrastando = true
      cartao.setPointerCapture(ponteiro)
      cartao.classList.add('deslizavel--arrastando')
    }
    mover(x)
  })

  function soltar() {
    if (inicioX === null) return
    inicioX = null
    if (!arrastando) return
    arrastando = false
    acabouDeArrastar = true
    setTimeout(() => (acabouDeArrastar = false), 0) // só o clique deste mesmo gesto é ignorado
    cartao.classList.remove('deslizavel--arrastando')
    const limite = Math.min(LIMITE_PX, cartao.offsetWidth * LIMITE_FRACAO)
    if (deslocamento > limite) sair(1)
    else if (deslocamento < -limite) sair(-1)
    else mover(0) // não chegou no limite: volta para o lugar
  }

  cartao.addEventListener('pointerup', soltar)
  cartao.addEventListener('pointercancel', () => {
    inicioX = null
    arrastando = false
    cartao.classList.remove('deslizavel--arrastando')
    mover(0)
  })

  // Setas do teclado, só com o foco no próprio cartão (não nos botões de dentro).
  cartao.addEventListener('keydown', (evento) => {
    if (evento.target !== cartao) return
    if (evento.key === 'ArrowRight') {
      evento.preventDefault()
      sair(1)
    }
    if (evento.key === 'ArrowLeft') {
      evento.preventDefault()
      sair(-1)
    }
  })

  // Para os botões "Pular" e "Quero este": o mesmo voo do gesto.
  return { pular: () => sair(-1), querer: () => sair(1) }
}
