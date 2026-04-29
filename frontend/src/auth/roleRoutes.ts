import type { AppRole } from '../types/auth'

export function isAppRole(role: string): role is AppRole {
  return normalizeRole(role) === role
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

export function normalizeRole(role: string | null | undefined): AppRole | null {
  if (!role) {
    return null
  }

  const normalized = role.trim().toLowerCase()
  if (normalized === 'student') {
    return 'user'
  }

  if (normalized === 'admin' || normalized === 'user' || normalized === 'mob') {
    return normalized
  }

  return null
}
