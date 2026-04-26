import { createFileRoute } from '@tanstack/react-router'
import { AnonymousQuestionsPage } from '../pages/AnonymousQuestionsPage'

export const Route = createFileRoute('/admin/anonymous-questions')({
  component: AnonymousQuestionsPage,
})
