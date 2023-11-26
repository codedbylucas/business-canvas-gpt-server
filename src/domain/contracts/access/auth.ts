import type { Either } from '@/shared/either'
import type { InvalidEmailError } from '../../entities/user/errors'
import type { InvalidCredentialsError } from '../../errors'

export interface AuthDto {
  email: string
  password: string
}

export interface AuthResValues {
  userName: string
  token: string
}

export type AuthRes = Either<InvalidEmailError | InvalidCredentialsError, AuthResValues>

export interface Auth {
  perform: (dto: AuthDto) => Promise<AuthRes>
}
