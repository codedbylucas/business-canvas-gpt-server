import type { Validation } from '@/presentation/contracts'
import { type Either, left, right } from '@/shared/either'
import { InvalidParamError } from '@/presentation/errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate (input: any): Either<Error, null> {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return left(new InvalidParamError(this.fieldNameToCompare))
    }
    return right(null)
  }
}
