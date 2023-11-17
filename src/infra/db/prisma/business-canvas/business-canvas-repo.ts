import type { BusinessCanvasModel } from '@/domain/models/db-models'
import type { AddBusinessCanvasRepo } from '@/interactions/contracts/db'
import { PrismaHelper } from '../helpers/prisma-helper'

export class BusinessCanvasPrismaRepo implements AddBusinessCanvasRepo {
  async add (dto: BusinessCanvasModel): Promise<void> {
    const { components, createdAt, id, name, userId } = dto
    const prisma = await PrismaHelper.getCli()
    await prisma.$transaction(async (transactionPrisma) => {
      await transactionPrisma.businessCanvas.create({
        data: { id, name, createdAt, userId }
      })
      const componentEntries = Object.entries(components)
      await transactionPrisma.businessCanvasComponent.createMany({
        data: componentEntries.map(([componentName, topics]) => ({
          businessCanvasId: id, componentName, topics
        }))
      })
    })
  }
}
