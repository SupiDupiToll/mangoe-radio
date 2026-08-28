import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number; weight?: number }

function Svg({ size = 24, weight = 2, children, ...props }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

type IconP = P & { filled?: boolean }

export const HouseIcon = ({ filled, ...p }: IconP) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9.5V20h12V9.5" />
  </Svg>
)

export const MagnifyingGlassIcon = ({ filled, ...p }: IconP) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20.5 20.5-4.5-4.5" />
  </Svg>
)

export const PlayWaveIcon = ({ filled, ...p }: IconP) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <rect x="3" y="4" width="18" height="16" rx="4" />
    <path
      d="M10.2 9.2 14.8 12l-4.6 2.8z"
      fill="currentColor"
      stroke="none"
    />
  </Svg>
)

export const PlayFillIcon = ({ filled, ...p }: IconP) => (
  <Svg {...p} fill="currentColor" weight={0}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.9l11-6.5a1 1 0 0 0 0-1.7l-11-6.6A1 1 0 0 0 8 5.5Z" />
  </Svg>
)

export const PauseFillIcon = ({ filled, ...p }: IconP) => (
  <Svg {...p} fill="currentColor" weight={0}>
    <rect x="6" y="5" width="4.4" height="14" rx="1.4" />
    <rect x="13.6" y="5" width="4.4" height="14" rx="1.4" />
  </Svg>
)

export const PlusIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const CheckmarkIcon = ({ filled, ...p }: IconP) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
)

export const PinSlashIcon = (p: P) => (
  <Svg {...p}>
    <path d="M14 4 9.5 9.4 12 10l-1 7-1.5-2.5H5L9 13 6 8.5 9 7.5 9.5 6 11 4Z" />
    <path d="M17 18.5V20.5M17 15.5V16" />
  </Svg>
)

export const WaveformIcon = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="9" width="2.6" height="6" rx="1" />
    <rect x="10.7" y="5" width="2.6" height="14" rx="1" />
    <rect x="17.4" y="7" width="2.6" height="10" rx="1" />
  </Svg>
)

export const VolumeHighIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 9.5v5h3.2L12 18V6L7.2 9.5Z" fill="currentColor" stroke="none" />
    <path d="M15.5 9a3.5 3.5 0 0 1 0 6" />
    <path d="M17.8 6.8a6.5 6.5 0 0 1 0 10.4" />
  </Svg>
)

export const ArrowLeftIcon = (p: P) => (
  <Svg {...p}>
    <path d="M14.5 5 7.5 12l7 7" />
  </Svg>
)

export const XmarkIcon = (p: P) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)

export const RetryIcon = (p: P) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66M20 3v4h-4" />
  </Svg>
)

export const StopFillIcon = ({ filled, ...p }: IconP) => (
  <Svg {...p} fill="currentColor" weight={0}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
  </Svg>
)
