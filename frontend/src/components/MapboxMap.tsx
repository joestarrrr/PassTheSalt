import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  deleteAwLocation,
  createAwLocation,
  getAwLocations,
  getWinningAwLocation,
  removeAwVote,
  updateAwLocation,
  voteAwLocation,
} from '../api.js'
import type { AwLocation } from '../types/aw'
import { getSessionToken } from '../auth/sessionToken'
import { useAuthSession } from '../auth/AuthSession'

type MapboxMapProps = {
  courseId?: number | null
}

type Feedback = {
  type: 'success' | 'error'
  message: string
}

const MAPBOX_TOKEN =
  (import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || '').trim()

const OSM_FALLBACK_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '(c) OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
} as mapboxgl.Style

function getAuthToken() {
  return getSessionToken()
}

function buildPopupContent(location: AwLocation) {
  const wrapper = document.createElement('div')
  wrapper.className = 'space-y-3 rounded-2xl bg-white p-1 text-slate-800'
  let removeVoteButton: HTMLButtonElement | null = null

  const title = document.createElement('p')
  title.className = 'text-sm font-semibold text-slate-900'
  title.textContent = location.name

  const meta = document.createElement('p')
  meta.className = 'text-xs text-slate-500'
  meta.textContent = `Votes: ${location.voteCount}`

  const creator = document.createElement('p')
  creator.className = 'text-xs text-slate-500'
  creator.textContent = `Suggested by ${location.createdByName}`

  const voteButton = document.createElement('button')
  voteButton.type = 'button'
  voteButton.className = 'w-full rounded-full bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300'
  voteButton.textContent = location.votedByCurrentUser ? 'Already voted' : 'Vote for location'
  voteButton.disabled = location.votedByCurrentUser
  voteButton.setAttribute('data-action', 'vote')

  voteButton.className = 'w-full rounded-full bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300'

  wrapper.append(title, meta, creator, voteButton)

  if (location.votedByCurrentUser) {
    removeVoteButton = document.createElement('button')
    removeVoteButton.type = 'button'
    removeVoteButton.className = 'w-full rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50'
    removeVoteButton.textContent = 'Remove vote'
    removeVoteButton.setAttribute('data-action', 'remove-vote')
    wrapper.append(removeVoteButton)
  }
  return wrapper
}

