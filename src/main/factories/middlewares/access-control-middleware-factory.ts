import type { Role } from '@/domain/models/db-models'
import type { Middleware } from '@/presentation/contracts'
import { AccessControlMiddleware } from '@/presentation/middlewares/access-control-middleware'
import { accessControlUseCaseFactory } from '../usecases/access/access-control-usecase-factory'

export const accessControlMiddlewareFactory = (requiredRole: Role): Middleware => {
  return new AccessControlMiddleware(accessControlUseCaseFactory(), requiredRole)
}
