import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '../../layout/AdminLayout'
import { AfterworkEventsManagement } from '../../components/AfterworkEventsManagement'
import { getCourses } from '../../api.js'

type Course = {
  id: number
  name: string
}

export function AdminAfterworkPage() {
  const [courseId, setCourseId] = useState<number | null>(null)

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => getCourses() as Promise<Course[]>,
  })

  useEffect(() => {
    if (courseId !== null) {
      return
    }

    const firstCourseId = coursesQuery.data?.[0]?.id ?? null
    if (firstCourseId !== null) {
      setCourseId(firstCourseId)
    }
  }, [courseId, coursesQuery.data])

  return (
    <AdminLayout
      title="Afterwork"
      description="Review afterwork events and inspect location votes by course."
    >
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm sm:p-8">
        <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Course filter</span>
            <select
              value={courseId ?? ''}
              onChange={(event) => setCourseId(event.target.value ? Number(event.target.value) : null)}
              className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
            >
              <option value="">Choose a course...</option>
              {(coursesQuery.data ?? []).map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>
          <p className="text-sm text-slate-600">Select a course to load afterwork location voting.</p>
        </div>

        <AfterworkEventsManagement apiScope="admin" courseId={courseId} />
      </div>
    </AdminLayout>
  )
}