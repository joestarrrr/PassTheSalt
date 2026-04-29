export type Course = {
  id: number
  name: string
  numberOfDays: number
  startDate: string
}

export type CreateCourseInput = {
  name: string
  numberOfDays: number
  startDate: string
}

export type CourseDay = {
  id: number
  courseId: number
  dayNumber: number
  date: string
}

export type UserCourseContext = {
  userId: number
  courseId: number | null
  courseName: string | null
  mobGroupId: number | null
  mobGroupName: string | null
  courseDays: CourseDay[]
}
