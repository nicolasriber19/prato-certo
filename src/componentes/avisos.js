// Avisos flutuantes ("toasts"), com o botão "Desfazer" quando a ação pode voltar atrás.
//
// Heurísticas de Nielsen atendidas (docs/heuristicas.md):
// - Visibilidade do estado do sistema: toda ação importante tem um retorno na hora.
// - Controle e liberdade: "Desfazer" corrige um toque sem querer, sem pedir confirmação antes.
//
// Acessibilidade:
// - A área dos avisos é "aria-live": o leitor de tela lê o aviso sem tirar o foco do lugar.
// - O aviso não some enquanto o mouse estiver em cima ou o foco estiver nele (WCAG 2.2.1).
// - Ctrl+Z (ou Cmd+Z) desfaz o último aviso, quando o foco não está num campo de texto.

import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'

const DURACAO_PADRAO = 7000
const MAXIMO_NA_TELA = 3

let ultimoDesfazer = null // o "Desfazer" do aviso mais novo, para o Ctrl+Z

function area() {
  return document.querySelector('[data-avisos]')
}

function fechar(aviso) {
  if (!aviso.isConnected || aviso.dataset.saindo) return
  aviso.dataset.saindo = 'sim'
  clearTimeout(aviso._tempo)
  if (ultimoDesfazer?.aviso === aviso) ultimoDesfazer = null
  // Espera a animação de saída (que vira 0 s com "reduzir movimento").
  const tempo = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--tempo-medio')) || 0
  aviso.classList.add('aviso-flutuante--saindo')
  setTimeout(() => aviso.remove(), tempo * 1000)
}

function agendarFechamento(aviso, duracao) {
  clearTimeout(aviso._tempo)
  aviso._tempo = setTimeout(() => fechar(aviso), duracao)
}

// texto: o que aconteceu ("Adicionado aos favoritos.")
// desfazer: função async que volta a ação atrás (opcional)
// tipo: 'sucesso' | 'erro' | 'info'
export function avisar(texto, { desfazer, tipo = 'sucesso', duracao = DURACAO_PADRAO } = {}) {
  const lugar = area()
  if (!lugar) return

  // Muitos avisos de uma vez viram ruído: fica só o mais recente de cada leva.
  const abertos = lugar.querySelectorAll('.aviso-flutuante:not([data-saindo])')
  if (abertos.length >= MAXIMO_NA_TELA) fechar(abertos[0])

  const nomeDoIcone = { sucesso: 'confere', erro: 'alerta', info: 'alerta' }[tipo]
  const aviso = document.createElement('div')
  aviso.className = `aviso-flutuante aviso-flutuante--${tipo}`
  aviso.innerHTML = `
    ${icone(nomeDoIcone)}
    <p class="aviso-flutuante__texto">${escapar(texto)}</p>
    ${desfazer ? `<button type="button" class="aviso-flutuante__desfazer" data-desfazer>Desfazer</button>` : ''}
    <button type="button" class="aviso-flutuante__fechar" data-fechar aria-label="Fechar aviso">×</button>
  `
  lugar.append(aviso)

  aviso.querySelector('[data-fechar]').addEventListener('click', () => fechar(aviso))

  if (desfazer) {
    const executar = async () => {
      if (aviso.dataset.desfeito) return
      aviso.dataset.desfeito = 'sim'
      clearTimeout(aviso._tempo)
      try {
        await desfazer()
        aviso.querySelector('.aviso-flutuante__texto').textContent = 'Pronto, desfeito.'
      } catch (erro) {
        console.error(erro)
        aviso.querySelector('.aviso-flutuante__texto').textContent = 'Não deu para desfazer. Tente de novo.'
      }
      aviso.querySelector('[data-desfazer]')?.remove()
      agendarFechamento(aviso, 2500)
    }
    aviso.querySelector('[data-desfazer]').addEventListener('click', executar)
    ultimoDesfazer = { aviso, executar }
  }

  // Pausa enquanto a pessoa estiver lendo ou usando o aviso.
  const pausar = () => clearTimeout(aviso._tempo)
  const retomar = () => {
    if (!aviso.matches(':hover') && !aviso.contains(document.activeElement)) agendarFechamento(aviso, 3000)
  }
  aviso.addEventListener('mouseenter', pausar)
  aviso.addEventListener('focusin', pausar)
  aviso.addEventListener('mouseleave', retomar)
  aviso.addEventListener('focusout', retomar)

  agendarFechamento(aviso, duracao)
}

// Ctrl+Z / Cmd+Z desfaz o último aviso (atalho para quem usa o teclado).
// Em campos de texto, o Ctrl+Z continua sendo o do navegador.
document.addEventListener('keydown', (evento) => {
  const atalho = (evento.ctrlKey || evento.metaKey) && !evento.shiftKey && evento.key.toLowerCase() === 'z'
  if (!atalho || !ultimoDesfazer) return
  if (evento.target.closest('input, textarea, [contenteditable="true"]')) return
  evento.preventDefault()
  ultimoDesfazer.executar()
})
