import { createFileRoute } from '@tanstack/react-router'
import { MobCoursePage } from '../pages/mob/MobCoursePage'

export const Route = createFileRoute('/mob/course')({
  component: MobCoursePage,
})