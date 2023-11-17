import type { Validation } from '@/presentation/contracts'
import { SomeFieldBeMandatoryValidation } from '@/presentation/helpers/validators'

export const someFieldMandatoryValidationFactory = (requiredFields: string[]): Validation => {
  return new SomeFieldBeMandatoryValidation(requiredFields)
}
