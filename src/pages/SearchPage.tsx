import { useEffect, useState } from 'react'
import type { Station } from '../types'
import StationRow from '../components/StationRow'
import { searchStations } from '../api/radioApi'
import { MagnifyingGlassIcon, PinSlashIcon, XmarkIcon } from '../components/Icons'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const [debounced, setDebounced] = useState(false)

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(true)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!debounced) return
    const q = query.trim()
    if (q.length < 2) {
      setStations([])
      return
    }
    let cancelled = false
    setLoading(true)
    searchStations(q)
      .then((res) => !cancelled && setStations(res))
      .catch(() => !cancelled && setStations([]))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [query, debounced])

  const isSearching = query.trim().length >= 2

  return (
    <div className="flex min-h-full flex-col pt-[env(safe-area-inset-top,0px)]">
      <header className="sticky top-0 z-10 bg-background/90 px-4 pb-2.5 pt-5 backdrop-blur-2xl">
        <h1 className="mx-1 mb-3.5 text-[30px] font-bold tracking-[-0.5px]">Suche</h1>
        <div className="flex h-[38px] items-center gap-2 rounded-xl bg-[rgba(118,118,128,0.12)] px-3 text-muted-foreground focus-within:bg-[rgba(255,255,255,0.95)] focus-within:shadow-[0_0_0_3.5px_rgba(0,0,0,0.06),0_1px_6px_rgba(0,0,0,0.08)]">
          <MagnifyingGlassIcon size={18} weight={2.5} />
          <input
            type="search"
            autoFocus
            placeholder="Sender suchen"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setDebounced(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setDebounced(true)
            }}
            className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none"
          />
          {query && (
            <button
              type="button"
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted-foreground leading-none text-white"
              onClick={() => {
                setQuery('')
                setStations([])
              }}
              aria-label="Eingabe löschen"
            >
              <XmarkIcon size={10} weight={3} />
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 px-4 pb-[30px] pt-1">
        {isSearching ? (
          loading ? (
            <p className="p-1.5 py-2 text-[13px] text-muted-foreground">Suche…</p>
          ) : (
            <>
              <p className="px-1.5 py-2 text-[13px] text-muted-foreground">
                <span className="font-semibold text-foreground">{stations.length}</span>{' '}
                Sender
              </p>
              <ul>
                {stations.map((station) => (
                  <StationRow key={station.stationuuid} station={station} />
                ))}
              </ul>
            </>
          )
        ) : (
          <div className="flex flex-col items-center px-6 pb-15 pt-[60px] text-center">
            <div className="mb-[22px] flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-muted text-primary">
              <PinSlashIcon size={30} />
            </div>
            <p className="text-muted-foreground">
              Suche nach deutschen Radiosendern
              <br />
              und pinne deine Favoriten an.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
