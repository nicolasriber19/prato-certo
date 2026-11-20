// Tabela de restaurantes e preços da página única.
//
// Funções puras: recebem o catálogo e as escolhas da pessoa e devolvem as linhas prontas,
// sem mexer na página. Por isso dá para testar sem navegador (tests/tabela.test.js).
//
// - Restrição é obrigatória: um prato que não atende a todas as marcadas nunca aparece.
// - Gosto é um filtro de cozinhas: sem nenhum marcado, aparecem todas.

import { distanciaKm } from './distancia.js'

export function atendeRestricoes(prato, restricoes = []) {
  return restricoes.every((restricao) => prato.tags.includes(restricao))
}

// Uma linha por prato: { prato, restaurante, distanciaKm }.
// origem: { latitude, longitude } da pessoa (bairro ou localização), ou null.
export function linhasDaTabela({ pratos, restaurantes, restricoes = [], gostos = [], origem = null }) {
  const restaurantePorId = new Map(restaurantes.map((restaurante) => [restaurante.id, restaurante]))
  return pratos
    .filter((prato) => atendeRestricoes(prato, restricoes))
    .filter((prato) => gostos.length === 0 || gostos.includes(prato.cozinha))
    .map((prato) => {
      const restaurante = restaurantePorId.get(prato.restaurante_id) ?? null
      return {
        prato,
        restaurante,
        distanciaKm: origem && restaurante ? distanciaKm(origem, restaurante) : null,
      }
    })
}

const texto = (a, b) => a.localeCompare(b, 'pt-BR')
const longeSeNaoSouber = (km) => km ?? Infinity

// Jeitos de ordenar a tabela. No empate, o mais barato e depois o nome, para a ordem nunca "pular".
export const ORDENS = {
  preco: { nome: 'Menor preço', comparar: (a, b) => a.prato.preco - b.prato.preco || texto(a.prato.nome, b.prato.nome) },
  distancia: {
    nome: 'Mais perto',
    comparar: (a, b) =>
      longeSeNaoSouber(a.distanciaKm) - longeSeNaoSouber(b.distanciaKm) ||
      a.prato.preco - b.prato.preco ||
      texto(a.prato.nome, b.prato.nome),
  },
  prato: { nome: 'Nome do prato', comparar: (a, b) => texto(a.prato.nome, b.prato.nome) },
  restaurante: {
    nome: 'Restaurante',
    comparar: (a, b) =>
      texto(a.restaurante?.nome ?? '', b.restaurante?.nome ?? '') || a.prato.preco - b.prato.preco,
  },
}

export function ordenar(linhas, por = 'preco') {
  const ordem = ORDENS[por] ?? ORDENS.preco
  return [...linhas].sort(ordem.comparar)
}

// "16 pratos em 9 restaurantes, de R$ 12,00 a R$ 58,00" (os valores; o texto é montado na página).
export function resumo(linhas) {
  const precos = linhas.map((linha) => linha.prato.preco)
  return {
    pratos: linhas.length,
    restaurantes: new Set(linhas.map((linha) => linha.restaurante?.id)).size,
    menorPreco: precos.length ? Math.min(...precos) : null,
    maiorPreco: precos.length ? Math.max(...precos) : null,
  }
}
