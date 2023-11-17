import type { Validation } from '@/presentation/contracts'
import { type FieldType, TypeValidation } from '@/presentation/helpers/validators'

export const typeValidationFactory = (fieldName: string, fieldType: FieldType): Validation => {
  return new TypeValidation(fieldName, fieldType)
}
