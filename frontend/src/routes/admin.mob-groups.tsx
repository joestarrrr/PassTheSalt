import { createFileRoute } from '@tanstack/react-router'
import { MobGroupsManagement } from '../pages/MobGroupsManagement'

export const Route = createFileRoute('/admin/mob-groups')({
  component: MobGroupsManagement,
})
