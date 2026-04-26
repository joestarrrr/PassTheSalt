import { useState, type FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserCourseContext, submitRetro } from '../api'

type CourseDay = {
  id: number
  courseId: number
  dayNumber: number
  date: string
}

type Feedback = { type: 'success' | 'error'; message: string } | null

type RetroInput = {
  courseId: number
  courseDayId: number
  mobGroupId: number
  userId: number
  startOfDay: string
  workedWell: string | null
  learned: string | null
  improve: string | null
  submissionDate: string
  rating: number
  lectureName: string | null
}

type UserCourseContext = {
  userId: number
  courseId: number
  courseName: string
  mobGroupId: number | null
  mobGroupName: string | null
  courseDays: CourseDay[]
}

export function UserCourseRetroPage() {
  const queryClient = useQueryClient()
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<CourseDay | null>(null)
  const [startOfDay, setStartOfDay] = useState('')
  const [workedWell, setWorkedWell] = useState('')
  const [learned, setLearned] = useState('')
  const [improve, setImprove] = useState('')
  const [rating, setRating] = useState<number>(3)
  const [lectureName, setLectureName] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [userId, setUserId] = useState<number>(1)

  const userContextQuery = useQuery<UserCourseContext>({
    queryKey: ['user-course-context', userId],
    queryFn: () => getUserCourseContext(userId) as Promise<UserCourseContext>,
    enabled: Boolean(userId),
  })

  const submitMutation = useMutation<unknown, Error, RetroInput>({
    mutationFn: (retroData) => submitRetro(retroData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['retros'] })
      // Reset form
      setStartOfDay('')
      setWorkedWell('')
      setLearned('')
      setImprove('')
      setRating(3)
      setLectureName('')
      setSelectedDayId(null)
      setFeedback({ type: 'success', message: 'Retro submitted successfully!' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to submit retro' })
    },
  })

  const handleSubmitRetro = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedDayId || !startOfDay.trim() || !userContextQuery.data?.courseId || !userContextQuery.data?.mobGroupId) {
      setFeedback({ type: 'error', message: 'Please select a day and add a start-of-day note' })
      return
    }

    const retroData: RetroInput = {
      courseId: userContextQuery.data.courseId,
      courseDayId: selectedDayId,
      mobGroupId: userContextQuery.data.mobGroupId,
      userId,
      startOfDay,
      workedWell: workedWell || null,
      learned: learned || null,
      improve: improve || null,
      submissionDate: selectedDay?.date || new Date().toISOString().split('T')[0],
      rating,
      lectureName: lectureName || null,
    }

    submitMutation.mutate(retroData)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-4 py-6 text-slate-800 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Course Retro</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Daily Retro Submission</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Share your daily reflections, what worked well, what you learned, and areas for improvement.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">User ID</span>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(Number(e.target.value))}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-2 text-sm outline-none focus:border-violet-400"
              />
            </label>
            <div className="rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-2 text-sm text-slate-700">
              <p>Course: {userContextQuery.data?.courseName ?? 'Not assigned'}</p>
              <p>Mob Group: {userContextQuery.data?.mobGroupName ?? 'Not assigned'}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Course Days Sidebar */}
          <div className="rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">Course Days</h3>

            {userContextQuery.isLoading ? (
              <p className="mt-4 text-sm text-slate-600">Loading course days...</p>
            ) : (userContextQuery.data?.courseDays ?? []).length === 0 ? (
              <p className="mt-4 text-sm text-slate-600">No course days available</p>
            ) : (
              <div className="mt-4 space-y-2">
                {(userContextQuery.data?.courseDays ?? []).map((day) => (
                  <button
                    onClick={() => {
                      setSelectedDayId(day.id)
                      setSelectedDay(day)
                    }}
                    key={day.id}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      selectedDayId === day.id
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Day {day.dayNumber}
                    <p className="mt-1 text-xs opacity-80">{day.date}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Retro Form */}
          <form onSubmit={handleSubmitRetro} className="space-y-4 rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
            <h3 className="text-lg font-bold text-slate-900">Submit Retro</h3>

            {feedback && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {feedback.message}
              </div>
            )}

            {!selectedDayId && <p className="text-sm text-slate-600">Select a day to start</p>}

            {selectedDayId && (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Start of Day Note</span>
                  <textarea
                    value={startOfDay}
                    onChange={(e) => setStartOfDay(e.target.value)}
                    placeholder="What was your focus for the day?"
                    rows={2}
                    className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">What Worked Well?</span>
                  <textarea
                    value={workedWell}
                    onChange={(e) => setWorkedWell(e.target.value)}
                    placeholder="Successes and positive moments..."
                    rows={2}
                    className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">What Did You Learn?</span>
                  <textarea
                    value={learned}
                    onChange={(e) => setLearned(e.target.value)}
                    placeholder="Key takeaways and insights..."
                    rows={2}
                    className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Areas for Improvement</span>
                  <textarea
                    value={improve}
                    onChange={(e) => setImprove(e.target.value)}
                    placeholder="What can be better next time..."
                    rows={2}
                    className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Lecture Name (Optional)</span>
                  <input
                    value={lectureName}
                    onChange={(e) => setLectureName(e.target.value)}
                    placeholder="e.g. React Hooks"
                    className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Day Rating (1-5)</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRating(r)}
                        className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${
                          rating === r
                            ? 'bg-violet-600 text-white'
                            : 'bg-white text-violet-600 ring-1 ring-violet-200 hover:bg-violet-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:bg-violet-300"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Retro'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </main>
  )
}
