import { useEffect, useState } from 'react'
import api from '../api/client'
import ConfirmModal from '../components/ConfirmModal'
import Pagination from '../components/Pagination'
import type { PageResponse, UserResponse } from '../types'
import { useAuth } from '../context/AuthContext'

export default function Users() {
  const { user: me } = useAuth()
  const [data, setData] = useState<PageResponse<UserResponse> | null>(null)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editUser, setEditUser] = useState<UserResponse | null>(null)
  const [editForm, setEditForm] = useState({ username: '', privacyMode: '', lastfmUsername: '' })

  const fetchUsers = () => {
    api.get('/api/users/search', { params: { query, page, size: 10 } })
      .then(r => setData(r.data))
      .catch(() => {})
  }

  useEffect(() => { fetchUsers() }, [page, query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    setQuery(search)
  }

  const openEdit = (u: UserResponse) => {
    setEditUser(u)
    setEditForm({ username: u.username, privacyMode: u.privacyMode, lastfmUsername: u.lastfmUsername ?? '' })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    await api.put(`/api/users/${editUser.id}`, {
      username: editForm.username,
      privacyMode: editForm.privacyMode,
      lastfmUsername: editForm.lastfmUsername || null,
    })
    setEditUser(null)
    fetchUsers()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await api.delete(`/api/users/${deleteId}`)
    setDeleteId(null)
    fetchUsers()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by username or email…"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 w-64"
          />
          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition">
            Search
          </button>
        </form>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr className="text-gray-500 text-left">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Username</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Privacy</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map(u => (
              <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="px-5 py-3 text-gray-500">{u.id}</td>
                <td className="px-5 py-3 text-white font-medium">{u.username}</td>
                <td className="px-5 py-3 text-gray-400">{u.email}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900 text-purple-300">{u.role}</span>
                </td>
                <td className="px-5 py-3 text-gray-400">{u.privacyMode.replace('_', ' ')}</td>
                <td className="px-5 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 flex gap-2">
                  <button onClick={() => openEdit(u)}
                    className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-300 hover:bg-gray-700 transition">
                    Edit
                  </button>
                  {me?.role === 'ADMIN' && u.id !== me.userId && (
                    <button onClick={() => setDeleteId(u.id)}
                      className="text-xs px-3 py-1 rounded border border-red-900 text-red-400 hover:bg-red-950 transition">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.content.length && (
          <p className="text-center text-gray-600 py-10">No users found.</p>
        )}
      </div>

      <Pagination page={page} totalPages={data?.totalPages ?? 0} onChange={setPage} />

      {deleteId && (
        <ConfirmModal
          message="This will permanently delete the user and all their data."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <form onSubmit={handleEdit} className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-semibold text-lg">Edit User</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Username</label>
              <input value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Last.fm Username</label>
              <input value={editForm.lastfmUsername} onChange={e => setEditForm({ ...editForm, lastfmUsername: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Privacy</label>
              <select value={editForm.privacyMode} onChange={e => setEditForm({ ...editForm, privacyMode: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500">
                <option value="PUBLIC">Public</option>
                <option value="FRIENDS_ONLY">Friends Only</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditUser(null)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition">Cancel</button>
              <button type="submit"
                className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
