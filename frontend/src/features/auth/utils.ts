import type { Role } from '../../types/api'

export const homePathFor = (role: Role) => (role === 'admin' ? '/admin/dashboard' : '/dashboard')
