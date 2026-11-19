// Palco da história do Início: o prato parado no lugar que muda conforme a rolagem
// (CONTE → ESCOLHA → COMA). É só ilustração: fica dentro de um aria-hidden="true",
// e o texto de cada passo está no HTML da tela (telas/inicio.js).
//
// - anel de progresso: enche de dourado ao longo dos 3 passos, com as marcas 01, 02 e 03;
// - passo 1: os chips do perfil orbitam no anel e "pousam" na borda do prato;
// - passo 2: a hora de agora aparece grande no prato, e o destaque do seletor de momentos
//   desliza até o momento desta hora; a luz atrás do prato ganha a cor do momento;
// - passo 3: a comida aparece no prato (foto de componentes/prato-foto.js) e o cartão da sugestão entra.
//
// Tudo é guiado por variáveis CSS de 0 a 1 (styles/inicio.css), calculadas a cada rolagem.
// Com "reduzir movimento", cada passo mostra direto o seu estado final.

import { icone } from '../lib/icone.js'
import { momentoDaHora, nomeDoMomento } from '../lib/momento.js'
import { pratoFoto } from './prato-foto.js'

// Chips do passo 1, nas diagonais (em graus, a partir do alto, no sentido do relógio).
const CHIPS_DO_PERFIL = [
  { icone: 'folha', texto: 'Vegano', angulo: 315 },
  { icone: 'sem-gluten', texto: 'Sem glúten', angulo: 45 },
  { icone: 'coracao', texto: 'Italiana', angulo: 135 },
  { icone: 'moeda', texto: 'Até R$ 50', angulo: 225 },
]

// Seletor do passo 2, com os horários de momentoDaHora() (lib/momento.js).
const SEGMENTOS = [
  { momento: 'almoco_rapido', nome: 'Almoço', horas: '11h às 15h' },
  { momento: 'jantar_romantico', nome: 'Jantar', horas: '18h à 0h' },
  { momento: 'lanche_economico', nome: 'Lanche', horas: 'outros horários' },
]

// Medidas no desenho de 400 × 400 (o centro é 200, 200).
const CENTRO = 200
const RAIO_ANEL = 186

// Em % do tamanho do palco: onde os chips orbitam (no anel) e onde pousam (na borda do prato).
const ORBITA = 46.5
const POUSO = 39
const VOLTA_DOS_CHIPS = 40 // graus que os chips andam na órbita até pousar

function ponto(raio, graus) {
  const radianos = ((graus - 90) * Math.PI) / 180
  return [CENTRO + raio * Math.cos(radianos), CENTRO + raio * Math.sin(radianos)]
}

function anel() {
  const marcas = [0, 1, 2]
    .map((i) => {
      const [x, y] = ponto(RAIO_ANEL, i * 120)
      return `
        <g class="anel__marca" data-marca="${i + 1}">
          <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="15" />
          <text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle">0${i + 1}</text>
        </g>`
    })
    .join('')

  return `
    <svg class="palco__anel" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <circle class="anel__trilho" cx="${CENTRO}" cy="${CENTRO}" r="${RAIO_ANEL}" />
      <circle class="anel__progresso" cx="${CENTRO}" cy="${CENTRO}" r="${RAIO_ANEL}" pathLength="100"
        transform="rotate(-90 ${CENTRO} ${CENTRO})" />
      ${marcas}
    </svg>
  `
}

// agora: a data usada para a hora e o momento (nos testes, uma data fixa).
export function palcoHistoria(agora = new Date()) {
  const momento = momentoDaHora(agora)
  const horaTexto = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const alvo = SEGMENTOS.findIndex((s) => s.momento === momento)
  // O espaguete não é lanche: nesse momento, o segundo motivo do cartão é outro.
  const motivoDoMomento =
    momento === 'lanche_economico' ? 'Você gosta de comida italiana' : `Bom para ${nomeDoMomento(momento).toLowerCase()}`

  return `
    <div class="palco" data-palco data-passo="1" data-momento="${momento}" data-alvo="${alvo}">
      <div class="palco__centro">
        <div class="palco__prato">${pratoFoto({ montavel: true })}</div>
        ${anel()}
        <ul class="palco__chips">
          ${CHIPS_DO_PERFIL.map((c) => `<li data-angulo="${c.angulo}">${icone(c.icone)} ${c.texto}</li>`).join('')}
        </ul>
        <p class="palco__hora">
          <span class="palco__relogio">${horaTexto}</span>
          <span class="palco__momento">${nomeDoMomento(momento)}</span>
        </p>
      </div>

      <div class="palco__seletor">
        <span class="palco__seletor-destaque"></span>
        ${SEGMENTOS.map(
          (s, i) => `
            <span class="palco__segmento${i === alvo ? ' palco__segmento--agora' : ''}">
              <span class="palco__segmento-nome">${s.nome}</span>
              <span class="palco__segmento-horas">${s.horas}</span>
            </span>`,
        ).join('')}
      </div>

      <div class="palco__sugestao">
        <p class="palco__sugestao-nome">Espaguete ao pomodoro</p>
        <p class="palco__motivo" style="--i: 0">${icone('confere')} Vegano</p>
        <p class="palco__motivo" style="--i: 1">${icone('confere')} ${motivoDoMomento}</p>
        <p class="palco__motivo" style="--i: 2">${icone('confere')} A 300 m</p>
      </div>
    </div>
  `
}

