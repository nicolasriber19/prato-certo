// Tela "Início" (#/): a apresentação do Prato Certo, contada pela rolagem ("scrollytelling").
//
// 1. Capa: título gigante em volta da foto do prato (componentes/prato-foto.js).
// 2. História: o prato fica parado no lugar enquanto os passos passam
//    (CONTE → ESCOLHA → COMA), e muda junto com a rolagem (componentes/palco-historia.js).
// 3. Restrições, 4. números, 5. prévia do cartão que desliza, 6. chamada final.
//
// Acessibilidade: o texto de cada passo está no HTML, na ordem certa; o palco é só ilustração
// (aria-hidden). Com "reduzir movimento", as trocas acontecem sem animação.
// Aberta a todos.

import { icone } from '../lib/icone.js'
import { RESTRICOES } from '../lib/opcoes.js'
import { estaLogado } from '../lib/sessao.js'
import { pratoFoto } from '../componentes/prato-foto.js'
import { palcoHistoria, ligarPalco } from '../componentes/palco-historia.js'
import { cardPrato } from '../componentes/card-prato.js'
import { ligarDeslizar } from '../componentes/deslizar.js'
import { avisar } from '../componentes/avisos.js'

const PASSOS = [
  {
    verbo: 'Conte',
    texto: 'Do que você gosta, o que não pode comer e quanto quer gastar. Tudo em toques, sem digitar.',
  },
  {
    verbo: 'Escolha',
    texto: 'O momento: almoço rápido, jantar romântico ou lanche econômico. Ele já vem marcado pela hora do dia.',
  },
  {
    verbo: 'Coma',
    texto: 'Uma sugestão por vez, com o porquê. Gostou? Arraste para a direita. Não? Para a esquerda.',
  },
]

const NUMEROS = [
  { valor: 4, texto: 'restrições respeitadas, sempre' },
  { valor: 3, texto: 'momentos do dia' },
  { valor: 3, texto: 'motivos em cada sugestão' },
  { valor: 0, texto: 'rastreadores e anúncios' },
]

// Pratos de exemplo para a prévia do cartão (os mesmos ids do catálogo de exemplo).
const PREVIA = [
  {
    prato: { id: 3, nome: 'Espaguete ao pomodoro', preco: 39, tempo_preparo_min: 20, tags: ['vegano', 'vegetariano', 'sem_lactose'] },
    restaurante: { id: 1, nome: 'Cantina Nonna Lia', bairro: 'Asa Sul' },
    distanciaKm: 0.3,
    motivos: ['Vegano', 'Bom para jantar romântico', 'Você gosta de comida italiana'],
  },
  {
    prato: { id: 29, nome: 'Tacos de carnitas (3)', preco: 36, tempo_preparo_min: 15, tags: ['sem_gluten', 'sem_lactose'] },
    restaurante: { id: 8, nome: 'Taquería Pequi', bairro: 'Lago Sul' },
    distanciaKm: 4.5,
    motivos: ['Sem glúten', 'Bom para almoço rápido', 'A 4,5 km'],
  },
  {
    prato: { id: 34, nome: 'Curry de grão-de-bico', preco: 46, tempo_preparo_min: 20, tags: ['vegano', 'vegetariano', 'sem_gluten', 'sem_lactose'] },
    restaurante: { id: 9, nome: 'Curry do Lago', bairro: 'Lago Norte' },
    distanciaKm: 9.8,
    motivos: ['Vegano e sem glúten', 'Bom para jantar romântico', 'Nota média 4,8'],
  },
]

function semMovimento() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}

function botoesDeEntrada() {
  return estaLogado()
    ? `<a class="botao botao--ouro botao--grande" href="#/hoje">${icone('prato')} Ver sugestões de hoje</a>`
    : `<a class="botao botao--ouro botao--grande" href="#/criar-conta">${icone('usuario')} Criar conta</a>
       <a class="botao botao--grande" href="#/entrar">${icone('entrar')} Já tenho conta</a>`
}

