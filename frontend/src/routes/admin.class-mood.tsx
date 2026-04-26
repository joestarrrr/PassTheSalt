import { createFileRoute } from '@tanstack/react-router'
import { ClassMoodGraphPage } from '../pages/ClassMoodGraphPage'

export const Route = createFileRoute('/admin/class-mood')({
  component: ClassMoodGraphPage,
})
