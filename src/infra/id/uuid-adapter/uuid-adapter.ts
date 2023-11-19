import type { IdModel } from '@/domain/models/output-models'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import type { IdValidator } from '@/presentation/contracts'
import * as uuid from 'uuid'

export class UuidAdapter implements IdBuilder, IdValidator {
  build (): IdModel {
    const id = uuid.v4()
    return { id }
  }

  isValid (id: string): boolean {
    return uuid.validate(id)
  }
}
