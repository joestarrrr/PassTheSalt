import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { assignUserToCourse, getAdminUsers, getCourses } from '../api.js'
import type { Course } from '../types/course'
import type { UserSummary } from '../types/user'

type Feedback = { type: 'success' | 'error'; message: string } | null

export function UserManagementPage() {
  const queryClient = useQueryClient()
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => getCourses() as Promise<Course[]>,
  })

  const usersQuery = useQuery<UserSummary[]>({
    queryKey: ['admin-users', selectedCourseId],
    queryFn: () => getAdminUsers(selectedCourseId ? Number(selectedCourseId) : undefined) as Promise<UserSummary[]>,
  })

  const assignCourseMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: number; courseId: number }) =>
      assignUserToCourse({ userId, courseId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setFeedback({ type: 'success', message: 'User assigned to course successfully.' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to assign user to course.' })
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <label className="block flex-1 min-w-[200px]">
          <span className="mb-1 block text-sm font-medium text-white/60">Filter by course</span>
          <select
            value={selectedCourseId}
            onChange={(event) => setSelectedCourseId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 [color-scheme:dark]"
          >
            <option value="">All courses</option>
            {(coursesQuery.data ?? []).map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
      </div>

        {feedback ? (
          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${feedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {feedback.message}
          </div>
        ) : null}

        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
          {usersQuery.isLoading ? (
            <p className="text-sm text-white/40">Loading users...</p>
          ) : (usersQuery.data ?? []).length === 0 ? (
            <p className="text-sm text-white/40">No users found.</p>
          ) : (
            (usersQuery.data ?? []).map((user) => (
              <div key={user.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-white">{user.fullName}</p>
                      <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-300">
                        {user.role}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/50">{user.email}</p>
                    <p className="mt-1 text-sm text-white/50">Current course: {user.courseId ?? 'Not assigned'}</p>
                  </div>

                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <select
                      defaultValue={user.courseId ?? ''}
                      onChange={(event) => {
                        const courseId = Number(event.target.value)
                        if (!courseId) {
                          return
                        }

                        assignCourseMutation.mutate({ userId: user.id, courseId })
                      }}
                      className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60 sm:w-auto"
                    >
                      <option value="">Assign course...</option>
                      {(coursesQuery.data ?? []).map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  )
}
