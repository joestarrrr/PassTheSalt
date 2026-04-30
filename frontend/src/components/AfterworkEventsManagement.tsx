import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAfterworkEvent,
  createUserAfterworkEvent,
  deleteAfterworkEvent,
  deleteUserAfterworkEvent,
  getAfterworkEvents,
  getUserAfterworkEvents,
  updateAfterworkEvent,
  updateUserAfterworkEvent,
} from '../api.js'
import { SectionCard } from './SectionCard'
import { MapboxMap } from './MapboxMap'
import type { AfterworkEventItem, AfterworkEventResponse } from '../types/afterwork'

type ApiScope = 'admin' | 'user'

type AfterworkEventsManagementProps = {
  apiScope?: ApiScope
  courseId?: number | null
}

function getTodayIsoDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateForUi(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? dateValue
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function mapEventForUi(event: AfterworkEventResponse): AfterworkEventItem {
  return {
    id: event.eventId,
    name: event.title,
    date: formatDateForUi(event.eventDate),
    rawDate: event.eventDate,
    status: 'Planned',
  }
}

export function AfterworkEventsManagement({ apiScope = 'admin', courseId = null }: AfterworkEventsManagementProps) {
  const queryClient = useQueryClient()
  const todayIsoDate = getTodayIsoDate()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDate, setEditDate] = useState('')
  const [pendingUpdateEventId, setPendingUpdateEventId] = useState<number | null>(null)
  const [pendingDeleteEventId, setPendingDeleteEventId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const api =
    apiScope === 'admin'
      ? {
          getAfterworkEvents,
          createAfterworkEvent,
          updateAfterworkEvent,
          deleteAfterworkEvent,
        }
      : {
          getAfterworkEvents: getUserAfterworkEvents,
          createAfterworkEvent: createUserAfterworkEvent,
          updateAfterworkEvent: updateUserAfterworkEvent,
          deleteAfterworkEvent: deleteUserAfterworkEvent,
        }

  const eventsQuery = useQuery({
    queryKey: ['afterwork-events', apiScope],
    queryFn: () => api.getAfterworkEvents() as Promise<AfterworkEventResponse[]>,
  })

  const createMutation = useMutation({
    mutationFn: (variables: { title: string; eventDate: string }) =>
      api.createAfterworkEvent({
        title: variables.title,
        eventDate: variables.eventDate,
      }) as Promise<AfterworkEventResponse>,
    onMutate: () => {
      setFeedback({ type: 'info', message: 'Creating event...' })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['afterwork-events', apiScope] })
      setName('')
      setDate('')
      setFeedback({ type: 'success', message: 'Afterwork event created.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to create event.' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (variables: { eventId: number; title: string; eventDate: string }) =>
      api.updateAfterworkEvent(variables.eventId, {
        title: variables.title,
        eventDate: variables.eventDate,
      }) as Promise<AfterworkEventResponse>,
    onMutate: (variables) => {
      setPendingUpdateEventId(variables.eventId)
      setFeedback({ type: 'info', message: 'Saving event changes...' })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['afterwork-events', apiScope] })
      setEditingEventId(null)
      setEditName('')
      setEditDate('')
      setFeedback({ type: 'success', message: 'Afterwork event updated.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to update event.' })
    },
    onSettled: () => {
      setPendingUpdateEventId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (eventId: number) => api.deleteAfterworkEvent(eventId),
    onMutate: (eventId) => {
      setPendingDeleteEventId(eventId)
      setFeedback({ type: 'info', message: 'Deleting event...' })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['afterwork-events', apiScope] })
      setFeedback({ type: 'success', message: 'Afterwork event deleted.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to delete event.' })
    },
    onSettled: () => {
      setPendingDeleteEventId(null)
    },
  })

  const events = (eventsQuery.data ?? []).map(mapEventForUi)

  const handleAddEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !date.trim()) {
      setFeedback({ type: 'error', message: 'Event name and date are required.' })
      return
    }

    if (date < todayIsoDate) {
      setFeedback({ type: 'error', message: 'You cannot create an afterwork event in the past.' })
      return
    }

    createMutation.mutate({ title: name.trim(), eventDate: date.trim() })
  }

  const startEditingEvent = (eventItem: AfterworkEventItem) => {
    setEditingEventId(eventItem.id)
    setEditName(eventItem.name)
    setEditDate(eventItem.rawDate)
    setFeedback(null)
  }

  const cancelEditingEvent = () => {
    setEditingEventId(null)
    setEditName('')
    setEditDate('')
  }

  const handleUpdateEvent = (eventId: number) => {
    if (!editName.trim() || !editDate.trim()) {
      setFeedback({ type: 'error', message: 'Event name and date are required.' })
      return
    }

    if (editDate < todayIsoDate) {
      setFeedback({ type: 'error', message: 'You cannot move an afterwork event to a past date.' })
      return
    }

    updateMutation.mutate({
      eventId,
      title: editName.trim(),
      eventDate: editDate.trim(),
    })
  }

  return (
    <SectionCard label="Afterwork Events" title="Afterwork Events Management">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleAddEvent} className="rounded-3xl border border-violet-500/20 bg-violet-500/8 p-5">
          <h3 className="text-lg font-bold text-white">Add New Event</h3>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/60">Event Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Coffee & Code"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-white/60">Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                min={todayIsoDate}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 [color-scheme:dark]"
              />
            </label>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60"
            >
              {createMutation.isPending ? 'Creating event...' : 'Create Event'}
            </button>
          </div>
        </form>

        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-white">Current Events</h3>

          {feedback && (
            <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : feedback.type === 'info' ? 'bg-sky-500/10 text-sky-300' : 'bg-rose-500/10 text-rose-400'}`}>
              {feedback.message}
            </div>
          )}

          {eventsQuery.isLoading ? <p className="text-sm text-white/40">Loading events...</p> : null}

          {!eventsQuery.isLoading && events.length === 0 && (
            <p className="text-sm text-white/40">No events yet. Create one using the form on the left.</p>
          )}

          {events.map((eventItem) => (
            <div key={eventItem.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  {editingEventId === eventItem.id ? (
                    <div className="space-y-2">
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(event) => setEditDate(event.target.value)}
                        min={todayIsoDate}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 [color-scheme:dark]"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-white">{eventItem.name}</p>
                      <p className="mt-1 text-sm text-white/50">Date: {eventItem.date}</p>
                    </>
                  )}
                  <p className="text-sm text-white/50">Status: {eventItem.status}</p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  {editingEventId === eventItem.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateEvent(eventItem.id)}
                        disabled={updateMutation.isPending && pendingUpdateEventId === eventItem.id}
                        className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60 sm:w-auto"
                      >
                        {updateMutation.isPending && pendingUpdateEventId === eventItem.id ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditingEvent}
                        disabled={updateMutation.isPending && pendingUpdateEventId === eventItem.id}
                        className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditingEvent(eventItem)}
                      className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 sm:w-auto"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(eventItem.id)}
                    disabled={deleteMutation.isPending && pendingDeleteEventId === eventItem.id}
                    className="w-full rounded-full border border-rose-500/20 bg-rose-500/8 px-4 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/15 disabled:opacity-60 sm:w-auto"
                  >
                    {deleteMutation.isPending && pendingDeleteEventId === eventItem.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-lg font-bold text-white">Event Locations & Voting</h3>
          <div className="h-[55vh] min-h-[22rem] max-h-[44rem] rounded-3xl border border-white/10 overflow-hidden">
            <MapboxMap courseId={courseId} />
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
