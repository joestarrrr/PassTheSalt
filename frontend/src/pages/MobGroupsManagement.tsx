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
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null)
  const [draftNames, setDraftNames] = useState<Record<number, string>>({})
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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

  const startRenamingGroup = (group: MobGroup) => {
    setEditingGroupId(group.id)
    setDraftNames((currentDraftNames) => ({
      ...currentDraftNames,
      [group.id]: group.name,
    }))
    setFeedback(null)
  }

  const cancelRenamingGroup = () => {
    setEditingGroupId(null)
  }

  const handleRenameGroup = async (groupId: number) => {
    const nextName = (draftNames[groupId] ?? '').trim()

    if (!nextName) {
      setFeedback({
        type: 'error',
        message: 'Group name cannot be empty.',
      })
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/mob-groups/${groupId}/rename`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: nextName }),
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        throw new Error(errorMessage || 'Unable to rename mob group.')
      }

      setGroups((currentGroups) =>
        currentGroups.map((group) => (group.id === groupId ? { ...group, name: nextName } : group)),
      )
      setEditingGroupId(null)
      setFeedback({
        type: 'success',
        message: 'Mob group name updated successfully.',
      })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to rename mob group.',
      })
    }
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

          {feedback ? (
            <div
              className={`rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200'}`}
            >
              {feedback.message}
            </div>
          ) : null}

          {groups.map((group) => (
            <div key={group.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  {editingGroupId === group.id ? (
                    <label className="block max-w-md">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Rename mob group
                      </span>
                      <input
                        type="text"
                        value={draftNames[group.id] ?? group.name}
                        onChange={(event) =>
                          setDraftNames((currentDraftNames) => ({
                            ...currentDraftNames,
                            [group.id]: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                      />
                    </label>
                  ) : (
                    <p className="font-semibold text-slate-900">{group.name}</p>
                  )}
                  <p className="mt-1 text-sm text-slate-600">{group.members} members</p>
                  <p className="text-sm text-slate-600">Days in course: {group.daysInCourse}</p>
                  <p className="text-sm text-slate-600">Created: {group.createdAt}</p>
                </div>

                {group.createdByAdmin ? (
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    {editingGroupId === group.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRenameGroup(group.id)}
                          className="w-full rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 sm:w-auto"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelRenamingGroup}
                          className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startRenamingGroup(group)}
                        className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                      >
                        Rename
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteGroup(group.id)}
                      className="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-inset ring-violet-200 hover:bg-violet-50 sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
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