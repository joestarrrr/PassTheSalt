import { useQuery } from '@tanstack/react-query'
import { UserLayout } from '../../layout/UserLayout'
import { useAuthSession } from '../../auth/AuthSession'
import { getUserCourseContext } from '../../api.js'
import type { UserCourseContext } from '../../types/course'

export function UserCoursePage() {
  const { backendUser } = useAuthSession()
  const userId = backendUser?.id ?? null

  const userContextQuery = useQuery<UserCourseContext>({
    queryKey: ['user-course-context', userId],
    queryFn: () => getUserCourseContext(userId as number) as Promise<UserCourseContext>,
    enabled: Boolean(userId),
  })

  return (
    <UserLayout title="Course" description="Check your assigned course and mob group.">
      <main className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">User Course</p>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Course Overview</h2>
            <div className="rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm text-slate-700">
              <p>Signed in as: {backendUser?.fullName ?? 'Loading...'}</p>
              <p>Course: {userContextQuery.data?.courseName ?? 'Not assigned'}</p>
              <p>Mob Group: {userContextQuery.data?.mobGroupName ?? 'Not assigned'}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-slate-100 bg-white/80 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-slate-900">Course Days</h3>
            {userContextQuery.isLoading ? (
              <p className="text-sm text-slate-600">Loading course days...</p>
            ) : (userContextQuery.data?.courseDays ?? []).length === 0 ? (
              <p className="text-sm text-slate-600">No course days available</p>
            ) : (
              <div className="space-y-2">
                {(userContextQuery.data?.courseDays ?? []).map((day) => (
                  <div key={day.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                    <p className="font-semibold text-slate-900">Day {day.dayNumber}</p>
                    <p className="text-slate-600">{day.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </UserLayout>
  )
}