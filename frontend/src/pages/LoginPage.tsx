import { Link } from '@tanstack/react-router'

export function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_28%,_#f8fafc_62%,_#eef2ff_100%)] px-4 py-8 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[10%] top-[12%] h-3 w-3 rounded-full bg-violet-300/70" />
        <span className="absolute right-[12%] top-[18%] h-2 w-2 rounded-full bg-pink-300/70" />
        <span className="absolute bottom-[16%] left-[16%] h-2 w-12 rounded-full bg-violet-200/70" />
        <span className="absolute bottom-[22%] right-[18%] text-2xl text-violet-300/70">✦</span>
        <span className="absolute left-[22%] top-[34%] text-xl text-pink-300/70">♡</span>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">
          Pass the Salt
        </p>

        <div className="mb-8 space-y-3">
          <h1 className="relative inline-block text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Login
            <span className="absolute -bottom-2 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-violet-300/80 blur-[1px]" />
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
            Sign in to continue to Pass the Salt.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(109,40,217,0.12)] backdrop-blur-sm sm:p-8">
          <div className="rounded-[1.5rem] border-2 border-dashed border-violet-200 bg-violet-50/70 px-6 py-12 text-center">
            <p className="text-base font-semibold text-slate-700">Clerk SignIn will go here later</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This space is ready for your future authentication UI.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <Link
              to="/user/afterwork-events"
              className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-violet-300/50 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60"
            >
              Continue as User
            </Link>

            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-full border border-violet-200 bg-white px-6 py-4 text-base font-semibold text-violet-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60"
            >
              Back to home
            </Link>

            <p className="font-[cursive] text-sm text-violet-500/90">
              We’ll keep this cozy <span className="inline-block rotate-[-8deg]">✿</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}