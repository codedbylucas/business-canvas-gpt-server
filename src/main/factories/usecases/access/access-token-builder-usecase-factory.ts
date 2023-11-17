import type { AccessTokenBuilder } from '@/domain/contracts'
import { AccessTokenBuilderUseCase } from '@/interactions/usecases/access'
import { jwtAdapterFactory } from '@/main/factories/infra/cryptography/jwt-adapter-factory'

export const accessTokenBuilderUseCaseFactory = (): AccessTokenBuilder => {
  return new AccessTokenBuilderUseCase(jwtAdapterFactory())
}
