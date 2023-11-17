import type { AccessDeniedError, InvalidTokenError } from '@/domain/errors'
import type { Role } from '@/domain/models/db-models'
import type { Either } from '@/shared/either'

export interface AccessControlDto {
  accessToken: string
  requiredRole: Role
}

export interface UserId {
  userId: string
}

export type AccessControlRes = Either<InvalidTokenError | AccessDeniedError, UserId>

export interface AccessControl {
  perform: (dto: AccessControlDto) => Promise<AccessControlRes>
}
