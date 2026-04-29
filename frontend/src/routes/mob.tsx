import { createFileRoute } from '@tanstack/react-router'
import { MobDashboardPage } from '../pages/mob/MobDashboardPage'

export const Route = createFileRoute('/mob')({
  component: MobDashboardPage,
})