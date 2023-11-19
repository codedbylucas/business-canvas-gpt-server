import type { Validation } from '@/presentation/contracts'
import { ListCompositeValidation } from '@/presentation/helpers/validators'
import { onlyRequiredFieldsValidationFactory, requiredFieldValidationFactory, typeValidationFactory } from '@/main/factories/validations'
import { someFieldMandatoryValidationFactory } from '@/main/factories/validations/some-field-be-mandadory-validation'
import { createBusinessCanvasValidationFactory } from './create-business-canvas-validation-factory'

jest.mock('@/presentation/helpers/validators/list-composite/list-composite-validation')

describe('CreateBusinessCanvasValidation Factory', () => {
  it('Should call ListCompositeValidation with all validations', async () => {
    createBusinessCanvasValidationFactory()
    const requiredFields = ['questionId', 'alternativeId', 'answer']
    const validations: Validation[] = [
      requiredFieldValidationFactory('questionId'),
      someFieldMandatoryValidationFactory(['alternativeId', 'answer']),
      onlyRequiredFieldsValidationFactory(requiredFields)
    ]
    for (const field of requiredFields) {
      validations.push(typeValidationFactory(field, 'string'))
    }
    expect(ListCompositeValidation).toHaveBeenCalledWith(validations)
  })
})
