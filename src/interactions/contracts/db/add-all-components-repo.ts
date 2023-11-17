import type { ComponentModel } from '@/domain/models/db-models'

export interface AddAllComponentsRepo {
  addAll: (data: ComponentModel[]) => Promise<void>
}
