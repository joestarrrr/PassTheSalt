import type { ReactElement } from 'react'

type MapboxMapProps = {
  courseId?: number | null
}

export function MapboxMap({ courseId = null }: MapboxMapProps): ReactElement {
  if (!courseId) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-violet-500/25 bg-violet-500/8 px-6 text-center text-sm text-white/60">
        Select a course to view afterwork location details.
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-[24rem] items-center justify-center rounded-3xl border border-white/10 bg-[#0c0618] px-6 text-center text-sm text-white/70">
      Map integration is disabled in this build. Use the list and voting controls below to manage locations.
    </div>
  )
}
