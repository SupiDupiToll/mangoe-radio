export interface Station {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  homepage: string
  favicon: string
  tags: string
  country: string
  countrycode: string
  language: string
  codec: string
  bitrate: number
  votes: number
  clickcount: number
}

export interface StationView extends Station {
  isLive?: boolean
}

export interface NowPlaying {
  station: Station
  title: string | null
  artist: string | null
  fetchedAt: number
}
