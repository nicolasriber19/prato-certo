// Recomendação de pratos e restaurantes (RF-04, RF-05, RF-08): uma regra de pontos.
//
// Funções puras: recebem tudo de que precisam e devolvem a lista ordenada,
// sem buscar nada no banco. Por isso dá para testar sem internet (tests/recomendar.test.js).
//
// 1. Elimina o que não atende às restrições e o que passa do orçamento.
// 2. Soma pontos (tabela PONTOS) e guarda os motivos em palavras.
// 3. Ordena: mais pontos primeiro; no empate, o mais perto, depois o mais barato.

import { nomeDaRestricao, cozinha } from './opcoes.js'
import { nomeDoMomento } from './momento.js'
import { distanciaKm, formatarDistancia } from './distancia.js'
import { juntar } from './textos.js'

export const PONTOS = {
  gosta: 3, //               cozinha de que gosta
  naoGosta: -5, //           cozinha que quer evitar
  momento: 4, //             combina com o momento escolhido
  pertinho: 2, //            até 2 km
  perto: 1, //               até 5 km
  bemAvaliado: 1, //         média de todos ≥ 4
  minhaNotaBoa: 2, //        eu dei 4 ou 5
  minhaNotaRuim: -8, //      eu dei 1 ou 2 (pesa mais que momento + gosto: não volta ao topo)
  escolhidoHaPouco: -2, //   escolhi nos últimos 3 dias (para variar)
  favorito: 1, //            está nos meus favoritos
}

const DIAS_PARA_VARIAR = 3
const UM_DIA_MS = 24 * 60 * 60 * 1000

export function atendeRestricoes(prato, restricoes = []) {
  return restricoes.every((restricao) => prato.tags.includes(restricao))
}

// orcamentoMax vazio (null) = sem limite
export function cabeNoOrcamento(prato, orcamentoMax) {
  return orcamentoMax == null || Number(prato.preco) <= Number(orcamentoMax)
}

