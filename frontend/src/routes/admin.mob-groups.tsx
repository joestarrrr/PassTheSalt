import { createFileRoute } from '@tanstack/react-router'
import { MobGroupsManagementPage } from '../pages/MobGroupsManagementPage'

export const Route = createFileRoute('/admin/mob-groups')({
  component: MobGroupsManagementPage,
})
