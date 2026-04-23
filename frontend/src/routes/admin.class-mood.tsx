import { createFileRoute } from '@tanstack/react-router'
import { ClassMoodGraph } from '../pages/ClassMoodGraph'

export const Route = createFileRoute('/admin/class-mood')({
  component: ClassMoodGraph,
})
