import { createFileRoute } from '@tanstack/react-router'
import { AnonymousQuestions } from '../pages/AnonymousQuestions'

export const Route = createFileRoute('/admin/anonymous-questions')({
  component: AnonymousQuestions,
})
