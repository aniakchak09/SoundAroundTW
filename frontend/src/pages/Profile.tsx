import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import type { MusicSnapshotResponse, UserResponse } from '../types'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserResponse | null>(null)
  const [snapshot, setSnapshot] = useState<MusicSnapshotResponse | null>(null)
  const [form, setForm] = useState({ username: '', lastfmUsername: '', privacyMode: 'PUBLIC' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [syncing, setSyncing] = useState(false)

  const fetchProfile = () => {
    if (!user) return
    api.get(`/api/users/${user.userId}`).then(r => {
      setProfile(r.data)
      setForm({
        username: r.data.username,
        lastfmUsername: r.data.lastfmUsername ?? '',
        privacyMode: r.data.privacyMode,
      })
    }).catch(() => {})
    api.get(`/api/music/user/${user.userId}`).then(r => setSnapshot(r.data)).catch(() => {})
  }

  useEffect(() => { fetchProfile() }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    try {
      await api.put(`/api/users/${user?.userId}`, {
        username: form.username,
        privacyMode: form.privacyMode,
        lastfmUsername: form.lastfmUsername || null,
      })
      setSuccess('Profile updated successfully.')
      fetchProfile()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed.')
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      await api.post(`/api/music/user/${user?.userId}/sync`, { lastfmUsername: form.lastfmUsername })
      fetchProfile()
    } catch {
      // ignore
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold text-white">Profile</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold">Edit Profile</h2>

        {success && <p className="text-green-400 text-sm bg-green-950 border border-green-800 rounded-lg px-4 py-3">{success}</p>}
        {error && <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">{error}</p>}

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Username</label>
          <input
            required value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email</label>
          <input
            disabled value={profile?.email ?? ''}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Last.fm Username</label>
          <input
            value={form.lastfmUsername}
            onChange={e => setForm({ ...form, lastfmUsername: e.target.value })}
            placeholder="your_lastfm"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Privacy</label>
          <select
            value={form.privacyMode}
            onChange={e => setForm({ ...form, privacyMode: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="PUBLIC">Public</option>
            <option value="FRIENDS_ONLY">Friends Only</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>

        <button type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition">
          Save Changes
        </button>
      </form>

      {/* Now Playing */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Now Playing</h2>
          <button onClick={handleSync} disabled={syncing || !form.lastfmUsername}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-40 transition">
            {syncing ? 'Syncing…' : 'Sync Last.fm'}
          </button>
        </div>
        {!form.lastfmUsername && (
          <p className="text-gray-500 text-sm">Link your Last.fm account above to sync music.</p>
        )}
        {snapshot?.isPlaying ? (
          <div className="flex items-center gap-4">
            {snapshot.albumArt && (
              <img src={snapshot.albumArt} alt="album" className="w-14 h-14 rounded-lg object-cover" />
            )}
            <div>
              <p className="text-white font-semibold">{snapshot.trackName}</p>
              <p className="text-gray-400 text-sm">{snapshot.artistName}</p>
              <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        ) : snapshot ? (
          <p className="text-gray-500 text-sm">Nothing playing right now.</p>
        ) : null}
      </div>
    </div>
  )
}
