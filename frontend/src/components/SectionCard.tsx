import { type ReactNode } from 'react'

type SectionCardProps = {
  label?: string
  title: string
  children: ReactNode
}

export function SectionCard({ label, title, children }: SectionCardProps) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-6">
      <div className="mb-5">
        {label ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">{label}</p>
        ) : null}
        <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
      </div>

      {children}
    </section>
  )
}
