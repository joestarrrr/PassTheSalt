import { Link } from '@tanstack/react-router'

export function AdminDashboard() {
  return (
    <main className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-8">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Admin Dashboard</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Choose an admin area</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            Use the admin navigation above to jump only to admin pages.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Link
            to="/admin/courses"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900">Manage Courses</p>
            <p className="mt-1 text-sm text-slate-600">Create courses and generate daily pages</p>
          </Link>

          <Link
            to="/admin/mob-groups"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900">Create Mob Groups</p>
            <p className="mt-1 text-sm text-slate-600">Organize students into groups</p>
          </Link>

          <Link
            to="/admin/users"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900">Manage Users</p>
            <p className="mt-1 text-sm text-slate-600">Assign users to courses and mob groups</p>
          </Link>

          <Link
            to="/admin/afterwork"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900">Afterwork Locations</p>
            <p className="mt-1 text-sm text-slate-600">Review suggestions and winning places</p>
          </Link>

          <Link
            to="/admin/feedback"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900">Anonymous Feedback</p>
            <p className="mt-1 text-sm text-slate-600">Review class feedback and questions</p>
          </Link>
        </section>

        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-600">
          The admin dashboard is now a clean hub for admin-only pages.
        </div>
      </div>
    </main>
  )
}