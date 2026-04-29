import { UserLayout } from '../../layout/UserLayout'
import { UserCourseRetroPage } from '../UserCourseRetroPage'

export function UserRetrosPage() {
  return (
    <UserLayout title="Retros" description="Submit and review your daily retro feedback.">
      <UserCourseRetroPage />
    </UserLayout>
  )
}