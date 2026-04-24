import { Route as rootRouteImport } from './routes/__root'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AdminAnonymousQuestionsRouteImport } from './routes/admin.anonymous-questions'
import { Route as AdminAfterworkEventsRouteImport } from './routes/admin.afterwork-events'
import { Route as AdminClassMoodRouteImport } from './routes/admin.class-mood'
import { Route as AdminMobGroupsRouteImport } from './routes/admin.mob-groups'
import { Route as AdminUsersRouteImport } from './routes/admin.users'
import { Route as IndexRouteImport } from './routes/index'
import { Route as LoginRouteImport } from './routes/login'
import { Route as UserAfterworkEventsRouteImport } from './routes/user.afterwork-events'

const AdminRoute = AdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRouteImport,
} as any)

const AdminAnonymousQuestionsRoute = AdminAnonymousQuestionsRouteImport.update({
  id: '/admin/anonymous-questions',
  path: '/admin/anonymous-questions',
  getParentRoute: () => rootRouteImport,
} as any)

const AdminAfterworkEventsRoute = AdminAfterworkEventsRouteImport.update({
  id: '/admin/afterwork-events',
  path: '/admin/afterwork-events',
  getParentRoute: () => rootRouteImport,
} as any)

const AdminClassMoodRoute = AdminClassMoodRouteImport.update({
  id: '/admin/class-mood',
  path: '/admin/class-mood',
  getParentRoute: () => rootRouteImport,
} as any)

const AdminMobGroupsRoute = AdminMobGroupsRouteImport.update({
  id: '/admin/mob-groups',
  path: '/admin/mob-groups',
  getParentRoute: () => rootRouteImport,
} as any)

const AdminUsersRoute = AdminUsersRouteImport.update({
  id: '/admin/users',
  path: '/admin/users',
  getParentRoute: () => rootRouteImport,
} as any)

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport,
} as any)

const UserAfterworkEventsRoute = UserAfterworkEventsRouteImport.update({
  id: '/user/afterwork-events',
  path: '/user/afterwork-events',
  getParentRoute: () => rootRouteImport,
} as any)

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin/anonymous-questions': {
      id: '/admin/anonymous-questions'
      path: '/admin/anonymous-questions'
      fullPath: '/admin/anonymous-questions'
      preLoaderRoute: typeof AdminAnonymousQuestionsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin/afterwork-events': {
      id: '/admin/afterwork-events'
      path: '/admin/afterwork-events'
      fullPath: '/admin/afterwork-events'
      preLoaderRoute: typeof AdminAfterworkEventsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin/class-mood': {
      id: '/admin/class-mood'
      path: '/admin/class-mood'
      fullPath: '/admin/class-mood'
      preLoaderRoute: typeof AdminClassMoodRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin/mob-groups': {
      id: '/admin/mob-groups'
      path: '/admin/mob-groups'
      fullPath: '/admin/mob-groups'
      preLoaderRoute: typeof AdminMobGroupsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin/users': {
      id: '/admin/users'
      path: '/admin/users'
      fullPath: '/admin/users'
      preLoaderRoute: typeof AdminUsersRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/user/afterwork-events': {
      id: '/user/afterwork-events'
      path: '/user/afterwork-events'
      fullPath: '/user/afterwork-events'
      preLoaderRoute: typeof UserAfterworkEventsRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

export const routeTree = rootRouteImport._addFileChildren({
  AdminRoute,
  AdminAnonymousQuestionsRoute,
  AdminAfterworkEventsRoute,
  AdminClassMoodRoute,
  AdminMobGroupsRoute,
  AdminUsersRoute,
  IndexRoute,
  LoginRoute,
  UserAfterworkEventsRoute,
})