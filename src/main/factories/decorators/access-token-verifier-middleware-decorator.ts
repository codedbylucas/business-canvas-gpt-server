import type { Middleware } from '@/presentation/contracts'
import { AccessTokenVerifierMiddlewareDecorator } from '@/presentation/decorators/access-token-verifier-middleware-decorator'

export const accessTokenVerifierMiddlewareDecoratorFactory = (middleware: Middleware): Middleware => {
  return new AccessTokenVerifierMiddlewareDecorator(middleware)
}
