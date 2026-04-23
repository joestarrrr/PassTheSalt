import { useState, type FormEvent } from 'react'
import { SectionCard } from './SectionCard'

type EventItem = {
  id: number
  name: string
  date: string
  status: string
}

const initialEvents: EventItem[] = [
  { id: 1, name: 'Coffee & Code', date: 'May 14', status: 'Planned' },
  { id: 2, name: 'Study Jam', date: 'May 18', status: 'Open' },
  { id: 3, name: 'Retro Walk', date: 'May 21', status: 'Draft' },
]

function createEvent(name: string, date: string): EventItem {
  return {
    id: Date.now(),
    name: name.trim(),
    date: date.trim(),
    status: 'Draft',
  }
}

export function AfterworkEventsManagement() {
  const [events, setEvents] = useState(initialEvents)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')

  const handleAddEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !date.trim()) {
      return
    }

    setEvents((currentEvents) => [createEvent(name, date), ...currentEvents])

    setName('')
    setDate('')
  }

  const handleDeleteEvent = (eventId: number) => {
    setEvents((currentEvents) => currentEvents.filter((item) => item.id !== eventId))
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
                value={date}
                onChange={(event) => setDate(event.target.value)}
                placeholder="May 24"
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

          {events.map((eventItem) => (
            <div key={eventItem.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{eventItem.name}</p>
                  <p className="mt-1 text-sm text-slate-600">Date: {eventItem.date}</p>
                  <p className="text-sm text-slate-600">Status: {eventItem.status}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteEvent(eventItem.id)}
                  className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}