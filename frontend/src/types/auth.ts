export type AppRole = 'admin' | 'user' | 'mob'

export type BackendUser = {
  id: number
  email: string
  fullName: string
  role: AppRole
  courseId: number | null
  mobGroupId: number | null
}

export type CurrentUserResponse = BackendUser
