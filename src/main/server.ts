import 'module-alias/register'
import app from './configs/app'
import env from './configs/env'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'

PrismaHelper.connect()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running at http://${env.host}:${env.port}`)
    })
  })
  .catch(console.error)
