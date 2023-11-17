import type { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { createBusinessCanvasControllerFactory } from '@/main/factories/controllers/business-canvas/create-business-canvas-controller-factory'
import { accessTokenVerifierMiddlewareDecoratorFactory } from '@/main/factories/decorators/access-token-verifier-middleware-decorator'
import { accessControlMiddlewareFactory } from '@/main/factories/middlewares/access-control-middleware-factory'

export default async (router: Router): Promise<void> => {
  router.post('/business-canvas',
    adaptMiddleware(
      accessTokenVerifierMiddlewareDecoratorFactory(
        accessControlMiddlewareFactory('user')
      )
    ),
    adaptRoute(createBusinessCanvasControllerFactory())
  )
}
