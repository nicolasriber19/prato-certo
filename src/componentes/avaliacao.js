// Avaliação de um prato (RF-07): estrelas de 1 a 5 e comentário opcional.
//
// As estrelas são botões de rádio de verdade: o teclado já funciona (Tab entra no grupo,
// setas trocam a nota) e o leitor de tela anuncia "3 estrelas, 3 de 5".

import { icone } from '../lib/icone.js'
import { escapar } from '../lib/html.js'
import { avaliar } from '../dados/avaliacoes.js'
import { anunciar } from '../lib/anunciar.js'

const plural = (n) => (n === 1 ? '1 estrela' : `${n} estrelas`)

// Só para mostrar (não muda): "★★★★☆ 4,0"
export function notaEmEstrelas(nota, rotulo = 'Nota') {
  const texto = Number(nota).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const cheias = Math.round(nota)
  return `
    <span class="nota">
      <span aria-hidden="true">
        ${[1, 2, 3, 4, 5].map((n) => icone(n <= cheias ? 'estrela-cheia' : 'estrela', `icone nota__estrela${n <= cheias ? ' nota__estrela--cheia' : ''}`)).join('')}
      </span>
      <span>${texto}</span>
      <span class="visualmente-oculto">${rotulo}: ${texto} de 5</span>
    </span>
  `
}

// atual: { nota, comentario } ou undefined
export function formAvaliacao(prato, atual) {
  const nome = `nota-${prato.id}`
  return `
    <form class="avaliacao" data-avaliacao="${prato.id}">
      <fieldset class="estrelas">
        <legend>Sua nota para ${escapar(prato.nome)}</legend>
        ${[1, 2, 3, 4, 5]
          .map(
            (n) => `
              <label class="estrela${atual && n <= atual.nota ? ' estrela--cheia' : ''}">
                <input class="visualmente-oculto" type="radio" name="${nome}" value="${n}" ${atual?.nota === n ? 'checked' : ''} required />
                ${icone('estrela', 'icone estrela__vazia')}${icone('estrela-cheia', 'icone estrela__cheia')}
                <span class="visualmente-oculto">${plural(n)}</span>
              </label>
            `,
          )
          .join('')}
      </fieldset>
      <label class="campo">
        <span class="campo__rotulo">Comentário (opcional)</span>
        <textarea name="comentario" rows="2" maxlength="500">${escapar(atual?.comentario ?? '')}</textarea>
      </label>
      <button type="submit" class="botao botao--primario">${icone('estrela')} ${atual ? 'Mudar avaliação' : 'Salvar avaliação'}</button>
      <p class="avaliacao__resposta" role="status" data-resposta></p>
    </form>
  `
}

// Liga todos os formulários de avaliação dentro de "area".
// aoSalvar(pratoId, nota, comentario) é chamado depois de salvar (a tela atualiza o que precisar).
export function ligarAvaliacoes(area, aoSalvar = () => {}) {
  area.addEventListener('change', (evento) => {
    if (!evento.target.matches('.estrelas input')) return
    const valor = Number(evento.target.value)
    evento.target.closest('.estrelas').querySelectorAll('.estrela').forEach((estrela, i) => {
      estrela.classList.toggle('estrela--cheia', i < valor)
    })
  })

  area.addEventListener('submit', async (evento) => {
    const form = evento.target.closest('[data-avaliacao]')
    if (!form) return
    evento.preventDefault()

    if (form.dataset.ocupado) return // já está salvando
    const pratoId = Number(form.dataset.avaliacao)
    const nota = Number(new FormData(form).get(`nota-${pratoId}`))
    const resposta = form.querySelector('[data-resposta]')
    const botao = form.querySelector('[type="submit"]')

    form.dataset.ocupado = 'sim'
    try {
      await avaliar(pratoId, nota, form.elements.comentario.value)
      resposta.textContent = `Avaliação salva: ${plural(nota)}.`
      botao.lastChild.textContent = ' Mudar avaliação'
      anunciar(`Avaliação salva: ${plural(nota)}.`)
      aoSalvar(pratoId, nota, form.elements.comentario.value.trim())
    } catch (erro) {
      console.error(erro)
      resposta.textContent = 'Não deu para salvar a avaliação. Tente de novo.'
    } finally {
      delete form.dataset.ocupado
    }
  })
}
