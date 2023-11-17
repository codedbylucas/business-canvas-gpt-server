import type { IdModel } from '@/domain/models/output-models'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import * as uuid from 'uuid'

export class UuidAdapter implements IdBuilder {
  build (): IdModel {
    const id = uuid.v4()
    return { id }
  }
}