export function MapboxMap({ courseId = null }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const markersRef = useRef<Map<number, mapboxgl.Marker>>(new Map())
  const queryClient = useQueryClient()
  const { backendUser } = useAuthSession()
  const [mapReady, setMapReady] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [draftPoint, setDraftPoint] = useState<{ lng: number; lat: number } | null>(null)
  const [locationName, setLocationName] = useState('')
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null)
  const [selectedLocationName, setSelectedLocationName] = useState('')

  const authToken = getAuthToken()
  const hasCourse = Boolean(courseId)
  const hasAuthToken = Boolean(authToken)
  const enabled = Boolean(courseId && hasAuthToken)

  const locationsQuery = useQuery<AwLocation[]>({
    queryKey: ['aw-locations', courseId, authToken],
    queryFn: () => getAwLocations(courseId as number) as Promise<AwLocation[]>,
    enabled,
    retry: false,
  })

  const winnerQuery = useQuery<AwLocation>({
    queryKey: ['aw-winning-location', courseId, authToken],
    queryFn: () => getWinningAwLocation(courseId as number) as Promise<AwLocation>,
    enabled,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: (input: { courseId: number; name: string; lng: number; lat: number }) =>
      createAwLocation(input) as Promise<AwLocation>,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aw-locations', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['aw-winning-location', courseId] })
      setDraftPoint(null)
      setLocationName('')
      setFeedback({ type: 'success', message: 'Location suggestion created.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to create location.' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (input: { locationId: number; name: string }) =>
      updateAwLocation(input.locationId, { name: input.name }) as Promise<AwLocation>,
    onSuccess: (updatedLocation) => {
      void queryClient.invalidateQueries({ queryKey: ['aw-locations', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['aw-winning-location', courseId] })
      setSelectedLocationName(updatedLocation.name)
      setFeedback({ type: 'success', message: 'Location updated.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update location.' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (locationId: number) => deleteAwLocation(locationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aw-locations', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['aw-winning-location', courseId] })
      popupRef.current?.remove()
      setSelectedLocationId(null)
      setSelectedLocationName('')
      setFeedback({ type: 'success', message: 'Location deleted.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to delete location.' })
    },
  })

  const voteMutation = useMutation({
    mutationFn: (locationId: number) => voteAwLocation(locationId) as Promise<AwLocation>,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aw-locations', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['aw-winning-location', courseId] })
      popupRef.current?.remove()
      setFeedback({ type: 'success', message: 'Vote recorded.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to vote.' })
    },
  })

  const removeVoteMutation = useMutation({
    mutationFn: (locationId: number) => removeAwVote(locationId) as Promise<AwLocation>,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['aw-locations', courseId] })
      void queryClient.invalidateQueries({ queryKey: ['aw-winning-location', courseId] })
      popupRef.current?.remove()
      setFeedback({ type: 'success', message: 'Vote removed.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to remove vote.' })
    },
  })

  useEffect(() => {
    if (!hasCourse) {
      return
    }

    if (!mapContainer.current) {
      return
    }

    try {
      setMapError(null)

      if (MAPBOX_TOKEN) {
        mapboxgl.accessToken = MAPBOX_TOKEN
      }

      let switchedToFallback = false
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: MAPBOX_TOKEN ? 'mapbox://styles/mapbox/streets-v12' : (OSM_FALLBACK_STYLE as mapboxgl.Style),
        center: [18.0686, 59.3293],
        zoom: 12,
      })

      mapInstance.on('click', (event) => {
        setSelectedLocationId(null)
        setSelectedLocationName('')
        setDraftPoint({ lng: event.lngLat.lng, lat: event.lngLat.lat })
        setLocationName('')
        setFeedback(null)
      })

      mapInstance.on('error', (event) => {
        const message = event.error?.message ?? 'Map rendering failed. Check token and network access.'
        const isMapboxAuthError = /401|403|forbidden|unauthorized|access token|not authorized/i.test(message)

        if (!switchedToFallback && MAPBOX_TOKEN && isMapboxAuthError) {
          switchedToFallback = true
          mapInstance.setStyle(OSM_FALLBACK_STYLE as mapboxgl.Style)
          setMapError('Mapbox tiles were blocked for this environment. Using OpenStreetMap fallback.')
          return
        }

        setMapError(message)
      })

      mapInstance.on('load', () => {
        mapInstance.resize()
      })

      const handleResize = () => mapInstance.resize()
      window.addEventListener('resize', handleResize)

      map.current = mapInstance
      setMapReady(true)

      return () => {
        popupRef.current?.remove()
        window.removeEventListener('resize', handleResize)
        mapInstance.remove()
        map.current = null
        setMapReady(false)
      }
    } catch (error) {
      setMapError(error instanceof Error ? error.message : 'Failed to initialize map.')
      return
    }
  }, [hasCourse])

  const selectedLocation = selectedLocationId
    ? (locationsQuery.data ?? []).find((location) => location.id === selectedLocationId) ?? null
    : null
  const canManageSelectedLocation = Boolean(
    selectedLocation &&
      (backendUser?.role === 'admin' || backendUser?.id === selectedLocation.createdByUserId),
  )

  useEffect(() => {
    if (!map.current || !mapReady) {
      return
    }

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current.clear()

    for (const location of locationsQuery.data ?? []) {
      const markerElement = document.createElement('div')
      markerElement.className = 'group flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-[10px] font-bold text-white shadow-lg shadow-violet-500/30 transition hover:scale-110'
      markerElement.textContent = `${location.voteCount}`

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([location.lng, location.lat])
        .addTo(map.current)

      markerElement.addEventListener('click', (event) => {
        event.stopPropagation()

        setDraftPoint(null)
        setSelectedLocationId(location.id)
        setSelectedLocationName(location.name)
        popupRef.current?.remove()
        const popup = new mapboxgl.Popup({ offset: 18, closeButton: true, maxWidth: '280px' })
          .setLngLat([location.lng, location.lat])
          .setDOMContent(buildPopupContent(location))
          .addTo(map.current!)

        popupRef.current = popup

        const popupElement = popup.getElement()
        if (!popupElement) {
          return
        }

        const voteButton = popupElement.querySelector('[data-action="vote"]')
        const removeVoteButton = popupElement.querySelector('[data-action="remove-vote"]')

        voteButton?.addEventListener('click', () => voteMutation.mutate(location.id))
        removeVoteButton?.addEventListener('click', () => removeVoteMutation.mutate(location.id))
      })

      markersRef.current.set(location.id, marker)
    }
  }, [locationsQuery.data, mapReady])

  useEffect(() => {
    if (!selectedLocation) {
      return
    }

    if (!selectedLocationName) {
      setSelectedLocationName(selectedLocation.name)
    }
  }, [selectedLocation, selectedLocationName])

  const handleCreateLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!courseId || !draftPoint || !locationName.trim()) {
      setFeedback({ type: 'error', message: 'Enter a location name before saving.' })
      return
    }

    createMutation.mutate({
      courseId,
      name: locationName.trim(),
      lng: draftPoint.lng,
      lat: draftPoint.lat,
    })
  }

  const handleUpdateLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedLocation || !selectedLocationName.trim()) {
      setFeedback({ type: 'error', message: 'Enter a new name before saving.' })
      return
    }

    updateMutation.mutate({
      locationId: selectedLocation.id,
      name: selectedLocationName.trim(),
    })
  }

  if (!courseId) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50/60 px-6 text-center text-sm text-slate-600">
        Select a course to load the map and afterwork locations.
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-100 transition-colors">
      <div ref={mapContainer} className="absolute inset-0" />

      {mapError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 px-6 text-center text-sm text-rose-200">
          <div className="max-w-lg rounded-2xl border border-rose-400/30 bg-rose-950/40 p-4">
            <p className="font-semibold text-rose-100">Map unavailable</p>
            <p className="mt-2">{mapError}</p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-sm space-y-3">
        {!hasAuthToken ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/95 px-4 py-3 text-sm text-amber-800 shadow-2xl backdrop-blur">
            Sign in with Clerk to load afterwork locations.
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 shadow-2xl backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">Afterwork Locations</p>
          <p className="mt-2 text-sm text-slate-600">
            Click the map to suggest a new location. Click a marker to vote or remove your vote.
          </p>
        </div>

        {locationsQuery.isError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/95 px-4 py-3 text-sm text-rose-700 shadow-2xl backdrop-blur">
            {locationsQuery.error instanceof Error ? locationsQuery.error.message : 'Failed to load afterwork locations.'}
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-900 shadow-2xl backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Winning Location</p>
          {winnerQuery.isLoading ? (
            <p className="mt-2 text-sm text-slate-500">Calculating winner...</p>
          ) : winnerQuery.data ? (
            <div className="mt-2 space-y-1">
              <p className="text-base font-semibold text-slate-900">{winnerQuery.data.name}</p>
              <p className="text-sm text-slate-600">{winnerQuery.data.voteCount} votes</p>
              <p className="text-xs text-slate-500">Suggested by {winnerQuery.data.createdByName}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No votes yet.</p>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`absolute right-4 top-4 z-10 rounded-2xl px-4 py-3 text-sm font-medium shadow-xl backdrop-blur ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {draftPoint && (
        <form
          onSubmit={handleCreateLocation}
          className="absolute bottom-4 left-4 z-10 w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">New Suggestion</p>
          <p className="mt-2 text-sm text-slate-500">
            {draftPoint.lat.toFixed(4)}, {draftPoint.lng.toFixed(4)}
          </p>

          <label className="mt-3 block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Location name</span>
            <input
              value={locationName}
              onChange={(event) => setLocationName(event.target.value)}
              placeholder="Kaffebaren, rooftop bar, ..."
              className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
            />
          </label>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300"
            >
              {createMutation.isPending ? 'Saving...' : 'Save suggestion'}
            </button>
            <button
              type="button"
              onClick={() => setDraftPoint(null)}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {selectedLocation && (
        <div className="absolute bottom-4 left-4 z-10 w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-500">Selected Location</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">{selectedLocation.name}</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedLocationId(null)
                setSelectedLocationName('')
              }}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="mt-3 grid gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p>Votes: {selectedLocation.voteCount}</p>
            <p>Suggested by: {selectedLocation.createdByName}</p>
            <p>
              Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {canManageSelectedLocation ? (
              <form onSubmit={handleUpdateLocation} className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Rename location</span>
                  <input
                    value={selectedLocationName}
                    onChange={(event) => setSelectedLocationName(event.target.value)}
                    className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300"
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(selectedLocation.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-full border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-slate-600">You can vote on this location, but only the creator or an admin can edit it.</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => voteMutation.mutate(selectedLocation.id)}
                disabled={selectedLocation.votedByCurrentUser || voteMutation.isPending}
                className="flex-1 rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300"
              >
                {selectedLocation.votedByCurrentUser ? 'Already voted' : voteMutation.isPending ? 'Voting...' : 'Vote'}
              </button>
              {selectedLocation.votedByCurrentUser ? (
                <button
                  type="button"
                  onClick={() => removeVoteMutation.mutate(selectedLocation.id)}
                  disabled={removeVoteMutation.isPending}
                  className="rounded-full border border-violet-200 bg-white px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-60"
                >
                  {removeVoteMutation.isPending ? 'Removing...' : 'Remove vote'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-10 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-2xl backdrop-blur">
        <p className="font-medium text-slate-900">{locationsQuery.data?.length ?? 0} suggestions</p>
        <p className="mt-1 text-xs text-slate-500">Bearer token required for fetch, suggest, vote, and remove vote.</p>
      </div>
    </div>
  )
}
