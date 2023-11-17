import { SomeFieldBeMandatoryError } from '@/presentation/errors'
import { left } from '@/shared/either'
import { SomeFieldBeMandatoryValidation } from './some-field-be-mandatory-validation'

const makeSut = (): SomeFieldBeMandatoryValidation => {
  return new SomeFieldBeMandatoryValidation(['field', 'otherField'])
}

describe('SomeFieldBeMandatory Validation', () => {
  it('Should return SomeFieldBeMandatoryError if none of the required fields were provided', () => {
    const sut = makeSut()
    const result = sut.validate({ anotherField: 'another_value' })
    expect(result).toEqual(left(new SomeFieldBeMandatoryError("'field', 'otherField'")))
  })

  it('Should return right result if any of the required fields are provided', () => {
    const sut = makeSut()
    const result = sut.validate({
      anotherField: 'another_value',
      field: 'any_value'
    })
    expect(result.isRight()).toBe(true)
  })
})