export const inicio = {
  titulo: 'Início',

  montar(area) {
    area.classList.add('tela--cheia', 'inicio')
    area.innerHTML = `
      <section class="capa-escura" aria-labelledby="titulo-inicio">
        <p class="rotulo">Prato Certo · Brasília</p>
        <h1 id="titulo-inicio" class="capa-escura__titulo">
          <span class="capa-escura__linha">O que vou</span>
          <span class="capa-escura__prato" aria-hidden="true">${pratoFoto({ prioridade: true })}</span>
          <span class="capa-escura__linha">comer <span class="destaque-dourado">hoje?</span></span>
        </h1>
        <div class="capa-escura__rodape">
          <p class="capa-escura__texto">
            Conte seus gostos, suas restrições e quanto quer gastar. O Prato Certo sugere pratos e
            restaurantes perto de você, e explica o porquê.
          </p>
          <div class="acoes">${botoesDeEntrada()}</div>
        </div>
        <p class="capa-escura__rolar" aria-hidden="true">Role para ver como funciona ↓</p>
      </section>

      <section class="historia" aria-labelledby="titulo-historia">
        <div class="historia__palco" aria-hidden="true">
          ${palcoHistoria()}
        </div>

        <div class="historia__passos">
          <p class="rotulo">Como funciona</p>
          <h2 id="titulo-historia" class="historia__titulo">Três toques até o prato certo</h2>
          <ol class="historia__lista" role="list">
            ${PASSOS.map(
              (passo, i) => `
                <li class="passo-historia" data-passo="${i + 1}">
                  <p class="passo-historia__numero">0${i + 1}</p>
                  <h3 class="passo-historia__verbo">${passo.verbo}</h3>
                  <p class="passo-historia__texto">${passo.texto}</p>
                </li>
              `,
            ).join('')}
          </ol>
        </div>
      </section>

      <section class="faixa faixa-restricoes" aria-labelledby="titulo-restricoes">
        <p class="rotulo">Sem exceção</p>
        <h2 id="titulo-restricoes">Suas restrições vêm primeiro</h2>
        <p class="tela__intro">Um prato que você não pode comer nunca aparece nas sugestões.</p>
        <ul class="selos selos--grandes">
          ${RESTRICOES.map((restricao) => `<li class="selo">${icone(restricao.icone)} ${restricao.nome}</li>`).join('')}
        </ul>
      </section>

      <section class="faixa numeros" aria-labelledby="titulo-numeros">
        <h2 id="titulo-numeros" class="visualmente-oculto">O Prato Certo em números</h2>
        <dl class="numeros__lista">
          ${NUMEROS.map(
            (n) => `
              <div class="numeros__item">
                <dt class="numeros__texto">${n.texto}</dt>
                <dd class="numeros__valor" data-numero="${n.valor}">${n.valor}</dd>
              </div>
            `,
          ).join('')}
        </dl>
      </section>

      <section class="faixa previa" aria-labelledby="titulo-previa">
        <div class="previa__texto">
          <p class="rotulo">Experimente</p>
          <h2 id="titulo-previa">Deslize para decidir</h2>
          <p class="tela__intro">
            Arraste o cartão: para a direita, você quer; para a esquerda, vem o próximo.
            No teclado, use as setas. Esta é só uma prévia.
          </p>
        </div>
        <div class="previa__baralho">
          <div class="baralho" data-previa></div>
          <div class="controles-baralho controles-baralho--dois">
            <button type="button" class="botao botao--grande" data-previa-pular>${icone('outra')} Pular</button>
            <button type="button" class="botao botao--primario botao--grande" data-previa-quero>${icone('confere')} Quero este</button>
          </div>
        </div>
      </section>

      <section class="faixa chamada" aria-labelledby="titulo-chamada">
        <h2 id="titulo-chamada">Pronto para decidir?</h2>
        <div class="acoes">${botoesDeEntrada()}</div>
        <p class="nota-exemplo">Os restaurantes deste site são exemplos fictícios, criados para o projeto.</p>
      </section>
    `

    const palco = area.querySelector('[data-palco]')
    const passos = [...area.querySelectorAll('.passo-historia')]
    const desligar = [ligarPalco(palco, passos, { semMovimento }), ligarNumeros(area), ligarPrevia(area)]
    return () => desligar.forEach((parar) => parar())
  },
}

// Os números contam de 0 até o valor quando aparecem na tela (sem isso com "reduzir movimento").
// O valor certo já está no HTML: se a animação não rodar, o número continua certo.
function ligarNumeros(area) {
  const numeros = [...area.querySelectorAll('[data-numero]')]
  if (semMovimento()) return () => {}

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue
        observador.unobserve(entrada.target)
        const alvo = Number(entrada.target.dataset.numero)
        const inicio = performance.now()
        const passo = (agora) => {
          const t = Math.min((agora - inicio) / 900, 1)
          entrada.target.textContent = String(Math.round(alvo * (1 - (1 - t) ** 3)))
          if (t < 1) requestAnimationFrame(passo)
        }
        requestAnimationFrame(passo)
      }
    },
    { threshold: 0.6 },
  )
  numeros.forEach((n) => observador.observe(n))
  return () => observador.disconnect()
}

// Prévia do cartão que desliza, com pratos de exemplo. Não grava nada.
function ligarPrevia(area) {
  const lugar = area.querySelector('[data-previa]')
  let indice = 0
  let atual = null

  function desenhar() {
    // Se o foco estava no cartão (setas do teclado), ele passa para o cartão novo.
    const focar = Boolean(document.activeElement?.closest?.('[data-previa]'))
    const sugestao = PREVIA[indice % PREVIA.length]
    lugar.innerHTML = `
      <div class="deslizavel" tabindex="0" role="group" aria-roledescription="cartão"
        aria-label="Prévia: ${sugestao.prato.nome}" data-deslizavel>
        <span class="selo-deslize selo-deslize--quero" aria-hidden="true">${icone('confere')} Quero</span>
        <span class="selo-deslize selo-deslize--pular" aria-hidden="true">${icone('outra')} Pular</span>
        ${cardPrato(sugestao, { destaque: true, comEscolha: false, acoes: false })}
      </div>
    `
    const cartao = lugar.querySelector('[data-deslizavel]')
    atual = ligarDeslizar(cartao, {
      aoEsquerda: () => {
        indice += 1
        desenhar()
      },
      aoDireita: () => {
        indice += 1
        desenhar()
        avisar(
          estaLogado()
            ? 'Boa! Em "Hoje", as sugestões são as suas de verdade.'
            : 'Boa! Crie sua conta para receber as suas sugestões de verdade.',
          { tipo: 'info' },
        )
      },
    })
    if (focar) cartao.focus()
  }

  area.querySelector('[data-previa-pular]').addEventListener('click', () => atual?.pular())
  area.querySelector('[data-previa-quero]').addEventListener('click', () => atual?.querer())
  desenhar()
  return () => {}
}
