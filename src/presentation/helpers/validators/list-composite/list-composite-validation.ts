import { type Validation } from '@/presentation/contracts'
import { right, type Either, left } from '@/shared/either'

export class ListCompositeValidation implements Validation {
  constructor (private readonly validations: Validation[]) {}

  validate (input: any): Either<Error, null> {
    for (const validation of this.validations) {
      const array = input as any[]
      for (const fields of array) {
        const validationResult = validation.validate(fields)
        if (validationResult.isLeft()) {
          return left(validationResult.value)
        }
      }
    }
    return right(null)
  }
}
