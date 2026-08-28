import { useEffect, useState } from 'react'
import type { Station } from '../types'

interface NowPlayingInfo {
  artist: string | null
  title: string | null
  raw: string
}

const TIMEOUT_MS = 5000

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Timout')), ms)
    promise.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (e) => {
        clearTimeout(t)
        reject(e)
      }
    )
  })
}

async function readIcyTitle(station: Station): Promise<NowPlayingInfo | null> {
  try {
    const origin = new URL(station.url_resolved || station.url).origin
    const res = await withTimeout(fetch(origin), TIMEOUT_MS)
    if (!res.ok) return null
    const html = await res.text()
    if (!/(StreamTitle|class="track"|class="song"|djplayed)/i.test(html)) {
      return null
    }
    const m = html.match(
      /([^:<>-]{2,}?)\s*-\s*([^<"'{}\[\]]{2,}?)(?:\s*\||<|"|')/i
    )
    if (m) {
      return { artist: m[1].trim(), title: m[2].trim(), raw: m[0].trim() }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Versucht, den laufenden Titel zu ermitteln.
 * Schlägt still fehl (z. B. wegen CORS) und gibt dann null zurück.
 * Optional: eigenes Polling-Intervall in ms (Standard: aus).
 */
export function useNowPlaying(station: Station | null, intervalMs = 0) {
  const [info, setInfo] = useState<NowPlayingInfo | null>(null)

  useEffect(() => {
    if (!station) {
      setInfo(null)
      return
    }
    let cancelled = false

    const tick = async () => {
      const next = await readIcyTitle(station)
      if (!cancelled) setInfo(next)
    }
    tick()

    let id: ReturnType<typeof setInterval> | undefined
    if (intervalMs > 0) id = setInterval(tick, intervalMs)
    return () => {
      cancelled = true
      if (id) clearInterval(id)
    }
  }, [station, intervalMs])

  return info
}
