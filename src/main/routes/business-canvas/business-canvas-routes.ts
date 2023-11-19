import type { Router } from 'express'
import { adaptMiddleware, adaptRoute } from '@/main/adapters'
import { createBusinessCanvasControllerFactory, fetchAllOfTheUserBusinessCanvasControllerFactory } from '@/main/factories/controllers/business-canvas'
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

  router.get('/business-canvas',
    adaptMiddleware(accessControlMiddlewareFactory('user')),
    adaptRoute(fetchAllOfTheUserBusinessCanvasControllerFactory())
  )
}
