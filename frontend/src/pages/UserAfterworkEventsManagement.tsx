import { useQuery } from '@tanstack/react-query'
import { AfterworkEventsManagement } from '../components/AfterworkEventsManagement'
import { useAuthSession } from '../auth/AuthSession'
import { getUserCourseContext } from '../api.js'
import type { UserCourseContext } from '../types/course'

export function UserAfterworkEventsManagement() {
  const { backendUser } = useAuthSession()
  const userId = backendUser?.id ?? null

  const userContextQuery = useQuery<UserCourseContext>({
    queryKey: ['user-course-context', userId],
    queryFn: () => getUserCourseContext(userId as number) as Promise<UserCourseContext>,
    enabled: Boolean(userId),
  })

  return (
    <AfterworkEventsManagement apiScope="user" courseId={userContextQuery.data?.courseId ?? null} />
  )
}
