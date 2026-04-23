import { createFileRoute } from '@tanstack/react-router'
import { AfterworkEventsManagement } from '../pages/AfterworkEventsManagement'

export const Route = createFileRoute('/admin/afterwork-events')({
  component: AfterworkEventsManagement,
})
