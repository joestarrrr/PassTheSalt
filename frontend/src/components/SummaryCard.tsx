type SummaryCardProps = {
  label: string
  value: string
}

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-violet-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{value}</p>
    </div>
  )
}
