import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '../store/usePlayerStore'
import { useRadioPlayer } from '../hooks/useRadioPlayer'
import { useNowPlaying } from '../hooks/useNowPlaying'
import {
  MagnifyingGlassIcon,
  PauseFillIcon,
  PlayFillIcon,
  StopFillIcon,
  VolumeHighIcon,
  WaveformIcon,
  XmarkIcon
} from '../components/Icons'

const DISMISS = 100

export default function PlayerPage() {
  const current = usePlayerStore((s) => s.currentStation)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const volume = usePlayerStore((s) => s.volume)
  const { toggle, stop, setVolume } = useRadioPlayer()
  const navigate = useNavigate()

  const [offset, setOffset] = useState(0)
  const [closing, setClosing] = useState(false)
  const start = useRef<{ x: number; y: number } | null>(null)
  const movedRef = useRef(false)

  const nowPlaying = useNowPlaying(current, 15000)

  const closeSheet = () => {
    setClosing(true)
    setOffset(window.innerHeight)
    setTimeout(() => navigate(-1), 180)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
    movedRef.current = false
    setClosing(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!start.current) return
    const t = e.touches[0]
    const dy = t.clientY - start.current.y
    const dx = Math.abs(t.clientX - start.current.x)

    if (!movedRef.current) {
      if (dy < 6 || dx > dy) return
      movedRef.current = true
    }

    if (dy > 0) {
      e.preventDefault()
      const resistance = Math.min(1, dy / 700)
      setOffset(dy * resistance)
    }
  }

  const onTouchEnd = () => {
    if (offset > DISMISS) {
      closeSheet()
    } else {
      setClosing(true)
      setOffset(0)
      setTimeout(() => setClosing(false), 200)
    }
    start.current = null
  }

  const meta = nowPlaying?.artist
    ? `${nowPlaying.artist}${nowPlaying.title ? ` – ${nowPlaying.title}` : ''}`
    : null

  return (
    <div
      className="fixed inset-0 z-[100] flex touch-none flex-col overflow-y-auto bg-[linear-gradient(180deg,#2b2b30_0%,#1b1b1f_55%,#161619_100%)] text-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        transform: offset ? `translateY(${offset}px)` : undefined,
        transition: closing ? 'transform 0.25s cubic-bezier(0.5,0,0,1), opacity 0.2s' : undefined,
        opacity: closing ? 0.4 : undefined
      }}
    >
      <div className="mx-auto mt-2.5 h-[5px] w-9 rounded-full bg-white/25" />

      <div className="flex items-center px-[18px] pb-1.5 pt-3.5">
        <span className="absolute left-1/2 -translate-x-1/2 text-[13px] font-medium tracking-[0.3px] text-white/85">
          Mangoe
        </span>
        <button
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-white active:bg-white/15"
          onClick={closeSheet}
          aria-label="Schließen"
        >
          <XmarkIcon size={16} weight={2.5} />
        </button>
      </div>

      {!current ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3.5 bg-background p-10 text-center text-foreground">
          <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-muted text-primary">
            <WaveformIcon size={38} />
          </div>
          <h1 className="mt-2 text-[22px]">Nichts wird abgespielt</h1>
          <p className="max-w-[260px] leading-relaxed text-muted-foreground">
            Suche einen Sender und tippe auf „Abspielen“.
          </p>
          <button
            className="mt-4 flex items-center gap-2 rounded-[14px] bg-primary px-[30px] py-[14px] text-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(255,159,10,0.4)] active:scale-95"
            onClick={() => navigate('/suche')}
          >
            <MagnifyingGlassIcon size={20} />
            Sender suchen
          </button>
        </div>
      ) : (
        <div className="relative flex h-full min-h-0 flex-col items-center justify-center px-7 pb-5 pt-2.5">
          <div className="flex aspect-square w-full max-w-[300px] items-center justify-center overflow-hidden rounded-[18px] bg-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_0.5px_rgba(255,255,255,0.06)]">
            {current.favicon ? (
              <img src={current.favicon} alt={current.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[96px] font-bold text-white/25">
                {current.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="mt-9 w-full text-center">
            <div className="mb-2 text-[13px] font-semibold uppercase tracking-[1.2px] text-primary">
              {isPlaying ? 'Live' : 'Pausiert'}
            </div>
            <div className="text-[25px] font-bold leading-tight tracking-[-0.4px]">
              {current.name}
            </div>
            <div className="mt-2 min-h-6 text-base text-white/65">
              {meta || <span className="italic">{isPlaying ? 'Streamt…' : ' '}</span>}
            </div>
            <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
              {current.bitrate > 0 && (
                <span className="rounded-[20px] bg-white/10 px-2.5 py-1 text-xs font-medium text-white/75">
                  {current.bitrate} kbps
                </span>
              )}
              {current.codec && (
                <span className="rounded-[20px] bg-white/10 px-2.5 py-1 text-xs font-medium text-white/75">
                  {current.codec}
                </span>
              )}
            </div>
          </div>

          <div className="mt-1.5 flex w-full items-center justify-center gap-11">
            <button
              type="button"
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full text-white/90 transition-transform active:scale-90"
              onClick={stop}
              aria-label="Stoppen"
            >
              <StopFillIcon size={30} />
            </button>
            <button
              type="button"
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-white !text-black shadow-[0_6px_24px_rgba(0,0,0,0.4)] transition-transform active:scale-90"
              onClick={toggle}
              aria-label={isPlaying ? 'Pausieren' : 'Abspielen'}
            >
              {isPlaying ? <PauseFillIcon size={40} /> : <PlayFillIcon size={40} />}
            </button>
          </div>

          <div className="mt-10 flex w-full items-center gap-3 text-white/45">
            <VolumeHighIcon size={22} />
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 outline-none"
              aria-label="Lautstärke"
              style={
                {
                  background: `linear-gradient(to right, #fff ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`
                } as React.CSSProperties
              }
            />
            <span className="min-w-[38px] text-right text-[13px]">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
