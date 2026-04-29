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
    queryKey: ['course-mob-groups', selectedCourseForUser],
    queryFn: () => getMobGroupsForCourse(selectedCourseForUser) as Promise<MobGroup[]>,
    enabled: Boolean(selectedCourseForUser),
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
    if (!selectedCourseForUser) {
      return usersQuery.data ?? []
    }
    return (usersQuery.data ?? []).filter((user) => String(user.courseId ?? '') === String(selectedCourseForUser))
  }, [usersQuery.data, selectedCourseForUser])

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_30%,_#eef2ff_100%)] px-4 py-6 text-slate-800 dark:bg-[radial-gradient(circle_at_top,_#1a1a2e_0%,_#16213e_30%,_#0f3460_100%)] dark:text-slate-100 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.10)] backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/80 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90 dark:text-violet-400/90">Mob Group Management</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Assign Users and Mob Groups</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
            Create mob groups inside a course, assign users to courses, and then assign those users to mob groups.
          </p>
        </header>

        {feedback && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={handleCreateMobGroup} className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5 dark:border-violet-900/50 dark:bg-slate-800/70">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Mob Group</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Select Course</span>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600"
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
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Mob Group Name</span>
                <input
                  value={mobGroupName}
                  onChange={(e) => setMobGroupName(e.target.value)}
                  placeholder="e.g. Mob Alpha"
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-violet-600"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Description (Optional)</span>
                <input
                  value={mobGroupDesc}
                  onChange={(e) => setMobGroupDesc(e.target.value)}
                  placeholder="e.g. Frontend specialists"
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:border-violet-600"
                />
              </label>
              <button
                type="submit"
                disabled={createMobGroupMutation.isPending}
                className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300 dark:bg-violet-700 dark:hover:bg-violet-600"
              >
                {createMobGroupMutation.isPending ? 'Creating...' : 'Create Mob Group'}
              </button>
            </div>
          </form>

          <form onSubmit={handleAssignUserToCourse} className="rounded-3xl border border-slate-100 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-800/80">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assign User to Course</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">User</span>
                <select
                  value={selectedUserForCourse}
                  onChange={(e) => setSelectedUserForCourse(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600"
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
                <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Course</span>
                <select
                  value={selectedCourseForUser}
                  onChange={(e) => setSelectedCourseForUser(e.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600"
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
                className="w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300 dark:bg-violet-700 dark:hover:bg-violet-600"
              >
                {assignUserToCourseMutation.isPending ? 'Assigning...' : 'Assign User to Course'}
              </button>
            </div>
          </form>
        </section>

        <form onSubmit={handleAssignUserToMobGroup} className="rounded-3xl border border-slate-100 bg-white/80 p-5 dark:border-slate-700 dark:bg-slate-800/80">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Assign User to Mob Group</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Course</span>
              <select
                value={selectedCourseForUser}
                onChange={(e) => setSelectedCourseForUser(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600"
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
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">User</span>
              <select
                value={selectedUserForMobGroup}
                onChange={(e) => setSelectedUserForMobGroup(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600"
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
              <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Mob Group</span>
              <select
                value={selectedMobGroupForUser}
                onChange={(e) => setSelectedMobGroupForUser(e.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 dark:border-violet-900/50 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-violet-600"
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
            className="mt-4 w-full rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:bg-violet-300 dark:bg-violet-700 dark:hover:bg-violet-600"
          >
            {assignUserToMobGroupMutation.isPending ? 'Assigning...' : 'Assign User to Mob Group'}
          </button>
        </form>
      </div>
    </main>
  )
}
