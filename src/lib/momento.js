// Momentos da refeição (RF-03) e qual deles combina com a hora do aparelho.

export const MOMENTOS = [
  { id: 'almoco_rapido', nome: 'Almoço rápido', icone: 'raio' },
  { id: 'jantar_romantico', nome: 'Jantar romântico', icone: 'taca' },
  { id: 'lanche_economico', nome: 'Lanche econômico', icone: 'moeda' },
]

// Das 11h às 14h59, almoço. Das 18h às 23h59, jantar. No resto do dia, lanche.
export function momentoDaHora(data = new Date()) {
  const hora = data.getHours()
  if (hora >= 11 && hora < 15) return 'almoco_rapido'
  if (hora >= 18) return 'jantar_romantico'
  return 'lanche_economico'
}

export function nomeDoMomento(id) {
  return MOMENTOS.find((momento) => momento.id === id)?.nome ?? id
}
