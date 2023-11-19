import type { Controller } from '@/presentation/contracts'
import { LoginController } from '@/presentation/controllers'
import { authUseCaseFactory } from '@/main/factories/usecases/access/auth-usecase-factory'
import { loginValidationFactory } from './login-validation-factory'

export const loginControllerFactory = (): Controller => {
  return new LoginController(loginValidationFactory(), authUseCaseFactory())
}
