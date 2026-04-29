import { createFileRoute } from '@tanstack/react-router'
import { UserRetrosPage } from '../pages/user/UserRetrosPage'

export const Route = createFileRoute('/user/retros')({
  component: UserRetrosPage,
})