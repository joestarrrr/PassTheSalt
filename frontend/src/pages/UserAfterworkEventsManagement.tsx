import { useQuery } from '@tanstack/react-query'
import { AfterworkEventsManagement } from '../components/AfterworkEventsManagement'
import { useAuthSession } from '../auth/AuthSession'
import { getUserCourseContext } from '../api.js'
import type { UserCourseContext } from '../types/course'

export function UserAfterworkEventsManagement() {
  const { backendUser } = useAuthSession()
  const userId = backendUser?.id ?? null

  const userContextQuery = useQuery<UserCourseContext>({
    queryKey: ['user-course-context', userId],
    queryFn: () => getUserCourseContext(userId as number) as Promise<UserCourseContext>,
    enabled: Boolean(userId),
  })

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-4 py-6 text-slate-800 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Pass the Salt</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Afterwork Locations</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Suggest places to meet after work, vote on the best options, and follow the winning location for your course.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/70 px-4 py-2 text-sm text-slate-700">
              <p>Signed in as: {backendUser?.fullName ?? 'Loading...'}</p>
              <p>Course: {userContextQuery.data?.courseName ?? 'Not assigned'}</p>
              <p>Mob Group: {userContextQuery.data?.mobGroupName ?? 'Not assigned'}</p>
            </div>
          </div>
        </header>

        <AfterworkEventsManagement apiScope="user" courseId={userContextQuery.data?.courseId ?? null} />
      </div>
    </main>
  )
}
