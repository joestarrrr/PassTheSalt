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

  const ratingCounts = dashboardQuery.data?.ratingCounts ?? [1, 2, 3, 4, 5].map((rating) => ({ rating, count: 0 }))
  const maxCount = Math.max(...ratingCounts.map((item) => item.count), 1)
  const totalRatings = ratingCounts.reduce((sum, item) => sum + item.count, 0)
  const activeCourseText = dashboardQuery.data?.courseCount
    ? `${dashboardQuery.data.courseCount} active`
    : 'No active course'

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/8 p-5 transition duration-200 hover:-translate-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-black">AC</span>
              Active Courses
            </p>
            <p className="mt-3 text-3xl font-extrabold text-emerald-300">{dashboardQuery.data?.courseCount ?? '—'}</p>
            <p className="mt-1 text-sm font-medium text-emerald-400/70">{activeCourseText}</p>
          </div>
          <div className="rounded-3xl border border-violet-500/20 bg-violet-500/8 p-5 transition duration-200 hover:-translate-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-black">FS</span>
              Feedback Submissions
            </p>
            <p className="mt-3 text-3xl font-extrabold text-white">{dashboardQuery.data?.retroCount ?? '—'}</p>
            <p className="mt-1 text-sm text-white/40">Total retros collected</p>
          </div>
          <div className="rounded-3xl border border-fuchsia-500/20 bg-fuchsia-500/8 p-5 transition duration-200 hover:-translate-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-fuchsia-500/20 text-[10px] font-black">AR</span>
              Average Rating
            </p>
            <p className="mt-3 text-3xl font-extrabold text-white">
              {dashboardQuery.data?.averageRating ? dashboardQuery.data.averageRating.toFixed(1) : '—'}
            </p>
            <p className="mt-1 text-sm text-white/40">Out of 5 from all retros</p>
          </div>
          <div className="rounded-3xl border border-sky-500/20 bg-sky-500/8 p-5 transition duration-200 hover:-translate-y-1">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/20 text-[10px] font-black">RT</span>
              Rating Trend
            </p>
            <p className="mt-3 text-2xl font-extrabold text-white sm:text-[1.7rem]">
              {dashboardQuery.data?.averageRating && dashboardQuery.data.averageRating >= 4 ? 'Strong' : 'Needs attention'}
            </p>
            <p className="mt-1 text-sm text-white/40">Based on current score distribution</p>
          </div>
        </section>

        <section className="grid gap-3 sm:gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Retro Ratings</p>
                <h3 className="mt-2 text-xl font-bold text-white">Session Feedback Distribution</h3>
              </div>
              <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                {totalRatings} total ratings
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {ratingCounts.map((entry) => {
                const width = maxCount === 0 ? 0 : (entry.count / maxCount) * 100
                const share = totalRatings === 0 ? 0 : Math.round((entry.count / totalRatings) * 100)
                return (
                  <div key={entry.rating} className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
                    <span className="text-sm font-semibold text-white/60">{entry.rating}★</span>
                    <div className="h-3 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="text-right text-sm font-semibold text-white/60" title={`${share}% of all ratings`}>
                      {entry.count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Insights</p>
            <h3 className="mt-2 text-xl font-bold text-white">Dashboard Highlights</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/55">
              <li className="rounded-2xl bg-white/5 px-4 py-3">
                <span className="font-semibold text-white">Courses:</span> {dashboardQuery.data?.courseCount ?? 0} currently active.
              </li>
              <li className="rounded-2xl bg-white/5 px-4 py-3">
                <span className="font-semibold text-white">Feedback:</span> {dashboardQuery.data?.retroCount ?? 0} submissions logged.
              </li>
              <li className="rounded-2xl bg-white/5 px-4 py-3">
                <span className="font-semibold text-white">Average score:</span>{' '}
                {dashboardQuery.data?.averageRating ? dashboardQuery.data.averageRating.toFixed(1) : '0.0'}/5.
              </li>
            </ul>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <h3 className="sm:col-span-2 xl:col-span-4 text-lg font-bold text-white">Quick Actions</h3>
          <Link
            to="/admin/courses"
            title="Create and manage course schedules"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Courses</p>
            <p className="mt-2 font-semibold text-white">Manage course setup</p>
            <p className="mt-1 text-sm text-white/50">Create courses and generate day plans.</p>
          </Link>

          <Link
            to="/admin/mob-groups"
            title="Organize members and group assignments"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Mob Groups</p>
            <p className="mt-2 font-semibold text-white">Manage mob groups</p>
            <p className="mt-1 text-sm text-white/50">Assign and balance users quickly.</p>
          </Link>

          <Link
            to="/admin/users"
            title="Manage platform users and roles"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Users</p>
            <p className="mt-2 font-semibold text-white">Manage users</p>
            <p className="mt-1 text-sm text-white/50">Control assignments and access.</p>
          </Link>

          <Link
            to="/admin/afterwork"
            title="Moderate afterwork suggestions and winners"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Afterwork</p>
            <p className="mt-2 font-semibold text-white">Afterwork locations</p>
            <p className="mt-1 text-sm text-white/50">Review suggestions and voting results.</p>
          </Link>

          <Link
            to="/admin/feedback"
            title="Review anonymous questions and feedback"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/30 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:col-span-2 xl:col-span-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">Feedback</p>
            <p className="mt-2 font-semibold text-white">Anonymous questions and sentiment</p>
            <p className="mt-1 text-sm text-white/50">Quickly inspect anonymous entries and recurring concerns.</p>
          </Link>
        </section>
    </div>
  )
}