import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Marker {
  id: string
  lng: number
  lat: number
  votes: number
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
const MIN_DISTANCE = 0.01 // Prevent markers within ~1km of each other

export function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return

    mapboxgl.accessToken = MAPBOX_TOKEN
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [18.0686, 59.3293],
      zoom: 12,
    })

    // Handle map click to add marker
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat

      // Check if marker already exists too close
      const tooClose = markers.some(
        (m) =>
          Math.abs(m.lng - lng) < MIN_DISTANCE &&
          Math.abs(m.lat - lat) < MIN_DISTANCE
      )

      if (tooClose) {
        alert('Marker too close to existing one')
        return
      }

      // Create new marker
      const newMarker: Marker = {
        id: `marker-${Date.now()}`,
        lng,
        lat,
        votes: 0,
      }

      setMarkers((prev) => [...prev, newMarker])
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Update markers on map when state changes
  useEffect(() => {
    if (!map.current || !markersRef.current) return

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    // Add new markers
    markers.forEach((markerData) => {
      const el = document.createElement('div')
      el.className = 'marker'
      el.style.width = '32px'
      el.style.height = '32px'
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/blue_marker.png)'
      el.style.backgroundSize = 'contain'
      el.style.cursor = 'pointer'

      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(map.current!)

      // Click marker to show popup
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        showPopup(markerData)
      })

      markersRef.current?.set(markerData.id, marker)
    })
  }, [markers])

  const showPopup = (markerData: Marker) => {
    if (!map.current) return

    const popupContent = document.createElement('div')
    popupContent.innerHTML = `
      <div style="padding: 10px; font-size: 14px;">
        <p><strong>Location</strong></p>
        <p>Lat: ${markerData.lat.toFixed(4)}</p>
        <p>Lng: ${markerData.lng.toFixed(4)}</p>
        <p style="margin: 10px 0;"><strong>Votes: ${markerData.votes}</strong></p>
        <button id="vote-btn" style="
          padding: 6px 12px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        ">Vote</button>
      </div>
    `

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setLngLat([markerData.lng, markerData.lat])
      .setDOMContent(popupContent)
      .addTo(map.current)

    // Handle vote button
    const voteBtn = popupContent.querySelector('#vote-btn')
    if (voteBtn) {
      voteBtn.addEventListener('click', () => {
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === markerData.id ? { ...m, votes: m.votes + 1 } : m
          )
        )
        popup.remove()
      })
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        <p>Click on map to add afterwork location</p>
        <p>Total markers: {markers.length}</p>
      </div>
    </div>
  )
}
