import { Link } from '@tanstack/react-router'
import { UserLayout } from '../../layout/UserLayout'

const cards = [
  { to: '/user/retros', title: 'Retros', description: 'Submit your daily retro notes.' },
  { to: '/user/afterwork', title: 'Afterwork', description: 'Vote on meeting spots after work.' },
  { to: '/user/course', title: 'Course', description: 'View your course and mob context.' },
]

export function UserDashboardPage() {
  return (
    <UserLayout title="User Dashboard" description="Your personal hub for retros, afterwork, and course context.">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">User</p>
            <p className="mt-3 text-xl font-bold text-slate-900">{card.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </UserLayout>
  )
}