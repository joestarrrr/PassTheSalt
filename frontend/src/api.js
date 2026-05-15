const DEFAULT_PROD_BACKEND_URL = 'https://passthesalt-production.up.railway.app'
const IS_LOCAL_HOST =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

// In local dev, keep this empty so /api uses Vite proxy.
// In production, always default to Railway if env define is missing.
const BACKEND_URL =
  typeof __BACKEND_URL__ !== 'undefined' && __BACKEND_URL__
    ? __BACKEND_URL__
    : IS_LOCAL_HOST
      ? ''
      : DEFAULT_PROD_BACKEND_URL

function getApiUrl(path) {
  // In dev with proxy: use relative path /api/*
  // In production: use explicit backend URL
  if (BACKEND_URL && BACKEND_URL !== '') {
    return `${BACKEND_URL}${path}`
  }
  return path
}

async function parseResponse(response, fallbackMessage) {
  if (!response.ok) {
    const message = (await response.text()).trim()
    throw new Error(message || fallbackMessage)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return null
}

function authFetch(input, init = {}) {
  const url = getApiUrl(input)
  return fetch(url, {
    ...init,
    headers: init.headers || {},
  })
}

export const assignUserToMobGroup = async (mobGroupId, userId) => {
  const response = await authFetch(`/api/admin/mob-groups/${mobGroupId}/users/${userId}`, {
    method: 'PUT',
  })

  return parseResponse(response, 'Failed to assign user to mob group')
}

export const renameMobGroup = async (mobGroupId, mobGroupName) => {
  const response = await authFetch(`/api/admin/mob-groups/${mobGroupId}/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mobGroupName }),
  })

  return parseResponse(response, 'Failed to rename mob group')
}

export const getAfterworkEvents = async () => {
  const response = await authFetch('/api/afterwork-events')
  return parseResponse(response, 'Failed to load afterwork events')
}

export const createAfterworkEvent = async ({ title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await authFetch('/api/afterwork-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to create afterwork event')
}

export const updateAfterworkEvent = async (eventId, { title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await authFetch(`/api/afterwork-events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to update afterwork event')
}

export const deleteAfterworkEvent = async (eventId) => {
  const response = await authFetch(`/api/afterwork-events/${eventId}`, {
    method: 'DELETE',
  })

  return parseResponse(response, 'Failed to delete afterwork event')
}

export const getUserAfterworkEvents = async () => {
  const response = await authFetch('/api/afterwork-events')
  return parseResponse(response, 'Failed to load user afterwork events')
}

export const createUserAfterworkEvent = async ({ title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await authFetch('/api/afterwork-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to create user afterwork event')
}

export const updateUserAfterworkEvent = async (eventId, { title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await authFetch(`/api/afterwork-events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to update user afterwork event')
}

export const deleteUserAfterworkEvent = async (eventId) => {
  const response = await authFetch(`/api/afterwork-events/${eventId}`, {
    method: 'DELETE',
  })

  return parseResponse(response, 'Failed to delete user afterwork event')
}

// Course Management API
export const createCourse = async ({ name, numberOfDays, startDate }) => {
  const response = await authFetch('/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, numberOfDays, startDate }),
  })

  return parseResponse(response, 'Failed to create course')
}

export const getCourses = async () => {
  const response = await authFetch('/api/courses')
  return parseResponse(response, 'Failed to load courses')
}

export const getCourseById = async (courseId) => {
  const response = await authFetch(`/api/courses/${courseId}`)
  return parseResponse(response, 'Failed to load course')
}

export const getCourseDays = async (courseId) => {
  const response = await authFetch(`/api/courses/${courseId}/days`)
  return parseResponse(response, 'Failed to load course days')
}

// Mob Group Management API
export const createMobGroup = async ({ courseId, name, description }) => {
  const response = await authFetch('/api/mob-groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId, name, description }),
  })

  return parseResponse(response, 'Failed to create mob group')
}

export const getMobGroupsForCourse = async (courseId) => {
  const response = await authFetch(`/api/courses/${courseId}/mob-groups`)
  return parseResponse(response, 'Failed to load mob groups for course')
}

export const getAdminUsers = async (courseId) => {
  const query = courseId ? `?courseId=${courseId}` : ''
  const response = await authFetch(`/api/users${query}`)
  return parseResponse(response, 'Failed to load users')
}

// User Assignment API
export const assignUserToCourse = async ({ userId, courseId }) => {
  const response = await authFetch('/api/users/assign-course', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, courseId }),
  })

  return parseResponse(response, 'Failed to assign user to course')
}

export const assignUserToMobGroupNew = async ({ userId, mobGroupId }) => {
  const response = await authFetch('/api/users/assign-mob-group', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, mobGroupId }),
  })

  return parseResponse(response, 'Failed to assign user to mob group')
}

export const getUserCourseContext = async (userId) => {
  const response = await authFetch(`/api/users/${userId}/course-context`)
  return parseResponse(response, 'Failed to load user course context')
}

export const getCurrentUser = async () => {
  const url = getApiUrl('/api/auth/me')
  const response = await fetch(url)

  if (response.ok) {
    return parseResponse(response, 'Failed to load current user')
  }

  // Try to parse structured error response from backend
  let bodyText = ''
  try {
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const json = await response.json()
      bodyText = json.message || JSON.stringify(json)
    } else {
      bodyText = (await response.text()).trim()
    }
  } catch (ex) {
    bodyText = 'Unknown error'
  }

  throw new Error(`HTTP ${response.status}: ${bodyText || 'Failed to load current user'}`)
}

// Retro API
export const submitRetro = async (retroData) => {
  const response = await authFetch('/api/retros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(retroData),
  })

  return parseResponse(response, 'Failed to submit retro')
}

export const updateRetro = async (retroId, retroData) => {
  const response = await authFetch(`/api/retros/${retroId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(retroData),
  })

  return parseResponse(response, 'Failed to update retro')
}

export const getRetrosByCourse = async (courseId) => {
  const response = await authFetch(`/api/retros/course/${courseId}`)
  return parseResponse(response, 'Failed to load retros')
}

export const getRetrosByCourseDay = async (courseDayId) => {
  const response = await authFetch(`/api/retros/course-day/${courseDayId}`)
  return parseResponse(response, 'Failed to load retros')
}

export const getRetrosByCourseDayAndMobGroup = async (courseDayId, mobGroupId) => {
  const response = await authFetch(`/api/retros/course-day/${courseDayId}/mob-group/${mobGroupId}`)
  return parseResponse(response, 'Failed to load retros')
}

// Afterwork Location API
export const getAwLocations = async (courseId) => {
  const response = await authFetch(`/api/aw-locations?courseId=${courseId}`)
  return parseResponse(response, 'Failed to load afterwork locations')
}

export const createAwLocation = async ({ courseId, name, lng, lat }) => {
  const response = await authFetch('/api/aw-locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId, name, lng, lat }),
  })

  return parseResponse(response, 'Failed to create afterwork location')
}

export const updateAwLocation = async (locationId, { name }) => {
  const response = await authFetch(`/api/aw-locations/${locationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  return parseResponse(response, 'Failed to update afterwork location')
}

export const deleteAwLocation = async (locationId) => {
  const response = await authFetch(`/api/aw-locations/${locationId}`, {
    method: 'DELETE',
  })

  return parseResponse(response, 'Failed to delete afterwork location')
}

export const voteAwLocation = async (locationId) => {
  const response = await authFetch(`/api/aw-locations/${locationId}/vote`, {
    method: 'POST',
  })

  return parseResponse(response, 'Failed to vote on afterwork location')
}

export const removeAwVote = async (locationId) => {
  const response = await authFetch(`/api/aw-locations/${locationId}/vote`, {
    method: 'DELETE',
  })

  return parseResponse(response, 'Failed to remove afterwork vote')
}

export const getWinningAwLocation = async (courseId) => {
  const response = await authFetch(`/api/aw-locations/winner?courseId=${courseId}`)
  return parseResponse(response, 'Failed to load winning afterwork location')
}
