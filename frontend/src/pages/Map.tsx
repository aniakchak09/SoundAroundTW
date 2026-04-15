import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

// Fix Leaflet default marker icon paths broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface LocationEntry {
  id: number
  userId: number
  lat: number
  lng: number
  lastSeen: string
  username?: string
}

export default function MapPage() {
  const { user } = useAuth()
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMap = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const [status, setStatus] = useState('')
  const [sharing, setSharing] = useState(false)
  const [radius, setRadius] = useState(5)
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null)

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return
    const map = L.map(mapRef.current).setView([45.75, 21.23], 13)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => map.setView([pos.coords.latitude, pos.coords.longitude], 13),
        () => {}
      )
    }
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)
    leafletMap.current = map
    return () => {
      map.remove()
      leafletMap.current = null
    }
  }, [])

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
  }

  const fetchNearby = async (lat: number, lng: number) => {
    clearMarkers()
    if (!leafletMap.current) return
    try {
      const res = await api.get<LocationEntry[]>('/api/locations/nearby', {
        params: { lat, lng, radiusKm: radius },
      })
      const map = leafletMap.current
      map.setView([lat, lng], 13)

      // Marker for current user
      const selfIcon = L.divIcon({
        html: '<div style="background:#7c3aed;width:14px;height:14px;border-radius:50%;border:2px solid white;"></div>',
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      const selfMarker = L.marker([lat, lng], { icon: selfIcon })
        .addTo(map)
        .bindPopup('You are here')
      markersRef.current.push(selfMarker)

      res.data.forEach(loc => {
        if (loc.userId === user?.userId) return
        const m = L.marker([loc.lat, loc.lng])
          .addTo(map)
          .bindPopup(`User #${loc.userId}<br>Last seen: ${new Date(loc.lastSeen).toLocaleString()}`)
        markersRef.current.push(m)
      })

      setStatus(`Showing ${res.data.length} user(s) within ${radius} km`)
    } catch {
      setStatus('Could not load nearby users.')
    }
  }

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser.')
      return
    }
    setSharing(true)
    setStatus('Getting your location…')
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          await api.put(`/api/locations/user/${user?.userId}`, { lat, lng })
          setCenter({ lat, lng })
          await fetchNearby(lat, lng)
        } catch {
          setStatus('Could not save your location.')
        } finally {
          setSharing(false)
        }
      },
      () => {
        setStatus('Location permission denied.')
        setSharing(false)
      }
    )
  }

  const stopSharing = async () => {
    try {
      await api.delete(`/api/locations/user/${user?.userId}`)
      setCenter(null)
      clearMarkers()
      setStatus('Location removed.')
    } catch {
      setStatus('Could not remove location.')
    }
  }

  const refreshNearby = () => {
    if (center) fetchNearby(center.lat, center.lng)
    else setStatus('Share your location first to see nearby users.')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">Nearby Map</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-gray-400 text-sm flex items-center gap-2">
            Radius
            <select
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm focus:outline-none"
            >
              {[1, 2, 5, 10, 20, 50].map(r => (
                <option key={r} value={r}>{r} km</option>
              ))}
            </select>
          </label>
          {center ? (
            <>
              <button onClick={refreshNearby}
                className="px-4 py-2 text-sm bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-lg transition">
                Refresh
              </button>
              <button onClick={stopSharing}
                className="px-4 py-2 text-sm border border-red-900 text-red-400 hover:bg-red-950 rounded-lg transition">
                Stop sharing
              </button>
            </>
          ) : (
            <button onClick={shareLocation} disabled={sharing}
              className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition">
              {sharing ? 'Locating…' : 'Share my location'}
            </button>
          )}
        </div>
      </div>

      {status && (
        <p className="text-gray-400 text-sm">{status}</p>
      )}

      <div
        ref={mapRef}
        className="w-full rounded-xl overflow-hidden border border-gray-800"
        style={{ height: '520px' }}
      />

      <p className="text-gray-600 text-xs">
        Your location is shared with nearby users. Click "Stop sharing" to remove it.
        Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap</a> contributors.
      </p>
    </div>
  )
}
