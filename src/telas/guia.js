// Tela "Guia de estilo" (#/guia): mostra cores, letras, botões, chips, selos e ícones
// num só lugar. Serve para conferir a identidade visual (passo 6) e o contraste.
// Não aparece na navegação: abra pelo endereço #/guia.

import { icone } from '../lib/icone.js'
import { chip, ligarChips } from '../componentes/chips.js'
import { RESTRICOES, ORCAMENTOS } from '../lib/opcoes.js'
import { MOMENTOS } from '../lib/momento.js'

const CORES = [
  ['--cor-primaria', 'Primária'],
  ['--cor-primaria-escura', 'Primária escura'],
  ['--cor-destaque', 'Destaque'],
  ['--cor-sucesso', 'Sucesso'],
  ['--cor-sucesso-fundo', 'Fundo de sucesso'],
  ['--cor-texto', 'Texto'],
  ['--cor-texto-suave', 'Texto suave'],
  ['--cor-fundo-suave', 'Fundo suave'],
  ['--cor-borda', 'Borda'],
  ['--cor-foco', 'Foco'],
  ['--cor-erro', 'Erro'],
]

const ICONES = [
  'prato', 'casa', 'coracao', 'coracao-cheio', 'relogio', 'ajustes', 'entrar', 'sair', 'usuario',
  'voltar', 'raio', 'taca', 'moeda', 'folha', 'broto', 'sem-gluten', 'sem-lactose', 'estrela',
  'estrela-cheia', 'restaurante', 'pino', 'localizacao', 'outra', 'lupa', 'confere', 'escudo',
  'lixeira', 'alerta',
]

export const guia = {
  titulo: 'Guia de estilo',

  montar(area) {
    const estilo = getComputedStyle(document.documentElement)

    area.classList.add('guia')
    area.innerHTML = `
      <h1>Guia de estilo</h1>
      <p class="tela__intro">As peças da interface do Prato Certo, num só lugar.</p>

      <section aria-labelledby="guia-cores">
        <h2 id="guia-cores">Cores</h2>
        <ul class="guia__cores">
          ${CORES.map(
            ([variavel, nome]) => `
              <li class="guia__cor">
                <span class="guia__amostra" style="background: var(${variavel})"></span>
                <strong>${nome}</strong>
                <code>${estilo.getPropertyValue(variavel).trim()}</code>
              </li>
            `,
          ).join('')}
        </ul>
      </section>

      <section aria-labelledby="guia-letras">
        <h2 id="guia-letras">Letras</h2>
        <p style="font-size: 2rem; font-weight: 700; margin: 0">Título da tela (h1)</p>
        <p style="font-size: 1.625rem; font-weight: 700; margin: 0">Título de seção (h2)</p>
        <p style="font-size: 1.25rem; font-weight: 700">Título de cartão (h3)</p>
        <p>Texto corrido: 18 px, acima do mínimo de 16 px (RNF-10).</p>
        <p class="tela__intro">Texto de introdução, em cor suave.</p>
      </section>

      <section aria-labelledby="guia-botoes">
        <h2 id="guia-botoes">Botões</h2>
        <div class="acoes">
          <button type="button" class="botao botao--primario">${icone('prato')} Me sugira</button>
          <button type="button" class="botao">${icone('outra')} Outra sugestão</button>
          <button type="button" class="botao botao--primario botao--grande">${icone('usuario')} Criar conta</button>
        </div>
      </section>

      <section aria-labelledby="guia-chips">
        <h2 id="guia-chips">Chips</h2>
        <p>Vários ligados ao mesmo tempo:</p>
        <div class="chips" data-chips-multiplos>
          ${RESTRICOES.map((r, i) => chip({ valor: r.id, texto: r.nome, nomeDoIcone: r.icone, ligado: i === 0 })).join('')}
        </div>
        <p>Um por vez:</p>
        <div class="chips" data-chips-um>
          ${MOMENTOS.map((m, i) => chip({ valor: m.id, texto: m.nome, nomeDoIcone: m.icone, ligado: i === 0 })).join('')}
        </div>
        <div class="chips" data-chips-um style="margin-top: 8px">
          ${ORCAMENTOS.map((o, i) => chip({ valor: String(o.valor), texto: o.nome, ligado: i === 1 })).join('')}
        </div>
      </section>

      <section aria-labelledby="guia-selos">
        <h2 id="guia-selos">Selos de restrição</h2>
        <ul class="selos">
          ${RESTRICOES.map((r) => `<li class="selo">${icone(r.icone)} ${r.nome}</li>`).join('')}
        </ul>
      </section>

      <section aria-labelledby="guia-avisos">
        <h2 id="guia-avisos">Avisos e cartões</h2>
        <p class="aviso">${icone('alerta')} Nada no seu orçamento. Veja opções um pouco acima.</p>
        <p class="aviso aviso--erro">${icone('alerta')} E-mail ou senha incorretos.</p>
        <ul class="cartoes" style="margin-top: 16px">
          <li class="cartao">
            <h3>Espaguete ao pomodoro</h3>
            <p>Cantina Nonna Lia · R$ 39,00</p>
            <ul class="selos"><li class="selo">${icone('folha')} Vegano</li></ul>
          </li>
        </ul>
      </section>

      <section aria-labelledby="guia-icones">
        <h2 id="guia-icones">Ícones</h2>
        <ul class="guia__icones">
          ${ICONES.map((nome) => `<li>${icone(nome)}<code>${nome}</code></li>`).join('')}
        </ul>
      </section>
    `

    ligarChips(area.querySelector('[data-chips-multiplos]'))
    area.querySelectorAll('[data-chips-um]').forEach((grupo) => ligarChips(grupo, { multiplo: false }))
  },
}
