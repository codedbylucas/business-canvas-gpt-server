import { InvalidPasswordError } from '../../errors'
import { Password } from './password'

describe('Password ValueObject', () => {
  it('Should return InvalidPasswordError if password is less than 8 characters', () => {
    const password = 'a'.repeat(7)
    const sut = Password.create(password)
    expect(sut.value).toEqual(new InvalidPasswordError(password))
  })

  it('Should return InvalidPasswordError if password is more than 128 characters', () => {
    const password = 'a'.repeat(129)
    const sut = Password.create(password)
    expect(sut.value).toEqual(new InvalidPasswordError(password))
  })

  it('Should return InvalidPasswordError if password contains only numbers', () => {
    const sut = Password.create('12345678')
    expect(sut.value).toEqual(new InvalidPasswordError('12345678'))
  })

  it('Should return InvalidPasswordError if password contains only letters', () => {
    const sut = Password.create('abcdefgh')
    expect(sut.value).toEqual(new InvalidPasswordError('abcdefgh'))
  })

  it('Should return a new Password if passowrd is valid', () => {
    const sut = Password.create('abcd1234')
    expect(sut.value).toEqual({ password: 'abcd1234' })
  })
})
