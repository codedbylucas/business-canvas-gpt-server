import type { Validation } from '@/presentation/contracts'
import { IdTypeValidation } from '@/presentation/helpers/validators'
import { uuidAdapterFactory } from '../infra/id/uuid-adapter-factory'

export const uuidTypeValidationFactory = (fieldName: string): Validation => {
  return new IdTypeValidation(fieldName, uuidAdapterFactory())
}
