import { createFileRoute } from '@tanstack/react-router'
import { AdminMobGroupManagementPage } from '../pages/AdminMobGroupManagementPage'

export const Route = createFileRoute('/admin/mob-groups-manage')({
  component: AdminMobGroupManagementPage,
})
