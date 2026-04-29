import { AdminLayout } from '../../layout/AdminLayout'
import { AdminDashboard } from '../AdminDashboard'

export function AdminDashboardPage() {
  return (
    <AdminLayout
      title="Admin Dashboard"
      description="Manage all admin-only areas from one clean entry point."
    >
      <AdminDashboard />
    </AdminLayout>
  )
}