function formatarNota(media) {
  return Number(media).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

const longeSeNaoSouber = (km) => km ?? Infinity

function porPontos(a, b) {
  return (
    b.pontos - a.pontos ||
    longeSeNaoSouber(a.distanciaKm) - longeSeNaoSouber(b.distanciaKm) ||
    Number(a.prato.preco) - Number(b.prato.preco) ||
    a.prato.id - b.prato.id
  )
}

// Quando nada cabe no orçamento, o mais barato vem primeiro: é o "um pouco acima".
function porPreco(a, b) {
  return Number(a.prato.preco) - Number(b.prato.preco) || porPontos(a, b)
}

// dados:
//   pratos, restaurantes        do banco
//   perfil                      { gostos, nao_gosta, restricoes, orcamento_max }
//   momento                     'almoco_rapido' | 'jantar_romantico' | 'lanche_economico'
//   origem                      { latitude, longitude } da pessoa, ou null
//   medias                      Map: id do prato → média de todas as notas
//   minhasNotas                 Map: id do prato → nota que a pessoa deu
//   favoritos                   Set: ids dos pratos favoritos
//   escolhas                    [{ prato_id, criado_em }]
//   agora                       Date (nos testes, uma data fixa)
//
// Devolve { sugestoes: [{ prato, restaurante, pontos, motivos, distanciaKm }], acimaDoOrcamento }
export function recomendarPratos({
  pratos,
  restaurantes,
  perfil,
  momento,
  origem = null,
  medias = new Map(),
  minhasNotas = new Map(),
  favoritos = new Set(),
  escolhas = [],
  agora = new Date(),
}) {
  const restricoes = perfil.restricoes ?? []
  const gostos = perfil.gostos ?? []
  const naoGosta = perfil.nao_gosta ?? []
  const restaurantePorId = new Map(restaurantes.map((restaurante) => [restaurante.id, restaurante]))

  const desde = agora.getTime() - DIAS_PARA_VARIAR * UM_DIA_MS
  const escolhidosHaPouco = new Set(
    escolhas.filter((escolha) => new Date(escolha.criado_em).getTime() >= desde).map((escolha) => escolha.prato_id),
  )

  // 1. Restrição é eliminatória sempre. Orçamento também, a não ser que não sobre nada.
  const permitidos = pratos.filter((prato) => atendeRestricoes(prato, restricoes))
  const noOrcamento = permitidos.filter((prato) => cabeNoOrcamento(prato, perfil.orcamento_max))
  const acimaDoOrcamento = noOrcamento.length === 0 && permitidos.length > 0
  const candidatos = acimaDoOrcamento ? permitidos : noOrcamento

  // 2. Pontos e motivos. Os motivos ficam na ordem em que a tela deve mostrar.
  const sugestoes = candidatos.map((prato) => {
    const restaurante = restaurantePorId.get(prato.restaurante_id) ?? null
    const motivos = []
    let pontos = 0

    if (restricoes.length > 0) {
      motivos.push(juntar(restricoes.map(nomeDaRestricao)))
    }

    const minhaNota = minhasNotas.get(prato.id)
    if (minhaNota >= 4) {
      pontos += PONTOS.minhaNotaBoa
      motivos.push(`Você deu ${minhaNota} estrelas`)
    } else if (minhaNota <= 2) {
      pontos += PONTOS.minhaNotaRuim
    }

    if (prato.momentos.includes(momento)) {
      pontos += PONTOS.momento
      motivos.push(`Bom para ${nomeDoMomento(momento).toLowerCase()}`)
    }

    if (gostos.includes(prato.cozinha)) {
      pontos += PONTOS.gosta
      motivos.push(`Você gosta de ${cozinha(prato.cozinha).frase}`)
    }
    if (naoGosta.includes(prato.cozinha)) {
      pontos += PONTOS.naoGosta
    }

    let km = null
    if (origem && restaurante) {
      km = distanciaKm(origem, restaurante)
      if (km <= 2) {
        pontos += PONTOS.pertinho
        motivos.push(`A ${formatarDistancia(km)}`)
      } else if (km <= 5) {
        pontos += PONTOS.perto
        motivos.push(`A ${formatarDistancia(km)}`)
      }
    }

    const media = medias.get(prato.id)
    if (media >= 4) {
      pontos += PONTOS.bemAvaliado
      motivos.push(`Nota média ${formatarNota(media)}`)
    }

    if (escolhidosHaPouco.has(prato.id)) {
      pontos += PONTOS.escolhidoHaPouco
    }

    if (favoritos.has(prato.id)) {
      pontos += PONTOS.favorito
      motivos.push('Está nos seus favoritos')
    }

    return { prato, restaurante, pontos, motivos, distanciaKm: km }
  })

  // 3. Ordem
  sugestoes.sort(acimaDoOrcamento ? porPreco : porPontos)
  return { sugestoes, acimaDoOrcamento }
}

// Restaurantes que têm pelo menos um prato sugerido (RF-05), do mais perto para o mais longe.
// Recebe as "sugestoes" de recomendarPratos(), já ordenadas.
export function recomendarRestaurantes(sugestoes) {
  const grupos = new Map()

  for (const sugestao of sugestoes) {
    if (!sugestao.restaurante) continue
    const id = sugestao.restaurante.id
    if (!grupos.has(id)) {
      grupos.set(id, { restaurante: sugestao.restaurante, distanciaKm: sugestao.distanciaKm, pratos: [] })
    }
    grupos.get(id).pratos.push(sugestao)
  }

  return [...grupos.values()]
    .map((grupo) => {
      const quantos = grupo.pratos.length
      const motivos = [quantos === 1 ? '1 prato para você' : `${quantos} pratos para você`]
      if (grupo.distanciaKm != null) motivos.push(`A ${formatarDistancia(grupo.distanciaKm)}`)
      motivos.push(`Destaque: ${grupo.pratos[0].prato.nome}`)
      return { ...grupo, pontos: Math.max(...grupo.pratos.map((sugestao) => sugestao.pontos)), motivos }
    })
    .sort(
      (a, b) =>
        longeSeNaoSouber(a.distanciaKm) - longeSeNaoSouber(b.distanciaKm) ||
        b.pontos - a.pontos ||
        a.restaurante.id - b.restaurante.id,
    )
}
