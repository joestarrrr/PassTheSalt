import { createFileRoute } from '@tanstack/react-router'
import { AdminCoursesPage } from '../pages/admin/AdminCoursesPage'

export const Route = createFileRoute('/admin/courses')({
  component: AdminCoursesPage,
})
