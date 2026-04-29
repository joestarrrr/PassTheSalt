import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { MobLayout } from '../../layout/MobLayout'
import { getRetrosByCourse } from '../../api.js'
import { useAuthSession } from '../../auth/AuthSession'

const cards = [
  { to: '/mob/retros', title: 'Retros', description: 'Share your day and team reflections.' },
  { to: '/mob/afterwork', title: 'Afterwork', description: 'Vote on afterwork locations as a mob.' },
  { to: '/mob/course', title: 'Course', description: 'View the mob course overview.' },
]

type RetroItem = {
  id: number
  submissionDate: string
  lectureName: string | null
  rating: number
  startOfDay: string
  workedWell: string | null
  learned: string | null
  improve: string | null
}

const STAR_LABELS = ['', 'Bad', 'Poor', 'Okay', 'Good', 'Great']

export function MobDashboardPage() {
  const { backendUser } = useAuthSession()
  const courseId = backendUser?.courseId ?? null

  const retrosQuery = useQuery<RetroItem[]>({
    queryKey: ['retros', 'course', courseId],
    queryFn: () => getRetrosByCourse(courseId) as Promise<RetroItem[]>,
    enabled: Boolean(courseId),
  })

  const myRetros = (retrosQuery.data ?? [])
    .slice()
    .sort((a, b) => b.submissionDate.localeCompare(a.submissionDate))
    .slice(0, 5)

  return (
    <MobLayout title="Mob Dashboard" description="Your mob-specific route entry point.">
      <div className="space-y-6">
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

        {/* Recent Retros */}
        <div className="rounded-[2rem] border border-violet-100 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">Activity</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Recent Retros</h2>
            </div>
            <Link to="/mob/retros" className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500">
              + New Retro
            </Link>
          </div>

          {retrosQuery.isLoading && <p className="text-sm text-slate-500">Loading retros...</p>}

          {!retrosQuery.isLoading && myRetros.length === 0 && (
            <p className="text-sm text-slate-500">No retros submitted yet. Go submit your first one!</p>
          )}

          {myRetros.length > 0 && (
            <div className="space-y-3">
              {myRetros.map((retro) => (
                <div key={retro.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {retro.lectureName ?? 'Retro'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{retro.submissionDate}</p>
                      {retro.startOfDay && (
                        <p className="mt-2 text-sm text-slate-700 line-clamp-2">{retro.startOfDay}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                        {'★'.repeat(retro.rating)}{'☆'.repeat(5 - retro.rating)} {STAR_LABELS[retro.rating]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobLayout>
  )
}