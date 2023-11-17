import type { ComparerDto, HashComparer } from '@/interactions/contracts/cryptography'
import type { AccessTokenBuilder, AuthDto } from '@/domain/contracts'
import type { FetchUserByEmailRepo } from '@/interactions/contracts/db'
import type { AccessTokenModel } from '@/domain/models/output-models'
import type { UserModel } from '@/domain/models/db-models'
import { AuthUseCase } from './auth-usecase'
import { Email } from '@/domain/entities/user/value-objects'
import { left, right } from '@/shared/either'
import { InvalidEmailError } from '@/domain/entities/user/errors'
import { InvalidCredentialsError } from '@/domain/errors'

jest.mock('@/domain/entities/user/value-objects/email/email', () => ({
  Email: {
    create: jest.fn(() => { return right({ email: 'any_email@mail.com' }) })
  }
}))

const makeFakeAuthDto = (): AuthDto => ({
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
      return await Promise.resolve(makeFakeUserModel())
    }
  }
  return new FetchUserByEmailRepoStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async comparer (dto: ComparerDto): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
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
  sut: AuthUseCase
  fetchUserByEmailRepoStub: FetchUserByEmailRepo
  hashComparerStub: HashComparer
  accessTokenBuilderStub: AccessTokenBuilder
}

const makeSut = (): SutTypes => {
  const fetchUserByEmailRepoStub = makeFetchUserByEmailRepo()
  const hashComparerStub = makeHashComparer()
  const accessTokenBuilderStub = makeAccessTokenBuilder()
  const sut = new AuthUseCase(
    fetchUserByEmailRepoStub, hashComparerStub, accessTokenBuilderStub
  )
  return {
    sut, fetchUserByEmailRepoStub, hashComparerStub, accessTokenBuilderStub
  }
}

describe('Auth UseCase', () => {
  it('Should call Email Value Object with correct email', async () => {
    const { sut } = makeSut()
    const createSpy = jest.spyOn(Email, 'create')
    await sut.perform(makeFakeAuthDto())
    expect(createSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return InvalidEmailError if Email Value Object returns InvalidEmailError', async () => {
    const { sut } = makeSut()
    jest.spyOn(Email, 'create').mockReturnValueOnce(
      left(new InvalidEmailError('any_email@mail.com'))
    )
    const result = await sut.perform(makeFakeAuthDto())
    expect(result.value).toEqual(new InvalidEmailError('any_email@mail.com'))
  })

  it('Should throw if Email Value Object throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(Email, 'create').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.perform(makeFakeAuthDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call FetchUserByEmailRepo with correct email', async () => {
    const { sut, fetchUserByEmailRepoStub } = makeSut()
    const fetchByEmailSpy = jest.spyOn(fetchUserByEmailRepoStub, 'fetchByEmail')
    await sut.perform(makeFakeAuthDto())
    expect(fetchByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return InvalidCredentialsError if FetchUserByEmailRepo returns null', async () => {
    const { sut, fetchUserByEmailRepoStub } = makeSut()
    jest.spyOn(fetchUserByEmailRepoStub, 'fetchByEmail').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const result = await sut.perform(makeFakeAuthDto())
    expect(result.value).toEqual(new InvalidCredentialsError())
  })

  it('Should throw if FetchUserByEmailRepo throws', async () => {
    const { sut, fetchUserByEmailRepoStub } = makeSut()
    jest.spyOn(fetchUserByEmailRepoStub, 'fetchByEmail').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAuthDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.perform(makeFakeAuthDto())
    expect(comparerSpy).toHaveBeenCalledWith({
      value: 'any_password', hash: 'hashed_password'
    })
  })

  it('Should return InvalidCredentialsError if HashComparer fails', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(
      Promise.resolve(false)
    )
    const result = await sut.perform(makeFakeAuthDto())
    expect(result.value).toEqual(new InvalidCredentialsError())
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAuthDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AccessTokenBuilder with correct user Id', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    const performSpy = jest.spyOn(accessTokenBuilderStub, 'perform')
    await sut.perform(makeFakeAuthDto())
    expect(performSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if AccessTokenBuilder throws', async () => {
    const { sut, accessTokenBuilderStub } = makeSut()
    jest.spyOn(accessTokenBuilderStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = sut.perform(makeFakeAuthDto())
    await expect(promise).rejects.toThrow()
  })

  it('Should return AccessTokenModel if AccessTokenBuilder is a success', async () => {
    const { sut } = makeSut()
    const result = await sut.perform(makeFakeAuthDto())
    expect(result.value).toEqual({ token: 'any_token' })
  })
})
