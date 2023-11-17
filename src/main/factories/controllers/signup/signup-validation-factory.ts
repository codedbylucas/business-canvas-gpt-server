import { type Validation } from '@/presentation/contracts'
import { compareFieldsValidationFactory, onlyRequiredFieldsValidationFactory, requiredFieldValidationFactory, typeValidationFactory, validationCompositeFactory } from '../../validations'

export const signUpValidationFactory = (): Validation => {
  const validations: Validation[] = []
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  for (const field of requiredFields) {
    validations.push(
      requiredFieldValidationFactory(field),
      typeValidationFactory(field, 'string')
    )
  }
  validations.push(
    onlyRequiredFieldsValidationFactory(requiredFields),
    compareFieldsValidationFactory('password', 'passwordConfirmation')
  )
  return validationCompositeFactory(validations)
}
