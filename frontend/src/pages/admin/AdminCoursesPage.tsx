import { AdminLayout } from '../../layout/AdminLayout'
import { AdminCourseManagementPage } from '../AdminCourseManagementPage'

export function AdminCoursesPage() {
  return (
    <AdminLayout title="Courses" description="Create courses and manage course setup.">
      <AdminCourseManagementPage />
    </AdminLayout>
  )
}