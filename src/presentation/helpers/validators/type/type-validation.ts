import type { Validation } from '@/presentation/contracts'
import { type Either, left, right } from '@/shared/either'
import { InvalidTypeError } from '@/presentation/errors'

export type FieldType = 'string' | 'number' | 'boolean' | 'array'

export class TypeValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly fieldType: FieldType
  ) {}

  validate (input: any): Either<Error, null> {
    if (this.fieldName in input) {
      if (this.fieldType === 'array') {
        if (!(input[this.fieldName] instanceof Array)) {
          left(new InvalidTypeError(this.fieldName))
        }
      }
      if (typeof input[this.fieldName] !== this.fieldType) {
        return left(new InvalidTypeError(this.fieldName))
      }
    }
    return right(null)
  }
}
