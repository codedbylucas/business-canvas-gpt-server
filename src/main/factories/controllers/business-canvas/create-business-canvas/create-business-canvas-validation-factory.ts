import type { Validation } from '@/presentation/contracts'
import { listCompositeValidationFactory } from '@/main/factories/validations/list-composite-validation-factory'
import { onlyRequiredFieldsValidationFactory, requiredFieldValidationFactory, typeValidationFactory } from '@/main/factories/validations'
import { someFieldMandatoryValidationFactory } from '@/main/factories/validations/some-field-be-mandadory-validation'

export const createBusinessCanvasValidationFactory = (): Validation => {
  const requiredFields = ['questionId', 'alternativeId', 'answer']
  const validations: Validation[] = [
    requiredFieldValidationFactory('questionId'),
    someFieldMandatoryValidationFactory(['alternativeId', 'answer']),
    onlyRequiredFieldsValidationFactory(requiredFields)
  ]
  for (const field of requiredFields) {
    validations.push(typeValidationFactory(field, 'string'))
  }
  return listCompositeValidationFactory(validations)
}
