import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (fieldName: string): RequiredFieldValidation => {
  return new RequiredFieldValidation(fieldName)
}

describe('RequiredField Validation', () => {
  it('Should return MissinParamError if input not contain required field', () => {
    const sut = makeSut('field')
    const result = sut.validate({ otherField: 'any_value' })
    expect(result.value).toEqual(new MissingParamError('field'))
  })

  it('Should return MissinParamError if required field is empty on input', () => {
    const sut = makeSut('field')
    const result = sut.validate({
      field: '',
      otherField: 'any_value'
    })
    expect(result.value).toEqual(new MissingParamError('field'))
  })

  it('Should return right result if input contain required field', () => {
    const sut = makeSut('field')
    const result = sut.validate({
      otherField: 'any_value',
      field: 'any_field'
    })
    expect(result.isRight()).toBe(true)
  })
})
