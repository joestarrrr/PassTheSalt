let sessionToken = ''

export function setSessionToken(token: string) {
  sessionToken = token.trim()
}

export function clearSessionToken() {
  sessionToken = ''
}

export function getSessionToken() {
  return sessionToken
}
