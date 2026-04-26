import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMobGroup, getCourses } from '../api'

type Course = {
  id: number
  name: string
}

type Feedback = { type: 'success' | 'error'; message: string } | null

type CreateMobGroupInput = {
  courseId: number
  name: string
  description: string
}

export function AdminMobGroupManagementPage() {
  const queryClient = useQueryClient()
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [mobGroupName, setMobGroupName] = useState('')
  const [mobGroupDesc, setMobGroupDesc] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => getCourses() as Promise<Course[]>,
  })

  const createMobGroupMutation = useMutation<unknown, Error, CreateMobGroupInput>({
    mutationFn: (variables) =>
      createMobGroup({
        courseId: variables.courseId,
        name: variables.name,
        description: variables.description,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['mobgroups'] })
      setMobGroupName('')
      setMobGroupDesc('')
      setFeedback({ type: 'success', message: 'Mob group created successfully!' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to create mob group' })
    },
  })

  const handleCreateMobGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedCourseId || !mobGroupName.trim()) {
      setFeedback({ type: 'error', message: 'Please select a course and enter a mob group name' })
      return
    }

    createMobGroupMutation.mutate({
      courseId: parseInt(selectedCourseId),
      name: mobGroupName,
      description: mobGroupDesc,
    })
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-4 py-6 text-slate-800 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Mob Group Management</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Create Mob Groups</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Organize students into mob groups within each course. Users can be assigned to mob groups to submit retros together.
          </p>
        </header>

        <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
          <h3 className="text-lg font-bold text-slate-900">Create New Mob Group</h3>

          <form onSubmit={handleCreateMobGroup} className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Select Course</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              >
                <option value="">Choose a course...</option>
                {(coursesQuery.data ?? []).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Mob Group Name</span>
              <input
                value={mobGroupName}
                onChange={(e) => setMobGroupName(e.target.value)}
                placeholder="e.g. Mob Alpha"
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Description (Optional)</span>
              <input
                value={mobGroupDesc}
                onChange={(e) => setMobGroupDesc(e.target.value)}
                placeholder="e.g. Frontend specialists"
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
              />
            </label>

            {feedback && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={createMobGroupMutation.isPending}
              className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:bg-violet-300"
            >
              {createMobGroupMutation.isPending ? 'Creating...' : 'Create Mob Group'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
