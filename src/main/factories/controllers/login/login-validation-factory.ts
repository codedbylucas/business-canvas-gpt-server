import { type Validation } from '@/presentation/contracts'
import { onlyRequiredFieldsValidationFactory, requiredFieldValidationFactory, typeValidationFactory, validationCompositeFactory } from '../../validations'

export const loginValidationFactory = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['email', 'password']
  for (const field of requiredFields) {
    validations.push(
      requiredFieldValidationFactory(field),
      typeValidationFactory(field, 'string')
    )
  }
  validations.push(onlyRequiredFieldsValidationFactory(requiredFields))
  return validationCompositeFactory(validations)
}
