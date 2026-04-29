import { type ReactNode } from 'react'

type SectionCardProps = {
  label?: string
  title: string
  children: ReactNode
}

export function SectionCard({ label, title, children }: SectionCardProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-6">
      <div className="mb-5">
        {label ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">{label}</p>
        ) : null}
        <h2 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">{title}</h2>
      </div>

      {children}
    </section>
  )
}
