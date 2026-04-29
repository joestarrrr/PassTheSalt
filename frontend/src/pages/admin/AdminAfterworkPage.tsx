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
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-8">
        <AfterworkEventsManagement apiScope="admin" courseId={courseId} />
      </div>
    </AdminLayout>
  )
}