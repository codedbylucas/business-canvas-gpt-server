import type { Validation } from '@/presentation/contracts'
import { OnlyRequiredFieldsValidation } from '@/presentation/helpers/validators'

export const onlyRequiredFieldsValidationFactory = (requiredFields: string[]): Validation => {
  return new OnlyRequiredFieldsValidation(requiredFields)
}
