import { createFileRoute } from '@tanstack/react-router'
import { UserCoursePage } from '../pages/user/UserCoursePage'

export const Route = createFileRoute('/user/course')({
  component: UserCoursePage,
})
