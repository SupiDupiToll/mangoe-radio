import { Link } from 'react-router-dom'
import { usePlayerStore } from '../store/usePlayerStore'
import { useRadioPlayer } from '../hooks/useRadioPlayer'
import StationCard from '../components/StationCard'
import { MagnifyingGlassIcon } from '../components/Icons'

export default function HomePage() {
  const pinned = usePlayerStore((s) => s.pinned)
  const current = usePlayerStore((s) => s.currentStation)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const { toggleStation } = useRadioPlayer()

  return (
    <div className="min-h-full pt-[env(safe-area-inset-top,0px)]">
      <header className="px-6 pb-3 pt-5">
        <div className="flex items-center gap-1 text-[26px] font-extrabold tracking-[-0.8px]">
          Mangoe<span className="text-primary">.</span>
        </div>
        <div className="mt-0.5 text-sm text-muted-foreground">Dein Internetradio</div>
      </header>

      {pinned.length === 0 ? (
        <div className="px-11 pb-5 pt-6">
          <div className="flex flex-col items-center pb-5 text-center">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] bg-primary text-white">
              <MagnifyingGlassIcon size={42} weight={2.5} />
            </div>
            <h1 className="mb-2.5 text-2xl font-bold tracking-[-0.5px]">
              Finde deine Lieblingssender
            </h1>
            <p className="mb-8 max-w-[280px] text-base leading-relaxed text-muted-foreground">
              Suche nach einem Sender und tippe auf das Plus, um ihn hier
              anzuheften.
            </p>
            <Link
              to="/suche"
              className="flex items-center gap-2 rounded-[18px] bg-primary px-[34px] py-[15px] text-[17px] font-semibold text-white transition-transform active:scale-95"
            >
              <MagnifyingGlassIcon size={20} weight={2.5} />
              Sender suchen
            </Link>
          </div>
        </div>
      ) : (
        <div className="px-5 pt-2">
          <div className="flex items-center justify-between px-1 pt-3">
            <span className="text-xl font-bold tracking-[-0.3px]">Angeheftet</span>
            <Link to="/suche" className="p-2 text-[15px] font-medium text-primary">
              Bearbeiten
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-[14px] gap-y-6 px-1 pb-20 pt-1.5">
            {pinned.map((station) => (
              <StationCard
                key={station.stationuuid}
                station={station}
                active={current?.stationuuid === station.stationuuid}
                isPlaying={isPlaying}
                onPress={toggleStation}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
