import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { register as registerAccount } from '../../api/auth'
import Button from '../../components/ui/Button'
import Field from '../../components/ui/Field'
import { applyServerError } from './formUtils'
import { registerSchema, type RegisterValues } from './schemas'
import { useAuthStore } from './store'

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      // Akun baru berperan user, level 1 (AUTH-01). Diasumsikan API langsung mengembalikan token.
      useAuthStore.getState().setSession(await registerAccount(values))
    } catch (err) {
      applyServerError(err, setError, ['name', 'email', 'password', 'password_confirmation'])
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {errors.root && (
        <p role="alert" className="rounded-2xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errors.root.message}
        </p>
      )}
      <Field label="Nama lengkap" autoComplete="name" placeholder="Nama kamu" error={errors.name?.message} {...register('name')} />
      <Field label="Email" type="email" autoComplete="email" inputMode="email" placeholder="nama@email.com" error={errors.email?.message} {...register('email')} />
      <Field label="Password" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" error={errors.password?.message} {...register('password')} />
      <Field label="Konfirmasi password" type="password" autoComplete="new-password" placeholder="Ulangi password" error={errors.password_confirmation?.message} {...register('password_confirmation')} />
      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? 'Membuat akun…' : 'Daftar sekarang'}
      </Button>
    </form>
  )
}
