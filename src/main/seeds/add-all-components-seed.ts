import 'module-alias/register'
import { PrismaHelper } from '@/infra/db/prisma/helpers/prisma-helper'
import { addAllComponentsUseCaseFactory } from '../factories/usecases/component/add-all-components'

const addAllComponentsSeed = async (): Promise<void> => {
  await PrismaHelper.connect()
  await addAllComponentsUseCaseFactory().perform()
}

export default addAllComponentsSeed()
  .then(() => { console.log('Components added successfully!') })
  .catch(console.error)
  .finally(async () => { await PrismaHelper.disconnect() })
