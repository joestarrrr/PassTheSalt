import type { AppRole } from '../types/auth'

export function isAppRole(role: string): role is AppRole {
  return role === 'admin' || role === 'user' || role === 'mob'
}

export function getRoleHome(role: AppRole) {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'mob':
      return '/mob'
    default:
      return '/user'
  }
}
