import { Link } from '@tanstack/react-router'
import { MobLayout } from '../../layout/MobLayout'

const cards = [
  { to: '/mob/retros', title: 'Retros', description: 'Share your day and team reflections.' },
  { to: '/mob/afterwork', title: 'Afterwork', description: 'Vote on afterwork locations as a mob.' },
  { to: '/mob/course', title: 'Course', description: 'View the mob course overview.' },
]

export function MobDashboardPage() {
  return (
    <MobLayout title="Mob Dashboard" description="Your mob-specific route entry point.">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] transition hover:-translate-y-1 hover:border-violet-200"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Mob</p>
            <p className="mt-3 text-xl font-bold text-slate-900">{card.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </MobLayout>
  )
}