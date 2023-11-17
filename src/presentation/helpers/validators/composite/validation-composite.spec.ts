import type { Validation } from '@/presentation/contracts'
import { type Either, left, right } from '@/shared/either'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationsStub: Validation[]
}

const makeSut = (): SutTypes => {
  const validationsStub = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite([validationsStub[0], validationsStub[1]])
  return { sut, validationsStub }
}

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(
      left(new Error('field'))
    )
    const result = sut.validate({ otherField: 'other_value' })
    expect(result.value).toEqual(new Error('field'))
  })

  it('Should return the first error if more the one validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    jest.spyOn(validationsStub[1], 'validate').mockReturnValueOnce(
      left(new Error('other_message'))
    )
    const result = sut.validate({ field: 'any_value' })
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should return right result if no validation fails', () => {
    const { sut } = makeSut()
    const result = sut.validate({ field: 'any_value' })
    expect(result.isRight()).toBe(true)
  })
})
