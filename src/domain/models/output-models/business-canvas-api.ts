import type { ComponentName } from '@/domain/entities/component'

export type BusinessCanvasApiModel = Record<ComponentName, string[]> & { name: string }
