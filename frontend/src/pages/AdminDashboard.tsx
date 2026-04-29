import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getCourses, getRetrosByCourse } from '../api.js'
import type { Course } from '../types/course'

type RetroRow = {
  rating: number | null
}

export function AdminDashboard() {
  const dashboardQuery = useQuery({
    queryKey: ['admin-dashboard-retro-ratings'],
    queryFn: async () => {
      const courses = (await getCourses()) as Course[]
      const retrosByCourse = await Promise.all(
        courses.map(async (course) => ({
          courseId: course.id,
          retros: (await getRetrosByCourse(course.id)) as RetroRow[],
        })),
      )

      const retros = retrosByCourse.flatMap((item) => item.retros)
      const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: retros.filter((retro) => retro.rating === rating).length,
      }))

      return {
        courseCount: courses.length,
        retroCount: retros.length,
        averageRating:
          retros.length === 0
            ? 0
            : retros.reduce((sum, retro) => sum + (retro.rating ?? 0), 0) / retros.length,
        ratingCounts,
      }
    },
  })

  return (
    <main className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/80 dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)] sm:p-8">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Admin Dashboard</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Choose an admin area</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Use the admin navigation above to jump only to admin pages.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Courses</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{dashboardQuery.data?.courseCount ?? '—'}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Active course setup</p>
          </div>
          <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Retros</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{dashboardQuery.data?.retroCount ?? '—'}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Feedback submissions</p>
          </div>
          <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Average Rating</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {dashboardQuery.data?.averageRating ? dashboardQuery.data.averageRating.toFixed(1) : '—'}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Across all available retros</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Retro Ratings</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Session feedback distribution</h3>
              </div>
              <div className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-900/50 dark:bg-slate-800 dark:text-violet-300">
                Real-time data
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {(dashboardQuery.data?.ratingCounts ?? [1, 2, 3, 4, 5].map((rating) => ({ rating, count: 0 }))).map((entry) => {
                const maxCount = Math.max(...((dashboardQuery.data?.ratingCounts ?? []).map((item) => item.count).concat(1)))
                const width = maxCount === 0 ? 0 : (entry.count / maxCount) * 100
                return (
                  <div key={entry.rating} className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{entry.rating}★</span>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{entry.count}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            to="/admin/courses"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70 dark:hover:border-violet-700"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">Manage Courses</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Create courses and generate daily pages</p>
          </Link>

          <Link
            to="/admin/mob-groups"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70 dark:hover:border-violet-700"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">Create Mob Groups</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Organize students into groups</p>
          </Link>

          <Link
            to="/admin/users"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70 dark:hover:border-violet-700"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">Manage Users</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Assign users to courses and mob groups</p>
          </Link>

          <Link
            to="/admin/afterwork"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70 dark:hover:border-violet-700"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">Afterwork Locations</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Review suggestions and winning places</p>
          </Link>

          <Link
            to="/admin/feedback"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md dark:border-violet-900/50 dark:bg-slate-900/70 dark:hover:border-violet-700"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900 dark:text-white">Anonymous Feedback</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Review class feedback and questions</p>
          </Link>
        </section>

        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
          The admin dashboard is now a clean hub for admin-only pages.
        </div>
      </div>
    </main>
  )
}