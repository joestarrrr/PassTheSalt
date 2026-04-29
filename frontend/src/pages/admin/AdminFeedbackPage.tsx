import { AdminLayout } from '../../layout/AdminLayout'
import { AnonymousQuestionsPage } from '../AnonymousQuestionsPage'

export function AdminFeedbackPage() {
  return (
    <AdminLayout title="Feedback" description="Review anonymous class feedback and questions.">
      <AnonymousQuestionsPage />
    </AdminLayout>
  )
}