import { Route as rootRouteImport } from './routes/__root'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as AdminAfterworkRouteImport } from './routes/admin.afterwork-events'
import { Route as AdminFeedbackRouteImport } from './routes/admin.anonymous-questions'
import { Route as AdminCoursesRouteImport } from './routes/admin.courses'
import { Route as AdminMobGroupsRouteImport } from './routes/admin.mob-groups'
import { Route as AdminUsersRouteImport } from './routes/admin.users'
import { Route as IndexRouteImport } from './routes/index'
import { Route as LoginRouteImport } from './routes/login'
import { Route as MobRouteImport } from './routes/mob'
import { Route as MobAfterworkRouteImport } from './routes/mob.afterwork'
import { Route as MobCourseRouteImport } from './routes/mob.course'
import { Route as MobRetrosRouteImport } from './routes/mob.retros'
import { Route as UserRouteImport } from './routes/user'
import { Route as UserAfterworkRouteImport } from './routes/user.afterwork-events'
import { Route as UserCourseRouteImport } from './routes/user.course'
import { Route as UserRetrosRouteImport } from './routes/user.retros'

const AdminRoute = AdminRouteImport.update({ id: '/admin', path: '/admin', getParentRoute: () => rootRouteImport } as any)
const AdminCoursesRoute = AdminCoursesRouteImport.update({ id: '/admin/courses', path: '/admin/courses', getParentRoute: () => rootRouteImport } as any)
const AdminMobGroupsRoute = AdminMobGroupsRouteImport.update({ id: '/admin/mob-groups', path: '/admin/mob-groups', getParentRoute: () => rootRouteImport } as any)
const AdminUsersRoute = AdminUsersRouteImport.update({ id: '/admin/users', path: '/admin/users', getParentRoute: () => rootRouteImport } as any)
const AdminAfterworkRoute = AdminAfterworkRouteImport.update({ id: '/admin/afterwork', path: '/admin/afterwork', getParentRoute: () => rootRouteImport } as any)
const AdminFeedbackRoute = AdminFeedbackRouteImport.update({ id: '/admin/feedback', path: '/admin/feedback', getParentRoute: () => rootRouteImport } as any)
const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const LoginRoute = LoginRouteImport.update({ id: '/login', path: '/login', getParentRoute: () => rootRouteImport } as any)
const UserRoute = UserRouteImport.update({ id: '/user', path: '/user', getParentRoute: () => rootRouteImport } as any)
const UserRetrosRoute = UserRetrosRouteImport.update({ id: '/user/retros', path: '/user/retros', getParentRoute: () => rootRouteImport } as any)
const UserAfterworkRoute = UserAfterworkRouteImport.update({ id: '/user/afterwork', path: '/user/afterwork', getParentRoute: () => rootRouteImport } as any)
const UserCourseRoute = UserCourseRouteImport.update({ id: '/user/course', path: '/user/course', getParentRoute: () => rootRouteImport } as any)
const MobRoute = MobRouteImport.update({ id: '/mob', path: '/mob', getParentRoute: () => rootRouteImport } as any)
const MobRetrosRoute = MobRetrosRouteImport.update({ id: '/mob/retros', path: '/mob/retros', getParentRoute: () => rootRouteImport } as any)
const MobAfterworkRoute = MobAfterworkRouteImport.update({ id: '/mob/afterwork', path: '/mob/afterwork', getParentRoute: () => rootRouteImport } as any)
const MobCourseRoute = MobCourseRouteImport.update({ id: '/mob/course', path: '/mob/course', getParentRoute: () => rootRouteImport } as any)

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/admin': { id: '/admin'; path: '/admin'; fullPath: '/admin'; preLoaderRoute: typeof AdminRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/courses': { id: '/admin/courses'; path: '/admin/courses'; fullPath: '/admin/courses'; preLoaderRoute: typeof AdminCoursesRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/mob-groups': { id: '/admin/mob-groups'; path: '/admin/mob-groups'; fullPath: '/admin/mob-groups'; preLoaderRoute: typeof AdminMobGroupsRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/users': { id: '/admin/users'; path: '/admin/users'; fullPath: '/admin/users'; preLoaderRoute: typeof AdminUsersRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/afterwork': { id: '/admin/afterwork'; path: '/admin/afterwork'; fullPath: '/admin/afterwork'; preLoaderRoute: typeof AdminAfterworkRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/feedback': { id: '/admin/feedback'; path: '/admin/feedback'; fullPath: '/admin/feedback'; preLoaderRoute: typeof AdminFeedbackRouteImport; parentRoute: typeof rootRouteImport }
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/login': { id: '/login'; path: '/login'; fullPath: '/login'; preLoaderRoute: typeof LoginRouteImport; parentRoute: typeof rootRouteImport }
    '/user': { id: '/user'; path: '/user'; fullPath: '/user'; preLoaderRoute: typeof UserRouteImport; parentRoute: typeof rootRouteImport }
    '/user/retros': { id: '/user/retros'; path: '/user/retros'; fullPath: '/user/retros'; preLoaderRoute: typeof UserRetrosRouteImport; parentRoute: typeof rootRouteImport }
    '/user/afterwork': { id: '/user/afterwork'; path: '/user/afterwork'; fullPath: '/user/afterwork'; preLoaderRoute: typeof UserAfterworkRouteImport; parentRoute: typeof rootRouteImport }
    '/user/course': { id: '/user/course'; path: '/user/course'; fullPath: '/user/course'; preLoaderRoute: typeof UserCourseRouteImport; parentRoute: typeof rootRouteImport }
    '/mob': { id: '/mob'; path: '/mob'; fullPath: '/mob'; preLoaderRoute: typeof MobRouteImport; parentRoute: typeof rootRouteImport }
    '/mob/retros': { id: '/mob/retros'; path: '/mob/retros'; fullPath: '/mob/retros'; preLoaderRoute: typeof MobRetrosRouteImport; parentRoute: typeof rootRouteImport }
    '/mob/afterwork': { id: '/mob/afterwork'; path: '/mob/afterwork'; fullPath: '/mob/afterwork'; preLoaderRoute: typeof MobAfterworkRouteImport; parentRoute: typeof rootRouteImport }
    '/mob/course': { id: '/mob/course'; path: '/mob/course'; fullPath: '/mob/course'; preLoaderRoute: typeof MobCourseRouteImport; parentRoute: typeof rootRouteImport }
  }
}

export const routeTree = rootRouteImport._addFileChildren({
  AdminRoute,
  AdminCoursesRoute,
  AdminMobGroupsRoute,
  AdminUsersRoute,
  AdminAfterworkRoute,
  AdminFeedbackRoute,
  IndexRoute,
  LoginRoute,
  UserRoute,
  UserRetrosRoute,
  UserAfterworkRoute,
  UserCourseRoute,
  MobRoute,
  MobRetrosRoute,
  MobAfterworkRoute,
  MobCourseRoute,
})