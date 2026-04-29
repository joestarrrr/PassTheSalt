import { MobLayout } from '../../layout/MobLayout'
import { CourseOverview } from '../../components/CourseOverview'

export function MobCoursePage() {
  return (
    <MobLayout title="Course" description="Mob mode uses the same course overview flow.">
      <CourseOverview roleLabel="Mob" />
    </MobLayout>
  )
}