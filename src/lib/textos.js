// Pequenos ajudantes de texto em português.

// ["Vegano", "Sem glúten", "Sem lactose"] → "Vegano, sem glúten e sem lactose"
export function juntar(nomes) {
  const [primeiro, ...resto] = nomes
  if (resto.length === 0) return primeiro ?? ''
  const minusculos = resto.map((nome) => nome.toLowerCase())
  return `${[primeiro, ...minusculos.slice(0, -1)].join(', ')} e ${minusculos.at(-1)}`
}

const hora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const dia = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })

// "Hoje, 12:30", "Ontem, 19:05" ou "18 de out., 12:30"
export function quando(dataIso, agora = new Date()) {
  const data = new Date(dataIso)
  const inicioDoDia = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const dias = Math.round((inicioDoDia(agora) - inicioDoDia(data)) / (24 * 60 * 60 * 1000))
  const rotulo = dias === 0 ? 'Hoje' : dias === 1 ? 'Ontem' : dia.format(data)
  return `${rotulo}, ${hora.format(data)}`
}

// Link para o mapa (abre em outra aba). Os restaurantes são de exemplo: o ponto é aproximado.
export function linkDoMapa({ latitude, longitude }) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude}`)}`
}
