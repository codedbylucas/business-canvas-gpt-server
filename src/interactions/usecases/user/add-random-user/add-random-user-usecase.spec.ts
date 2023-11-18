import type { AccessTokenModel, HashedModel, IdModel } from '@/domain/models/output-models'
import type { Hasher } from '@/interactions/contracts/cryptography'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import type { UserModel } from '@/domain/models/db-models'
import type { AddUserRepo } from '@/interactions/contracts/db'
import { AddRandomUserUseCase } from './add-random-user-usecase'
import MockDate from 'mockdate'
import { type AccessTokenBuilder } from '@/domain/contracts'

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'Convidado',
  email: 'any_id@convidado.com',
  password: 'hashed_password',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hashing (value: string): Promise<HashedModel> {
      return await Promise.resolve({ hash: 'hashed_password' })
    }
  }
  return new HasherStub()
}

const makeIdBuilder = (): IdBuilder => {
  class IdBuilderStub implements IdBuilder {
    build (): IdModel {
      return { id: 'any_id' }
    }
  }
  return new IdBuilderStub()
}

const makeAddUserRepo = (): AddUserRepo => {
  class AddUserRepoStub implements AddUserRepo {
    async add (data: UserModel): Promise<void> {
      await Promise.resolve()
    }
  }
  return new AddUserRepoStub()
}

const makeAccessTokenBuilder = (): AccessTokenBuilder => {
  class AccessTokenBuilderStub implements AccessTokenBuilder {
    async perform (value: string): Promise<AccessTokenModel> {
      return { token: 'any_token' }
    }
  }
  return new AccessTokenBuilderStub()
}

interface SutTypes {
  sut: AddRandomUserUseCase
  hasherStub: Hasher
  idBuilderStub: IdBuilder
  addUserRepoStub: AddUserRepo
  accessTokenBuilderStub: AccessTokenBuilder
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const idBuilderStub = makeIdBuilder()
  const addUserRepoStub = makeAddUserRepo()
  const accessTokenBuilderStub = makeAccessTokenBuilder()
  const sut = new AddRandomUserUseCase(
    hasherStub, idBuilderStub, addUserRepoStub, accessTokenBuilderStub
  )
  return { sut, hasherStub, idBuilderStub, addUserRepoStub, accessTokenBuilderStub }
}

describe('AddRandomUser UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashingSpy = jest.spyOn(hasherStub, 'hashing')
    await sut.perform()
    expect(hashingSpy).toHaveBeenCalledWith('any_password')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hashing').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform()
    expect(buildSpy).toHaveBeenCalled()
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddUserRepo with correct values', async () => {
    const { sut, addUserRepoStub } = makeSut()
    const addSpy = jest.spyOn(addUserRepoStub, 'add')
    await sut.perform()
    expect(addSpy).toHaveBeenCalledWith(makeFakeUserModel())
  })

  it('Should throw if AddUserRepo throws', async () => {
    const { sut, addUserRepoStub } = makeSut()
    jest.spyOn(addUserRepoStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should call AccessTokenBuilder with correct Id', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    const performSpy = jest.spyOn(accessTokenBuilderStub, 'perform')
    await sut.perform()
    expect(performSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if AccessTokenBuilder throws', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    jest.spyOn(accessTokenBuilderStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform()
    await expect(promise).rejects.toThrow()
  })

  it('Should return AccessTokenModel if AccessTokenBuilder is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform()
    expect(result).toEqual({ token: 'any_token' })
  })
})
