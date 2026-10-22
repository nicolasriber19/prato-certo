// Avisos lidos pelo leitor de tela, sem mudar o foco (ex.: "Adicionado aos favoritos").
// Usa o <p aria-live="polite" data-anuncio> do index.html.

export function anunciar(texto) {
  const regiao = document.querySelector('[data-anuncio]')
  if (!regiao) return
  // Limpa antes, para o mesmo aviso ser lido de novo se repetir.
  regiao.textContent = ''
  setTimeout(() => (regiao.textContent = texto), 50)
}
