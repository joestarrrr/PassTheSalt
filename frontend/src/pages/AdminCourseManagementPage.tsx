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
  const [numberOfDaysInput, setNumberOfDaysInput] = useState('1')
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
      setNumberOfDaysInput('1')
      setStartDate('')
      setFeedback({ type: 'success', message: 'Course created successfully!' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to create course' })
    },
  })

  const handleCreateCourse = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const parsedNumberOfDays = Number.parseInt(numberOfDaysInput, 10)

    if (!courseName.trim() || !startDate || !Number.isFinite(parsedNumberOfDays) || parsedNumberOfDays < 1 || parsedNumberOfDays > 365) {
      setFeedback({ type: 'error', message: 'Please fill in all fields' })
      return
    }

    createMutation.mutate({
      name: courseName,
      numberOfDays: parsedNumberOfDays,
      startDate,
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={handleCreateCourse} className="rounded-3xl border border-violet-500/20 bg-violet-500/8 p-5">
            <h3 className="text-lg font-bold text-white">Create New Course</h3>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white/60">Course Name</span>
                <input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. JavaScript Bootcamp"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white/60">Number of Days</span>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={numberOfDaysInput}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '')
                    const withoutLeadingZeros = digitsOnly.replace(/^0+(?=\d)/, '')
                    setNumberOfDaysInput(withoutLeadingZeros)
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-white/60">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 [color-scheme:dark]"
                />
              </label>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-white">Active Courses</h3>

            {feedback && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {coursesQuery.isLoading ? (
              <p className="text-sm text-white/40">Loading courses...</p>
            ) : (coursesQuery.data ?? []).length === 0 ? (
              <p className="text-sm text-white/40">No courses yet. Create one to get started!</p>
            ) : (
              (coursesQuery.data ?? []).map((course) => (
                <div key={course.id} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <p className="font-semibold text-white">{course.name}</p>
                  <p className="mt-1 text-sm text-white/50">Days: {course.numberOfDays}</p>
                  <p className="text-sm text-white/50">Start: {course.startDate}</p>
                </div>
              ))
            )}
          </div>
        </div>
  )
}
