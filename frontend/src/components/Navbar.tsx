import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/',         label: 'Dashboard' },
  { to: '/users',    label: 'Users'     },
  { to: '/tracks',   label: 'Tracks'    },
  { to: '/friends',  label: 'Friends'   },
  { to: '/profile',  label: 'Profile'   },
  { to: '/feedback', label: 'Feedback'  },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <span className="text-purple-400 font-bold text-xl tracking-tight">
              ♪ SoundAround
            </span>
            <div className="flex gap-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">{user?.username}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900 text-purple-300">
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
