import { type Validation } from '@/presentation/contracts'
import { ValidationComposite } from '@/presentation/helpers/validators'
import { signUpValidationFactory } from './signup-validation-factory'
import { compareFieldsValidationFactory, onlyRequiredFieldsValidationFactory, requiredFieldValidationFactory, typeValidationFactory } from '../../validations'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('SignUpValidation Factory', () => {
  it('Should call ValidationComposite with all validations', async () => {
    signUpValidationFactory()
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
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
