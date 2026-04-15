import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const rules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter (A–Z)', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a–z)', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Digit (0–9)',            test: (p: string) => /\d/.test(p) },
  { label: 'Special character',      test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
]

export default function Register() {
  const { login } = useAuth()
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirm: '', lastfmUsername: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pwFocused, setPwFocused] = useState(false)

  const passwordValid = rules.every(r => r.test(form.password))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!passwordValid) {
      setError('Password does not meet all requirements.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        lastfmUsername: form.lastfmUsername || null,
      })
      login(res.data)
      window.location.replace('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value })
  })

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">♪ SoundAround</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-3">{error}</p>}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Username</label>
            <input required {...field('username')} minLength={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="yourname"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
            <input required type="email" {...field('email')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
            <input
              required
              type="password"
              {...field('password')}
              onFocus={() => setPwFocused(true)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="••••••••"
            />
            {(pwFocused || form.password.length > 0) && (
              <ul className="mt-2 space-y-1">
                {rules.map(r => {
                  const ok = r.test(form.password)
                  return (
                    <li key={r.label} className={`flex items-center gap-2 text-xs ${ok ? 'text-green-400' : 'text-gray-500'}`}>
                      <span>{ok ? '✓' : '○'}</span>
                      {r.label}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Confirm Password</label>
            <input required type="password" {...field('confirm')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Last.fm Username <span className="text-gray-600">(optional)</span></label>
            <input {...field('lastfmUsername')}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              placeholder="your_lastfm"
            />
          </div>
          <button type="submit" disabled={loading || !passwordValid}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition mt-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
