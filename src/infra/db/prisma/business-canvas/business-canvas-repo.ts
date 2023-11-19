import type { BusinessCanvasModel } from '@/domain/models/db-models'
import type { AddBusinessCanvasRepo, FetchAllBusinessCanvasByUserIdRepo, UserBusinessCanvasSummaryRepo } from '@/interactions/contracts/db'
import { PrismaHelper } from '../helpers/prisma-helper'

export class BusinessCanvasPrismaRepo implements AddBusinessCanvasRepo, FetchAllBusinessCanvasByUserIdRepo {
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

  async fetchByUserId (userId: string): Promise<UserBusinessCanvasSummaryRepo[]> {
    const prisma = await PrismaHelper.getCli()
    const businessCanvas = await prisma.businessCanvas.findMany({
      where: { userId },
      select: { id: true, createdAt: true, name: true }
    })
    return businessCanvas
  }
}
