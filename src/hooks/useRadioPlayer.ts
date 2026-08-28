import { useCallback, useEffect } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'
import type { Station } from '../types'

/**
 * Einzige Audio-Instanz der App. Läuft im Modul-Scope, damit sie
 * über alle Routen/Komponenten hinweg stabil weiterläuft.
 */
let audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'none'
    audio.volume = usePlayerStore.getState().volume
  }
  return audio
}

export function useRadioPlayer() {
  const currentStation = usePlayerStore((s) => s.currentStation)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)

  const play = useCallback((station: Station) => {
    const el = getAudio()
    const state = usePlayerStore.getState()

    // Bereits laufenden Sender erneut antippen -> sicherstellen, dass er spielt
    if (state.currentStation?.stationuuid === station.stationuuid) {
      el.play().catch(() => {})
      state.setPlaying(true)
      return
    }

    el.src = station.url_resolved || station.url
    el.volume = state.volume
    state.setCurrentStation(station)
    state.registerPlay(station)
    el.play()
      .then(() => {
        if (
          usePlayerStore.getState().currentStation?.stationuuid ===
          station.stationuuid
        ) {
          usePlayerStore.getState().setPlaying(true)
        }
      })
      .catch(() => {
        /* Autoplay blockiert o. ä. */
      })
  }, [])

  /** Spielt einen Sender ab bzw. stoppt ihn, falls er gerade läuft. */
  const toggleStation = useCallback(
    (station: Station) => {
      const state = usePlayerStore.getState()
      if (
        state.currentStation?.stationuuid === station.stationuuid &&
        state.isPlaying
      ) {
        getAudio().pause()
        state.setPlaying(false)
      } else {
        play(station)
      }
    },
    [play]
  )

  const toggle = useCallback(() => {
    const state = usePlayerStore.getState()
    if (!state.currentStation) return
    if (state.isPlaying) {
      getAudio().pause()
      state.setPlaying(false)
    } else {
      getAudio()
        .play()
        .then(() => state.setPlaying(true))
        .catch(() => {})
    }
  }, [])

  const stop = useCallback(() => {
    const el = getAudio()
    el.pause()
    el.removeAttribute('src')
    el.load()
    const st = usePlayerStore.getState()
    st.setCurrentStation(null)
    st.setPlaying(false)
  }, [])

  const setVolume = useCallback((v: number) => {
    usePlayerStore.getState().setVolume(v)
  }, [])

  // Lautstärke-Änderung ans Audio-Gerät weiterreichen.
  // Bewusst KEIN Cleanup mit audio.pause(): Die Instanz lebt im Modul-Scope
  // und darf beim Wechseln der Tabs/Routen NICHT gestoppt werden.
  useEffect(() => {
    if (audio) audio.volume = volume
  }, [volume])

  return {
    currentStation,
    isPlaying,
    volume,
    play,
    toggleStation,
    toggle,
    stop,
    setVolume
  }
}
