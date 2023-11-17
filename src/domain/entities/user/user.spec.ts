import type { UserDto } from './user-dto'
import { InvalidEmailError, InvalidNameError, InvalidPasswordError } from './errors'
import { Email, Name, Password } from './value-objects'
import { left, right } from '@/shared/either'
import { User } from './user'

jest.mock('@/domain/entities/user/value-objects/name/name', () => ({
  Name: {
    create: jest.fn(() => { return right({ name: 'any_name' }) })
  }
}))

jest.mock('@/domain/entities/user/value-objects/email/email', () => ({
  Email: {
    create: jest.fn(() => { return right({ email: 'any_email@mail.com' }) })
  }
}))

jest.mock('@/domain/entities/user/value-objects/password/password', () => ({
  Password: {
    create: jest.fn(() => { return right({ password: 'any_password' }) })
  }
}))

const makeFakeUserDto = (): UserDto => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('User Entity', () => {
  it('Should call Name with correct value', () => {
    const createSpy = jest.spyOn(Name, 'create')
    User.create(makeFakeUserDto())
    expect(createSpy).toHaveBeenCalledWith('any_name')
  })

  it('Should return InvalidNameError if Name return InvalidNameError', () => {
    jest.spyOn(Name, 'create').mockReturnValueOnce(
      left(new InvalidNameError('any_name'))
    )
    const sut = User.create(makeFakeUserDto())
    expect(sut.value).toEqual(new InvalidNameError('any_name'))
  })

  it('Should call Email with correct value', () => {
    const createSpy = jest.spyOn(Email, 'create')
    User.create(makeFakeUserDto())
    expect(createSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return InvalidEmailError if Email return InvalidEmailError', () => {
    jest.spyOn(Email, 'create').mockReturnValueOnce(
      left(new InvalidEmailError('any_email@mail.com'))
    )
    const sut = User.create(makeFakeUserDto())
    expect(sut.value).toEqual(new InvalidEmailError('any_email@mail.com'))
  })

  it('Should call Password with correct value', () => {
    const createSpy = jest.spyOn(Password, 'create')
    User.create(makeFakeUserDto())
    expect(createSpy).toHaveBeenCalledWith('any_password')
  })

  it('Should return InvalidPasswordError if Password return InvalidPasswordError', () => {
    jest.spyOn(Password, 'create').mockReturnValueOnce(
      left(new InvalidPasswordError('any_password'))
    )
    const sut = User.create(makeFakeUserDto())
    expect(sut.value).toEqual(new InvalidPasswordError('any_password'))
  })

  it('Should return a new User if all data is valid', () => {
    const sut = User.create(makeFakeUserDto())
    expect(sut.value).toEqual({
      name: { name: 'any_name' },
      email: { email: 'any_email@mail.com' },
      password: { password: 'any_password' }
    })
  })
})
