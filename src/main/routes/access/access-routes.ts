import type { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { signUpControllerFactory } from '@/main/factories/controllers/signup/signup-controller-factory'
import { loginControllerFactory } from '@/main/factories/controllers/login/login-controller-factory'

export default async (router: Router): Promise<void> => {
  router.post('/signup', adaptRoute(signUpControllerFactory()))
  router.post('/login', adaptRoute(loginControllerFactory()))
}
