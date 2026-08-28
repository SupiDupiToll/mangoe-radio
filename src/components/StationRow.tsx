import type { Station } from '../types'
import { usePlayerStore } from '../store/usePlayerStore'
import { useRadioPlayer } from '../hooks/useRadioPlayer'
import { CheckmarkIcon, PlayFillIcon, PlusIcon } from './Icons'
import { cn } from '../lib/utils'

interface Props {
  station: Station
  showPin?: boolean
}

export default function StationRow({ station, showPin = true }: Props) {
  const current = usePlayerStore((s) => s.currentStation)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const isPinned = usePlayerStore((s) =>
    s.pinned.some((x) => x.stationuuid === station.stationuuid)
  )
  const togglePin = usePlayerStore((s) => s.togglePin)
  const { play } = useRadioPlayer()

  const active = current?.stationuuid === station.stationuuid

  const handleClick = () => {
    if (active) return
    play(station)
  }

  return (
    <li className="relative flex min-h-[64px] items-center gap-1 bg-card px-4 active:bg-muted">
      <button
        type="button"
        className="flex h-[63px] min-w-0 flex-1 items-center gap-3 p-0 text-left"
        onClick={handleClick}
        aria-label={`${station.name} abspielen`}
      >
        <span className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-muted">
          {station.favicon ? (
            <img src={station.favicon} alt="" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[15px] font-semibold text-muted-foreground">
              {station.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <div
            className={cn(
              'flex items-center gap-[5px] whitespace-nowrap text-[16.5px]',
              active ? 'text-primary' : 'text-foreground'
            )}
          >
            <span className="truncate">{station.name}</span>
            {active && isPlaying && <PlayFillIcon size={12} />}
          </div>
          <div className="mt-px text-[13px] text-muted-foreground">
            {[station.bitrate > 0 ? `${station.bitrate}` : station.codec]
              .filter(Boolean)
              .join(' · ') || 'Radio'}
          </div>
        </span>
      </button>

      {showPin && (
        <button
          type="button"
          className={cn(
            'ml-1 flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full transition-transform active:scale-90',
            isPinned
              ? 'bg-primary-soft text-primary'
              : 'bg-primary text-white shadow-[0_2px_8px_rgba(255,149,0,0.45)]'
          )}
          onClick={() => togglePin(station)}
          aria-pressed={isPinned}
          aria-label={isPinned ? 'Entfernen' : 'Anheften'}
        >
          {isPinned ? <CheckmarkIcon size={16} weight={3} /> : <PlusIcon size={15} weight={3} />}
        </button>
      )}
    </li>
  )
}
