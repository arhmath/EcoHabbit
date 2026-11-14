export default function SplashScreen() {
  return (
    <div role="status" aria-live="polite" className="flex min-h-screen items-center justify-center bg-zest text-leaf">
      <svg viewBox="0 0 24 24" className="size-10 animate-pulse text-leaf motion-reduce:animate-none" fill="currentColor" aria-hidden="true">
        <path d="M20 4C9 4 4 9.5 4 15c0 1.7.5 3.2 1.4 4.4C7 14 11 10.5 16 9c-4 2.5-7 6-8.4 11.2.8.5 1.6.8 2.5.8 6.3 0 10-6 9.9-17z" />
      </svg>
      <span className="sr-only">Memuat EcoHabbit</span>
    </div>
  )
}