// Posição de um chip em % do palco, a partir do ângulo (graus, do alto, no sentido do relógio) e do raio.
// O chip nunca passa da borda do palco: no celular, o palco tem a largura da tela, e um chip
// na órbita, de lado, ficaria cortado.
function posicionar(chip, angulo, raio, lado) {
  const radianos = (angulo * Math.PI) / 180
  const meiaLargura = (chip.offsetWidth / 2 / lado) * 100
  const meiaAltura = (chip.offsetHeight / 2 / lado) * 100
  const x = Math.min(Math.max(50 + raio * Math.sin(radianos), meiaLargura), 100 - meiaLargura)
  const y = Math.min(Math.max(50 - raio * Math.cos(radianos), meiaAltura), 100 - meiaAltura)
  chip.style.left = `${x.toFixed(2)}%`
  chip.style.top = `${y.toFixed(2)}%`
}

// Liga o palco à rolagem. passos: os <li> dos passos (cada um com um .passo-historia__verbo).
// Devolve uma função que desliga tudo (o roteador chama ao sair da tela).
export function ligarPalco(palco, passos, { semMovimento }) {
  const computador = matchMedia('(min-width: 960px)')
  const verbos = passos.map((passo) => passo.querySelector('.passo-historia__verbo'))
  const chips = [...palco.querySelectorAll('.palco__chips li')]
  const centro = palco.querySelector('.palco__centro')
  const alvo = Number(palco.dataset.alvo)
  const limitar = (valor) => Math.min(Math.max(valor, 0), 1)
  const definir = (nome, valor) => palco.style.setProperty(nome, valor.toFixed(3))

  function atualizar() {
    // O passo ativo é o último cujo verbo já passou desta linha: no computador, o meio da tela;
    // no celular, logo abaixo do palco, que ocupa a metade de cima.
    const linha = innerHeight * (computador.matches ? 0.5 : 0.62)
    const topo = verbos.map((verbo) => verbo.getBoundingClientRect().top)
    let indice = 0
    topo.forEach((t, i) => {
      if (t <= linha) indice = i
    })

    // Quanto de cada passo já foi rolado (0 a 1). O 3º termina 35% da tela depois do verbo.
    const fim3 = innerHeight * 0.35
    let p1 = limitar((linha - topo[0]) / (topo[1] - topo[0]))
    let p2 = limitar((linha - topo[1]) / (topo[2] - topo[1]))
    let p3 = limitar((linha - topo[2]) / fim3)
    let geral = limitar((linha - topo[0]) / (topo[2] - topo[0] + fim3))
    if (semMovimento()) {
      // Sem movimento: cada passo aparece pronto, sem acompanhar a rolagem.
      p1 = 1
      p2 = indice >= 1 ? 1 : 0
      p3 = indice >= 2 ? 1 : 0
      geral = (indice + 1) / 3
    }

    // Anel de progresso
    definir('--progresso', geral)

    // Passo 1: os chips andam pela órbita e pousam na borda do prato
    const lado = centro.clientWidth
    chips.forEach((chip) => {
      const angulo = Number(chip.dataset.angulo) - VOLTA_DOS_CHIPS * (1 - p1)
      posicionar(chip, angulo, ORBITA - (ORBITA - POUSO) * p1, lado)
    })
    definir('--pouso', p1)

    // Passo 2: o destaque do seletor desliza do 1º momento até o de agora (na primeira
    // metade do passo); depois, o momento de agora acende e a luz do prato ganha a cor dele.
    definir('--seletor', alvo * limitar(p2 / 0.6))
    definir('--acende', limitar((p2 - 0.55) / 0.3))

    // Passo 3: a comida aparece no prato, depois entram o cartão e os motivos
    const faixa = (de, ate) => limitar((p3 - de) / (ate - de))
    definir('--massa', faixa(0, 0.6))
    definir('--cartao', faixa(0.6, 0.8))
    definir('--motivos', faixa(0.75, 1))

    const numero = String(indice + 1)
    if (palco.dataset.passo !== numero) palco.dataset.passo = numero
    passos.forEach((passo, i) => passo.classList.toggle('passo-historia--ativo', i === indice))
  }

  window.addEventListener('scroll', atualizar, { passive: true })
  window.addEventListener('resize', atualizar)
  atualizar()
  return () => {
    window.removeEventListener('scroll', atualizar)
    window.removeEventListener('resize', atualizar)
  }
}
