// Guarda as escolhas da pessoa no próprio navegador (localStorage).
//
// Guardamos só restrições, gostos, bairro e a ordem da tabela. A localização do aparelho
// nunca é guardada: ela é usada na hora e esquecida ao recarregar.
//
// Se o navegador não deixar guardar (aba anônima, memória cheia), a página continua
// funcionando: as escolhas só não sobrevivem ao recarregar.

const CHAVE = 'pratocerto:escolhas'
const ANTIGAS = 'pratocerto:demo:' // da versão com login, que tinha perfil, favoritos e histórico

export const PADRAO = { restricoes: [], gostos: [], bairro: '', ordem: 'preco' }

const lista = (valor) => (Array.isArray(valor) ? valor.filter((item) => typeof item === 'string') : [])

export function lerEscolhas() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? 'null')
    if (salvo && typeof salvo === 'object') {
      return {
        restricoes: lista(salvo.restricoes),
        gostos: lista(salvo.gostos),
        bairro: typeof salvo.bairro === 'string' ? salvo.bairro : '',
        ordem: typeof salvo.ordem === 'string' ? salvo.ordem : PADRAO.ordem,
      }
    }
  } catch {
    // Sem memória disponível ou valor estragado: começa do zero.
  }
  return structuredClone(PADRAO)
}

export function gravarEscolhas({ restricoes, gostos, bairro, ordem }) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ restricoes, gostos, bairro, ordem }))
  } catch {
    // Sem memória disponível: segue sem guardar.
  }
}

// Apaga tudo o que o Prato Certo guardou neste navegador, inclusive o que sobrou da versão antiga.
export function apagarTudo() {
  try {
    for (const chave of Object.keys(localStorage)) {
      if (chave === CHAVE || chave.startsWith(ANTIGAS)) localStorage.removeItem(chave)
    }
  } catch {
    // Sem memória disponível: não há o que apagar.
  }
}

// A versão com login deixava perfil, favoritos e histórico guardados. Nada disso é usado agora.
export function apagarRestosDaVersaoAntiga() {
  try {
    for (const chave of Object.keys(localStorage)) {
      if (chave.startsWith(ANTIGAS)) localStorage.removeItem(chave)
    }
  } catch {
    // Sem memória disponível: não há o que apagar.
  }
}
