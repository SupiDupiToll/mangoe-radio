import type { Station } from '../types'

const BASE = 'https://de1.api.radio-browser.info/json'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json' }
  })
  if (!res.ok) {
    throw new Error(`Radio-Browser-Anfrage fehlgeschlagen: ${res.status}`)
  }
  return (await res.json()) as T
}

/** Beliebte deutsche Sender für die Homepage. */
export function getGermanStations(limit = 48): Promise<Station[]> {
  return request<Station[]>(
    `/stations/search?countrycode=DE&order=clickcount&reverse=true&limit=${limit}`
  )
}

/** Volle Textsuche über den Sendernamen. */
export function searchStations(
  query: string,
  limit = 30
): Promise<Station[]> {
  const q = encodeURIComponent(query)
  return request<Station[]>(
    `/stations/search?countrycode=DE&name=${q}&order=clickcount&reverse=true&limit=${limit}`
  )
}
