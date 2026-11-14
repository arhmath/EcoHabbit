import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { login } from '../../api/auth'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import { applyServerError } from './formUtils'
import { loginSchema, type LoginValues } from './schemas'
import { useAuthStore } from './store'

export default function LoginForm() {
  const notice = useAuthStore((s) => s.notice)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    useAuthStore.getState().clearNotice()
    try {
      useAuthStore.getState().setSession(await login(values))
      // GuestOnly mengalihkan ke dashboard sesuai role (AUTH-02).
    } catch (err) {
      applyServerError(err, setError, ['email', 'password'])
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {notice && (
        <p role="status" className="rounded-2xl border border-leaf/30 bg-zest-soft px-4 py-3 text-sm">
          {notice}
        </p>
      )}
      {errors.root && (
        <p role="alert" className="rounded-2xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errors.root.message}
        </p>
      )}
      <Field label="Email" type="email" autoComplete="email" inputMode="email" placeholder="nama@email.com" error={errors.email?.message} {...register('email')} />
      <Field label="Password" type="password" autoComplete="current-password" placeholder="Password akunmu" error={errors.password?.message} {...register('password')} />
      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? 'Memeriksa…' : 'Masuk ke EcoHabbit'}
      </Button>
    </form>
  )
}
