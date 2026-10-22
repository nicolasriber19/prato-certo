// Distância entre dois pontos do mapa (RF-05) e os bairros do perfil.
//
// Usa a fórmula de Haversine: a distância "em linha reta" sobre a Terra.
// O caminho de verdade, pelas ruas, é um pouco maior.

const RAIO_DA_TERRA_KM = 6371

const radianos = (graus) => (graus * Math.PI) / 180

// a e b: { latitude, longitude }
export function distanciaKm(a, b) {
  const dLat = radianos(b.latitude - a.latitude)
  const dLon = radianos(b.longitude - a.longitude)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radianos(a.latitude)) * Math.cos(radianos(b.latitude)) * Math.sin(dLon / 2) ** 2
  return 2 * RAIO_DA_TERRA_KM * Math.asin(Math.sqrt(h))
}

// 0,35 → "350 m"   1,23 → "1,2 km"   12,6 → "13 km"
export function formatarDistancia(km) {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`
  const casas = km < 10 ? 1 : 0
  return `${km.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })} km`
}

// Centro aproximado de cada bairro. Usado quando a pessoa não libera a localização.
export const BAIRROS = [
  { nome: 'Asa Sul', latitude: -15.812, longitude: -47.9 },
  { nome: 'Asa Norte', latitude: -15.763, longitude: -47.882 },
  { nome: 'Sudoeste', latitude: -15.798, longitude: -47.925 },
  { nome: 'Noroeste', latitude: -15.752, longitude: -47.91 },
  { nome: 'Lago Sul', latitude: -15.84, longitude: -47.87 },
  { nome: 'Lago Norte', latitude: -15.73, longitude: -47.85 },
  { nome: 'Guará', latitude: -15.824, longitude: -47.98 },
  { nome: 'Águas Claras', latitude: -15.839, longitude: -48.027 },
  { nome: 'Taguatinga', latitude: -15.833, longitude: -48.056 },
]

export function coordenadasDoBairro(nome) {
  return BAIRROS.find((bairro) => bairro.nome === nome) ?? null
}
