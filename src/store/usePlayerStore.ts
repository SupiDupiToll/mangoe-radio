import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Station } from '../types'

export interface PlayerState {
  currentStation: Station | null
  isPlaying: boolean
  volume: number
  pinned: Station[]
  playedStations: Station[]
  nowPlayingTitle: string | null
  nowPlayingArtist: string | null

  setCurrentStation: (station: Station | null) => void
  setPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void

  isPinned: (uuid: string) => boolean
  togglePin: (station: Station) => void
  clearPinned: () => void

  setNowPlaying: (title: string | null, artist: string | null) => void

  registerPlay: (station: Station) => void
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentStation: null,
      isPlaying: false,
      volume: 0.8,
      pinned: [],
      playedStations: [],
      nowPlayingTitle: null,
      nowPlayingArtist: null,

      setCurrentStation: (station) =>
        set({ currentStation: station, nowPlayingTitle: null, nowPlayingArtist: null }),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => set({ volume }),

      isPinned: (uuid) => get().pinned.some((s) => s.stationuuid === uuid),
      togglePin: (station) =>
        set((state) => {
          const exists = state.pinned.some(
            (s) => s.stationuuid === station.stationuuid
          )
          return {
            pinned: exists
              ? state.pinned.filter((s) => s.stationuuid !== station.stationuuid)
              : [station, ...state.pinned]
          }
        }),
      clearPinned: () => set({ pinned: [] }),

      setNowPlaying: (title, artist) =>
        set({ nowPlayingTitle: title, nowPlayingArtist: artist }),

      registerPlay: (station) =>
        set((state) => ({
          playedStations: [
            station,
            ...state.playedStations.filter(
              (s) => s.stationuuid !== station.stationuuid
            )
          ].slice(0, 10)
        }))
    }),
    {
      name: 'mangoe-pins',
      partialize: (state) => ({ pinned: state.pinned, volume: state.volume })
    }
  )
)
