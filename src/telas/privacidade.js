// Tela "Privacidade" (#/privacidade) (RF-12): quais dados guardamos, para quê e com quem.
// Para quem entrou, tem o botão "Apagar meus dados", com confirmação.
// Texto de projeto acadêmico: antes de uso real, precisa de revisão jurídica [LGPD: confirmar].

import { modoDemonstracao } from '../lib/supabase.js'
import { estaLogado } from '../lib/sessao.js'
import { apagarMeusDados } from '../dados/meus-dados.js'
import { anunciar } from '../lib/anunciar.js'
import { icone } from '../lib/icone.js'

const ONDE = modoDemonstracao
  ? 'No modo demonstração, tudo fica só neste navegador. Nada vai para a internet.'
  : 'Os dados ficam no Supabase, o serviço que guarda o banco e cuida do login. Cada pessoa só consegue ver os próprios dados.'

export const privacidade = {
  titulo: 'Privacidade',

  montar(area) {
    area.innerHTML = `
      <h1>Privacidade</h1>
      <p class="tela__intro">O Prato Certo é um projeto acadêmico. Guardamos só o necessário para sugerir pratos.</p>

      <section class="secao texto" aria-labelledby="titulo-dados">
        <h2 id="titulo-dados">Que dados guardamos</h2>
        <ul>
          <li><strong>Conta:</strong> seu e-mail. A senha é guardada pelo Supabase de forma protegida: nem nós a vemos.</li>
          <li><strong>Preferências:</strong> cozinhas, restrições, orçamento e bairro.</li>
          <li><strong>Uso:</strong> seus favoritos, os pratos que você escolheu e as suas avaliações.</li>
          <li><strong>Localização:</strong> só se você tocar em "Usar minha localização". Ela é usada no aparelho para calcular distâncias e não é guardada.</li>
        </ul>
      </section>

      <section class="secao texto" aria-labelledby="titulo-para-que">
        <h2 id="titulo-para-que">Para quê e com quem</h2>
        <p>Só para escolher e ordenar as sugestões. Não vendemos nem mostramos seus dados a ninguém. Não há anúncios nem rastreadores.</p>
        <p>${ONDE}</p>
        <p>A média das notas de cada prato junta as notas de todo mundo, sem mostrar quem deu cada uma.</p>
      </section>

      <section class="secao texto" aria-labelledby="titulo-apagar">
        <h2 id="titulo-apagar">Apagar meus dados</h2>
        ${
          estaLogado()
            ? `
              <p>Apaga suas preferências, favoritos, escolhas e avaliações. Não dá para desfazer.</p>
              <div class="acoes" data-apagar>
                <button type="button" class="botao botao--perigo" data-pedir>${icone('lixeira')} Apagar meus dados</button>
              </div>
              <div class="confirmar" data-confirmar hidden>
                <p id="pergunta-apagar"><strong>Tem certeza?</strong> Tudo o que você salvou aqui vai sumir.</p>
                <div class="acoes" role="group" aria-labelledby="pergunta-apagar">
                  <button type="button" class="botao botao--perigo" data-sim>${icone('lixeira')} Sim, apagar</button>
                  <button type="button" class="botao" data-nao>Cancelar</button>
                </div>
              </div>
              <p role="status" data-resultado></p>
            `
            : '<p>Entre na sua conta para apagar seus dados.</p>'
        }
        ${modoDemonstracao ? '' : '<p>Para apagar também a conta (o e-mail), fale com os responsáveis pelo projeto.</p>'}
      </section>
    `

    if (!estaLogado()) return

    const pedir = area.querySelector('[data-pedir]')
    const confirmar = area.querySelector('[data-confirmar]')
    const resultado = area.querySelector('[data-resultado]')

    pedir.addEventListener('click', () => {
      area.querySelector('[data-apagar]').hidden = true
      confirmar.hidden = false
      area.querySelector('[data-nao]').focus() // o foco vai para a opção segura
    })

    area.querySelector('[data-nao]').addEventListener('click', () => {
      confirmar.hidden = true
      area.querySelector('[data-apagar]').hidden = false
      pedir.focus()
    })

    area.querySelector('[data-sim]').addEventListener('click', async () => {
      try {
        await apagarMeusDados()
        confirmar.hidden = true
        resultado.innerHTML = `${icone('confere')} Pronto: seus dados foram apagados. <a href="#/preferencias">Começar de novo</a>`
        resultado.querySelector('a').focus()
        anunciar('Seus dados foram apagados.')
      } catch (erro) {
        console.error(erro)
        resultado.textContent = 'Não deu para apagar agora. Confira sua internet e tente de novo.'
      }
    })
  },
}
