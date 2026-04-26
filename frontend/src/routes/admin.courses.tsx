import { createFileRoute } from '@tanstack/react-router'
import { AdminCourseManagementPage } from '../pages/AdminCourseManagementPage'

export const Route = createFileRoute('/admin/courses')({
  component: AdminCourseManagementPage,
})
