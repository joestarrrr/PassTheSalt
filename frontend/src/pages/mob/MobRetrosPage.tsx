import { useState, type FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRetrosByCourse, getUserCourseContext, submitRetro } from '../../api'
import type { CourseDay, UserCourseContext } from '../../types/course'
import { useAuthSession } from '../../auth/AuthSession'
import { MobLayout } from '../../layout/MobLayout'

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

type RetroRecord = {
  id: number
  userId: number
  courseDayId: number
  startOfDay: string
  workedWell: string | null
  learned: string | null
  improve: string | null
  rating: number
  lectureName: string | null
  submissionDate: string
}

export function MobRetrosPage() {
  const queryClient = useQueryClient()
  const { backendUser } = useAuthSession()
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<CourseDay | null>(null)
  const [startOfDay, setStartOfDay] = useState('')
  const [workedWell, setWorkedWell] = useState('')
  const [learned, setLearned] = useState('')
  const [improve, setImprove] = useState('')
  const [rating, setRating] = useState<number>(3)
  const [lectureName, setLectureName] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [daysPage, setDaysPage] = useState(0)
  const userId = backendUser?.id ?? null
  const daysPerPage = 5

  const userContextQuery = useQuery<UserCourseContext>({
    queryKey: ['user-course-context', userId],
    queryFn: () => getUserCourseContext(userId as number) as Promise<UserCourseContext>,
    enabled: Boolean(userId),
  })

  const submitMutation = useMutation<unknown, Error, RetroInput>({
    mutationFn: (retroData) => submitRetro(retroData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['retros'] })
      void queryClient.invalidateQueries({ queryKey: ['retros', 'course', courseId] })
      setStartOfDay('')
      setWorkedWell('')
      setLearned('')
      setImprove('')
      setRating(3)
      setLectureName('')
      setFeedback({ type: 'success', message: '✓ Retro submitted successfully!' })
      setTimeout(() => setFeedback(null), 5000)
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to submit retro' })
    },
  })

  const courseId = userContextQuery.data?.courseId ?? backendUser?.courseId ?? null
  const mobGroupId = userContextQuery.data?.mobGroupId ?? backendUser?.mobGroupId ?? null
  const isNotAssigned = !userContextQuery.isLoading && (!courseId || !mobGroupId)

  const retrosQuery = useQuery<RetroRecord[]>({
    queryKey: ['retros', 'course', courseId],
    queryFn: () => getRetrosByCourse(courseId as number) as Promise<RetroRecord[]>,
    enabled: Boolean(courseId),
  })

  const myRetrosByDay = new Map<number, RetroRecord>()
  for (const retro of retrosQuery.data ?? []) {
    if (retro.userId !== userId) {
      continue
    }

    const existing = myRetrosByDay.get(retro.courseDayId)
    if (!existing || retro.submissionDate > existing.submissionDate) {
      myRetrosByDay.set(retro.courseDayId, retro)
    }
  }

  const selectedDayRetro = selectedDayId ? myRetrosByDay.get(selectedDayId) ?? null : null

  const handleSubmitRetro = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedDayId) {
      setFeedback({ type: 'error', message: '📅 Please select a course day first' })
      return
    }

    if (!startOfDay.trim()) {
      setFeedback({ type: 'error', message: '📝 Please add a start-of-day note' })
      return
    }

    if (!courseId || !mobGroupId) {
      setFeedback({ type: 'error', message: '⚠️ You are not assigned to a mob group. Ask your admin to assign you.' })
      return
    }

    if (selectedDayId && myRetrosByDay.has(selectedDayId)) {
      setFeedback({ type: 'error', message: '✅ Retro for this day is already submitted. Click another day or review below.' })
      return
    }

    const retroData: RetroInput = {
      courseId,
      courseDayId: selectedDayId,
      mobGroupId,
      userId: userId as number,
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

  const allDays = userContextQuery.data?.courseDays ?? []
  const totalPages = Math.ceil(allDays.length / daysPerPage)
  const paginatedDays = allDays.slice(daysPage * daysPerPage, (daysPage + 1) * daysPerPage)

  return (
    <MobLayout title="Daily Retros" description="Reflect on your day with your mob group and submit your insights.">
      <div className="mx-auto w-full max-w-6xl">
        {isNotAssigned && (
          <div className="mb-6 rounded-2xl bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800 border border-amber-200">
            ⚠️ You are not assigned to a mob group or course yet. Contact your admin to get assigned before submitting a retro.
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          {/* Days Sidebar */}
          <div className="rounded-3xl border border-slate-100 bg-white/90 shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4 sm:px-8">
              <h3 className="text-lg font-bold text-slate-900">📅 Course Days</h3>
            </div>

            {userContextQuery.isLoading ? (
              <div className="px-6 py-8 text-center sm:px-8">
                <p className="text-sm text-slate-600">Loading days...</p>
              </div>
            ) : allDays.length === 0 ? (
              <div className="px-6 py-8 text-center sm:px-8">
                <p className="text-sm text-slate-600">No course days available yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 px-6 py-6 sm:px-8">
                  {paginatedDays.map((day) => (
                    (() => {
                      const hasRetro = myRetrosByDay.has(day.id)
                      return (
                    <button
                      onClick={() => {
                        setSelectedDayId(day.id)
                        setSelectedDay(day)
                        setFeedback(null)

                        if (!myRetrosByDay.has(day.id)) {
                          setStartOfDay('')
                          setWorkedWell('')
                          setLearned('')
                          setImprove('')
                          setRating(3)
                          setLectureName('')
                        }
                      }}
                      key={day.id}
                      className={`w-full rounded-2xl px-4 py-4 text-left text-sm font-medium transition-all ${
                        selectedDayId === day.id
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'bg-slate-50 text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold">Day {day.dayNumber}</div>
                        {hasRetro ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              selectedDayId === day.id
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            Done
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs opacity-80">{day.date}</div>
                    </button>
                      )
                    })()
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setDaysPage(Math.max(0, daysPage - 1))}
                        disabled={daysPage === 0}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        ← Prev
                      </button>
                      <span className="text-xs text-slate-600">
                        Page {daysPage + 1} of {totalPages}
                      </span>
                      <button
                        onClick={() => setDaysPage(Math.min(totalPages - 1, daysPage + 1))}
                        disabled={daysPage === totalPages - 1}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Retro Form */}
          <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white/80 shadow-sm">
            <div className="border-b border-violet-100 px-6 py-4 sm:px-8">
              <h3 className="text-lg font-bold text-slate-900">✨ Retro Reflection</h3>
            </div>

            <form onSubmit={handleSubmitRetro} className="space-y-5 px-6 py-6 sm:px-8">
              {feedback && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    feedback.type === 'success'
                      ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border border-rose-200 bg-rose-50 text-rose-800'
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {!selectedDayId ? (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/60 px-4 py-4 text-sm text-blue-800">
                  👈 Select a course day to begin
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-700">
                    <p className="font-semibold">📍 Day {selectedDay?.dayNumber}</p>
                    <p className="mt-1 text-xs text-slate-600">{selectedDay?.date}</p>
                  </div>

                  {selectedDayRetro ? (
                    <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-sm text-slate-700">
                      <p className="font-semibold text-emerald-800">✅ This day is completed. You can review your submitted retro below.</p>

                      <div className="rounded-xl bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Lecture</p>
                        <p className="mt-1 text-sm font-medium text-slate-900">{selectedDayRetro.lectureName || 'No lecture name'}</p>
                      </div>

                      <div className="rounded-xl bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Start of Day</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{selectedDayRetro.startOfDay || 'No note'}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Worked Well</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{selectedDayRetro.workedWell || 'No entry'}</p>
                        </div>
                        <div className="rounded-xl bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Learned</p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{selectedDayRetro.learned || 'No entry'}</p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Improve</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-900">{selectedDayRetro.improve || 'No entry'}</p>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rating</p>
                        <p className="text-sm font-bold text-violet-700">{'★'.repeat(selectedDayRetro.rating)}{'☆'.repeat(5 - selectedDayRetro.rating)}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-800">🎯 Start of Day Note *</span>
                        <textarea
                          value={startOfDay}
                          onChange={(e) => setStartOfDay(e.target.value)}
                          placeholder="What was your focus for the day?"
                          rows={2}
                          className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-800">👏 What Worked Well?</span>
                        <textarea
                          value={workedWell}
                          onChange={(e) => setWorkedWell(e.target.value)}
                          placeholder="Successes and positive moments..."
                          rows={2}
                          className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-800">💡 What Did You Learn?</span>
                        <textarea
                          value={learned}
                          onChange={(e) => setLearned(e.target.value)}
                          placeholder="Key takeaways and insights..."
                          rows={2}
                          className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-800">🔄 Areas for Improvement?</span>
                        <textarea
                          value={improve}
                          onChange={(e) => setImprove(e.target.value)}
                          placeholder="What can be better next time..."
                          rows={2}
                          className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-800">🏷️ Lecture Name (Optional)</span>
                        <input
                          value={lectureName}
                          onChange={(e) => setLectureName(e.target.value)}
                          placeholder="e.g. React Hooks, State Management"
                          className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-200/60"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-3 block text-sm font-semibold text-slate-800">⭐ Day Rating</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setRating(r)}
                              className={`flex-1 rounded-full py-2 text-sm font-bold transition-all ${
                                rating === r
                                  ? 'bg-violet-600 text-white shadow-md'
                                  : 'bg-white text-violet-600 ring-2 ring-violet-200 hover:ring-violet-300'
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
                        className="w-full rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-70"
                      >
                        {submitMutation.isPending ? '⏳ Submitting...' : '✓ Submit Retro'}
                      </button>
                    </>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </MobLayout>
  )
}
