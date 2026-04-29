import { createFileRoute } from '@tanstack/react-router'
import { MobRetrosPage } from '../pages/mob/MobRetrosPage'

export const Route = createFileRoute('/mob/retros')({
  component: MobRetrosPage,
})