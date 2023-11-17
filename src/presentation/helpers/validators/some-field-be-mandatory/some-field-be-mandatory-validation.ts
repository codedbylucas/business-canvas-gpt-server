import type { Validation } from '@/presentation/contracts'
import { type Either, left, right } from '@/shared/either'
import { SomeFieldBeMandatoryError } from '@/presentation/errors'

export class SomeFieldBeMandatoryValidation implements Validation {
  constructor (private readonly requiredFields: string[]) {}

  validate (input: any): Either<Error, null> {
    const keys = Object.keys(input)
    let count = 0
    for (const field of this.requiredFields) {
      if (keys.includes(field)) {
        count++
      }
    }
    if (count === 0) {
      let fields = ''
      this.requiredFields.forEach(field => { fields += `'${field}', ` })
      fields = fields.slice(0, -2)
      return left(new SomeFieldBeMandatoryError(fields))
    }
    return right(null)
  }
}
