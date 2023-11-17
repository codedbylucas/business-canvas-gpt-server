import type { AccessTokenModel, HashedModel, IdModel } from '@/domain/models/output-models'
import type { AccessTokenBuilder } from '@/domain/contracts'
import type { AddUserRepo, FetchUserByEmailRepo } from '../../../contracts/db'
import type { IdBuilder } from '../../../contracts/id/id-builder'
import type { UserModel } from '@/domain/models/db-models'
import type { Hasher } from '../../../contracts/cryptography'
import { User, type UserDto } from '@/domain/entities/user'
import { AddUserUseCase } from './add-user-usecase'
import { left, right } from '@/shared/either'
import { EmailInUseError } from '@/domain/errors'
import MockDate from 'mockdate'

jest.mock('@/domain/entities/user/user', () => ({
  User: {
    create: jest.fn(() => {
      return right({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      })
    })
  }
}))

const makeFakeUserDto = (): UserDto => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
})

const makeFetchUserByEmailRepo = (): FetchUserByEmailRepo => {
  class FetchUserByEmailRepoStub implements FetchUserByEmailRepo {
    async fetchByEmail (email: string): Promise<null | UserModel> {
      return await Promise.resolve(null)
    }
  }
  return new FetchUserByEmailRepoStub()
}

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
  sut: AddUserUseCase
  fetchUserByEmailRepoStub: FetchUserByEmailRepo
  hasherStub: Hasher
  idBuilderStub: IdBuilder
  addUserRepoStub: AddUserRepo
  accessTokenBuilderStub: AccessTokenBuilder
}

const makeSut = (): SutTypes => {
  const fetchUserByEmailRepoStub = makeFetchUserByEmailRepo()
  const hasherStub = makeHasher()
  const idBuilderStub = makeIdBuilder()
  const addUserRepoStub = makeAddUserRepo()
  const accessTokenBuilderStub = makeAccessTokenBuilder()
  const sut = new AddUserUseCase(
    fetchUserByEmailRepoStub,
    hasherStub,
    idBuilderStub,
    addUserRepoStub,
    accessTokenBuilderStub
  )
  return {
    sut,
    fetchUserByEmailRepoStub,
    hasherStub,
    idBuilderStub,
    addUserRepoStub,
    accessTokenBuilderStub
  }
}

describe('AddUser UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call User Entity with correct values', async () => {
    const { sut } = makeSut()
    const createSpy = jest.spyOn(User, 'create')
    await sut.perform(makeFakeUserDto())
    expect(createSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('Should return a Error if create User fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'create').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const result = await sut.perform(makeFakeUserDto())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should throw if User Entity throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(User, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeUserDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call FetchUserByEmailRepo with correct email', async () => {
    const { sut, fetchUserByEmailRepoStub } = makeSut()
    const fetchByEmailSpy = jest.spyOn(fetchUserByEmailRepoStub, 'fetchByEmail')
    await sut.perform(makeFakeUserDto())
    expect(fetchByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return EmailInUseError if FetchUserByEmailRepo return an UserModel', async () => {
    const { sut, fetchUserByEmailRepoStub } = makeSut()
    jest.spyOn(fetchUserByEmailRepoStub, 'fetchByEmail').mockReturnValueOnce(
      Promise.resolve(makeFakeUserModel())
    )
    const result = await sut.perform(makeFakeUserDto())
    expect(result.value).toEqual(new EmailInUseError('any_email@mail.com'))
  })

  it('Should throw if FetchUserByEmailRepo throws', async () => {
    const { sut, fetchUserByEmailRepoStub } = makeSut()
    jest.spyOn(fetchUserByEmailRepoStub, 'fetchByEmail').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeUserDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashingSpy = jest.spyOn(hasherStub, 'hashing')
    await sut.perform(makeFakeUserDto())
    expect(hashingSpy).toHaveBeenCalledWith('any_password')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hashing').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeUserDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call IdBuilder', async () => {
    const { sut, idBuilderStub } = makeSut()
    const buildSpy = jest.spyOn(idBuilderStub, 'build')
    await sut.perform(makeFakeUserDto())
    expect(buildSpy).toHaveBeenCalled()
  })

  it('Should throw if IdBuilder throws', async () => {
    const { sut, idBuilderStub } = makeSut()
    jest.spyOn(idBuilderStub, 'build').mockImplementation(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeUserDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddUserRepo with correct values', async () => {
    const { sut, addUserRepoStub } = makeSut()
    const addSpy = jest.spyOn(addUserRepoStub, 'add')
    await sut.perform(makeFakeUserDto())
    expect(addSpy).toHaveBeenCalledWith(makeFakeUserModel())
  })

  it('Should throw if AddUserRepo throws', async () => {
    const { sut, addUserRepoStub } = makeSut()
    jest.spyOn(addUserRepoStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeUserDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AccessTokenBuilder with correct Id', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    const performSpy = jest.spyOn(accessTokenBuilderStub, 'perform')
    await sut.perform(makeFakeUserDto())
    expect(performSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if AccessTokenBuilder throws', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    jest.spyOn(accessTokenBuilderStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeUserDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should return AccessTokenModel if AccessTokenBuilder is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeUserDto())
    expect(result.value).toEqual({ token: 'any_token' })
  })
})
