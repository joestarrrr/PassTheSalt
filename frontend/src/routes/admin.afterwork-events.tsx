import { createFileRoute } from '@tanstack/react-router'
import { AdminAfterworkPage } from '../pages/admin/AdminAfterworkPage'

export const Route = createFileRoute('/admin/afterwork')({
  component: AdminAfterworkPage,
})
