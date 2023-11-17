import type { AddAllComponents } from '@/domain/contracts'
import type { AddAllComponentsRepo } from '@/interactions/contracts/db'
import type { ComponentModel } from '@/domain/models/db-models'
import type { IdBuilder } from '@/interactions/contracts/id/id-builder'
import { Component, type ComponentName } from '@/domain/entities/component'

export class AddAllComponentsUseCase implements AddAllComponents {
  constructor (
    private readonly idBuilder: IdBuilder,
    private readonly addAllComponentsRepo: AddAllComponentsRepo
  ) {}

  async perform (): Promise<void> {
    const components = Component.createMany()
    const componentModels: ComponentModel[] = []
    for (const component of components) {
      const name = Component.getComponent(component) as ComponentName
      const { id } = this.idBuilder.build()
      componentModels.push({ id, name })
    }
    await this.addAllComponentsRepo.addAll(componentModels)
  }
}
