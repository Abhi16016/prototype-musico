export interface Track {
  id: string
  name: string
  artist_name: string
  album_name: string
  duration: number
  audio: string
  image: string
  shareurl: string
}

export interface AppState {
  tracks: Track[]
  isLoading: boolean
  error: string | null
  page: number
  hasMore: boolean
}

