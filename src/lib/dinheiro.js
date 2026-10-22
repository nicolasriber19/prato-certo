// Formata valores em reais, no padrão brasileiro: 25.9 → "R$ 25,90".

const formatoReal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function emReais(valor) {
  return formatoReal.format(valor)
}
