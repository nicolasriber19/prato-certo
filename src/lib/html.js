// Protege o HTML montado com textos que vêm do banco (nomes, comentários).
// Sem isso, um comentário com "<script>" viraria código na página.
//   `<p>${escapar(avaliacao.comentario)}</p>`

const TROCAS = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

export function escapar(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (letra) => TROCAS[letra])
}
