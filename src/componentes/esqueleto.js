// "Esqueletos": blocos cinza no formato do conteúdo, enquanto ele carrega.
// Mostram que algo está acontecendo e onde o conteúdo vai aparecer
// (heurística "visibilidade do estado do sistema"). O leitor de tela ouve "Carregando…".

const CARTAO = `
  <div class="esqueleto__cartao" aria-hidden="true">
    <span class="esqueleto__linha esqueleto__linha--titulo"></span>
    <span class="esqueleto__linha"></span>
    <span class="esqueleto__linha esqueleto__linha--curta"></span>
  </div>
`

export function esqueleto({ cartoes = 3, texto = 'Carregando…' } = {}) {
  return `
    <div class="esqueleto" role="status">
      <span class="visualmente-oculto">${texto}</span>
      ${CARTAO.repeat(cartoes)}
    </div>
  `
}
