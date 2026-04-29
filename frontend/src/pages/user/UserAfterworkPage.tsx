import { UserLayout } from '../../layout/UserLayout'
import { UserAfterworkEventsManagement } from '../UserAfterworkEventsManagement'

export function UserAfterworkPage() {
  return (
    <UserLayout title="Afterwork" description="Vote on afterwork locations for your course.">
      <UserAfterworkEventsManagement />
    </UserLayout>
  )
}