import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap, useMotion } from '../../lib/motion'
import { Logo } from '../landing/Navbar'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

// Satu halaman untuk /login dan /register: panel overlay bergeser seperti ResQNet.
// Layout route ini tidak remount saat pindah rute, jadi transisinya mulus.
export default function AuthPage() {
  const isRegister = useLocation().pathname.startsWith('/register')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = isRegister ? 'Daftar | EcoHabbit' : 'Masuk | EcoHabbit'
  }, [isRegister])

  useMotion(ref, () => {
    gsap.from('.auth-card', { y: 40, opacity: 0, duration: 1, ease: 'power4.out' })
    gsap.to('.orb', { yPercent: (i: number) => (i % 2 ? 12 : -12), duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  })

  return (
    <div ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4 py-10 text-leaf">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="orb absolute -top-28 -left-28 size-[26rem] rounded-full bg-zest" />
        <div className="orb absolute -right-24 bottom-0 size-80 rounded-full bg-leaf" />
        <div className="orb absolute top-1/3 right-[12%] size-20 rounded-full border-2 border-leaf bg-white" />
      </div>

      <div className="auth-card relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] border-2 border-leaf bg-white shadow-[12px_12px_0_0_var(--color-leaf)] md:min-h-[40rem] md:grid-cols-2">
        {/* Header merek untuk layar kecil (overlay hanya tampil di md ke atas). */}
        <div className="relative overflow-hidden bg-leaf px-6 pt-6 pb-16 text-white md:hidden">
          <Logo href="/" />
          <div aria-hidden="true" className="absolute -right-8 -bottom-10 size-32 rounded-full bg-zest" />
          <div aria-hidden="true" className="absolute right-20 -bottom-6 size-14 rounded-full bg-leaf-600" />
        </div>

        <section
          inert={isRegister}
          aria-labelledby="login-title"
          className={`flex flex-col justify-center px-6 py-10 sm:px-12 md:col-start-1 md:row-start-1 md:px-14 ${isRegister ? 'max-md:hidden' : ''}`}
        >
          <h1 id="login-title" className="font-display text-4xl font-extrabold tracking-tight">
            Selamat datang
          </h1>
          <p className="mt-2 mb-8 text-leaf/70">Silakan masuk ke akun EcoHabbit kamu.</p>
          <LoginForm />
          <p className="mt-6 text-sm text-leaf/70 md:hidden">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-leaf underline underline-offset-4">
              Daftar
            </Link>
          </p>
          <BackHome />
        </section>

        <section
          inert={!isRegister}
          aria-labelledby="register-title"
          className={`flex flex-col justify-center px-6 py-10 sm:px-12 md:col-start-2 md:row-start-1 md:px-14 ${isRegister ? '' : 'max-md:hidden'}`}
        >
          <h1 id="register-title" className="font-display text-4xl font-extrabold tracking-tight">
            Buat akun EcoHabbit
          </h1>
          <p className="mt-2 mb-8 text-leaf/70">Daftar dan mulai tumbuhkan kebiasaan hijaumu.</p>
          <RegisterForm />
          <p className="mt-6 text-sm text-leaf/70 md:hidden">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-leaf underline underline-offset-4">
              Masuk
            </Link>
          </p>
          <BackHome />
        </section>

        {/* Overlay geser (desktop). Menutupi sisi yang tidak sedang dipakai. */}
        <aside
          className={`absolute inset-y-0 left-0 hidden w-1/2 overflow-hidden bg-leaf text-white transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.18,1)] motion-reduce:transition-none md:block ${
            isRegister ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-leaf-600" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-zest" />
          <div aria-hidden="true" className="pointer-events-none absolute right-16 bottom-40 size-16 rounded-full border-2 border-zest" />
          <Panel
            active={!isRegister}
            title="Mulai dari satu kebiasaan."
            body="Catat aksi hijau harian, pilah sampah, dan tumbuhkan tanamanmu bersama EcoHabbit."
            to="/register"
            cta="Buat akun"
          />
          <Panel
            active={isRegister}
            title="Selamat datang kembali."
            body="Sudah punya akun? Masuk untuk melanjutkan misi dan menjaga streak-mu."
            to="/login"
            cta="Masuk"
          />
        </aside>
      </div>
    </div>
  )
}

function Panel({ active, title, body, to, cta }: { active: boolean; title: string; body: string; to: string; cta: string }) {
  return (
    <div
      inert={!active}
      aria-hidden={!active}
      className={`absolute inset-0 flex flex-col items-start gap-5 p-12 transition-opacity duration-500 motion-reduce:transition-none ${active ? 'opacity-100 delay-300' : 'opacity-0'}`}
    >
      <Logo href="/" />
      <h2 className="mt-6 max-w-xs font-display text-4xl leading-[1.05] font-extrabold tracking-tight">{title}</h2>
      <p className="max-w-xs text-white/75">{body}</p>
      <Link to={to} className="relative z-10 rounded-full border-2 border-zest px-7 py-3 font-semibold text-zest transition-colors hover:bg-zest hover:text-leaf">
        {cta}
      </Link>
    </div>
  )
}

function BackHome() {
  return (
    <Link to="/" className="mt-4 inline-block w-fit text-sm font-semibold text-leaf-600 hover:text-leaf">
      ← Kembali ke halaman utama
    </Link>
  )
}
