import { createFileRoute } from '@tanstack/react-router'
import { UserAfterworkPage } from '../pages/user/UserAfterworkPage'

export const Route = createFileRoute('/user/afterwork')({
  component: UserAfterworkPage,
})
