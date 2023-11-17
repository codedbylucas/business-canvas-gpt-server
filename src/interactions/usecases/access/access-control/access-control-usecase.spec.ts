import type { AccessControlDto } from '@/domain/contracts'
import type { Decrypter } from '@/interactions/contracts/cryptography'
import type { UserModel } from '@/domain/models/db-models'
import type { FetchUserByIdRepo } from '@/interactions/contracts/db/fetch-user-by-id-repo'
import { AccessControlUseCase } from './access-control-usecase'
import { AccessDeniedError, InvalidTokenError } from '@/domain/errors'

const makeFakeAccessControlDto = (): AccessControlDto => ({
  accessToken: 'any_token',
  requiredRole: 'admin'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<null | string> {
      return await Promise.resolve('any_id')
    }
  }
  return new DecrypterStub()
}

const makeFetchUserByIdRepo = (): FetchUserByIdRepo => {
  class FetchUserByIdRepoStub implements FetchUserByIdRepo {
    async fetchById (id: string): Promise<null | UserModel> {
      return await Promise.resolve(makeFakeUserModel())
    }
  }
  return new FetchUserByIdRepoStub()
}

interface SutTypes {
  sut: AccessControlUseCase
  decrypterStub: Decrypter
  fetchUserByIdRepoStub: FetchUserByIdRepo
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const fetchUserByIdRepoStub = makeFetchUserByIdRepo()
  const sut = new AccessControlUseCase(decrypterStub, fetchUserByIdRepoStub)
  return { sut, decrypterStub, fetchUserByIdRepoStub }
}

describe('AccessControl UseCase', () => {
  it('Should call Decrypter with correct token', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.perform(makeFakeAccessControlDto())
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return InvalidTokenError if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAccessControlDto())
    expect(result.value).toEqual(new InvalidTokenError())
  })

  it('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAccessControlDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call FetchUsertByIdRepo with correct Id', async () => {
    const { sut, fetchUserByIdRepoStub } = makeSut()
    const fetchByIdSpy = jest.spyOn(fetchUserByIdRepoStub, 'fetchById')
    await sut.perform(makeFakeAccessControlDto())
    expect(fetchByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return AccessDeniedError if FetchUsertByIdRepo returns null', async () => {
    const { sut, fetchUserByIdRepoStub } = makeSut()
    jest.spyOn(fetchUserByIdRepoStub, 'fetchById').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAccessControlDto())
    expect(result.value).toEqual(new AccessDeniedError())
  })

  it('Should throw if FetchUsertByIdRepo throws', async () => {
    const { sut, fetchUserByIdRepoStub } = makeSut()
    jest.spyOn(fetchUserByIdRepoStub, 'fetchById').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAccessControlDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should return AccessDeniedError if the user role is different from the required role', async () => {
    const { sut, fetchUserByIdRepoStub } = makeSut()
    const user = makeFakeUserModel()
    user.role = 'user'
    jest.spyOn(fetchUserByIdRepoStub, 'fetchById').mockReturnValueOnce(
      Promise.resolve(user)
    )
    const result = await sut.perform(makeFakeAccessControlDto())
    expect(result.value).toEqual(new AccessDeniedError())
  })

  it('Should return an userId if the user role is admin', async () => {
    const { sut } = makeSut()
    const result = await sut.perform({
      accessToken: 'any_token',
      requiredRole: 'user'
    })
    expect(result.value).toEqual({ userId: 'any_id' })
  })

  it('Should return an userId if validations is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeAccessControlDto())
    expect(result.value).toEqual({ userId: 'any_id' })
  })
})
