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

export const assignUserToMobGroup = async (mobGroupId, userId) => {
  const response = await fetch(`/api/admin/mob-groups/${mobGroupId}/users/${userId}`, {
    method: 'PUT',
  })

  return parseResponse(response, 'Failed to assign user to mob group')
}

export const renameMobGroup = async (mobGroupId, mobGroupName) => {
  const response = await fetch(`/api/admin/mob-groups/${mobGroupId}/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mobGroupName }),
  })

  return parseResponse(response, 'Failed to rename mob group')
}

export const getAfterworkEvents = async () => {
  const response = await fetch('/api/afterwork-events')
  return parseResponse(response, 'Failed to load afterwork events')
}

export const createAfterworkEvent = async ({ title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await fetch('/api/afterwork-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to create afterwork event')
}

export const updateAfterworkEvent = async (eventId, { title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await fetch(`/api/afterwork-events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to update afterwork event')
}

export const deleteAfterworkEvent = async (eventId) => {
  const response = await fetch(`/api/afterwork-events/${eventId}`, {
    method: 'DELETE',
  })

  return parseResponse(response, 'Failed to delete afterwork event')
}

export const getUserAfterworkEvents = async () => {
  const response = await fetch('/api/afterwork-events')
  return parseResponse(response, 'Failed to load user afterwork events')
}

export const createUserAfterworkEvent = async ({ title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await fetch('/api/afterwork-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to create user afterwork event')
}

export const updateUserAfterworkEvent = async (eventId, { title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await fetch(`/api/afterwork-events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to update user afterwork event')
}

export const deleteUserAfterworkEvent = async (eventId) => {
  const response = await fetch(`/api/afterwork-events/${eventId}`, {
    method: 'DELETE',
  })

  return parseResponse(response, 'Failed to delete user afterwork event')
}

// Course Management API
export const createCourse = async ({ name, numberOfDays, startDate }) => {
  const response = await fetch('/api/courses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, numberOfDays, startDate }),
  })

  return parseResponse(response, 'Failed to create course')
}

export const getCourses = async () => {
  const response = await fetch('/api/courses')
  return parseResponse(response, 'Failed to load courses')
}

export const getCourseById = async (courseId) => {
  const response = await fetch(`/api/courses/${courseId}`)
  return parseResponse(response, 'Failed to load course')
}

export const getCourseDays = async (courseId) => {
  const response = await fetch(`/api/courses/${courseId}/days`)
  return parseResponse(response, 'Failed to load course days')
}

// Mob Group Management API
export const createMobGroup = async ({ courseId, name, description }) => {
  const response = await fetch('/api/mob-groups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId, name, description }),
  })

  return parseResponse(response, 'Failed to create mob group')
}

export const getMobGroupsForCourse = async (courseId) => {
  const response = await fetch(`/api/courses/${courseId}/mob-groups`)
  return parseResponse(response, 'Failed to load mob groups for course')
}

export const getAdminUsers = async (courseId) => {
  const query = courseId ? `?courseId=${courseId}` : ''
  const response = await fetch(`/api/users${query}`)
  return parseResponse(response, 'Failed to load users')
}

// User Assignment API
export const assignUserToCourse = async ({ userId, courseId }) => {
  const response = await fetch('/api/users/assign-course', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, courseId }),
  })

  return parseResponse(response, 'Failed to assign user to course')
}

export const assignUserToMobGroupNew = async ({ userId, mobGroupId }) => {
  const response = await fetch('/api/users/assign-mob-group', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, mobGroupId }),
  })

  return parseResponse(response, 'Failed to assign user to mob group')
}

export const getUserCourseContext = async (userId) => {
  const response = await fetch(`/api/users/${userId}/course-context`)
  return parseResponse(response, 'Failed to load user course context')
}

// Retro API
export const submitRetro = async (retroData) => {
  const response = await fetch('/api/retros', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(retroData),
  })

  return parseResponse(response, 'Failed to submit retro')
}

export const getRetrosByCourse = async (courseId) => {
  const response = await fetch(`/api/retros/course/${courseId}`)
  return parseResponse(response, 'Failed to load retros')
}

export const getRetrosByCourseDay = async (courseDayId) => {
  const response = await fetch(`/api/retros/course-day/${courseDayId}`)
  return parseResponse(response, 'Failed to load retros')
}

export const getRetrosByCourseDayAndMobGroup = async (courseDayId, mobGroupId) => {
  const response = await fetch(`/api/retros/course-day/${courseDayId}/mob-group/${mobGroupId}`)
  return parseResponse(response, 'Failed to load retros')
}
