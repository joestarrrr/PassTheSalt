import { AdminLayout } from '../../layout/AdminLayout'
import { AdminMobGroupManagementPage } from '../AdminMobGroupManagementPage'

export function AdminMobGroupsPage() {
  return (
    <AdminLayout title="Mob Groups" description="Create groups and assign users to them.">
      <AdminMobGroupManagementPage />
    </AdminLayout>
  )
}