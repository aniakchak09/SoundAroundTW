import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Tracks from './pages/Tracks'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import Feedback from './pages/Feedback'
import MapPage from './pages/Map'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Navbar />}>
              <Route path="/"         element={<Dashboard />} />
              <Route path="/users"    element={<Users />}     />
              <Route path="/tracks"   element={<Tracks />}    />
              <Route path="/friends"  element={<Friends />}   />
              <Route path="/profile"  element={<Profile />}   />
              <Route path="/feedback" element={<Feedback />}  />
              <Route path="/map"      element={<MapPage />}   />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
