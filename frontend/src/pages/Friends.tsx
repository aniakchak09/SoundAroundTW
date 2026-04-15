import { useEffect, useState } from 'react'
import api from '../api/client'
import ConfirmModal from '../components/ConfirmModal'
import type { FriendshipResponse } from '../types'
import { useAuth } from '../context/AuthContext'

export default function Friends() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<FriendshipResponse[]>([])
  const [pending, setPending] = useState<FriendshipResponse[]>([])
  const [sendTo, setSendTo] = useState('')
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState('')
  const [removeId, setRemoveId] = useState<number | null>(null)

  const fetchFriends = () => {
    if (!user) return
    api.get(`/api/friendships/user/${user.userId}`)
      .then(r => setFriends(r.data.content ?? []))
      .catch(() => {})
    api.get(`/api/friendships/user/${user.userId}/pending`)
      .then(r => setPending(r.data.content ?? []))
      .catch(() => {})
  }

  useEffect(() => { fetchFriends() }, [user])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendError('')
    setSendSuccess('')
    try {
      // Look up user by username to get their ID
      const search = await api.get('/api/users/search', { params: { query: sendTo, size: 5 } })
      const found = (search.data.content as any[]).find(
        (u: any) => u.username.toLowerCase() === sendTo.toLowerCase()
      )
      if (!found) { setSendError('User not found.'); return }
      if (found.id === user?.userId) { setSendError("You can't add yourself."); return }
      await api.post(`/api/friendships/user/${user?.userId}`, { addresseeId: found.id })
      setSendTo('')
      setSendSuccess('Friend request sent!')
    } catch (err: any) {
      setSendError(err.response?.data?.message || 'Could not send request.')
    }
  }

  const handleAccept = async (id: number) => {
    await api.put(`/api/friendships/${id}/accept`, null, { params: { userId: user?.userId } })
    fetchFriends()
  }

  const handleDecline = async (id: number) => {
    await api.delete(`/api/friendships/${id}`, { params: { userId: user?.userId } })
    fetchFriends()
  }

  const handleRemove = async () => {
    if (!removeId) return
    await api.delete(`/api/friendships/${removeId}`, { params: { userId: user?.userId } })
    setRemoveId(null)
    fetchFriends()
  }

  const otherUsername = (f: FriendshipResponse) =>
    f.requesterId === user?.userId ? f.addresseeUsername : f.requesterUsername

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Friends</h1>

      {/* Send request */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-3">Send Friend Request</h2>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={sendTo}
            onChange={e => setSendTo(e.target.value)}
            placeholder="Exact username…"
            required
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
          />
          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition">
            Send
          </button>
        </form>
        {sendError && <p className="text-red-400 text-sm mt-2">{sendError}</p>}
        {sendSuccess && <p className="text-green-400 text-sm mt-2">{sendSuccess}</p>}
      </div>

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-3">Pending Requests</h2>
          <ul className="space-y-2">
            {pending.map(f => (
              <li key={f.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300 text-sm">{f.requesterUsername} wants to be your friend</span>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(f.id)}
                    className="text-xs px-3 py-1 rounded bg-purple-700 hover:bg-purple-600 text-white transition">
                    Accept
                  </button>
                  <button onClick={() => handleDecline(f.id)}
                    className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-400 hover:bg-gray-800 transition">
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friends list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">
            My Friends <span className="text-gray-500 text-sm font-normal">({friends.length})</span>
          </h2>
        </div>
        {friends.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No friends yet. Send a request!</p>
        ) : (
          <ul>
            {friends.map(f => (
              <li key={f.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition">
                <div>
                  <p className="text-white text-sm font-medium">{otherUsername(f)}</p>
                  {f.matchScore !== null && (
                    <p className="text-gray-500 text-xs">Match score: {f.matchScore}</p>
                  )}
                </div>
                <button onClick={() => setRemoveId(f.id)}
                  className="text-xs px-3 py-1 rounded border border-red-900 text-red-400 hover:bg-red-950 transition">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {removeId && (
        <ConfirmModal
          message="Remove this friend?"
          onConfirm={handleRemove}
          onCancel={() => setRemoveId(null)}
        />
      )}
    </div>
  )
}
