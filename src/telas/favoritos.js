// Tela "Favoritos" (#/favoritos) (RF-06): pratos e restaurantes salvos, do mais novo ao mais antigo.
// Tocar no coração de novo tira dos favoritos, mas o cartão fica na tela até sair dela:
// assim dá para desfazer na hora, e o foco não se perde.

import { carregarCatalogo } from '../dados/catalogo.js'
import { listarFavoritos } from '../dados/favoritos.js'
import { icone } from '../lib/icone.js'
import { cardPrato, ligarFavoritos } from '../componentes/card-prato.js'
import { cardRestaurante } from '../componentes/card-restaurante.js'

export const favoritos = {
  titulo: 'Favoritos',

  async montar(area) {
    area.innerHTML = '<h1>Favoritos</h1><div data-corpo><p class="carregando">Carregando…</p></div>'
    const [{ pratos, restaurantes }, favoritosSalvos] = await Promise.all([carregarCatalogo(), listarFavoritos()])
    const corpo = area.querySelector('[data-corpo]')

    const pratosFavoritos = favoritosSalvos.lista
      .filter((f) => f.prato_id != null)
      .map((f) => pratos.find((p) => p.id === f.prato_id))
      .filter(Boolean) // um prato que saiu do catálogo some daqui
      .map((prato) => ({ prato, restaurante: restaurantes.find((r) => r.id === prato.restaurante_id) }))

    const restaurantesFavoritos = favoritosSalvos.lista
      .filter((f) => f.restaurante_id != null)
      .map((f) => restaurantes.find((r) => r.id === f.restaurante_id))
      .filter(Boolean)

    if (pratosFavoritos.length === 0 && restaurantesFavoritos.length === 0) {
      corpo.innerHTML = `
        <p class="tela__intro">Você ainda não salvou nada. Toque no coração de um prato ou restaurante para guardar aqui.</p>
        <div class="acoes"><a class="botao botao--primario" href="#/hoje">${icone('prato')} Ver sugestões</a></div>
      `
      return
    }

    corpo.innerHTML = `
      <section class="secao" aria-labelledby="titulo-fav-pratos">
        <h2 id="titulo-fav-pratos">Pratos</h2>
        ${
          pratosFavoritos.length > 0
            ? `<ul class="cartoes" role="list">${pratosFavoritos.map((s) => `<li>${cardPrato(s, { favorito: true })}</li>`).join('')}</ul>`
            : '<p>Nenhum prato salvo.</p>'
        }
      </section>
      <section class="secao" aria-labelledby="titulo-fav-restaurantes">
        <h2 id="titulo-fav-restaurantes">Restaurantes</h2>
        ${
          restaurantesFavoritos.length > 0
            ? `<ul class="cartoes" role="list">${restaurantesFavoritos.map((r) => `<li>${cardRestaurante({ restaurante: r }, { favorito: true })}</li>`).join('')}</ul>`
            : '<p>Nenhum restaurante salvo.</p>'
        }
      </section>
    `
    ligarFavoritos(corpo)
  },
}
