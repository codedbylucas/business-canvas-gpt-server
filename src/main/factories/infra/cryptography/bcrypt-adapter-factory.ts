import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'

export const bcryptAdapterFactory = (): BcryptAdapter => {
  const salt = 12
  return new BcryptAdapter(salt)
}
