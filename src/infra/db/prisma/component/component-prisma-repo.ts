import type { ComponentModel } from '@/domain/models/db-models'
import type { AddAllComponentsRepo } from '@/interactions/contracts/db'
import { PrismaHelper } from '../helpers/prisma-helper'

export class ComponentPrismaRepo implements AddAllComponentsRepo {
  async addAll (data: ComponentModel[]): Promise<void> {
    const prisma = await PrismaHelper.getCli()
    await prisma.component.createMany({ data })
  }
}
