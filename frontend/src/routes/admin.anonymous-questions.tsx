import { createFileRoute } from '@tanstack/react-router'
import { AdminFeedbackPage } from '../pages/admin/AdminFeedbackPage'

export const Route = createFileRoute('/admin/feedback')({
  component: AdminFeedbackPage,
})
