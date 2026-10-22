// Tela para endereços que não existem (ex.: #/pagina-errada).

import { icone } from '../lib/icone.js'

export const naoEncontrada = {
  titulo: 'Página não encontrada',

  montar(area) {
    area.innerHTML = `
      <h1>Página não encontrada</h1>
      <p class="tela__intro">Este endereço não existe no Prato Certo.</p>
      <div class="acoes">
        <a class="botao botao--primario" href="#/">${icone('casa')} Ir para o início</a>
      </div>
    `
  },
}
