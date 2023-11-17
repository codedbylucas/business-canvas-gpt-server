import type { Validation } from '@/presentation/contracts'
import { CompareFieldsValidation } from '@/presentation/helpers/validators'

export const compareFieldsValidationFactory = (
  fieldName: string, fieldNameToCompare: string
): Validation => {
  return new CompareFieldsValidation(fieldName, fieldNameToCompare)
}
