// Tela "Início" (#/): o que é o Prato Certo e como funciona. Aberta a todos.

import { icone } from '../lib/icone.js'
import { RESTRICOES } from '../lib/opcoes.js'

const PASSOS = [
  { icone: 'ajustes', titulo: 'Conte seus gostos', texto: 'Cozinhas preferidas, restrições e quanto quer gastar.' },
  { icone: 'relogio', titulo: 'Escolha o momento', texto: 'Almoço rápido, jantar romântico ou lanche econômico.' },
  { icone: 'prato', titulo: 'Receba a sugestão', texto: 'Com o motivo de cada uma. Depois, favorite e avalie.' },
]

export const inicio = {
  titulo: 'Início',

  montar(area) {
    area.classList.add('tela--cheia', 'inicio')
    area.innerHTML = `
      <section class="faixa faixa--suave" aria-labelledby="titulo-inicio">
        <h1 id="titulo-inicio">O que vou comer hoje?</h1>
        <p class="tela__intro">
          Conte do que você gosta, o que não pode comer e quanto quer gastar.
          O Prato Certo sugere pratos e restaurantes perto de você.
        </p>
        <div class="acoes">
          <a class="botao botao--primario botao--grande" href="#/criar-conta">${icone('usuario')} Criar conta</a>
          <a class="botao botao--grande" href="#/entrar">${icone('entrar')} Já tenho conta</a>
        </div>
      </section>

      <section class="faixa" aria-labelledby="titulo-como-funciona">
        <h2 id="titulo-como-funciona">Como funciona</h2>
        <ol class="cartoes passos" role="list">
          ${PASSOS.map(
            (passo) => `
              <li class="cartao">
                ${icone(passo.icone)}
                <h3>${passo.titulo}</h3>
                <p>${passo.texto}</p>
              </li>
            `,
          ).join('')}
        </ol>
      </section>

      <section class="faixa faixa--suave" aria-labelledby="titulo-restricoes">
        <h2 id="titulo-restricoes">Suas restrições vêm primeiro</h2>
        <p>Um prato que você não pode comer nunca aparece nas sugestões.</p>
        <ul class="selos">
          ${RESTRICOES.map((restricao) => `<li class="selo">${icone(restricao.icone)} ${restricao.nome}</li>`).join('')}
        </ul>
        <p class="nota-exemplo">
          Os restaurantes deste site são exemplos fictícios, criados para o projeto.
        </p>
      </section>
    `
  },
}
