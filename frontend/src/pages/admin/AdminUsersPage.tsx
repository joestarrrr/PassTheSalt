import { AdminLayout } from '../../layout/AdminLayout'
import { UserManagementPage } from '../UserManagementPage'

export function AdminUsersPage() {
  return (
    <AdminLayout title="Users" description="Assign users to courses and mob groups.">
      <UserManagementPage />
    </AdminLayout>
  )
}