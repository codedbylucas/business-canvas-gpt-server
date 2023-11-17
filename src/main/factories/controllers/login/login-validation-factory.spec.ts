import { type Validation } from '@/presentation/contracts'
import { onlyRequiredFieldsValidationFactory, requiredFieldValidationFactory, typeValidationFactory } from '../../validations'
import { ValidationComposite } from '@/presentation/helpers/validators'
import { loginValidationFactory } from './login-validation-factory'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('LoginValidation Factory', () => {
  it('Should call ValidationComposite with all validations', async () => {
    loginValidationFactory()
    const validations: Validation[] = []
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      validations.push(
        requiredFieldValidationFactory(field),
        typeValidationFactory(field, 'string')
      )
    }
    validations.push(onlyRequiredFieldsValidationFactory(requiredFields))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
