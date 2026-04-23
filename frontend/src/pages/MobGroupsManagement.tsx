import { useState, type FormEvent } from 'react'
import { SectionCard } from './SectionCard'

type MobGroup = {
  id: number
  name: string
  members: number
  daysInCourse: number
  createdAt: string
  createdByAdmin: boolean
}

const initialGroups: MobGroup[] = [
  { id: 1, name: 'Mob Alpha', members: 10, daysInCourse: 14, createdAt: 'May 12, 2026', createdByAdmin: true },
  { id: 2, name: 'Mob Beta', members: 5, daysInCourse: 21, createdAt: 'May 10, 2026', createdByAdmin: false },
  { id: 3, name: 'Mob Gamma', members: 3, daysInCourse: 7, createdAt: 'May 08, 2026', createdByAdmin: true },
]

function createMobGroup(name: string, daysInCourse: string): MobGroup {
  return {
    id: Date.now(),
    name: name.trim(),
    members: 0,
    daysInCourse: Number(daysInCourse),
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    createdByAdmin: true,
  }
}

export function MobGroupsManagement() {
  const [groups, setGroups] = useState(initialGroups)
  const [name, setName] = useState('')
  const [daysInCourse, setDaysInCourse] = useState('')

  const handleAddGroup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !daysInCourse.trim()) {
      return
    }

    setGroups((currentGroups) => [createMobGroup(name, daysInCourse), ...currentGroups])

    setName('')
    setDaysInCourse('')
  }

  const handleDeleteGroup = (groupId: number) => {
    setGroups((currentGroups) => currentGroups.filter((group) => group.id !== groupId || !group.createdByAdmin))
  }

  return (
    <SectionCard label="Mob Groups" title="Mob Groups Management">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleAddGroup} className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
          <h3 className="text-lg font-bold text-slate-900">Add New Mob Group</h3>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Group Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Mob Delta"
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Days in Course</span>
              <input
                type="number"
                min="1"
                value={daysInCourse}
                onChange={(event) => setDaysInCourse(event.target.value)}
                placeholder="18"
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              />
            </label>

            <button type="submit" className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">
              Create Group
            </button>
          </div>
        </form>

        <div className="space-y-3 rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-slate-900">Current Mob Groups</h3>

          {groups.map((group) => (
            <div key={group.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{group.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{group.members} members</p>
                  <p className="text-sm text-slate-600">Days in course: {group.daysInCourse}</p>
                  <p className="text-sm text-slate-600">Created: {group.createdAt}</p>
                </div>

                {group.createdByAdmin ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteGroup(group.id)}
                    className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                  >
                    Delete
                  </button>
                ) : (
                  <span className="w-full rounded-full bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-400 sm:w-auto">
                    Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}