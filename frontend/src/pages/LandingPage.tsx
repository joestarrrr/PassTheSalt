import { Link } from '@tanstack/react-router'

export function LandingPage() {
  return (
    <main>
      <header>
        <p>Pass the Salt</p>
      </header>

      <section aria-labelledby="welcome-heading">
        <h1 id="welcome-heading">Welcome!</h1>

        <figure>
          <img
            src="https://placehold.co/320x240/png?text=Mascot"
            alt="Placeholder mascot illustration"
          />
          <figcaption>Let's make classes better together!</figcaption>
        </figure>

        <p>Share feedback. Ask questions. Plan afterworks.</p>
        <p>Anonymously and together, we make every class better.</p>

        <Link to="/login">Click to Login →</Link>
        <p>It's quick &amp; easy!</p>
      </section>
    </main>
  )
}