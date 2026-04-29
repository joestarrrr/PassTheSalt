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
        <AfterworkEventsManagement apiScope="admin" courseId={courseId} />
      </div>
    </AdminLayout>
  )
}