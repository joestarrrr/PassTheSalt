import { createRouter } from '@tanstack/react-router'
import { createHashHistory } from '@tanstack/history'
import { routeTree } from '../routeTree.gen'

const basepath = (() => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const trimmed = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return trimmed === '' ? '/' : trimmed
})()

export const router = createRouter({
  routeTree,
  basepath,
  history: createHashHistory(),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}