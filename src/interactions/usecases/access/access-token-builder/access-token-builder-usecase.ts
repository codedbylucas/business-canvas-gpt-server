import type { AccessTokenBuilder } from '@/domain/contracts'
import type { Encrypter } from '@/interactions/contracts/cryptography'
import type { AccessTokenModel } from '@/domain/models/output-models'

export class AccessTokenBuilderUseCase implements AccessTokenBuilder {
  constructor (private readonly encrypter: Encrypter) {}

  async perform (value: string): Promise<AccessTokenModel> {
    return await this.encrypter.encrypt({ value, expiresInHours: 48 })
  }
}
