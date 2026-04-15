import { useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['BUG', 'FEATURE', 'GENERAL', 'OTHER']

export default function Feedback() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    category: 'GENERAL',
    rating: 0,
    message: '',
    subscribe: false,
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.rating === 0) { setError('Please select a rating.'); return }
    setError('')
    setLoading(true)
    try {
      await api.post(`/api/feedback/user/${user?.userId}`, {
        category: form.category,
        rating: form.rating,
        message: form.message,
        subscribeToUpdates: form.subscribe,
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not submit feedback.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-5xl">✅</div>
        <h2 className="text-white text-xl font-semibold">Thank you for your feedback!</h2>
        <p className="text-gray-400 text-sm">Your response has been recorded.</p>
        <button onClick={() => { setSuccess(false); setForm({ category: 'GENERAL', rating: 0, message: '', subscribe: false }) }}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition">
          Submit another
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-5">
      <h1 className="text-2xl font-bold text-white">Send Feedback</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5">
        {error && <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">{error}</p>}

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Rating</label>
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map(n => (
              <label key={n} className="flex flex-col items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={n}
                  checked={form.rating === n}
                  onChange={() => setForm({ ...form, rating: n })}
                  className="sr-only"
                />
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border transition ${
                    form.rating === n
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-gray-700 text-gray-400 hover:border-purple-600'
                  }`}
                >
                  {n}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Message</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us what you think…"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Subscribe */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.subscribe}
            onChange={e => setForm({ ...form, subscribe: e.target.checked })}
            className="w-4 h-4 rounded accent-purple-600"
          />
          <span className="text-sm text-gray-400">Notify me about updates and improvements</span>
        </label>

        <button type="submit" disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition">
          {loading ? 'Submitting…' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}
