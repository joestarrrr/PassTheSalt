import { MobLayout } from '../../layout/MobLayout'
import { UserCourseRetroPage } from '../UserCourseRetroPage'

export function MobRetrosPage() {
  return (
    <MobLayout title="Retros" description="Mob mode uses the same retro flow with a mob-specific shell.">
      <UserCourseRetroPage />
    </MobLayout>
  )
}