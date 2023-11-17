import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '@/main/configs/env'

export const jwtAdapterFactory = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecretKey)
}
