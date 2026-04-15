import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { MusicSnapshotResponse, UserResponse } from '../types'

export default function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserResponse | null>(null)
  const [snapshot, setSnapshot] = useState<MusicSnapshotResponse | null>(null)

  useEffect(() => {
    if (!user) return
    api.get(`/api/users/${user.userId}`).then(r => setProfile(r.data)).catch(() => {})
  }, [user])

  useEffect(() => {
    if (!user || !profile) return
    const sync = () => {
      if (profile.lastfmUsername) {
        api.post(`/api/music/user/${user.userId}/sync`, { lastfmUsername: profile.lastfmUsername })
          .then(r => setSnapshot(r.data))
          .catch(() => {})
      } else {
        api.get(`/api/music/user/${user.userId}`).then(r => setSnapshot(r.data)).catch(() => {})
      }
    }
    sync()
    const interval = setInterval(sync, 25000)
    return () => clearInterval(interval)
  }, [user, profile])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.username} 👋</h1>
        <p className="text-gray-500 mt-1">Here's what's going on with your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-sm mb-1">Account</p>
          <p className="text-white font-semibold">{profile?.username}</p>
          <p className="text-gray-400 text-sm">{profile?.email}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-sm mb-1">Last.fm</p>
          {profile?.lastfmUsername
            ? <p className="text-white font-semibold">{profile.lastfmUsername}</p>
            : <p className="text-gray-500 text-sm">Not linked</p>
          }
          <Link to="/profile" className="text-purple-400 text-xs hover:underline mt-1 inline-block">
            {profile?.lastfmUsername ? 'Change' : 'Link account →'}
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-sm mb-1">Privacy</p>
          <p className="text-white font-semibold">{profile?.privacyMode?.replace('_', ' ')}</p>
          <Link to="/profile" className="text-purple-400 text-xs hover:underline mt-1 inline-block">
            Change →
          </Link>
        </div>
      </div>

      {snapshot?.trackName && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-sm mb-3">
            {snapshot.isPlaying ? 'Now Playing' : 'Last Listened'}
          </p>
          <div className="flex items-center gap-4">
            {snapshot.albumArt && (
              <img src={snapshot.albumArt} alt="album" className="w-14 h-14 rounded-lg object-cover" />
            )}
            <div>
              <p className="text-white font-semibold">{snapshot.trackName}</p>
              <p className="text-gray-400 text-sm">{snapshot.artistName}</p>
              {snapshot.isPlaying ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(snapshot.syncedAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'My Friends', to: '/friends', icon: '🤝' },
          { label: 'Nearby Map', to: '/map', icon: '🗺️' },
          { label: 'Profile', to: '/profile', icon: '👤' },
          { label: 'Send Feedback', to: '/feedback', icon: '💬' },
        ].map(item => (
          <Link key={item.to} to={item.to}
            className="bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-xl p-4 text-center transition group"
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-sm text-gray-400 group-hover:text-white transition">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
