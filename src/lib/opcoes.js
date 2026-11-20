// As opções que a pessoa marca na página: restrições (passo 1) e cozinhas de que gosta (passo 2).
// Os "id" são os mesmos usados nos pratos de src/dados/catalogo.js (campos "tags" e "cozinha").

export const RESTRICOES = [
  { id: 'vegano', nome: 'Vegano', icone: 'folha' },
  { id: 'vegetariano', nome: 'Vegetariano', icone: 'broto' },
  { id: 'sem_gluten', nome: 'Sem glúten', icone: 'sem-gluten' },
  { id: 'sem_lactose', nome: 'Sem lactose', icone: 'sem-lactose' },
]

export const COZINHAS = [
  { id: 'brasileira', nome: 'Brasileira' },
  { id: 'nordestina', nome: 'Nordestina' },
  { id: 'italiana', nome: 'Italiana' },
  { id: 'japonesa', nome: 'Japonesa' },
  { id: 'arabe', nome: 'Árabe' },
  { id: 'mexicana', nome: 'Mexicana' },
  { id: 'indiana', nome: 'Indiana' },
  { id: 'hamburguer', nome: 'Hambúrguer' },
  { id: 'saudavel', nome: 'Saudável' },
  { id: 'cafeteria', nome: 'Café e lanches' },
]

export function nomeDaRestricao(id) {
  return RESTRICOES.find((restricao) => restricao.id === id)?.nome ?? id
}

export function cozinha(id) {
  return COZINHAS.find((item) => item.id === id) ?? { id, nome: id }
}
