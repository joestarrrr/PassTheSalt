import { createFileRoute } from '@tanstack/react-router'
import { UserAfterworkEventsManagement } from '../pages/UserAfterworkEventsManagement'

export const Route = createFileRoute('/user/afterwork-events')({
  component: UserAfterworkEventsManagement,
})
