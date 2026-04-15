import { useEffect, useState } from 'react'
import api from '../api/client'
import ConfirmModal from '../components/ConfirmModal'
import Pagination from '../components/Pagination'
import type { PageResponse, TrackResponse } from '../types'
import { useAuth } from '../context/AuthContext'

const empty = { title: '', artist: '', album: '', previewUrl: '', lastfmUrl: '' }

export default function Tracks() {
  const { user } = useAuth()
  const [data, setData] = useState<PageResponse<TrackResponse> | null>(null)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editTrack, setEditTrack] = useState<TrackResponse | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(empty)

  const fetchTracks = () => {
    api.get('/api/tracks/search', { params: { query, page, size: 10 } })
      .then(r => setData(r.data))
      .catch(() => {})
  }

  useEffect(() => { fetchTracks() }, [page, query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    setQuery(search)
  }

  const openEdit = (t: TrackResponse) => {
    setEditTrack(t)
    setForm({
      title: t.title,
      artist: t.artist,
      album: t.album ?? '',
      previewUrl: t.previewUrl ?? '',
      lastfmUrl: t.lastfmUrl ?? '',
    })
  }

  const openAdd = () => {
    setForm(empty)
    setShowAdd(true)
  }

  const buildPayload = () => ({
    title: form.title,
    artist: form.artist,
    album: form.album || null,
    previewUrl: form.previewUrl || null,
    lastfmUrl: form.lastfmUrl || null,
  })

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/api/tracks', buildPayload())
    setShowAdd(false)
    fetchTracks()
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTrack) return
    await api.put(`/api/tracks/${editTrack.id}`, buildPayload())
    setEditTrack(null)
    fetchTracks()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await api.delete(`/api/tracks/${deleteId}`)
    setDeleteId(null)
    fetchTracks()
  }

  const TrackForm = ({ onSubmit, title, onClose }: { onSubmit: (e: React.FormEvent) => void; title: string; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form onSubmit={onSubmit} className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md space-y-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        {[
          { label: 'Title', key: 'title' as const, required: true },
          { label: 'Artist', key: 'artist' as const, required: true },
          { label: 'Album', key: 'album' as const },
          { label: 'Preview URL', key: 'previewUrl' as const },
          { label: 'Last.fm URL', key: 'lastfmUrl' as const },
        ].map(({ label, key, required }) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
            <input
              required={required}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        ))}
        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition">Cancel</button>
          <button type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition">Save</button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Tracks</h1>
        <div className="flex gap-2">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or artist…"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 w-64"
            />
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition">
              Search
            </button>
          </form>
          {user?.role === 'ADMIN' && (
            <button onClick={openAdd}
              className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm rounded-lg transition">
              + Add
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr className="text-gray-500 text-left">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Artist</th>
              <th className="px-5 py-3">Album</th>
              <th className="px-5 py-3">Last.fm</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.content.map(t => (
              <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                <td className="px-5 py-3 text-gray-500">{t.id}</td>
                <td className="px-5 py-3 text-white font-medium">{t.title}</td>
                <td className="px-5 py-3 text-gray-400">{t.artist}</td>
                <td className="px-5 py-3 text-gray-400">{t.album ?? '—'}</td>
                <td className="px-5 py-3">
                  {t.lastfmUrl
                    ? <a href={t.lastfmUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline text-xs">View</a>
                    : <span className="text-gray-600">—</span>}
                </td>
                <td className="px-5 py-3 flex gap-2">
                  {user?.role === 'ADMIN' && (
                    <>
                      <button onClick={() => openEdit(t)}
                        className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-300 hover:bg-gray-700 transition">
                        Edit
                      </button>
                      <button onClick={() => setDeleteId(t.id)}
                        className="text-xs px-3 py-1 rounded border border-red-900 text-red-400 hover:bg-red-950 transition">
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data?.content.length && (
          <p className="text-center text-gray-600 py-10">No tracks found.</p>
        )}
      </div>

      <Pagination page={page} totalPages={data?.totalPages ?? 0} onChange={setPage} />

      {deleteId && (
        <ConfirmModal
          message="This will permanently delete the track."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {showAdd && <TrackForm onSubmit={handleAdd} title="Add Track" onClose={() => setShowAdd(false)} />}
      {editTrack && <TrackForm onSubmit={handleEdit} title="Edit Track" onClose={() => setEditTrack(null)} />}
    </div>
  )
}
