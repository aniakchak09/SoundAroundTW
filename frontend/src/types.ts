export interface AuthResponse {
  token: string
  userId: number
  username: string
  email: string
  role: string
}

export interface UserResponse {
  id: number
  username: string
  email: string
  lastfmUsername: string | null
  avatarUrl: string | null
  privacyMode: 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE'
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export interface TrackResponse {
  id: number
  title: string
  artist: string
  album: string | null
  previewUrl: string | null
  lastfmUrl: string | null
}

export interface FriendshipResponse {
  id: number
  requesterId: number
  requesterUsername: string
  addresseeId: number
  addresseeUsername: string
  status: 'PENDING' | 'ACCEPTED' | 'BLOCKED'
  matchScore: number | null
  createdAt: string
}

export interface MusicSnapshotResponse {
  id: number
  userId: number
  trackName: string | null
  artistName: string | null
  albumArt: string | null
  previewUrl: string | null
  isPlaying: boolean
  syncedAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}
