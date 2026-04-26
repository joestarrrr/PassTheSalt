import { AnonymousQuestions } from '../components/AnonymousQuestions'
import { AfterworkEventsManagement } from '../components/AfterworkEventsManagement'
import { ClassMoodGraph } from '../components/ClassMoodGraph'
import { MobGroupsManagement } from '../components/MobGroupsManagement'
import { SummaryCard } from '../components/SummaryCard'
import { UserManagement } from '../components/UserManagement'
import { Link } from '@tanstack/react-router'

const summaryCards = [
  { label: 'Class Mood', value: '4.2/5' },
  { label: 'Feedback Posts', value: '128' },
  { label: 'Best Lecture', value: 'Arrays & Maps 4.6' },
  { label: 'Worst Lecture', value: 'Pointers 2.1' },
]

export function AdminDashboard() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-4 py-6 text-slate-800 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">
            Pass the Salt
          </p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Pass the Salt Admin Dashboard
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            A simple admin overview with dummy data for mood, groups, events, users, and anonymous questions.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} label={card.label} value={card.value} />
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/admin/courses"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900">Manage Courses</p>
            <p className="mt-1 text-sm text-slate-600">Create courses and generate daily pages</p>
          </Link>

          <Link
            to="/admin/mob-groups-manage"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Management</p>
            <p className="mt-2 font-semibold text-slate-900">Create Mob Groups</p>
            <p className="mt-1 text-sm text-slate-600">Organize students into groups</p>
          </Link>

          <Link
            to="/user/course"
            className="rounded-3xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm hover:border-violet-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Preview</p>
            <p className="mt-2 font-semibold text-slate-900">View Retro Page</p>
            <p className="mt-1 text-sm text-slate-600">See the retro submission form</p>
          </Link>
        </section>

        <ClassMoodGraph />
        <MobGroupsManagement />
        <AfterworkEventsManagement />
        <UserManagement />
        <AnonymousQuestions />
      </div>
    </main>
  )
}