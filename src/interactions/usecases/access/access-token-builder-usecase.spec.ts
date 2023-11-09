import type { Encrypter, EncrypterDto } from '@/interactions/contracts/cryptography'
import type { AccessTokenModel } from '@/domain/models/output-models'
import { AccessTokenBuilderUseCase } from './access-token-builder-usecase'

const makeAccessTokenEncrypter = (): Encrypter => {
  class AccessTokenEcrypterStub implements Encrypter {
    async encrypt (data: EncrypterDto): Promise<AccessTokenModel> {
      return { token: 'any_token' }
    }
  }
  return new AccessTokenEcrypterStub()
}

interface SutTypes {
  sut: AccessTokenBuilderUseCase
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeAccessTokenEncrypter()
  const sut = new AccessTokenBuilderUseCase(encrypterStub)
  return { sut, encrypterStub }
}

describe('AccessTokenBuilder UseCase', () => {
  it('Should call Ecrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.perform('any_value')
    expect(encryptSpy).toHaveBeenCalledWith({
      value: 'any_value', expiresInHours: 48
    })
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform('any_value')
    await expect(promise).rejects.toThrow()
  })
})
