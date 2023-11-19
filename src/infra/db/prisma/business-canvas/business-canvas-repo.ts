import type { AddBusinessCanvasRepo, FetchAllBusinessCanvasByUserIdRepo, FetchOneOfTheUserBusinessCanvasRepo, UserBusinessCanvasSummaryRepo } from '@/interactions/contracts/db'
import type { FetchOneOfTheUserBusinessCanvasDto } from '@/domain/contracts'
import type { BusinessCanvasModel } from '@/domain/models/db-models'
import { PrismaHelper } from '../helpers/prisma-helper'

export class BusinessCanvasPrismaRepo implements AddBusinessCanvasRepo, FetchAllBusinessCanvasByUserIdRepo, FetchOneOfTheUserBusinessCanvasRepo {
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

  async fetchAllByUserId (userId: string): Promise<UserBusinessCanvasSummaryRepo[]> {
    const prisma = await PrismaHelper.getCli()
    const businessCanvasOrEmpty = await prisma.businessCanvas.findMany({
      where: { userId },
      select: { id: true, createdAt: true, name: true }
    })
    return businessCanvasOrEmpty
  }

  async fetchOneOfTheUser (dto: FetchOneOfTheUserBusinessCanvasDto): Promise<null | BusinessCanvasModel> {
    const prisma = await PrismaHelper.getCli()
    const businessCanvasOrNull = await prisma.businessCanvas.findUnique({
      where: { id: dto.businessCanvasId, userId: dto.userId },
      include: { BusinessCanvasComponent: true }
    })
    if (businessCanvasOrNull) {
      const components: Record<string, string[]> = {}
      for (const component of businessCanvasOrNull.BusinessCanvasComponent) {
        components[component.componentName] = component.topics
      }
      const { id, name, userId, createdAt } = businessCanvasOrNull
      const businessCanvas = { id, name, userId, createdAt, components }
      return businessCanvas as BusinessCanvasModel
    }
    return businessCanvasOrNull
  }
}
