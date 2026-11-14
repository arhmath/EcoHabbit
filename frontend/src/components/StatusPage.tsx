import { Link } from 'react-router-dom'

interface Props {
  code: string
  title: string
  body: string
}

export default function StatusPage({ code, title, body }: Props) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linear-to-b from-ink to-forest-900 px-6 text-center text-mist">
      <p className="font-display text-8xl font-extrabold tracking-[0.2em] text-forest-700">{code}</p>
      <h1 className="font-display text-3xl font-bold md:text-5xl">{title}</h1>
      <p className="max-w-md text-mist/70">{body}</p>
      <Link to="/" className="mt-4 rounded-full bg-sage px-7 py-3.5 font-semibold text-ink transition-colors hover:bg-mist">
        Kembali ke beranda
      </Link>
    </main>
  )
}
