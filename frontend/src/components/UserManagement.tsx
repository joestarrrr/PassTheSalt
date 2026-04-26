import { useState } from 'react'
import { assignUserToMobGroup } from '../api.js'
import { SectionCard } from './SectionCard'

type User = {
  id: number
  name: string
  role: 'Student' | 'Admin'
  mobGroupId: number
  mobGroup: string
}

type MobGroup = {
  id: number
  name: string
}

const initialUsers: User[] = [
  { id: 1, name: 'Sara', role: 'Student', mobGroupId: 1, mobGroup: 'Mob Group A' },
  { id: 2, name: 'Alex', role: 'Student', mobGroupId: 2, mobGroup: 'Mob Group B' },
  { id: 3, name: 'Emma', role: 'Admin', mobGroupId: 1, mobGroup: 'Mob Group A' },
]

const mobGroups: MobGroup[] = [
  { id: 1, name: 'Mob Group A' },
  { id: 2, name: 'Mob Group B' },
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [selectedGroupsByUserId, setSelectedGroupsByUserId] = useState<Record<number, number>>(
    Object.fromEntries(initialUsers.map((user) => [user.id, user.mobGroupId])),
  )
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [savingUserId, setSavingUserId] = useState<number | null>(null)

  const handleAssignUser = async (userId: number) => {
    const selectedMobGroupId = selectedGroupsByUserId[userId]
    const selectedMobGroup = mobGroups.find((group) => group.id === selectedMobGroupId)

    if (!selectedMobGroup) {
      setFeedback({ type: 'error', message: 'Please select a mob group.' })
      return
    }

    try {
      setSavingUserId(userId)
      await assignUserToMobGroup(selectedMobGroupId, userId)

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? { ...user, mobGroupId: selectedMobGroup.id, mobGroup: selectedMobGroup.name }
            : user,
        ),
      )
      setFeedback({ type: 'success', message: 'User assigned successfully.' })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to assign user to mob group.',
      })
    } finally {
      setSavingUserId(null)
    }
  }

  return (
    <SectionCard label="Users" title="User Management">
      <div className="rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5">
        <h3 className="text-lg font-bold text-slate-900">Assign Users To Mob Groups</h3>

        {feedback ? (
          <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {feedback.message}
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {user.role}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">Current Mob Group: {user.mobGroup}</p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <select
                    value={selectedGroupsByUserId[user.id]}
                    onChange={(event) =>
                      setSelectedGroupsByUserId((current) => ({
                        ...current,
                        [user.id]: Number(event.target.value),
                      }))
                    }
                    className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60 sm:w-auto"
                  >
                    {mobGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleAssignUser(user.id)}
                    disabled={savingUserId === user.id}
                    className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-300 sm:w-auto"
                  >
                    {savingUserId === user.id ? 'Assigning...' : 'Assign'}
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
