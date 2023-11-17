import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '@/presentation/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFields Validation', () => {
  it('Should return InvalidaParamError if the comparation fails', () => {
    const sut = makeSut()
    const result = sut.validate({
      field: 'any_value', fieldToCompare: 'invalid_value'
    })
    expect(result.value).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Should return right result if compartion is a success', () => {
    const sut = makeSut()
    const result = sut.validate({
      field: 'any_value', fieldToCompare: 'any_value'
    })
    expect(result.isRight()).toBe(true)
  })
})
