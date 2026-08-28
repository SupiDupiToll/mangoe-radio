import type { Station } from '../types'
import { PauseFillIcon, PlayFillIcon, PlusIcon } from './Icons'
import { usePlayerStore } from '../store/usePlayerStore'
import { cn } from '../lib/utils'

interface Props {
  station: Station
  active: boolean
  isPlaying: boolean
  onPress: (s: Station) => void
}

export default function StationCard({ station, active, isPlaying, onPress }: Props) {
  const togglePin = usePlayerStore((s) => s.togglePin)
  const isPinned = usePlayerStore((s) =>
    s.pinned.some((x) => x.stationuuid === station.stationuuid)
  )

  const playing = active && isPlaying

  return (
    <div className="relative">
      <button
        type="button"
        className="flex w-full flex-col p-0 text-center"
        onClick={() => onPress(station)}
        aria-label={`${station.name} ${playing ? 'pausieren' : 'abspielen'}`}
      >
        <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-muted shadow-[0_4px_18px_rgba(0,0,0,0.1)]">
          {station.favicon ? (
            <img
              src={station.favicon}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-200 active:scale-105"
            />
          ) : (
            <span className="text-[30px] font-bold text-muted-foreground">
              {station.name.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span
            className={cn(
              'absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200',
              active ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            )}
          >
            {playing ? <PauseFillIcon size={20} /> : <PlayFillIcon size={20} />}
          </span>
        </span>
        <span className="mt-2 line-clamp-2 text-center text-sm font-medium leading-tight text-foreground">
          {station.name}
        </span>
      </button>
      {!isPinned && (
        <button
          type="button"
          className="absolute right-1.5 top-1.5 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
          onClick={() => togglePin(station)}
          aria-label="Anheften"
        >
          <PlusIcon size={14} weight={3} />
        </button>
      )}
    </div>
  )
}
