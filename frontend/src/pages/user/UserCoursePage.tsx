import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { UserLayout } from '../../layout/UserLayout'
import { useAuthSession } from '../../auth/AuthSession'
import { getUserCourseContext } from '../../api.js'
import type { UserCourseContext } from '../../types/course'

export function UserCoursePage() {
  const { backendUser } = useAuthSession()
  const userId = backendUser?.id ?? null
  const [daysPage, setDaysPage] = useState(0)
  const DAYS_PAGE_SIZE = 5

  const userContextQuery = useQuery<UserCourseContext>({
    queryKey: ['user-course-context', userId],
    queryFn: () => getUserCourseContext(userId as number) as Promise<UserCourseContext>,
    enabled: Boolean(userId),
  })

  const courseDays = userContextQuery.data?.courseDays ?? []
  const totalPages = Math.max(1, Math.ceil(courseDays.length / DAYS_PAGE_SIZE))
  const visibleCourseDays = courseDays.slice(daysPage * DAYS_PAGE_SIZE, daysPage * DAYS_PAGE_SIZE + DAYS_PAGE_SIZE)

  return (
    <UserLayout title="Course" description="Check your assigned course and mob group.">
      <main className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-3xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900/50 dark:bg-slate-800/70">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">User Course</p>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Course Overview</h2>
            <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-slate-700 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-200">
              <p>Signed in as: {backendUser?.fullName ?? 'Loading...'}</p>
              <p>Course: {userContextQuery.data?.courseName ?? 'Not assigned'}</p>
              <p>Mob Group: {userContextQuery.data?.mobGroupName ?? 'Not assigned'}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Course Days</h3>
            {userContextQuery.isLoading ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">Loading course days...</p>
            ) : courseDays.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400">No course days available</p>
            ) : (
              <div className="space-y-2">
                {visibleCourseDays.map((day) => (
                  <div key={day.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900/70">
                    <p className="font-semibold text-slate-900 dark:text-white">Day {day.dayNumber}</p>
                    <p className="text-slate-600 dark:text-slate-300">{day.date}</p>
                  </div>
                ))}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDaysPage((page) => Math.max(0, page - 1))}
                    disabled={daysPage === 0}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Previous
                  </button>

                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setDaysPage(index)}
                        className={`h-9 min-w-9 rounded-full px-3 text-sm font-semibold transition ${
                          index === daysPage
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20 dark:bg-violet-700'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setDaysPage((page) => Math.min(totalPages - 1, page + 1))}
                    disabled={daysPage >= totalPages - 1}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </UserLayout>
  )
}