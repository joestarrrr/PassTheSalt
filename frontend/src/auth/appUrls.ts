export function getAppRootUrl() {
  if (typeof window === 'undefined') {
    return '/'
  }

  const basePath = import.meta.env.BASE_URL || '/'
  return new URL(basePath, window.location.origin).toString()
}