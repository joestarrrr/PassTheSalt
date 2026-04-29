import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCourse, getCourses } from '../api'

type Course = {
  id: number
  name: string
  numberOfDays: number
  startDate: string
}

type Feedback = { type: 'success' | 'error'; message: string } | null

type CreateCourseInput = {
  name: string
  numberOfDays: number
  startDate: string
}

export function AdminCourseManagementPage() {
  const queryClient = useQueryClient()
  const [courseName, setCourseName] = useState('')
  const [numberOfDays, setNumberOfDays] = useState<number>(1)
  const [startDate, setStartDate] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => getCourses() as Promise<Course[]>,
  })

  const createMutation = useMutation<unknown, Error, CreateCourseInput>({
    mutationFn: (variables) =>
      createCourse({
        name: variables.name,
        numberOfDays: variables.numberOfDays,
        startDate: variables.startDate,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses'] })
      setCourseName('')
      setNumberOfDays(1)
      setStartDate('')
      setFeedback({ type: 'success', message: 'Course created successfully!' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to create course' })
    },
  })

  const handleCreateCourse = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!courseName.trim() || !startDate) {
      setFeedback({ type: 'error', message: 'Please fill in all fields' })
      return
    }

    createMutation.mutate({
      name: courseName,
      numberOfDays,
      startDate,
    })
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-4 py-6 text-slate-800 dark:bg-[radial-gradient(circle_at_top,_#1a1a2e_0%,_#16213e_30%,_#0f3460_100%)] dark:text-slate-100 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/80 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Course Management</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Create & Manage Courses</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Set up courses with specific start dates and durations. Courses automatically generate daily pages for retro submissions.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleCreateCourse} className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900/50 dark:bg-slate-800/70">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Course</h3>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Course Name</span>
                <input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. JavaScript Bootcamp"
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-violet-600 dark:focus:ring-violet-500/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Number of Days</span>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={numberOfDays}
                  onChange={(e) => setNumberOfDays(Number(e.target.value))}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600 dark:focus:ring-violet-500/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600 dark:focus:ring-violet-500/30"
                />
              </label>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300 dark:bg-violet-700 dark:hover:bg-violet-600"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>

          <div className="space-y-3 rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Courses</h3>

            {feedback && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {coursesQuery.isLoading ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">Loading courses...</p>
            ) : (coursesQuery.data ?? []).length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">No courses yet. Create one to get started!</p>
            ) : (
              (coursesQuery.data ?? []).map((course) => (
                <div key={course.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                  <p className="font-semibold text-slate-900 dark:text-white">{course.name}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Days: {course.numberOfDays}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Start: {course.startDate}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
