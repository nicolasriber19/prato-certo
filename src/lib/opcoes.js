// Opções que a pessoa escolhe nas preferências (RF-02).
// Os "id" são os mesmos valores guardados no banco (supabase/schema.sql e seed.sql).

export const RESTRICOES = [
  { id: 'vegano', nome: 'Vegano', icone: 'folha' },
  { id: 'vegetariano', nome: 'Vegetariano', icone: 'broto' },
  { id: 'sem_gluten', nome: 'Sem glúten', icone: 'sem-gluten' },
  { id: 'sem_lactose', nome: 'Sem lactose', icone: 'sem-lactose' },
]

// "frase" completa os motivos da sugestão: "Você gosta de comida italiana".
export const COZINHAS = [
  { id: 'brasileira', nome: 'Brasileira', frase: 'comida brasileira' },
  { id: 'nordestina', nome: 'Nordestina', frase: 'comida nordestina' },
  { id: 'italiana', nome: 'Italiana', frase: 'comida italiana' },
  { id: 'japonesa', nome: 'Japonesa', frase: 'comida japonesa' },
  { id: 'arabe', nome: 'Árabe', frase: 'comida árabe' },
  { id: 'mexicana', nome: 'Mexicana', frase: 'comida mexicana' },
  { id: 'indiana', nome: 'Indiana', frase: 'comida indiana' },
  { id: 'hamburguer', nome: 'Hambúrguer', frase: 'hambúrguer' },
  { id: 'saudavel', nome: 'Saudável', frase: 'comida saudável' },
  { id: 'cafeteria', nome: 'Café e lanches', frase: 'café e lanches' },
]

// Até quanto a pessoa quer gastar por prato. "null" = sem limite.
export const ORCAMENTOS = [
  { valor: 25, nome: 'Até R$ 25' },
  { valor: 50, nome: 'Até R$ 50' },
  { valor: 80, nome: 'Até R$ 80' },
  { valor: null, nome: 'Sem limite' },
]

export function nomeDaRestricao(id) {
  return RESTRICOES.find((restricao) => restricao.id === id)?.nome ?? id
}

export function cozinha(id) {
  return COZINHAS.find((item) => item.id === id) ?? { id, nome: id, frase: id }
}
