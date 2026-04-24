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

type EventItem = {
  id: number
  name: string
  date: string
  rawDate: string
  status: string
}

type AfterworkEventResponse = {
  eventId: number
  title: string
  location: string
  eventDate: string
  createdByUserId: number
}

type ApiScope = 'admin' | 'user'

function formatDateForUi(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`)
  return Number.isNaN(date.getTime())
    ? dateValue
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function mapEventForUi(event: AfterworkEventResponse): EventItem {
  return {
    id: event.eventId,
    name: event.title,
    date: formatDateForUi(event.eventDate),
    rawDate: event.eventDate,
    status: 'Planned',
  }
}

export function AfterworkEventsManagement({ apiScope = 'admin' }: { apiScope?: ApiScope }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDate, setEditDate] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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
  })

  const deleteMutation = useMutation({
    mutationFn: (eventId: number) => api.deleteAfterworkEvent(eventId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['afterwork-events', apiScope] })
      setFeedback({ type: 'success', message: 'Afterwork event deleted.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to delete event.' })
    },
  })

  const events = (eventsQuery.data ?? []).map(mapEventForUi)

  const handleAddEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !date.trim()) {
      return
    }

    createMutation.mutate({ title: name.trim(), eventDate: date.trim() })
  }

  const startEditingEvent = (eventItem: EventItem) => {
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

    updateMutation.mutate({
      eventId,
      title: editName.trim(),
      eventDate: editDate.trim(),
    })
  }

  return (
    <SectionCard label="Afterwork Events" title="Afterwork Events Management">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleAddEvent} className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
          <h3 className="text-lg font-bold text-slate-900">Add New Event</h3>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Event Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Coffee & Code"
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              />
            </label>

            <button type="submit" className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">
              Create Event
            </button>
          </div>
        </form>

        <div className="space-y-3 rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-slate-900">Current Events</h3>

          {feedback && (
            <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {feedback.message}
            </div>
          )}

          {eventsQuery.isLoading ? <p className="text-sm text-slate-600">Loading events...</p> : null}

          {events.map((eventItem) => (
            <div key={eventItem.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  {editingEventId === eventItem.id ? (
                    <div className="space-y-2">
                      <input
                        value={editName}
                        onChange={(event) => setEditName(event.target.value)}
                        className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                      />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(event) => setEditDate(event.target.value)}
                        className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900">{eventItem.name}</p>
                      <p className="mt-1 text-sm text-slate-600">Date: {eventItem.date}</p>
                    </>
                  )}
                  <p className="text-sm text-slate-600">Status: {eventItem.status}</p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  {editingEventId === eventItem.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateEvent(eventItem.id)}
                        className="w-full rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 sm:w-auto"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditingEvent}
                        className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditingEvent(eventItem)}
                      className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(eventItem.id)}
                    className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}