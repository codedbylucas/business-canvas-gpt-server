import type { AccessTokenModel } from '@/domain/models/output-models'

export interface EncrypterDto {
  value: string
  expiresInHours?: number
}

export interface Encrypter {
  encrypt: (dto: EncrypterDto) => Promise<AccessTokenModel>
}
