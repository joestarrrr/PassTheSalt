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
  const response = await fetch('/api/admin/afterwork-events')
  return parseResponse(response, 'Failed to load afterwork events')
}

export const createAfterworkEvent = async ({ title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await fetch('/api/admin/afterwork-events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to create afterwork event')
}

export const updateAfterworkEvent = async (eventId, { title, eventDate, location = 'TBD', createdByUserId = 1 }) => {
  const response = await fetch(`/api/admin/afterwork-events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, eventDate, location, createdByUserId }),
  })

  return parseResponse(response, 'Failed to update afterwork event')
}

export const deleteAfterworkEvent = async (eventId) => {
  const response = await fetch(`/api/admin/afterwork-events/${eventId}`, {
    method: 'DELETE',
  })

  return parseResponse(response, 'Failed to delete afterwork event')
}