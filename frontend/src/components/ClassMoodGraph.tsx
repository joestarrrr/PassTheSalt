import { SectionCard } from './SectionCard'

const moodData = [
  { date: 'May 10', rating: 4.2 },
  { date: 'May 11', rating: 4.4 },
  { date: 'May 12', rating: 4.3 },
  { date: 'May 13', rating: 4.6 },
  { date: 'May 14', rating: 4.1 },
  { date: 'May 15', rating: 4.5 },
  { date: 'May 16', rating: 4.7 },
]

export function ClassMoodGraph() {
  const maxRating = 5

  return (
    <SectionCard label="Analytics" title="Class Mood Over Time">
      <div className="mb-5">
        <p className="mt-2 text-sm leading-6 text-white/50">Dummy weekly mood data for now.</p>
      </div>

      <div className="rounded-3xl border border-violet-100 bg-violet-50/70 p-3 sm:p-5">
        <div className="overflow-x-auto pb-1">
          <div className="flex h-64 min-w-[560px] items-end gap-3 sm:h-72 sm:min-w-0">
          {moodData.map((item) => {
            const barHeight = `${(item.rating / maxRating) * 100}%`

            return (
              <div key={item.date} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="flex h-full w-full items-end justify-center">
                  <div className="relative flex h-full w-full max-w-14 items-end rounded-t-2xl bg-violet-100/60 p-1">
                    <div
                      className="w-full rounded-t-2xl bg-violet-500 shadow-[0_10px_20px_rgba(109,40,217,0.20)] transition-all"
                      style={{ height: barHeight }}
                    />
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-white/70 shadow-sm">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium text-white/60">{item.date}</p>
                </div>
              </div>
            )
          })}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <span>Lowest mood: 4.1</span>
          <span>Highest mood: 4.7</span>
        </div>
      </div>
    </SectionCard>
  )
}
