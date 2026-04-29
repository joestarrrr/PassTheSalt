import { createFileRoute } from '@tanstack/react-router'
import { AdminMobGroupsPage } from '../pages/admin/AdminMobGroupsPage'

export const Route = createFileRoute('/admin/mob-groups')({
  component: AdminMobGroupsPage,
})
