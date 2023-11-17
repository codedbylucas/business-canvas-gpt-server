import type { Validation } from '@/presentation/contracts'
import { right, type Either, left } from '@/shared/either'
import { ListCompositeValidation } from './list-composite-validation'

const makeFakeInput = (): any => ([
  { anyField: 'any_value' },
  { otherField: 'other_value' }
])

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Either<Error, null> {
      return right(null)
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ListCompositeValidation
  validationsStub: Validation[]
}

const makeSut = (): SutTypes => {
  const validationsStub = [makeValidation(), makeValidation()]
  const sut = new ListCompositeValidation([validationsStub[0], validationsStub[1]])
  return { sut, validationsStub }
}

describe('ListComposite Validation', () => {
  it('Should call Validations with correct values', async () => {
    const { sut, validationsStub } = makeSut()
    const validateSpy = jest.spyOn(validationsStub[0], 'validate')
    sut.validate(makeFakeInput())
    expect(validateSpy).toHaveBeenCalledWith({ anyField: 'any_value' })
    expect(validateSpy).toHaveBeenCalledWith({ otherField: 'other_value' })
  })

  it('Should return an error if any Validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    const result = sut.validate(makeFakeInput())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should return the first error if more the one validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(
      left(new Error('any_message'))
    )
    jest.spyOn(validationsStub[1], 'validate').mockReturnValueOnce(
      left(new Error('other_message'))
    )
    const result = sut.validate(makeFakeInput())
    expect(result.value).toEqual(new Error('any_message'))
  })

  it('Should return right result if no validation fails', () => {
    const { sut } = makeSut()
    const result = sut.validate(makeFakeInput())
    expect(result.isRight()).toBe(true)
  })
})
