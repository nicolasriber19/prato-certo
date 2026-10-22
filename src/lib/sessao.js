// Quem está usando o site (RF-01).
// Com o Supabase: conta de verdade, com e-mail e senha.
// No modo demonstração: uma conta fictícia, guardada só neste navegador. Não pede senha.

import { supabase, modoDemonstracao } from './supabase.js'
import { lerTabela, gravarTabela } from '../dados/local.js'

let usuario = null // { id, email } ou null
const ouvintes = new Set()

function resumir(sessao) {
  return sessao?.user ? { id: sessao.user.id, email: sessao.user.email } : null
}

// Só avisa quem está ouvindo quando a pessoa muda de verdade (entrou, saiu ou trocou).
function definirUsuario(novo) {
  const mudou = usuario?.id !== novo?.id
  usuario = novo
  if (mudou) ouvintes.forEach((avisar) => avisar(usuario))
}

// Chamada uma vez, antes de abrir a primeira tela.
export async function iniciarSessao() {
  if (modoDemonstracao) {
    usuario = lerTabela('sessao', null)
    return
  }
  const { data } = await supabase.auth.getSession()
  usuario = resumir(data.session)
  // Avisa quando a sessão muda em outra aba ou quando o login expira.
  supabase.auth.onAuthStateChange((_evento, sessao) => definirUsuario(resumir(sessao)))
}

export function usuarioAtual() {
  return usuario
}

export function estaLogado() {
  return usuario !== null
}

export function aoMudarSessao(avisar) {
  ouvintes.add(avisar)
}

export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha })
  if (error) throw new Error(traduzirErro(error))
  definirUsuario(resumir(data.session))
}

// Se a confirmação de e-mail estiver ligada no Supabase, a conta nasce sem sessão:
// a pessoa precisa clicar no link do e-mail antes de entrar.
export async function criarConta(email, senha) {
  const { data, error } = await supabase.auth.signUp({ email, password: senha })
  if (error) throw new Error(traduzirErro(error))
  if (!data.session) return { precisaConfirmar: true }
  definirUsuario(resumir(data.session))
  return { precisaConfirmar: false }
}

export function entrarDemonstracao() {
  const demonstracao = { id: 'demonstracao', email: null }
  gravarTabela('sessao', demonstracao)
  definirUsuario(demonstracao)
}

export async function sair() {
  if (modoDemonstracao) {
    gravarTabela('sessao', null)
  } else {
    await supabase.auth.signOut()
  }
  definirUsuario(null)
}

// Mensagens do Supabase em português simples.
// Códigos: https://supabase.com/docs/guides/auth/debugging/error-codes
function traduzirErro(erro) {
  const porCodigo = {
    invalid_credentials: 'E-mail ou senha incorretos.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar: procure a mensagem na sua caixa de entrada.',
    user_already_exists: 'Já existe uma conta com este e-mail. Toque em "Entrar".',
    email_exists: 'Já existe uma conta com este e-mail. Toque em "Entrar".',
    weak_password: 'Senha fraca: use pelo menos 6 caracteres.',
    email_address_invalid: 'Este e-mail não parece válido. Confira e tente de novo.',
    over_email_send_rate_limit: 'Muitas tentativas. Espere alguns minutos e tente de novo.',
    over_request_rate_limit: 'Muitas tentativas. Espere alguns minutos e tente de novo.',
  }
  if (porCodigo[erro.code]) return porCodigo[erro.code]
  if (erro.name === 'AuthRetryableFetchError') return 'Sem conexão com o servidor. Confira sua internet.'
  return 'Não deu para concluir agora. Tente de novo em instantes.'
}
