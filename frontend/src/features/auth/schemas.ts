import { z } from 'zod'

const email = z.string().trim().min(1, 'Email wajib diisi').email('Format email tidak valid')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password wajib diisi'),
})

// Panjang minimum password mengikuti default Laravel (8), konfirmasi dengan backend.
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
    email,
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((v) => v.password === v.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Konfirmasi password tidak sama',
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
