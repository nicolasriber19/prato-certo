// Tela provisória para as rotas que ainda não foram feitas.
// Cada uma diz em qual passo do plano (docs/plano.md) ela fica pronta.

export function emConstrucao(titulo, texto, passo) {
  return {
    titulo,
    montar(area) {
      area.innerHTML = `
        <h1>${titulo}</h1>
        <p class="tela__intro">${texto}</p>
        <p class="aviso">Esta tela fica pronta no passo ${passo} do plano.</p>
      `
    },
  }
}
