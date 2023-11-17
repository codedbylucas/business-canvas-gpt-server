import type { ComponentName } from '@/domain/entities/component'
import type { BaseModel } from './util/base-model'

export interface BusinessCanvasModel extends BaseModel {
  name: string
  userId: string
  components: Record<ComponentName, string[]>
}
