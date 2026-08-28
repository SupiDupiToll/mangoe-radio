import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { usePlayerStore } from '../store/usePlayerStore'
import {
  HouseIcon,
  MagnifyingGlassIcon,
  PauseFillIcon,
  PlayFillIcon,
  PlayWaveIcon,
  StopFillIcon,
  WaveformIcon
} from '../components/Icons'
import { useRadioPlayer } from '../hooks/useRadioPlayer'
import { cn } from '../lib/utils'

function TabItem({
  to,
  icon,
  label
}: {
  to: string
  icon: (active: boolean) => React.ReactNode
  label: string
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className="flex flex-1 flex-col items-center justify-center gap-[3px] text-[10px] font-medium tracking-[-0.1px] text-[#3c3c43]/50 active:opacity-70"
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'flex h-[29px] items-center justify-center rounded-2xl px-[13px] text-[#1c1c1e] transition-all duration-200',
              isActive &&
                'bg-gradient-to-b from-white to-[#f4f2ef] shadow-[0_6px_16px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.08)]'
            )}
          >
            {icon(isActive)}
          </span>
          <span className="leading-none">{label}</span>
        </>
      )}
    </NavLink>
  )
}

function TabBar() {
  return (
    <nav className="relative flex h-[62px] overflow-hidden rounded-[26px] border border-white/75 bg-[#faf7f3]/60 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.95),0_18px_44px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-[32px] backdrop-saturate-200 before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(115deg,rgba(255,255,255,0)_32%,rgba(255,255,255,0.45)_46%,rgba(255,255,255,0)_60%)]">
      <TabItem
        to="/"
        icon={(a) => <HouseIcon size={23} filled={a} />}
        label="Start"
      />
      <TabItem
        to="/suche"
        icon={(a) => <MagnifyingGlassIcon size={23} filled={a} />}
        label="Suchen"
      />
      <TabItem
        to="/player"
        icon={(a) => <PlayWaveIcon size={23} filled={a} />}
        label="Player"
      />
    </nav>
  )
}

function NowPlayingBar() {
  const current = usePlayerStore((s) => s.currentStation)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const { toggle, stop } = useRadioPlayer()
  const navigate = useNavigate()

  if (!current) return null

  return (
    <div className="absolute inset-x-0 bottom-[82px] mx-[10px] flex h-[60px] animate-np-in items-center gap-1 rounded-[19px] bg-card p-[6px] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-[10px] p-0 text-left"
        onClick={() => navigate('/player')}
        aria-label="Player öffnen"
      >
        <span className="h-[47px] w-[47px] flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
          {current.favicon ? (
            <img src={current.favicon} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3a3a3f] to-[#26262a] text-primary">
              <WaveformIcon size={22} />
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-[1px]">
          <span className="truncate text-[15px] font-semibold text-foreground">
            {current.name}
          </span>
          <span className="text-[11.5px] font-medium text-primary">
            {isPlaying ? 'Läuft' : 'Pausiert'}
          </span>
        </span>
      </button>
      <span className="flex flex-shrink-0 items-center gap-0.5 pr-1">
        <button
          type="button"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-foreground text-white active:scale-90"
          onClick={() => toggle()}
          aria-label={isPlaying ? 'Pausieren' : 'Abspielen'}
        >
          {isPlaying ? <PauseFillIcon size={24} /> : <PlayFillIcon size={24} />}
        </button>
        <button
          type="button"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-muted-foreground active:scale-90"
          onClick={() => stop()}
          aria-label="Stoppen"
        >
          <StopFillIcon size={22} />
        </button>
      </span>
    </div>
  )
}

export default function RootLayout() {
  return (
    <div className="flex min-h-full w-full justify-center bg-black">
      <div className="relative flex min-h-screen w-full max-w-[480px] flex-col bg-background shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Outlet />
        </main>

        <div className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 px-4 pb-[calc(12px+env(safe-area-inset-bottom,0px))]">
          <div className="pointer-events-auto">
            <NowPlayingBar />
            <TabBar />
          </div>
        </div>
      </div>
    </div>
  )
}
