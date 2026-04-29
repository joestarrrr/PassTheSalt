import { useMemo, useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  assignUserToCourse,
  assignUserToMobGroupNew,
  createMobGroup,
  getAdminUsers,
  getCourses,
  getMobGroupsForCourse,
} from '../api'

type Course = {
  id: number
  name: string
}

type UserSummary = {
  id: number
  email: string
  fullName: string
  role: string
  courseId: number | null
  mobGroupId: number | null
}

type MobGroup = {
  id: number
  courseId: number
  name: string
  description: string | null
}

type Feedback = { type: 'success' | 'error'; message: string } | null

type CreateMobGroupInput = {
  courseId: number
  name: string
  description: string
}

export function AdminMobGroupManagementPage() {
  const queryClient = useQueryClient()

  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [mobGroupName, setMobGroupName] = useState('')
  const [mobGroupDesc, setMobGroupDesc] = useState('')

  const [selectedUserForCourse, setSelectedUserForCourse] = useState('')
  const [selectedCourseForUser, setSelectedCourseForUser] = useState('')

  const [selectedUserForMobGroup, setSelectedUserForMobGroup] = useState('')
  const [selectedMobGroupForUser, setSelectedMobGroupForUser] = useState('')
  const [selectedCourseForMobGroup, setSelectedCourseForMobGroup] = useState('')

  const [feedback, setFeedback] = useState<Feedback>(null)

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => getCourses() as Promise<Course[]>,
  })

  const usersQuery = useQuery<UserSummary[]>({
    queryKey: ['admin-users'],
    queryFn: () => getAdminUsers() as Promise<UserSummary[]>,
  })

  const mobGroupsQuery = useQuery<MobGroup[]>({
    queryKey: ['course-mob-groups', selectedCourseForMobGroup],
    queryFn: () => getMobGroupsForCourse(selectedCourseForMobGroup) as Promise<MobGroup[]>,
    enabled: Boolean(selectedCourseForMobGroup),
  })

  const createMobGroupMutation = useMutation<unknown, Error, CreateMobGroupInput>({
    mutationFn: (variables) =>
      createMobGroup({
        courseId: variables.courseId,
        name: variables.name,
        description: variables.description,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['course-mob-groups'] })
      setMobGroupName('')
      setMobGroupDesc('')
      setFeedback({ type: 'success', message: 'Mob group created successfully!' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to create mob group' })
    },
  })

  const assignUserToCourseMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: number; courseId: number }) =>
      assignUserToCourse({ userId, courseId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setFeedback({ type: 'success', message: 'User assigned to course successfully!' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to assign user to course' })
    },
  })

  const assignUserToMobGroupMutation = useMutation({
    mutationFn: ({ userId, mobGroupId }: { userId: number; mobGroupId: number }) =>
      assignUserToMobGroupNew({ userId, mobGroupId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setFeedback({ type: 'success', message: 'User assigned to mob group successfully!' })
    },
    onError: (error) => {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to assign user to mob group' })
    },
  })

  const selectedCourseUsers = useMemo(() => {
    if (!selectedCourseForMobGroup) {
      return usersQuery.data ?? []
    }
    return (usersQuery.data ?? []).filter((user) => String(user.courseId ?? '') === String(selectedCourseForMobGroup))
  }, [usersQuery.data, selectedCourseForMobGroup])

  const handleCreateMobGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedCourseId || !mobGroupName.trim()) {
      setFeedback({ type: 'error', message: 'Please select a course and enter a mob group name' })
      return
    }

    createMobGroupMutation.mutate({
      courseId: Number(selectedCourseId),
      name: mobGroupName.trim(),
      description: mobGroupDesc.trim(),
    })
  }

  const handleAssignUserToCourse = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedUserForCourse || !selectedCourseForUser) {
      setFeedback({ type: 'error', message: 'Please select both user and course' })
      return
    }

    assignUserToCourseMutation.mutate({
      userId: Number(selectedUserForCourse),
      courseId: Number(selectedCourseForUser),
    })
  }

  const handleAssignUserToMobGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedUserForMobGroup || !selectedMobGroupForUser) {
      setFeedback({ type: 'error', message: 'Please select both user and mob group' })
      return
    }

    assignUserToMobGroupMutation.mutate({
      userId: Number(selectedUserForMobGroup),
      mobGroupId: Number(selectedMobGroupForUser),
    })
  }

  return (
    <div className="space-y-6">
      {feedback && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleCreateMobGroup} className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
            <h3 className="text-lg font-bold text-slate-900">Create New Mob Group</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Select Course</span>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                >
                  <option value="">Choose a course...</option>
                  {(coursesQuery.data ?? []).map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Mob Group Name</span>
                <input
                  value={mobGroupName}
                  onChange={(e) => setMobGroupName(e.target.value)}
                  placeholder="e.g. Mob Alpha"
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Description (Optional)</span>
                <input
                  value={mobGroupDesc}
                  onChange={(e) => setMobGroupDesc(e.target.value)}
                  placeholder="e.g. Frontend specialists"
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                />
              </label>
              <button
                type="submit"
                disabled={createMobGroupMutation.isPending}
                className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300"
              >
                {createMobGroupMutation.isPending ? 'Creating...' : 'Create Mob Group'}
              </button>
            </div>
          </form>

          <form onSubmit={handleAssignUserToCourse} className="rounded-3xl border border-slate-100 bg-white/80 p-5">
            <h3 className="text-lg font-bold text-slate-900">Assign User to Course</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">User</span>
                <select
                  value={selectedUserForCourse}
                  onChange={(e) => setSelectedUserForCourse(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                >
                  <option value="">Choose a user...</option>
                  {(usersQuery.data ?? []).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Course</span>
                <select
                  value={selectedCourseForUser}
                  onChange={(e) => setSelectedCourseForUser(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
                >
                  <option value="">Choose a course...</option>
                  {(coursesQuery.data ?? []).map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={assignUserToCourseMutation.isPending}
                className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300"
              >
                {assignUserToCourseMutation.isPending ? 'Assigning...' : 'Assign User to Course'}
              </button>
            </div>
          </form>
        </section>

        <form onSubmit={handleAssignUserToMobGroup} className="rounded-3xl border border-slate-100 bg-white/80 p-5">
          <h3 className="text-lg font-bold text-slate-900">Assign User to Mob Group</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Course</span>
              <select
                value={selectedCourseForMobGroup}
                onChange={(e) => setSelectedCourseForMobGroup(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="">Choose a course...</option>
                {(coursesQuery.data ?? []).map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">User</span>
              <select
                value={selectedUserForMobGroup}
                onChange={(e) => setSelectedUserForMobGroup(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="">Choose a user...</option>
                {selectedCourseUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Mob Group</span>
              <select
                value={selectedMobGroupForUser}
                onChange={(e) => setSelectedMobGroupForUser(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400"
              >
                <option value="">Choose a mob group...</option>
                {(mobGroupsQuery.data ?? []).map((mobGroup) => (
                  <option key={mobGroup.id} value={mobGroup.id}>
                    {mobGroup.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={assignUserToMobGroupMutation.isPending}
            className="mt-4 w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300"
          >
            {assignUserToMobGroupMutation.isPending ? 'Assigning...' : 'Assign User to Mob Group'}
          </button>
        </form>
    </div>
  )
}
