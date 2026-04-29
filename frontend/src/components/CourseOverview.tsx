import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuthSession } from '../auth/AuthSession'
import { getUserCourseContext } from '../api.js'
import type { UserCourseContext } from '../types/course'

type CourseOverviewProps = {
  roleLabel: 'User' | 'Mob'
}

const roleLinks = {
  User: {
    retros: '/user/retros',
    afterwork: '/user/afterwork',
  },
  Mob: {
    retros: '/mob/retros',
    afterwork: '/mob/afterwork',
  },
} as const

export function CourseOverview({ roleLabel }: CourseOverviewProps) {
  const { backendUser } = useAuthSession()
  const userId = backendUser?.id ?? null

  const userContextQuery = useQuery<UserCourseContext>({
    queryKey: ['user-course-context', userId],
    queryFn: () => getUserCourseContext(userId as number) as Promise<UserCourseContext>,
    enabled: Boolean(userId),
  })

  const [daysPage, setDaysPage] = useState(0)
  const PAGE_SIZE = 5
  const days = userContextQuery.data?.courseDays ?? []
  const totalPages = Math.max(1, Math.ceil(days.length / PAGE_SIZE))
  const visibleDays = days.slice(daysPage * PAGE_SIZE, daysPage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-3xl border border-violet-500/20 bg-violet-500/8 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">{roleLabel} Course</p>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Course Overview</h2>
          <p className="text-sm leading-6 text-white/50">
            View the current course, assigned mob group, and the generated course days used by the retro flow.
          </p>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            <p>Signed in as: {backendUser?.fullName ?? 'Loading...'}</p>
            <p>Course: {userContextQuery.data?.courseName ?? 'Not assigned'}</p>
            <p>Mob Group: {userContextQuery.data?.mobGroupName ?? 'Not assigned'}</p>
            <p>Course Days: {userContextQuery.data?.courseDays.length ?? 0}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={roleLinks[roleLabel].retros}
              className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:from-violet-500 hover:to-fuchsia-500"
            >
              Go to retros
            </Link>
            <Link
              to={roleLinks[roleLabel].afterwork}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 hover:bg-white/10"
            >
              Go to afterwork
            </Link>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-white">Course Days</h3>

          {userContextQuery.isLoading ? (
            <p className="text-sm text-white/40">Loading course days...</p>
          ) : days.length === 0 ? (
            <p className="text-sm text-white/40">No course days available</p>
          ) : (
            <div className="space-y-2">
              {visibleDays.map((day) => (
                <div
                  key={day.id}
                  className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm transition-shadow hover:shadow-md hover:shadow-violet-900/20"
                >
                  <p className="font-semibold text-white">Day {day.dayNumber}</p>
                  <p className="text-white/50">{day.date}</p>
                </div>
              ))}

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setDaysPage((p) => Math.max(0, p - 1))}
                  disabled={daysPage === 0}
                  className="rounded-full px-3 py-1 text-sm ring-1 ring-inset ring-white/15 text-white/60 hover:bg-white/8 disabled:opacity-40"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setDaysPage(i)}
                      className={`w-8 rounded-full text-sm ${i === daysPage ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'bg-white/5 ring-1 ring-inset ring-white/15 text-white/60'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setDaysPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={daysPage >= totalPages - 1}
                  className="rounded-full px-3 py-1 text-sm ring-1 ring-inset ring-white/15 text-white/60 hover:bg-white/8 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  )
}