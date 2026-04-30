import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { renameMobGroup } from '../api.js'
import { SectionCard } from './SectionCard'

type MobGroup = {
  id: number
  name: string
  members: number
  daysInCourse: number
  createdAt: string
  createdByAdmin: boolean
}

type RenameMobGroupResponse = {
  mobGroupName?: string
  name?: string
}

const groupsData: MobGroup[] = [
  { id: 1, name: 'Mob Alpha', members: 10, daysInCourse: 14, createdAt: 'May 12, 2026', createdByAdmin: true },
  { id: 2, name: 'Mob Beta', members: 5, daysInCourse: 21, createdAt: 'May 10, 2026', createdByAdmin: false },
  { id: 3, name: 'Mob Gamma', members: 3, daysInCourse: 7, createdAt: 'May 08, 2026', createdByAdmin: true },
]

export function MobGroupsManagement() {
  const [groups, setGroups] = useState(groupsData)
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null)
  const [draftName, setDraftName] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const renameMutation = useMutation({
    mutationFn: ({ groupId, name }: { groupId: number; name: string }) =>
      renameMobGroup(groupId, name) as Promise<RenameMobGroupResponse>,
    onMutate: () => {
      setFeedback({ type: 'info', message: 'Saving mob group name...' })
    },
    onSuccess: (updatedGroup, variables) => {
      const nextName = updatedGroup.mobGroupName ?? updatedGroup.name ?? draftName.trim()
      setGroups((currentGroups) =>
        currentGroups.map((group) => (group.id === variables.groupId ? { ...group, name: nextName } : group)),
      )
      setEditingGroupId(null)
      setDraftName('')
      setFeedback({ type: 'success', message: 'Mob group name updated successfully.' })
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to rename mob group.',
      })
    },
  })

  const handleRenameGroup = (groupId: number) => {
    if (!draftName.trim()) {
      setFeedback({ type: 'error', message: 'Group name cannot be empty.' })
      return
    }

    renameMutation.mutate({ groupId, name: draftName.trim() })
  }

  const startRenamingGroup = (group: MobGroup) => {
    setEditingGroupId(group.id)
    setDraftName(group.name)
    setFeedback(null)
  }

  const cancelRenamingGroup = () => {
    setEditingGroupId(null)
    setDraftName('')
  }

  return (
    <SectionCard label="Mob Groups" title="Mob Groups Management">
      <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <h3 className="text-lg font-bold text-white">Current Mob Groups</h3>

        {feedback && (
          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : feedback.type === 'info' ? 'bg-sky-500/10 text-sky-300' : 'bg-rose-500/10 text-rose-400'}`}>
            {feedback.message}
          </div>
        )}

        {groups.map((group) => (
          <div key={group.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {editingGroupId === group.id ? (
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
                    placeholder="New group name"
                  />
                ) : (
                  <p className="font-semibold text-white">{group.name}</p>
                )}
                <p className="mt-1 text-sm text-white/50">{group.members} members</p>
                <p className="text-sm text-white/50">Days in course: {group.daysInCourse}</p>
                <p className="text-sm text-white/50">Created: {group.createdAt}</p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                {editingGroupId === group.id ? (
                  <>
                    <button
                      onClick={() => handleRenameGroup(group.id)}
                      type="button"
                      disabled={renameMutation.isPending}
                      className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:from-violet-500 hover:to-fuchsia-500 sm:w-auto"
                    >
                      {renameMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelRenamingGroup}
                      type="button"
                      disabled={renameMutation.isPending}
                      className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startRenamingGroup(group)}
                    type="button"
                    className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 sm:w-auto"
                  >
                    Rename
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
