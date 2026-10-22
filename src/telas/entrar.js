// Telas "Entrar" (#/entrar) e "Criar conta" (#/criar-conta) (RF-01).
// No modo demonstração, não há senha: um botão entra numa conta fictícia deste navegador.

import { modoDemonstracao } from '../lib/supabase.js'
import { entrar as entrarNaConta, criarConta as criarNovaConta, entrarDemonstracao } from '../lib/sessao.js'
import { irPara, parametrosDaBusca } from '../lib/rotas.js'
import { icone } from '../lib/icone.js'

// Para onde ir depois de entrar: a tela que a pessoa tentou abrir, ou "Hoje".
function destino() {
  const { volta } = parametrosDaBusca()
  return volta?.startsWith('/') ? volta : '/hoje'
}

function montarDemonstracao(area, titulo) {
  area.innerHTML = `
    <h1>${titulo}</h1>
    <p class="tela__intro">
      O Prato Certo está no modo demonstração: ainda não há banco de dados ligado.
      Você pode testar tudo, sem e-mail nem senha. Os dados ficam só neste navegador.
    </p>
    <div class="acoes">
      <button type="button" class="botao botao--primario botao--grande" data-demonstracao>
        ${icone('entrar')} Entrar no modo demonstração
      </button>
    </div>
  `
  area.querySelector('[data-demonstracao]').addEventListener('click', () => {
    entrarDemonstracao()
    irPara(destino())
  })
}

// tipo: 'entrar' ou 'criar'
function montarFormulario(area, tipo) {
  const criando = tipo === 'criar'
  area.innerHTML = `
    <h1>${criando ? 'Criar conta' : 'Entrar'}</h1>
    <p class="tela__intro">
      ${criando ? 'Crie sua conta para guardar suas preferências, favoritos e avaliações.' : 'Que bom ver você de novo.'}
    </p>
    <form class="formulario" novalidate data-formulario>
      <label class="campo">
        <span class="campo__rotulo">E-mail</span>
        <input type="email" name="email" autocomplete="email" required />
      </label>
      <label class="campo">
        <span class="campo__rotulo">Senha</span>
        <input type="password" name="senha" minlength="6" required
          autocomplete="${criando ? 'new-password' : 'current-password'}"
          ${criando ? 'aria-describedby="dica-senha"' : ''} />
        ${criando ? '<span class="campo__dica" id="dica-senha">Pelo menos 6 caracteres.</span>' : ''}
      </label>
      <p class="aviso aviso--erro" role="alert" data-erro hidden></p>
      <button type="submit" class="botao botao--primario botao--grande">
        ${icone(criando ? 'usuario' : 'entrar')} ${criando ? 'Criar conta' : 'Entrar'}
      </button>
    </form>
    <p class="formulario__troca">
      ${
        criando
          ? 'Já tem conta? <a href="#/entrar">Entrar</a>'
          : 'Ainda não tem conta? <a href="#/criar-conta">Criar conta</a>'
      }
    </p>
  `

  const form = area.querySelector('[data-formulario]')
  const erro = area.querySelector('[data-erro]')
  const mostrarErro = (texto) => {
    erro.innerHTML = `${icone('alerta')} <span></span>`
    erro.querySelector('span').textContent = texto
    erro.hidden = false
  }

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault()
    if (form.dataset.ocupado) return
    const email = form.elements.email.value.trim()
    const senha = form.elements.senha.value

    // Conferência simples aqui; o Supabase confere de novo.
    if (!form.elements.email.checkValidity() || email === '') {
      mostrarErro('Digite um e-mail válido, como nome@exemplo.com.')
      form.elements.email.focus()
      return
    }
    if (senha.length < 6) {
      mostrarErro('A senha precisa ter pelo menos 6 caracteres.')
      form.elements.senha.focus()
      return
    }

    erro.hidden = true
    form.dataset.ocupado = 'sim'
    form.setAttribute('aria-busy', 'true')
    try {
      if (criando) {
        const { precisaConfirmar } = await criarNovaConta(email, senha)
        if (precisaConfirmar) {
          area.innerHTML = `
            <h1 tabindex="-1">Confira seu e-mail</h1>
            <p class="tela__intro">Enviamos um link para <strong></strong>. Clique nele e depois entre com sua senha.</p>
            <div class="acoes"><a class="botao botao--primario" href="#/entrar">${icone('entrar')} Entrar</a></div>
          `
          area.querySelector('strong').textContent = email
          area.querySelector('h1').focus()
          return
        }
      } else {
        await entrarNaConta(email, senha)
      }
      irPara(destino())
    } catch (falha) {
      mostrarErro(falha.message)
    } finally {
      delete form.dataset.ocupado
      form.removeAttribute('aria-busy')
    }
  })
}

export const entrar = {
  titulo: 'Entrar',
  montar(area) {
    if (modoDemonstracao) montarDemonstracao(area, 'Entrar')
    else montarFormulario(area, 'entrar')
  },
}

export const criarConta = {
  titulo: 'Criar conta',
  montar(area) {
    if (modoDemonstracao) montarDemonstracao(area, 'Criar conta')
    else montarFormulario(area, 'criar')
  },
}
