import { MobLayout } from '../../layout/MobLayout'
import { UserAfterworkEventsManagement } from '../UserAfterworkEventsManagement'

export function MobAfterworkPage() {
  return (
    <MobLayout title="Afterwork" description="Mob mode uses the same afterwork voting flow.">
      <UserAfterworkEventsManagement />
    </MobLayout>
  )
}