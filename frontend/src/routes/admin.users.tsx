import { createFileRoute } from '@tanstack/react-router'
import { UserManagementPage } from '../pages/UserManagementPage'

export const Route = createFileRoute('/admin/users')({
  component: UserManagementPage,
})
