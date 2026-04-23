import { useState, type FormEvent } from 'react'
import { SectionCard } from './SectionCard'

type User = {
  id: number
  name: string
  role: 'Student' | 'Admin'
  mobGroup: string
}

const initialUsers: User[] = [
  { id: 1, name: 'Sara', role: 'Student', mobGroup: 'Mob Alpha' },
  { id: 2, name: 'Alex', role: 'Student', mobGroup: 'Mob Beta' },
  { id: 3, name: 'Emma', role: 'Admin', mobGroup: 'Mob Gamma' },
]

const mobGroups = ['Mob Alpha', 'Mob Beta', 'Mob Gamma']

function createUser(name: string, role: User['role'], mobGroup: string): User {
  return {
    id: Date.now(),
    name: name.trim(),
    role,
    mobGroup,
  }
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [name, setName] = useState('')
  const [role, setRole] = useState<User['role']>('Student')
  const [mobGroup, setMobGroup] = useState(mobGroups[0])

  const handleAddUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) {
      return
    }

    setUsers((currentUsers) => [createUser(trimmedName, role, mobGroup), ...currentUsers])
    setName('')
    setRole('Student')
    setMobGroup(mobGroups[0])
  }

  const handleDeleteUser = (userId: number) => {
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId))
  }

  return (
    <SectionCard label="Users" title="User Management">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <form
          onSubmit={handleAddUser}
          className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5"
        >
          <h3 className="text-lg font-bold text-slate-900">Add New User</h3>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">User Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jamie"
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as User['role'])}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Mob Group</span>
              <select
                value={mobGroup}
                onChange={(event) => setMobGroup(event.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              >
                {mobGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">
              Add User
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-slate-900">Current Users</h3>

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
                    <p className="mt-2 text-sm text-slate-600">Mob Group: {user.mobGroup}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user.id)}
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm ring-1 ring-inset ring-violet-200 transition hover:bg-violet-50 sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-500">Dummy data only. Backend data can replace this later.</p>
        </div>
      </div>
    </SectionCard>
  )
}