import { createFileRoute } from '@tanstack/react-router'
import { AfterworkEventsManagementPage } from '../pages/AfterworkEventsManagementPage'

export const Route = createFileRoute('/admin/afterwork-events')({
  component: AfterworkEventsManagementPage,
})
