import type { Controller } from '@/presentation/contracts'
import { SignUpController } from '@/presentation/controllers'
import { signUpValidationFactory } from './signup-validation-factory'
import { addUserUseCaseFactory } from '@/main/factories/usecases/user/add-user-usecase-factory'

export const signUpControllerFactory = (): Controller => {
  return new SignUpController(
    signUpValidationFactory(), addUserUseCaseFactory()
  )
}
