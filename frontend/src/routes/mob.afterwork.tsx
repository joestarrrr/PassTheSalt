import { createFileRoute } from '@tanstack/react-router'
import { MobAfterworkPage } from '../pages/mob/MobAfterworkPage'

export const Route = createFileRoute('/mob/afterwork')({
  component: MobAfterworkPage,
})