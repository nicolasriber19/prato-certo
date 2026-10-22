// Memória do navegador para o modo demonstração (sem Supabase).
// Cada "tabela" (perfil, favoritos, escolhas...) fica guardada no localStorage.
//
// Se o navegador não deixar guardar (ex.: aba anônima bloqueada), o site continua
// funcionando com uma cópia na memória da página, que some ao recarregar.

const PREFIXO = 'pratocerto:demo:'
const reserva = new Map()

export function lerTabela(nome, padrao = []) {
  if (reserva.has(nome)) return reserva.get(nome)
  try {
    const salvo = localStorage.getItem(PREFIXO + nome)
    if (salvo !== null) return JSON.parse(salvo)
  } catch {
    // Sem memória disponível ou valor estragado: começa do padrão.
  }
  return padrao
}

export function gravarTabela(nome, valor) {
  reserva.set(nome, valor)
  try {
    localStorage.setItem(PREFIXO + nome, JSON.stringify(valor))
  } catch {
    // Sem memória disponível: fica só na reserva.
  }
}

// Apaga as tabelas do modo demonstração, menos as que forem pedidas para ficar.
export function apagarTabelas({ menos = [] } = {}) {
  for (const nome of ['perfil', 'favoritos', 'escolhas', 'avaliacoes', 'sessao']) {
    if (menos.includes(nome)) continue
    reserva.delete(nome)
    try {
      localStorage.removeItem(PREFIXO + nome)
    } catch {
      // Sem memória disponível: não há o que apagar.
    }
  }
}

// Um id novo para as linhas criadas no modo demonstração.
export function novoId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000)
}
