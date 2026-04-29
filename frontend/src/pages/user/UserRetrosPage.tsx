import { UserLayout } from '../../layout/UserLayout'

export function UserRetrosPage() {
  return (
    <UserLayout title="Retros" description="Submit and review your daily retro feedback.">
      <div className="rounded-3xl border border-slate-100 bg-white/80 p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Mob Group Feature</p>
        <p className="mt-3 text-slate-600">Retro submissions are only available for mob group members. Contact your instructor to join a mob group.</p>
      </div>
    </UserLayout>
  )
}