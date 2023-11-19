import type { FetchOneOfTheUserBusinessCanvas } from '@/domain/contracts'
import { FetchOneOfTheUserBusinessCanvasUseCase } from '@/interactions/usecases/business-canvas'
import { businessCanvasPrismaRepoFactory } from '@/main/factories/infra/db/prisma/business-canvas-prisma-repo-factory'

export const fetchOneOfTheUserBusinessCanvasUseCaseFactory = (): FetchOneOfTheUserBusinessCanvas => {
  return new FetchOneOfTheUserBusinessCanvasUseCase(
    businessCanvasPrismaRepoFactory()
  )
}
