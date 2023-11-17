import type { Validation } from '@/presentation/contracts'
import { ListCompositeValidation } from '@/presentation/helpers/validators'

export const listCompositeValidationFactory = (validations: Validation[]): Validation => {
  return new ListCompositeValidation(validations)
}
