import type { Validation } from '@/presentation/contracts'
import { type Either, left, right } from '@/shared/either'
import { UnnecessaryFieldError } from '@/presentation/errors'

export class OnlyRequiredFieldsValidation implements Validation {
  constructor (private readonly requiredFields: string[]) {}

  validate (input: any): Either<Error, null> {
    const keys = Object.keys(input)
    for (const key of keys) {
      if (!this.requiredFields.includes(key)) {
        return left(new UnnecessaryFieldError(key))
      }
    }
    return right(null)
  }
}
