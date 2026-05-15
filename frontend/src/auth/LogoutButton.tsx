type LogoutButtonProps = {
  label?: string
  className?: string
}

export function LogoutButton({
  label = 'Sign out',
  className =
    'inline-flex items-center justify-center rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300/60',
}: LogoutButtonProps) {
  const handleClick = () => {
    window.location.hash = '#/login'
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {label}
    </button>
  )
}
