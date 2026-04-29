import { SectionCard } from './SectionCard'

export function AnonymousQuestions() {
  return (
    <SectionCard label="Anonymous Questions" title="Anonymous Questions">
      <div className="rounded-3xl border border-dashed border-violet-500/25 bg-violet-500/8 p-4 text-center sm:p-6">
        <p className="text-lg font-semibold text-white">This feature is coming soon!</p>
        <p className="mt-2 text-sm leading-6 text-white/50">In the future, admins will be able to view and manage anonymous questions from students.</p>

        <button type="button" disabled className="mt-6 w-full rounded-full bg-violet-500/20 px-5 py-3 text-sm font-semibold text-violet-300 opacity-60 sm:w-auto">
          Future Action
        </button>
      </div>
    </SectionCard>
  )
}
