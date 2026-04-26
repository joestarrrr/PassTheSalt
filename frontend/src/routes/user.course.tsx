import { createFileRoute } from '@tanstack/react-router'
import { UserCourseRetroPage } from '../pages/UserCourseRetroPage'

export const Route = createFileRoute('/user/course')({
  component: UserCourseRetroPage,
})
