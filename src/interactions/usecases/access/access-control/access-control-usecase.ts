import type { AccessControl, AccessControlDto, AccessControlRes } from '@/domain/contracts'
import type { FetchUserByIdRepo } from '@/interactions/contracts/db/fetch-user-by-id-repo'
import type { Decrypter } from '@/interactions/contracts/cryptography'
import { AccessDeniedError, InvalidTokenError } from '@/domain/errors'
import { left, right } from '@/shared/either'

export class AccessControlUseCase implements AccessControl {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly fetchUsertByIdRepo: FetchUserByIdRepo
  ) {}

  async perform (dto: AccessControlDto): Promise<AccessControlRes> {
    const userId = await this.decrypter.decrypt(dto.accessToken)
    if (!userId) {
      return left(new InvalidTokenError())
    }
    const user = await this.fetchUsertByIdRepo.fetchById(userId)
    if (!user) {
      return left(new AccessDeniedError())
    }
    if (user.role !== 'admin' && dto.requiredRole !== user.role) {
      return left(new AccessDeniedError())
    }
    return right({ userId })
  }
}
