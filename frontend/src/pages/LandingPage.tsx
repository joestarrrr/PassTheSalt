import { Link } from '@tanstack/react-router'

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#faf5ff_0%,_#f5f3ff_28%,_#f8fafc_62%,_#eef2ff_100%)] px-4 py-8 text-slate-800">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[8%] top-[10%] h-3 w-3 rounded-full bg-violet-300/70" />
        <span className="absolute left-[15%] top-[18%] h-1.5 w-1.5 rounded-full bg-pink-300/70" />
        <span className="absolute right-[14%] top-[14%] h-4 w-4 rounded-full bg-violet-200/70" />
        <span className="absolute bottom-[18%] left-[12%] h-2 w-10 rounded-full bg-violet-200/70" />
        <span className="absolute bottom-[22%] right-[10%] h-2.5 w-2.5 rounded-full bg-pink-200/70" />
        <span className="absolute left-[20%] top-[36%] text-2xl text-violet-300/70">✦</span>
        <span className="absolute right-[20%] top-[38%] text-xl text-pink-300/70">♡</span>
      </div>

      <section className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-violet-500/90">
          Pass the Salt
        </p>

        <div className="mb-8 space-y-3">
          <h1 className="relative inline-block text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Welcome!
            <span className="absolute -bottom-2 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-violet-300/80 blur-[1px]" />
          </h1>
          <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600 sm:text-base">
            A soft little space to share notes, ask questions, and make class feel a lot friendlier.
          </p>
        </div>

        <div className="relative mb-8 w-full">
          <div className="absolute -left-1 top-8 hidden h-14 w-14 rounded-full border border-violet-200/80 sm:block" />
          <div className="absolute -right-2 top-2 hidden h-10 w-10 rounded-full border border-pink-200/80 sm:block" />

          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center gap-4 rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(109,40,217,0.12)] backdrop-blur-sm">
            <div className="relative shrink-0">
              <img
                src="https://placehold.co/180x180/f5e8ff/7c3aed?text=Salt+Buddy"
                alt="Placeholder mascot illustration"
                className="h-28 w-28 rounded-[1.5rem] border-4 border-white object-cover shadow-lg shadow-violet-200/50 sm:h-32 sm:w-32"
              />
              <span className="absolute -left-3 top-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-violet-500 shadow-sm">
                hi!
              </span>
            </div>

            <div className="max-w-[11rem] rounded-[1.5rem] rounded-bl-md border border-violet-100 bg-violet-50 px-4 py-3 text-left shadow-sm">
              <p className="text-sm font-medium leading-6 text-slate-700">
                Hey! Ready to make class notes a little less lonely?
              </p>
              <div className="mt-2 flex gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-pink-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-sm space-y-5">
          <p className="text-base leading-7 text-slate-600 sm:text-[1.05rem]">
            Sign in to share feedback, swap ideas, and join the class community in one cute little place.
          </p>

          <Link
            to="/login"
            className="inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-violet-300/50 transition duration-200 hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60"
          >
            Log in to continue
          </Link>

          <p className="font-[cursive] text-sm text-violet-500/90">
            Promise it only takes a sec <span className="inline-block rotate-[-8deg]">✿</span>
          </p>
        </div>
      </section>
    </main>
  )
}